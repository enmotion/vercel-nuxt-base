---
name: 部署规范
description: Vercel 和传统服务器部署的标准工作范式
---

# 部署规范

## 1. 部署模式

本项目支持两种部署模式：

| 模式       | 适用场景        | 特点                         |
| ---------- | --------------- | ---------------------------- |
| Vercel     | 推荐，边缘部署  | 零配置、自动 CI/CD、边缘网络 |
| 传统服务器 | VPS、自建服务器 | 完全控制、成本可控           |

## 2. Vercel 部署

### 2.1 首次部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署 (首次会创建项目)
vercel

# 4. 部署到生产环境
vercel --prod
```

### 2.2 自动部署 (推荐)

1. 将代码推送到 GitHub
2. 在 Vercel Dashboard 导入项目
3. 每次 push 到 main 分支自动部署

### 2.3 环境变量配置

在 Vercel Dashboard > Project > Settings > Environment Variables 配置：

```
# 必需变量
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://...
BLOB_READ_WRITE_TOKEN=xxx
NUXT_SESSION_SECRET=xxx

# 公开变量 (会暴露到客户端)
NUXT_PUBLIC_APP_NAME=My CMS
NUXT_PUBLIC_APP_URL=https://yourdomain.com
NUXT_PUBLIC_STORAGE_PROXY_PREFIX=https://xxx.public.blob.vercel-storage.com
NUXT_PUBLIC_DEFAULT_LOCALE=zh-CN
NUXT_PUBLIC_SUPPORTED_LOCALES=zh-CN,en
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NUXT_PUBLIC_GA_ENABLED=true
```

### 2.4 vercel.json 配置

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nuxtjs",
  "buildCommand": "nuxt build",
  "outputDirectory": ".output",
  "regions": ["hkg1"],
  "functions": {
    "server/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store, max-age=0" }]
    },
    {
      "source": "/_nuxt/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 3. 传统服务器部署

### 3.1 构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 3.2 运行

```bash
# 直接运行
node .output/server/index.mjs

# 使用 PM2 (推荐)
pm2 start .output/server/index.mjs --name "nuxt-cms"

# PM2 常用命令
pm2 status          # 查看状态
pm2 logs nuxt-cms   # 查看日志
pm2 restart nuxt-cms # 重启
pm2 stop nuxt-cms   # 停止
```

### 3.3 Nginx 配置

```nginx
upstream nuxt_cms {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 静态文件缓存
    location /_nuxt/ {
        proxy_pass http://nuxt_cms;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API 不缓存
    location /api/ {
        proxy_pass http://nuxt_cms;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        add_header Cache-Control "no-store";
    }

    # 其他请求
    location / {
        proxy_pass http://nuxt_cms;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 本地文件存储 (可选)
    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.4 环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
# 编辑 .env 填入实际值
```

## 4. 数据库迁移

### 4.1 本地开发

```bash
# 生成迁移文件
npx drizzle-kit generate

# 执行迁移
npx drizzle-kit migrate

# 查看数据库 (可视化)
npx drizzle-kit studio
```

### 4.2 生产环境

```bash
# 方式 1: 本地执行 (连接生产数据库)
DATABASE_URL=postgresql://... npx drizzle-kit migrate

# 方式 2: 在服务器执行
ssh server
cd /path/to/project
npm run db:migrate
```

## 5. CI/CD 工作流

### 5.1 GitHub Actions (可选)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

## 6. 部署检查清单

### 6.1 部署前检查

- [ ] 所有测试通过
- [ ] 环境变量已配置
- [ ] 数据库迁移已执行
- [ ] 构建成功无错误

### 6.2 部署后验证

- [ ] 首页正常加载
- [ ] API 接口正常响应
- [ ] 用户登录正常
- [ ] 文件上传正常
- [ ] 多语言切换正常
- [ ] Light/Dark 模式正常
- [ ] Google Analytics 正常

## 7. 回滚流程

### 7.1 Vercel 回滚

1. 进入 Vercel Dashboard > Deployments
2. 找到之前的正常部署
3. 点击 "..." > "Promote to Production"

### 7.2 传统服务器回滚

```bash
# 使用 PM2
pm2 deploy production revert 1

# 手动回滚
cd /path/to/project
git checkout <previous-commit>
npm install
npm run build
pm2 restart nuxt-cms
```

## 8. 监控与日志

### 8.1 Vercel

- Vercel Dashboard > Analytics: 性能监控
- Vercel Dashboard > Logs: 运行时日志

### 8.2 传统服务器

```bash
# PM2 日志
pm2 logs nuxt-cms

# 保存日志到文件
pm2 logs nuxt-cms --lines 1000 > app.log

# 监控
pm2 monit
```
