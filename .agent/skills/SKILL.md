---
name: Nuxt CMS 开发规范
description: 本项目的核心开发规范和工作范式，包括技术栈、目录结构、代码规范等
---

# Nuxt CMS 开发规范

## 1. 技术栈概览

| 类别      | 技术                   | 版本要求 |
| --------- | ---------------------- | -------- |
| 前端框架  | Nuxt 3                 | ^3.x     |
| 开发语言  | TypeScript             | ^5.x     |
| 样式方案  | TailwindCSS            | ^3.x     |
| UI 组件库 | shadcn-vue             | 最新     |
| 图标库    | Iconify (@iconify/vue) | 最新     |
| ORM       | Drizzle ORM            | 最新     |
| 数据库    | PostgreSQL (Supabase)  | -        |
| 文件存储  | Vercel Storage (Blob)  | -        |
| 国际化    | @nuxtjs/i18n           | ^8.x     |
| 主题      | @nuxtjs/color-mode     | ^3.x     |
| 编辑器    | Tiptap                 | ^2.x     |

## 2. 目录结构规范

```
vercel-nuxt-base/
├── app/                        # 前端应用
│   ├── assets/                 # 静态资源
│   ├── components/             # Vue 组件
│   │   ├── ui/                 # shadcn-vue 基础组件
│   │   ├── common/             # 通用业务组件
│   │   ├── layout/             # 布局组件
│   │   └── [feature]/          # 功能模块组件
│   ├── composables/            # 组合式函数
│   ├── layouts/                # 布局模板
│   ├── middleware/             # 路由中间件
│   ├── pages/                  # 页面路由
│   └── plugins/                # Nuxt 插件
│
├── server/                     # 服务端
│   ├── database/               # Drizzle 配置
│   │   ├── client.ts           # 数据库客户端
│   │   ├── schema.ts           # Schema 聚合导出
│   │   └── migrations/         # 迁移文件
│   ├── modules/                # 业务模块
│   │   └── [module]/
│   │       ├── [module].schema.ts
│   │       ├── [module].service.ts
│   │       └── [module].types.ts
│   ├── api/                    # API 路由
│   ├── middleware/             # 服务端中间件
│   └── utils/                  # 工具函数
│
├── shared/                     # 前后端共享
│   ├── types/                  # 共享类型
│   ├── constants/              # 共享常量
│   └── utils/                  # 共享工具
│
├── locales/                    # 国际化文件
│   ├── zh-CN.json
│   └── en.json
│
└── public/                     # 静态文件
```

## 3. 命名规范

### 3.1 文件命名

| 类型       | 格式                   | 示例                              |
| ---------- | ---------------------- | --------------------------------- |
| Vue 组件   | PascalCase             | `PostCard.vue`, `ThemeToggle.vue` |
| 组合式函数 | camelCase + use前缀    | `useAuth.ts`, `useTheme.ts`       |
| API 路由   | kebab-case + HTTP 方法 | `index.get.ts`, `[id].delete.ts`  |
| Schema     | kebab-case + .schema   | `posts.schema.ts`                 |
| Service    | kebab-case + .service  | `posts.service.ts`                |
| Types      | kebab-case + .types    | `posts.types.ts`                  |

### 3.2 变量/函数命名

```typescript
// ✅ 正确
const getUserById = async (id: string) => { ... }
const isAuthenticated = ref(false)
const PostStatus = { DRAFT: 'draft', PUBLISHED: 'published' } as const

// ❌ 错误
const get_user_by_id = async (id: string) => { ... }
const isauthenticated = ref(false)
```

## 4. 代码规范

### 4.1 TypeScript 规范

- 始终使用 TypeScript，禁止 `any` 类型
- 使用 `type` 定义对象类型，`interface` 仅用于实现/继承
- 导出类型使用 `export type`

```typescript
// ✅ 推荐
export type Post = {
  id: string;
  title: string;
  status: "draft" | "published";
};

// 从 Drizzle schema 推导类型
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

### 4.2 Vue 组件规范

- 使用 `<script setup lang="ts">` 语法
- Props 使用 `defineProps` + TypeScript 类型
- Emits 使用 `defineEmits` + TypeScript 类型
- 组件按功能模块组织

```vue
<script setup lang="ts">
// 1. 类型导入
import type { Post } from '~/shared/types'

// 2. 组件导入
import { Button } from '~/components/ui/button'

// 3. 组合式函数
const { t } = useI18n()
const colorMode = useColorMode()

// 4. Props & Emits
const props = defineProps<{
  post: Post
  editable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', post: Post): void
  (e: 'delete', id: string): void
}>()

// 5. 响应式状态
const isLoading = ref(false)

// 6. 计算属性
const isPublished = computed(() => props.post.status === 'published')

// 7. 方法
const handleDelete = async () => { ... }
</script>

<template>
  <!-- 模板内容 -->
</template>
```

### 4.3 API 开发规范

```typescript
// server/api/posts/index.get.ts
import { PostsService } from "~/server/modules/posts/posts.service";

export default defineEventHandler(async (event) => {
  // 1. 获取查询参数
  const query = getQuery(event);

  // 2. 参数验证 (使用 zod)
  const validated = PostQuerySchema.parse(query);

  // 3. 调用 Service
  const result = await PostsService.findAll(validated);

  // 4. 返回结果
  return {
    success: true,
    data: result.data,
    pagination: result.pagination,
  };
});
```

### 4.4 Service 开发规范

```typescript
// server/modules/posts/posts.service.ts
import { db } from "~/server/database/client";
import { posts } from "./posts.schema";
import type { NewPost, Post } from "./posts.types";

export class PostsService {
  static async findAll(options: FindAllOptions) {
    return db.query.posts.findMany({
      where: options.where,
      limit: options.limit,
      offset: options.offset,
    });
  }

  static async findById(id: string) {
    return db.query.posts.findFirst({
      where: eq(posts.id, id),
    });
  }

  static async create(data: NewPost) {
    const [post] = await db.insert(posts).values(data).returning();
    return post;
  }

  static async update(id: string, data: Partial<NewPost>) {
    const [post] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  static async delete(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
  }
}
```

## 5. 国际化规范

### 5.1 翻译文件结构

```json
// locales/zh-CN.json
{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "confirm": "确认"
  },
  "posts": {
    "title": "文章管理",
    "create": "创建文章",
    "edit": "编辑文章"
  }
}
```

### 5.2 使用方式

```vue
<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <Button>{{ t("common.save") }}</Button>
</template>
```

## 6. 主题规范

### 6.1 颜色使用

始终使用 CSS 变量，不要硬编码颜色值：

```vue
<!-- ✅ 正确 -->
<div class="bg-background text-foreground">
  <Button class="bg-primary text-primary-foreground">
    Click
  </Button>
</div>

<!-- ❌ 错误 -->
<div class="bg-white text-black">
  <Button class="bg-blue-500 text-white">
    Click
  </Button>
</div>
```

### 6.2 暗色模式适配

```vue
<!-- 自动适配 Light/Dark -->
<div class="bg-card text-card-foreground border-border">
  Content
</div>
```

## 7. Git 提交规范

使用 Conventional Commits：

```
feat(posts): add post creation page
fix(auth): resolve token refresh issue
docs(readme): update installation guide
style(ui): adjust button padding
refactor(api): extract common validation logic
test(posts): add unit tests for PostsService
chore(deps): update nuxt to 3.10
```

## 8. 错误处理规范

### 8.1 API 错误响应

```typescript
// 统一错误响应格式
throw createError({
  statusCode: 404,
  statusMessage: "Post not found",
  data: {
    code: "POST_NOT_FOUND",
    message: "文章不存在",
  },
});
```

### 8.2 前端错误处理

```typescript
try {
  await $fetch("/api/posts", { method: "POST", body: data });
} catch (error) {
  if (error.statusCode === 401) {
    navigateTo("/auth/login");
  } else {
    toast.error(error.data?.message || t("common.error"));
  }
}
```

## 9. 相关 Skills

- [API 开发规范](./api-development.md)
- [组件开发规范](./component-development.md)
- [模块开发规范](./module-development.md)
- [部署规范](./deployment.md)
