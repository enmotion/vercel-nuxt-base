---
name: API 开发规范
description: 服务端 API 开发的标准工作范式，包括路由定义、参数验证、错误处理等
---

# API 开发规范

## 1. API 路由结构

### 1.1 文件命名约定

```
server/api/
├── posts/
│   ├── index.get.ts          # GET  /api/posts
│   ├── index.post.ts         # POST /api/posts
│   ├── [id].get.ts           # GET  /api/posts/:id
│   ├── [id].put.ts           # PUT  /api/posts/:id
│   ├── [id].delete.ts        # DELETE /api/posts/:id
│   └── [id]/
│       └── publish.post.ts   # POST /api/posts/:id/publish
```

### 1.2 RESTful 设计原则

| 操作     | HTTP 方法 | 路径           | 说明           |
| -------- | --------- | -------------- | -------------- |
| 查询列表 | GET       | /api/posts     | 支持分页、筛选 |
| 查询单个 | GET       | /api/posts/:id | 返回单个资源   |
| 创建     | POST      | /api/posts     | 创建新资源     |
| 更新     | PUT       | /api/posts/:id | 完整更新       |
| 部分更新 | PATCH     | /api/posts/:id | 部分字段更新   |
| 删除     | DELETE    | /api/posts/:id | 删除资源       |

## 2. API 开发模板

### 2.1 查询列表 API

```typescript
// server/api/posts/index.get.ts
import { z } from "zod";
import { PostsService } from "~/server/modules/posts/posts.service";

// 查询参数 Schema
const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["draft", "published"]).optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export default defineEventHandler(async (event) => {
  // 1. 解析并验证查询参数
  const query = getQuery(event);
  const validated = QuerySchema.safeParse(query);

  if (!validated.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query parameters",
      data: validated.error.flatten(),
    });
  }

  // 2. 调用 Service 层
  const { page, limit, ...filters } = validated.data;
  const result = await PostsService.findAll({
    offset: (page - 1) * limit,
    limit,
    filters,
  });

  // 3. 返回统一格式
  return {
    success: true,
    data: result.items,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
});
```

### 2.2 查询单个 API

```typescript
// server/api/posts/[id].get.ts
import { PostsService } from "~/server/modules/posts/posts.service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing post ID" });
  }

  const post = await PostsService.findById(id);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  return {
    success: true,
    data: post,
  };
});
```

### 2.3 创建 API

```typescript
// server/api/posts/index.post.ts
import { z } from "zod";
import { PostsService } from "~/server/modules/posts/posts.service";

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export default defineEventHandler(async (event) => {
  // 1. 鉴权检查
  const user = await requireAuth(event);

  // 2. 解析请求体
  const body = await readBody(event);
  const validated = CreateSchema.safeParse(body);

  if (!validated.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validated.error.flatten(),
    });
  }

  // 3. 创建资源
  const post = await PostsService.create({
    ...validated.data,
    authorId: user.id,
  });

  // 4. 返回创建结果
  return {
    success: true,
    data: post,
  };
});
```

### 2.4 更新 API

```typescript
// server/api/posts/[id].put.ts
import { z } from "zod";
import { PostsService } from "~/server/modules/posts/posts.service";

const UpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  // ... 其他可更新字段
});

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id")!;

  // 检查资源是否存在
  const existing = await PostsService.findById(id);
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  // 检查权限
  if (existing.authorId !== user.id && user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody(event);
  const validated = UpdateSchema.safeParse(body);

  if (!validated.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: validated.error.flatten(),
    });
  }

  const updated = await PostsService.update(id, validated.data);

  return {
    success: true,
    data: updated,
  };
});
```

### 2.5 删除 API

```typescript
// server/api/posts/[id].delete.ts
import { PostsService } from "~/server/modules/posts/posts.service";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id")!;

  const existing = await PostsService.findById(id);
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  if (existing.authorId !== user.id && user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  await PostsService.delete(id);

  return {
    success: true,
    message: "Post deleted successfully",
  };
});
```

## 3. 鉴权中间件

### 3.1 requireAuth 辅助函数

```typescript
// server/utils/auth.ts
import { H3Event } from "h3";

export async function requireAuth(event: H3Event) {
  const token = getHeader(event, "Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const user = await verifyToken(token);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }

  return user;
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event);

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }

  return user;
}
```

## 4. 统一响应格式

### 4.1 成功响应

```typescript
// 单个资源
{
  "success": true,
  "data": { ... }
}

// 列表资源
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// 操作成功
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### 4.2 错误响应

```typescript
{
  "statusCode": 400,
  "statusMessage": "Validation failed",
  "data": {
    "formErrors": [],
    "fieldErrors": {
      "title": ["Title is required"]
    }
  }
}
```

## 5. 参数验证

使用 Zod 进行参数验证：

```typescript
import { z } from "zod";

// UUID 验证
const idSchema = z.string().uuid();

// 分页参数
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// 日期范围
const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// 组合使用
const querySchema = paginationSchema.merge(dateRangeSchema);
```

## 6. 错误处理最佳实践

```typescript
// 业务错误
throw createError({
  statusCode: 400,
  statusMessage: "Invalid operation",
  data: { code: "INVALID_OPERATION", message: "无法执行此操作" },
});

// 资源不存在
throw createError({
  statusCode: 404,
  statusMessage: "Resource not found",
});

// 权限不足
throw createError({
  statusCode: 403,
  statusMessage: "Forbidden",
});

// 服务器错误 (记录日志)
console.error("Unexpected error:", error);
throw createError({
  statusCode: 500,
  statusMessage: "Internal server error",
});
```
