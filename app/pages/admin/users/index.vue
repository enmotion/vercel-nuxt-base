<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { t } = useI18n()

definePageMeta({
  layout: 'admin',
})

// 模拟用户列表
const users = ref([
  { id: '1', email: 'admin@example.com', displayName: 'Admin', role: 'admin', createdAt: '2026-01-01' },
  { id: '2', email: 'editor@example.com', displayName: 'Editor', role: 'editor', createdAt: '2026-01-10' },
  { id: '3', email: 'user@example.com', displayName: 'User', role: 'user', createdAt: '2026-01-15' },
])

const roleLabels = {
  admin: '管理员',
  editor: '编辑',
  user: '用户',
}

const roleColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

// SEO
useSeoMeta({
  title: `${t('admin.users')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">{{ t('admin.users') }}</h1>
      <p class="text-muted-foreground">管理系统用户</p>
    </div>

    <!-- Users Table -->
    <div class="rounded-lg border bg-card">
      <table class="w-full">
        <thead class="border-b bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium">用户</th>
            <th class="px-4 py-3 text-left text-sm font-medium">邮箱</th>
            <th class="px-4 py-3 text-left text-sm font-medium">角色</th>
            <th class="px-4 py-3 text-left text-sm font-medium">注册时间</th>
            <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-muted/50"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon icon="lucide:user" class="h-5 w-5 text-primary" />
                </div>
                <span class="font-medium">{{ user.displayName }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ user.email }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                  roleColors[user.role as keyof typeof roleColors]
                ]"
              >
                {{ roleLabels[user.role as keyof typeof roleLabels] }}
              </span>
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ user.createdAt }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="rounded p-1.5 hover:bg-accent" title="编辑">
                  <Icon icon="lucide:edit" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
