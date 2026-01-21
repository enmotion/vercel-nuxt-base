<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'admin',
})

// 文章列表
const posts = ref([
  { id: '1', title: '开始使用 Nuxt 3', slug: 'getting-started-with-nuxt3', status: 'published', publishedAt: '2026-01-20', views: 128 },
  { id: '2', title: 'Tailwind CSS v4 新特性', slug: 'tailwind-css-v4-features', status: 'published', publishedAt: '2026-01-18', views: 256 },
  { id: '3', title: 'Drizzle ORM 入门', slug: 'drizzle-orm-guide', status: 'draft', publishedAt: null, views: 0 },
])

const selectedPosts = ref<string[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')

// 过滤文章
const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || post.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// 删除文章
const handleDelete = (id: string) => {
  if (confirm('确定要删除这篇文章吗？')) {
    posts.value = posts.value.filter(p => p.id !== id)
  }
}

// SEO
useSeoMeta({
  title: `${t('admin.posts')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ t('posts.title') }}</h1>
        <p class="text-muted-foreground">管理您的博客文章</p>
      </div>
      <NuxtLink
        :to="localePath('/admin/posts/create')"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Icon icon="lucide:plus" class="h-4 w-4" />
        {{ t('posts.create') }}
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <div class="relative flex-1">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('common.search')"
          class="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <select
        v-model="statusFilter"
        class="rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">全部状态</option>
        <option value="published">已发布</option>
        <option value="draft">草稿</option>
      </select>
    </div>

    <!-- Posts Table -->
    <div class="rounded-lg border bg-card">
      <table class="w-full">
        <thead class="border-b bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium">
              <input type="checkbox" class="rounded" />
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium">标题</th>
            <th class="px-4 py-3 text-left text-sm font-medium">状态</th>
            <th class="px-4 py-3 text-left text-sm font-medium">发布时间</th>
            <th class="px-4 py-3 text-left text-sm font-medium">浏览量</th>
            <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="post in filteredPosts"
            :key="post.id"
            class="hover:bg-muted/50"
          >
            <td class="px-4 py-3">
              <input
                v-model="selectedPosts"
                type="checkbox"
                :value="post.id"
                class="rounded"
              />
            </td>
            <td class="px-4 py-3">
              <NuxtLink
                :to="localePath(`/admin/posts/${post.id}`)"
                class="font-medium hover:text-primary"
              >
                {{ post.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                  post.status === 'published'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                ]"
              >
                {{ post.status === 'published' ? t('posts.published') : t('posts.draft') }}
              </span>
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ post.publishedAt || '-' }}
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ post.views }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  class="rounded p-1.5 hover:bg-accent"
                  title="编辑"
                >
                  <Icon icon="lucide:edit" class="h-4 w-4" />
                </button>
                <button
                  class="rounded p-1.5 text-destructive hover:bg-destructive/10"
                  title="删除"
                  @click="handleDelete(post.id)"
                >
                  <Icon icon="lucide:trash" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredPosts.length === 0" class="py-12 text-center">
        <Icon icon="lucide:file-x" class="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-semibold">{{ t('common.noData') }}</h3>
        <p class="mt-2 text-muted-foreground">暂无文章数据</p>
      </div>
    </div>
  </div>
</template>
