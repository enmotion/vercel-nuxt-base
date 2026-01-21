# CMS 管理系统 - 产品需求文档 (PRD)

> **版本**: v1.0.0  
> **创建日期**: 2026-01-21  
> **状态**: 草稿讨论阶段

---

## 1. 项目概述

### 1.1 项目愿景

构建一个基于现代技术栈的 CMS 管理系统，前期以 **个人博客** 形式运营，后期扩展为支持 **实物销售的独立站**。系统需具备良好的可扩展性、部署灵活性和维护性。

### 1.2 核心技术栈

| 类别              | 技术选型                | 说明                                  |
| ----------------- | ----------------------- | ------------------------------------- |
| **前端框架**      | Nuxt 3                  | Vue 3 生态的全栈框架，支持 SSR/SSG    |
| **开发语言**      | TypeScript              | 类型安全，提升代码质量                |
| **数据库**        | Supabase (PostgreSQL)   | 开源 Firebase 替代品，提供 BaaS 能力  |
| **ORM**           | Drizzle ORM             | ✅ 已确认，类型安全、轻量级、边缘兼容 |
| **文件存储**      | Vercel Storage (Blob)   | 边缘存储，支持大文件上传              |
| **部署平台**      | Vercel                  | ✅ 已确认，支持传统服务器备选         |
| **样式方案**      | TailwindCSS             | ✅ 已确认                             |
| **UI 组件库**     | shadcn-vue              | ✅ 已确认，基于 Radix Vue             |
| **主题系统**      | @nuxtjs/color-mode      | ✅ Light/Dark 切换 + 自定义主题色     |
| **图标库**        | Iconify                 | ✅ 已确认，最通用，支持 100+ 图标集   |
| **Markdown 编辑** | Tiptap                  | ✅ 已确认，轻量且支持图片/表格等内容  |
| **国际化**        | @nuxtjs/i18n            | ✅ zh-CN, en                          |
| **访问统计**      | Google Analytics (gtag) | ✅ 已确认                             |

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户访问层                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐              ┌─────────────────┐         │
│   │   公开页面       │              │   管理系统       │         │
│   │   (无需鉴权)     │              │   (需要鉴权)     │         │
│   │                 │              │                 │         │
│   │ - 首页          │              │ - 仪表盘         │         │
│   │ - 博客列表      │              │ - 文章管理       │         │
│   │ - 文章详情      │              │ - 媒体管理       │         │
│   │ - 关于页        │              │ - 用户管理       │         │
│   │ - 联系页        │              │ - 系统设置       │         │
│   │ - (未来)商品页  │              │ - (未来)商品管理  │         │
│   └─────────────────┘              └─────────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        Nuxt 3 Server API                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────┐                   │
│   │    Supabase     │    │  Vercel Storage │                   │
│   │   (PostgreSQL)  │    │     (Blob)      │                   │
│   │                 │    │                 │                   │
│   │ - 用户数据      │    │ - 图片文件      │                   │
│   │ - 文章数据      │    │ - 附件文件      │                   │
│   │ - 配置数据      │    │ - 媒体文件      │                   │
│   └─────────────────┘    └─────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 文件存储策略

采用 **相对地址 + 代理前缀** 的方式实现文件托管服务的灵活切换：

```
数据库存储: /uploads/2026/01/image.webp (相对路径)

渲染时拼接:
- Vercel Storage: https://xxx.public.blob.vercel-storage.com/uploads/2026/01/image.webp
- 自建服务器:    https://cdn.example.com/uploads/2026/01/image.webp
- 本地开发:      http://localhost:3000/api/storage/uploads/2026/01/image.webp
```

**配置方式**:

```typescript
// 环境变量
STORAGE_PROXY_PREFIX=https://xxx.public.blob.vercel-storage.com
// 或
STORAGE_PROXY_PREFIX=https://cdn.example.com
```

---

## 3. 功能模块

### 3.1 公开页面 (Public)

#### 3.1.1 首页 (`/`)

- 网站介绍/欢迎语
- 最新文章列表
- 精选内容展示
- (未来) 精选商品展示

#### 3.1.2 博客模块 (`/blog`)

- `/blog` - 文章列表页 (支持分页、分类、标签筛选)
- `/blog/:slug` - 文章详情页
- 支持 Markdown 渲染
- 代码高亮
- 目录导航 (TOC)

#### 3.1.3 静态页面

- `/about` - 关于页面
- `/contact` - 联系/留言页面
- (可扩展其他页面)

#### 3.1.4 联系/留言功能 (`/contact`)

- 访客留言表单 (姓名、邮箱、主题、内容)
- 无需发送邮件，留言存入数据库
- 管理后台可查看、管理留言
- 支持标记已读/未读状态

#### 3.1.5 (未来) 商城模块

- `/products` - 商品列表
- `/products/:id` - 商品详情
- `/cart` - 购物车
- `/checkout` - 结算页面

### 3.2 管理系统 (Admin)

> **访问路径**: `/admin/*`  
> **鉴权方式**: Supabase Auth (Email/Password 或 OAuth)

#### 3.2.1 仪表盘 (`/admin`)

- 数据概览 (文章数、访问量、存储用量)
- 快捷操作入口
- 系统通知

#### 3.2.2 文章管理 (`/admin/posts`)

- 文章 CRUD 操作
- Markdown 编辑器 (支持实时预览)
- 图片上传与插入
- 分类与标签管理
- 文章状态管理 (草稿/已发布/定时发布)
- SEO 设置 (meta title, description, keywords)

#### 3.2.3 媒体管理 (`/admin/media`)

- 文件上传 (拖拽上传、批量上传)
- 文件列表 (缩略图/列表视图)
- 文件分类/文件夹管理
- 文件删除与替换
- 复制文件链接

#### 3.2.4 用户管理 (`/admin/users`)

- 用户列表
- 角色权限管理 (管理员/编辑/访客)
- 用户状态管理

#### 3.2.5 留言管理 (`/admin/messages`)

- 留言列表 (支持分页、筛选)
- 查看留言详情
- 标记已读/未读
- 删除留言
- 留言统计 (未读数量)

#### 3.2.6 系统设置 (`/admin/settings`)

- 网站基本信息 (名称、Logo、描述)
- 存储配置 (代理前缀)
- SEO 全局设置
- Google Analytics 配置
- 多语言设置
- (未来) 支付配置

### 3.3 主题系统

#### 3.3.1 Light/Dark 模式切换

- 支持亮色模式 (Light) 和 暗色模式 (Dark)
- 切换按钮位于 Header 右上角
- 支持跟随系统设置 (System Preference)
- 用户选择存储到 localStorage
- 使用 `@nuxtjs/color-mode` 实现

#### 3.3.2 用户自定义主题色

- 预设主题色方案：
  - Ocean Blue (蓝色)
  - Emerald Green (绿色)
  - Violet Purple (紫色)
  - Sunset Orange (橙色)
  - Zinc Neutral (中性灰)
- 自定义颜色选择器 (Color Picker)
- 实时预览效果
- 主题色存储到 localStorage
- 使用 CSS 变量动态更新 `--primary` 系列色值

#### 3.3.3 技术实现

```typescript
// composables/useTheme.ts
export const useTheme = () => {
  const colorMode = useColorMode(); // light | dark | system
  const primaryColor = useState("primaryColor", () => "#3b82f6"); // 默认蓝色

  // 切换 Light/Dark 模式
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  };

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
    localStorage.setItem("primaryColor", color);
    updateCSSVariables(color);
  };

  // 更新 CSS 变量
  const updateCSSVariables = (color: string) => {
    const hsl = hexToHSL(color);
    document.documentElement.style.setProperty("--primary", hsl);
    // 更新相关变量: --primary-foreground, --ring 等
  };

  return { colorMode, primaryColor, toggleColorMode, setPrimaryColor };
};
```

---

## 4. 目录结构设计

```
vercel-nuxt-base/
├── .nuxt/                      # Nuxt 构建输出 (自动生成)
├── .output/                    # 生产构建输出 (自动生成)
├── .vercel/                    # Vercel 部署配置 (自动生成)
│
├── app/                        # 应用主目录 (Nuxt 3 推荐)
│   ├── assets/                 # 静态资源 (会被构建处理)
│   │   ├── css/
│   │   └── images/
│   │
│   ├── components/             # Vue 组件
│   │   ├── common/             # 通用组件 (Button, Modal, etc.)
│   │   ├── layout/             # 布局组件 (Header, Footer, Sidebar)
│   │   ├── blog/               # 博客相关组件
│   │   ├── admin/              # 管理后台组件
│   │   └── ui/                 # UI 基础组件
│   │
│   ├── composables/            # 组合式函数
│   │   ├── useAuth.ts          # 认证相关
│   │   ├── useStorage.ts       # 存储相关
│   │   └── useApi.ts           # API 调用封装
│   │
│   ├── layouts/                # 布局模板
│   │   ├── default.vue         # 公开页面默认布局
│   │   ├── admin.vue           # 管理后台布局
│   │   └── blank.vue           # 空白布局 (登录页等)
│   │
│   ├── middleware/             # 路由中间件
│   │   ├── auth.ts             # 认证中间件
│   │   └── admin.ts            # 管理员权限中间件
│   │
│   ├── pages/                  # 页面路由
│   │   ├── index.vue           # 首页
│   │   ├── about.vue           # 关于页
│   │   ├── contact.vue         # 联系页
│   │   ├── blog/
│   │   │   ├── index.vue       # 博客列表
│   │   │   └── [slug].vue      # 博客详情
│   │   ├── admin/
│   │   │   ├── index.vue       # 仪表盘
│   │   │   ├── posts/
│   │   │   │   ├── index.vue   # 文章列表
│   │   │   │   ├── create.vue  # 创建文章
│   │   │   │   └── [id].vue    # 编辑文章
│   │   │   ├── media/
│   │   │   │   └── index.vue   # 媒体管理
│   │   │   ├── users/
│   │   │   │   └── index.vue   # 用户管理
│   │   │   └── settings/
│   │   │       └── index.vue   # 系统设置
│   │   └── auth/
│   │       ├── login.vue       # 登录页
│   │       └── register.vue    # 注册页 (可选)
│   │
│   └── plugins/                # Nuxt 插件
│       └── supabase.client.ts  # Supabase 客户端初始化
│
├── public/                     # 静态资源 (不经过构建处理)
│   ├── favicon.ico
│   └── robots.txt
│
├── server/                     # 服务端代码
│   ├── database/               # 数据库配置 (Drizzle ORM)
│   │   ├── client.ts           # Drizzle 客户端初始化
│   │   ├── schema.ts           # 聚合导出所有 schema
│   │   └── migrations/         # 迁移文件 (drizzle-kit 生成)
│   │
│   ├── modules/                # 业务模块 (每个模块自包含 schema/service)
│   │   ├── posts/              # 文章模块
│   │   │   ├── posts.schema.ts   # 文章表 Drizzle schema
│   │   │   ├── posts.service.ts  # 文章业务逻辑
│   │   │   └── posts.types.ts    # 文章类型定义
│   │   ├── users/              # 用户模块
│   │   │   ├── users.schema.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.types.ts
│   │   ├── messages/           # 留言模块
│   │   │   ├── messages.schema.ts
│   │   │   ├── messages.service.ts
│   │   │   └── messages.types.ts
│   │   ├── media/              # 媒体模块
│   │   │   ├── media.schema.ts
│   │   │   ├── media.service.ts
│   │   │   └── media.types.ts
│   │   ├── categories/         # 分类模块
│   │   │   ├── categories.schema.ts
│   │   │   └── categories.service.ts
│   │   ├── tags/               # 标签模块
│   │   │   ├── tags.schema.ts
│   │   │   └── tags.service.ts
│   │   └── settings/           # 设置模块
│   │       ├── settings.schema.ts
│   │       └── settings.service.ts
│   │
│   ├── api/                    # API 路由 (调用 modules 中的 service)
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── posts/
│   │   │   ├── index.get.ts      # GET /api/posts
│   │   │   ├── index.post.ts     # POST /api/posts
│   │   │   ├── [id].get.ts       # GET /api/posts/:id
│   │   │   ├── [id].put.ts       # PUT /api/posts/:id
│   │   │   └── [id].delete.ts    # DELETE /api/posts/:id
│   │   ├── messages/
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── media/
│   │   │   ├── upload.post.ts    # 文件上传
│   │   │   └── [...path].get.ts  # 文件代理访问
│   │   ├── categories/
│   │   │   └── index.get.ts
│   │   ├── tags/
│   │   │   └── index.get.ts
│   │   └── settings/
│   │       ├── index.get.ts
│   │       └── index.put.ts
│   │
│   ├── middleware/             # 服务端中间件
│   │   ├── auth.ts             # API 认证中间件
│   │   └── admin.ts            # 管理员权限中间件
│   │
│   ├── utils/                  # 服务端工具函数
│   │   ├── supabase.ts         # Supabase 服务端客户端 (用于 Auth)
│   │   └── storage.ts          # 存储操作工具
│   │
│   └── plugins/                # 服务端插件
│
├── shared/                     # 前后端共享代码
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts            # 导出共享类型
│   ├── constants/              # 常量
│   └── utils/                  # 通用工具函数
│
├── docs/                       # 项目文档
│   ├── prd.md                  # 产品需求文档 (本文档)
│   ├── api.md                  # API 文档
│   └── deployment.md           # 部署文档
│
├── .env.example                # 环境变量示例
├── .gitignore
├── nuxt.config.ts              # Nuxt 配置
├── drizzle.config.ts           # Drizzle 配置
├── package.json
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.ts          # Tailwind 配置
├── vercel.json                 # Vercel 部署配置
└── README.md
```

---

## 5. 数据模型设计

> **ORM**: 使用 Drizzle ORM 管理数据模型，每个模块的 schema 定义在 `server/modules/[module]/[module].schema.ts`

### 5.0 Drizzle Schema 示例

以下是 `posts.schema.ts` 的 Drizzle 定义示例：

```typescript
// server/modules/posts/posts.schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "../users/users.schema";
import { categories } from "../categories/categories.schema";
import { tags } from "../tags/tags.schema";

// 文章状态枚举
export const postStatusEnum = ["draft", "published", "scheduled"] as const;

// 文章表
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  status: varchar("status", { length: 20 }).default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  authorId: uuid("author_id").references(() => profiles.id),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 文章-分类关联表
export const postCategories = pgTable("post_categories", {
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
});

// 文章-标签关联表
export const postTags = pgTable("post_tags", {
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
});

// 关系定义
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(profiles, {
    fields: [posts.authorId],
    references: [profiles.id],
  }),
  categories: many(postCategories),
  tags: many(postTags),
}));
```

**数据库客户端初始化** (`server/database/client.ts`):

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

const client = postgres(connectionString!);
export const db = drizzle(client, { schema });
```

以下为各表的 SQL DDL 定义（供参考，实际由 Drizzle 迁移生成）：

### 5.1 用户表 (users)

> 使用 Supabase Auth 内置的 `auth.users` 表，扩展 `profiles` 表存储额外信息

```sql
-- profiles 表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user', -- admin, editor, user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.2 文章表 (posts)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,                    -- 摘要
  cover_image TEXT,                -- 封面图 (相对路径)
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES profiles(id),
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.3 分类表 (categories)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.4 标签表 (tags)

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.5 文章-分类/标签关联表

```sql
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

### 5.6 媒体文件表 (media)

```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  path TEXT NOT NULL,              -- 相对路径: /uploads/2026/01/xxx.webp
  mime_type VARCHAR(100),
  size INTEGER,                    -- 文件大小 (bytes)
  width INTEGER,                   -- 图片宽度
  height INTEGER,                  -- 图片高度
  alt_text VARCHAR(255),
  folder_id UUID REFERENCES media_folders(id),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.7 留言表 (messages)

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,        -- 访客姓名
  email VARCHAR(255) NOT NULL,       -- 访客邮箱
  subject VARCHAR(200),              -- 留言主题
  content TEXT NOT NULL,             -- 留言内容
  is_read BOOLEAN DEFAULT FALSE,     -- 是否已读
  ip_address VARCHAR(45),            -- 访客 IP
  user_agent TEXT,                   -- 浏览器信息
  locale VARCHAR(10),                -- 留言时的语言
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE   -- 阅读时间
);
```

### 5.8 系统设置表 (settings)

```sql
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6. 部署方案

### 6.1 Vercel 部署 (推荐)

**优势**: 零配置、边缘部署、自动 CI/CD

**配置文件**: `vercel.json`

```json
{
  "framework": "nuxt",
  "buildCommand": "nuxt build",
  "outputDirectory": ".output"
}
```

**环境变量**: 参见下方「环境变量配置模板」章节

### 6.2 传统服务器部署

**优势**: 完全控制、成本可控、可使用自建存储

**部署方式**:

```bash
# 构建
npm run build

# 运行 (使用 PM2)
pm2 start .output/server/index.mjs --name "nuxt-cms"
```

**Nginx 配置示例**:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件代理 (如使用本地存储)
    location /uploads/ {
        alias /var/www/uploads/;
    }
}
```

**环境变量**: 参见下方「环境变量配置模板」章节

---

## 6.3 环境变量配置模板

以下为完整的环境变量配置模板，将作为 `.env.example` 文件：

```bash
# ========================================
# 应用基础配置
# ========================================

# 应用名称
NUXT_PUBLIC_APP_NAME="My CMS"

# 应用 URL (用于生成绝对链接、SEO 等)
NUXT_PUBLIC_APP_URL=http://localhost:3000

# 运行环境: development | production
NODE_ENV=development

# ========================================
# Supabase 配置
# ========================================

# Supabase 项目 URL
SUPABASE_URL=https://your-project-id.supabase.co

# Supabase 匿名公钥 (客户端使用)
SUPABASE_ANON_KEY=your-anon-key

# Supabase 服务端密钥 (仅服务端使用，勿暴露给客户端)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ========================================
# 文件存储配置
# ========================================

# 存储服务提供商: vercel | local | s3 | oss
STORAGE_PROVIDER=vercel

# 文件访问代理前缀 (用于拼接相对路径生成完整 URL)
# Vercel Storage 示例: https://xxx.public.blob.vercel-storage.com
# 自建 CDN 示例: https://cdn.example.com
NUXT_PUBLIC_STORAGE_PROXY_PREFIX=https://xxx.public.blob.vercel-storage.com

# Vercel Storage Token (使用 Vercel Storage 时必填)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# 本地存储路径 (STORAGE_PROVIDER=local 时使用)
LOCAL_STORAGE_PATH=/var/www/uploads

# S3 兼容存储配置 (STORAGE_PROVIDER=s3 时使用)
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=

# ========================================
# 国际化 (i18n) 配置
# ========================================

# 默认语言: zh-CN | en | ja | ...
NUXT_PUBLIC_DEFAULT_LOCALE=zh-CN

# 支持的语言列表 (逗号分隔)
NUXT_PUBLIC_SUPPORTED_LOCALES=zh-CN,en

# ========================================
# Google Analytics 配置
# ========================================

# GA Measurement ID (格式: G-XXXXXXXXXX)
NUXT_PUBLIC_GA_ID=

# 是否启用 GA (生产环境建议开启)
NUXT_PUBLIC_GA_ENABLED=false

# ========================================
# SEO 默认配置
# ========================================

# 网站默认标题
NUXT_PUBLIC_SEO_TITLE="My Blog"

# 网站默认描述
NUXT_PUBLIC_SEO_DESCRIPTION="A personal blog powered by Nuxt 3"

# 网站关键词 (逗号分隔)
NUXT_PUBLIC_SEO_KEYWORDS="blog,nuxt,vue"

# ========================================
# 管理后台配置
# ========================================

# JWT 密钥 (用于 session 加密，请使用随机字符串)
NUXT_SESSION_SECRET=your-random-secret-key-at-least-32-chars

# 管理员初始邮箱 (首次部署时创建)
ADMIN_EMAIL=admin@example.com

# 管理员初始密码 (首次部署后请立即修改)
ADMIN_PASSWORD=change-me-immediately

# ========================================
# 传统服务器部署配置 (非 Vercel 部署时使用)
# ========================================

# 服务器监听地址
HOST=0.0.0.0

# 服务器监听端口
PORT=3000

# 数据库直连 URL (非 Supabase 时使用)
# DATABASE_URL=postgresql://user:pass@localhost:5432/cms

# ========================================
# 开发环境专用
# ========================================

# 是否启用开发调试模式
DEBUG=false
```

### 环境变量说明

| 前缀                   | 说明                                         |
| ---------------------- | -------------------------------------------- |
| `NUXT_PUBLIC_*`        | 客户端可访问的公开变量，会被打包到前端代码中 |
| `SUPABASE_*`           | Supabase 相关配置                            |
| `STORAGE_*` / `BLOB_*` | 文件存储相关配置                             |
| 无前缀                 | 仅服务端可访问的私密变量                     |

---

## 7. 已确认事项

### 7.1 技术选型确认

| 项目                | 选择                      | 状态      |
| ------------------- | ------------------------- | --------- |
| **CSS 框架**        | TailwindCSS               | ✅ 已确认 |
| **UI 组件库**       | shadcn-vue                | ✅ 已确认 |
| **图标库**          | Iconify                   | ✅ 已确认 |
| **Markdown 编辑器** | Tiptap                    | ✅ 已确认 |
| **ORM**             | Drizzle ORM               | ✅ 已确认 |
| **主题系统**        | Light/Dark + 自定义主题色 | ✅ 已确认 |
| **国际化 (i18n)**   | @nuxtjs/i18n              | ✅ 已确认 |
| **支持语言**        | zh-CN, en                 | ✅ 已确认 |
| **访问统计**        | Google Analytics          | ✅ 已确认 |
| **联系页功能**      | 留言存数据库              | ✅ 已确认 |
| **部署环境**        | Vercel (已有域名)         | ✅ 已确认 |

### 7.2 功能优先级

请确认以下功能的开发优先级 (P0 最高):

- [ ] P0: 基础博客功能 (文章 CRUD、列表、详情)
- [ ] P0: 用户认证 (登录、权限)
- [ ] P0: 多语言支持 (i18n)
- [ ] P1: 媒体管理
- [ ] P1: 留言管理
- [ ] P1: SEO 优化 + Google Analytics
- [ ] P2: 搜索功能
- [ ] P3: 商城模块

### 7.3 待确认问题

1. **内容迁移**: 是否有现有内容需要迁移？

---

## 8. 开发里程碑 (初步计划)

| 阶段        | 内容                             | 预计周期 |
| ----------- | -------------------------------- | -------- |
| **Phase 1** | 项目初始化、技术栈搭建、基础布局 | 1 周     |
| **Phase 2** | 认证系统、管理后台框架           | 1 周     |
| **Phase 3** | 文章管理、Markdown 编辑器        | 2 周     |
| **Phase 4** | 媒体管理、存储集成               | 1 周     |
| **Phase 5** | 公开页面、SEO 优化               | 1 周     |
| **Phase 6** | 测试、优化、部署                 | 1 周     |

---

## 9. 更新日志

| 日期       | 版本   | 更新内容                                                           |
| ---------- | ------ | ------------------------------------------------------------------ |
| 2026-01-21 | v1.0.0 | 初稿创建                                                           |
| 2026-01-21 | v1.1.0 | 确认 TailwindCSS、i18n、GA、留言功能；添加环境变量模板             |
| 2026-01-21 | v1.2.0 | 确认 UI 组件库 shadcn-vue                                          |
| 2026-01-21 | v1.3.0 | 确认 Iconify、Tiptap、语言 zh-CN/en、Vercel 部署；创建 vercel.json |
| 2026-01-21 | v1.4.0 | 确认 Drizzle ORM；更新模块化目录结构                               |
| 2026-01-21 | v1.5.0 | 添加主题系统：Light/Dark 模式切换 + 用户自定义主题色               |

---

> **下一步**: 技术选型已全部确认，可以开始项目初始化和开发。
