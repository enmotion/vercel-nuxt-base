<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'admin',
})

// 统计数据
const stats = [
  { label: '文章总数', value: 28, icon: 'lucide:file-text', change: '+12%' },
  { label: '总浏览量', value: '12.5K', icon: 'lucide:eye', change: '+8%' },
  { label: '留言数', value: 156, icon: 'lucide:message-circle', change: '+23%' },
  { label: '用户数', value: 42, icon: 'lucide:users', change: '+5%' },
]

// 最近文章
const recentPosts = [
  { title: '开始使用 Nuxt 3', status: 'published', date: '2026-01-20', views: 128 },
  { title: 'Tailwind CSS v4 新特性', status: 'published', date: '2026-01-18', views: 256 },
  { title: 'Drizzle ORM 入门', status: 'draft', date: '2026-01-15', views: 0 },
]

// 最近留言
const recentMessages = [
  { name: '张三', email: 'zhang@example.com', subject: '咨询合作', time: '2小时前' },
  { name: 'John', email: 'john@example.com', subject: 'Question about API', time: '5小时前' },
  { name: '李四', email: 'li@example.com', subject: '技术问题', time: '1天前' },
]

// SEO
useSeoMeta({
  title: `${t('admin.dashboard')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold">{{ t('admin.dashboard') }}</h1>
      <p class="text-muted-foreground">欢迎回来，这是您的网站概览</p>
    </div>

    <!-- Stats Grid -->
    <div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border bg-card p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
            <p class="mt-1 text-3xl font-bold">{{ stat.value }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon :icon="stat.icon" class="h-6 w-6 text-primary" />
          </div>
        </div>
        <p class="mt-2 text-sm text-green-600">
          {{ stat.change }} <span class="text-muted-foreground">较上月</span>
        </p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Recent Posts -->
      <div class="rounded-lg border bg-card">
        <div class="flex items-center justify-between border-b p-4">
          <h2 class="font-semibold">最近文章</h2>
          <NuxtLink
            to="/admin/posts"
            class="text-sm text-primary hover:underline"
          >
            查看全部
          </NuxtLink>
        </div>
        <div class="divide-y">
          <div
            v-for="post in recentPosts"
            :key="post.title"
            class="flex items-center justify-between p-4"
          >
            <div>
              <p class="font-medium">{{ post.title }}</p>
              <p class="text-sm text-muted-foreground">{{ post.date }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span
                :class="[
                  'rounded-full px-2 py-1 text-xs',
                  post.status === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                ]"
              >
                {{ post.status === 'published' ? t('posts.published') : t('posts.draft') }}
              </span>
              <span class="flex items-center gap-1 text-sm text-muted-foreground">
                <Icon icon="lucide:eye" class="h-4 w-4" />
                {{ post.views }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Messages -->
      <div class="rounded-lg border bg-card">
        <div class="flex items-center justify-between border-b p-4">
          <h2 class="font-semibold">最近留言</h2>
          <NuxtLink
            to="/admin/messages"
            class="text-sm text-primary hover:underline"
          >
            查看全部
          </NuxtLink>
        </div>
        <div class="divide-y">
          <div
            v-for="message in recentMessages"
            :key="message.email"
            class="flex items-center justify-between p-4"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="lucide:user" class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="font-medium">{{ message.name }}</p>
                <p class="text-sm text-muted-foreground">{{ message.subject }}</p>
              </div>
            </div>
            <span class="text-sm text-muted-foreground">{{ message.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
