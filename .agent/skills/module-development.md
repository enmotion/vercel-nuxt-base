---
name: 模块开发规范
description: 业务模块（Schema、Service、Types）的标准开发范式
---

# 模块开发规范

## 1. 模块结构

每个业务模块遵循统一的目录结构：

```
server/modules/[module]/
├── [module].schema.ts      # Drizzle Schema 定义
├── [module].service.ts     # 业务逻辑层
├── [module].types.ts       # 类型定义
└── [module].validator.ts   # Zod 验证器 (可选)
```

## 2. 创建新模块步骤

### 步骤 1: 创建 Schema

```typescript
// server/modules/posts/posts.schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "../users/users.schema";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  status: varchar("status", { length: 20 }).default("draft"),
  authorId: uuid("author_id").references(() => profiles.id),
  viewCount: integer("view_count").default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 定义关系
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(profiles, {
    fields: [posts.authorId],
    references: [profiles.id],
  }),
}));
```

### 步骤 2: 定义类型

```typescript
// server/modules/posts/posts.types.ts
import type { posts } from "./posts.schema";

// 从 Schema 推导类型
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// 查询选项类型
export type FindPostsOptions = {
  offset?: number;
  limit?: number;
  filters?: {
    status?: "draft" | "published";
    authorId?: string;
    categoryId?: string;
    search?: string;
  };
};

// 查询结果类型
export type FindPostsResult = {
  items: Post[];
  total: number;
};

// 创建/更新 DTO
export type CreatePostDTO = Omit<NewPost, "id" | "createdAt" | "updatedAt">;
export type UpdatePostDTO = Partial<CreatePostDTO>;
```

### 步骤 3: 实现 Service

```typescript
// server/modules/posts/posts.service.ts
import { eq, and, ilike, sql, desc } from "drizzle-orm";
import { db } from "~/server/database/client";
import { posts } from "./posts.schema";
import type {
  Post,
  NewPost,
  FindPostsOptions,
  FindPostsResult,
  CreatePostDTO,
  UpdatePostDTO,
} from "./posts.types";

export class PostsService {
  /**
   * 查询文章列表
   */
  static async findAll(
    options: FindPostsOptions = {},
  ): Promise<FindPostsResult> {
    const { offset = 0, limit = 20, filters = {} } = options;
    const conditions = [];

    // 构建查询条件
    if (filters.status) {
      conditions.push(eq(posts.status, filters.status));
    }
    if (filters.authorId) {
      conditions.push(eq(posts.authorId, filters.authorId));
    }
    if (filters.search) {
      conditions.push(ilike(posts.title, `%${filters.search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // 查询数据
    const [items, countResult] = await Promise.all([
      db.query.posts.findMany({
        where,
        limit,
        offset,
        orderBy: desc(posts.createdAt),
        with: {
          author: true,
        },
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(where),
    ]);

    return {
      items,
      total: Number(countResult[0]?.count || 0),
    };
  }

  /**
   * 根据 ID 查询文章
   */
  static async findById(id: string): Promise<Post | null> {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        author: true,
      },
    });
    return post || null;
  }

  /**
   * 根据 Slug 查询文章
   */
  static async findBySlug(slug: string): Promise<Post | null> {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        author: true,
      },
    });
    return post || null;
  }

  /**
   * 创建文章
   */
  static async create(data: CreatePostDTO): Promise<Post> {
    const [post] = await db.insert(posts).values(data).returning();
    return post;
  }

  /**
   * 更新文章
   */
  static async update(id: string, data: UpdatePostDTO): Promise<Post | null> {
    const [post] = await db
      .update(posts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    return post || null;
  }

  /**
   * 删除文章
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  /**
   * 增加阅读量
   */
  static async incrementViewCount(id: string): Promise<void> {
    await db
      .update(posts)
      .set({
        viewCount: sql`${posts.viewCount} + 1`,
      })
      .where(eq(posts.id, id));
  }

  /**
   * 发布文章
   */
  static async publish(id: string): Promise<Post | null> {
    return this.update(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }
}
```

### 步骤 4: 注册 Schema

```typescript
// server/database/schema.ts
// 聚合导出所有 Schema

export * from "../modules/users/users.schema";
export * from "../modules/posts/posts.schema";
export * from "../modules/categories/categories.schema";
export * from "../modules/tags/tags.schema";
export * from "../modules/messages/messages.schema";
export * from "../modules/media/media.schema";
export * from "../modules/settings/settings.schema";
```

### 步骤 5: 创建 API 路由

参考 [API 开发规范](./api-development.md)

## 3. Schema 设计规范

### 3.1 通用字段

每个表应包含以下通用字段：

```typescript
// 主键
id: uuid('id').primaryKey().defaultRandom(),

// 时间戳
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
```

### 3.2 软删除 (可选)

```typescript
deletedAt: timestamp('deleted_at', { withTimezone: true }),
```

### 3.3 外键关联

```typescript
// 用户关联
authorId: uuid('author_id').references(() => profiles.id),

// 级联删除
categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
```

### 3.4 枚举类型

```typescript
// 使用 varchar + 应用层验证
status: varchar('status', { length: 20 }).default('draft'),

// 在类型中定义枚举
export const PostStatus = ['draft', 'published', 'scheduled'] as const
export type PostStatus = typeof PostStatus[number]
```

## 4. Service 设计原则

### 4.1 职责单一

- 每个 Service 只负责一个业务模块
- 复杂业务逻辑拆分为多个方法
- 跨模块调用通过注入其他 Service

### 4.2 方法命名约定

| 操作     | 方法名                        |
| -------- | ----------------------------- |
| 查询多个 | findAll, findMany, list       |
| 查询单个 | findById, findBySlug, findOne |
| 创建     | create                        |
| 更新     | update                        |
| 删除     | delete, remove                |
| 存在检查 | exists, isExists              |
| 计数     | count                         |

### 4.3 事务处理

```typescript
import { db } from '~/server/database/client'

static async createWithTags(data: CreatePostDTO, tagIds: string[]) {
  return db.transaction(async (tx) => {
    // 创建文章
    const [post] = await tx.insert(posts).values(data).returning()

    // 关联标签
    if (tagIds.length > 0) {
      await tx.insert(postTags).values(
        tagIds.map(tagId => ({ postId: post.id, tagId }))
      )
    }

    return post
  })
}
```

## 5. 数据库迁移

### 5.1 生成迁移

```bash
npx drizzle-kit generate
```

### 5.2 执行迁移

```bash
npx drizzle-kit migrate
```

### 5.3 查看数据库

```bash
npx drizzle-kit studio
```

## 6. 模块示例清单

项目包含以下业务模块：

| 模块       | 说明          |
| ---------- | ------------- |
| users      | 用户/个人资料 |
| posts      | 文章          |
| categories | 分类          |
| tags       | 标签          |
| messages   | 留言          |
| media      | 媒体文件      |
| settings   | 系统设置      |
