<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const slug = route.params.slug as string

// 模拟文章数据 (实际从 API 获取)
const post = ref({
  id: '1',
  title: '开始使用 Nuxt 3 构建现代化 Web 应用',
  slug: 'getting-started-with-nuxt3',
  content: `
## 简介

Nuxt 3 是一个基于 Vue 3 的全栈框架，它提供了服务端渲染（SSR）、静态站点生成（SSG）等多种渲染模式。

## 快速开始

首先，使用以下命令创建一个新的 Nuxt 3 项目：

\`\`\`bash
npx nuxi@latest init my-app
cd my-app
npm install
npm run dev
\`\`\`

## 目录结构

Nuxt 3 采用了约定优于配置的设计理念，主要目录包括：

- \`app/\` - 应用主目录
- \`pages/\` - 页面路由
- \`components/\` - Vue 组件
- \`composables/\` - 组合式函数
- \`server/\` - 服务端代码

## 总结

Nuxt 3 是构建现代化 Web 应用的绝佳选择，它结合了 Vue 3 的响应式系统和强大的服务端能力。
  `,
  coverImage: 'https://picsum.photos/seed/post1/1200/600',
  publishedAt: '2026-01-20',
  viewCount: 128,
  author: {
    name: 'Admin',
    avatar: 'https://picsum.photos/seed/avatar/100/100',
  },
})

// SEO
useSeoMeta({
  title: `${post.value.title} - My CMS`,
  description: post.value.content.slice(0, 160),
})
</script>

<template>
  <article class="container py-12">
    <!-- Back Link -->
    <NuxtLink
      :to="localePath('/blog')"
      class="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
    >
      <Icon icon="lucide:arrow-left" class="mr-2 h-4 w-4" />
      {{ t('common.back') }}
    </NuxtLink>

    <!-- Article Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {{ post.title }}
      </h1>
      <div class="mt-4 flex items-center gap-4 text-muted-foreground">
        <div class="flex items-center gap-2">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="h-8 w-8 rounded-full"
          />
          <span>{{ post.author.name }}</span>
        </div>
        <span>·</span>
        <time>{{ post.publishedAt }}</time>
        <span>·</span>
        <span class="flex items-center gap-1">
          <Icon icon="lucide:eye" class="h-4 w-4" />
          {{ post.viewCount }} {{ t('posts.viewCount') }}
        </span>
      </div>
    </header>

    <!-- Cover Image -->
    <div class="mb-8 overflow-hidden rounded-lg">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full object-cover"
      />
    </div>

    <!-- Article Content -->
    <div class="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
      <div v-html="post.content" />
    </div>

    <!-- Share & Navigation -->
    <footer class="mt-12 border-t pt-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm text-muted-foreground">分享到:</span>
          <button class="rounded-full p-2 hover:bg-accent">
            <Icon icon="lucide:twitter" class="h-5 w-5" />
          </button>
          <button class="rounded-full p-2 hover:bg-accent">
            <Icon icon="lucide:facebook" class="h-5 w-5" />
          </button>
          <button class="rounded-full p-2 hover:bg-accent">
            <Icon icon="lucide:link" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  </article>
</template>
