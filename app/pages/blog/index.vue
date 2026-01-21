<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// 模拟博客文章数据
const posts = ref([
  {
    id: '1',
    title: '开始使用 Nuxt 3 构建现代化 Web 应用',
    slug: 'getting-started-with-nuxt3',
    excerpt: '本文将介绍如何使用 Nuxt 3 快速搭建一个现代化的 Web 应用，包括路由配置、状态管理等核心功能。',
    coverImage: 'https://picsum.photos/seed/post1/800/400',
    publishedAt: '2026-01-20',
    viewCount: 128,
  },
  {
    id: '2',
    title: 'Tailwind CSS v4 新特性详解',
    slug: 'tailwind-css-v4-features',
    excerpt: 'Tailwind CSS v4 带来了全新的配置方式和更强大的功能，让我们一起来看看有哪些激动人心的变化。',
    coverImage: 'https://picsum.photos/seed/post2/800/400',
    publishedAt: '2026-01-18',
    viewCount: 256,
  },
  {
    id: '3',
    title: 'Drizzle ORM 入门指南',
    slug: 'drizzle-orm-guide',
    excerpt: 'Drizzle ORM 是一个轻量级、类型安全的 TypeScript ORM，本文将带你快速上手。',
    coverImage: 'https://picsum.photos/seed/post3/800/400',
    publishedAt: '2026-01-15',
    viewCount: 192,
  },
])

// SEO
useSeoMeta({
  title: `${t('nav.blog')} - My CMS`,
  description: 'Explore our blog posts about web development, Nuxt, and modern technologies.',
})
</script>

<template>
  <div class="container py-12">
    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold tracking-tight">{{ t('nav.blog') }}</h1>
      <p class="mt-4 text-lg text-muted-foreground">
        探索我们关于 Web 开发、Nuxt 和现代技术的文章
      </p>
    </div>

    <!-- Posts Grid -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
      >
        <!-- Cover Image -->
        <NuxtLink :to="localePath(`/blog/${post.slug}`)">
          <div class="aspect-video overflow-hidden">
            <img
              :src="post.coverImage"
              :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </NuxtLink>

        <!-- Content -->
        <div class="p-6">
          <NuxtLink :to="localePath(`/blog/${post.slug}`)">
            <h2 class="mb-2 text-xl font-semibold text-card-foreground transition-colors hover:text-primary">
              {{ post.title }}
            </h2>
          </NuxtLink>
          <p class="mb-4 line-clamp-2 text-muted-foreground">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center justify-between text-sm text-muted-foreground">
            <time>{{ post.publishedAt }}</time>
            <span class="flex items-center gap-1">
              <Icon icon="lucide:eye" class="h-4 w-4" />
              {{ post.viewCount }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="py-24 text-center">
      <Icon icon="lucide:file-text" class="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 class="mt-4 text-lg font-semibold">{{ t('common.noData') }}</h3>
      <p class="mt-2 text-muted-foreground">暂时没有文章，敬请期待。</p>
    </div>
  </div>
</template>
