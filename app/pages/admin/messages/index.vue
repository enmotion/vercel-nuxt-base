<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'admin',
})

// 留言列表
const messages = ref([
  { id: '1', name: '张三', email: 'zhang@example.com', subject: '咨询合作', content: '您好，我想咨询一下合作事宜...', isRead: false, createdAt: '2026-01-21 10:30' },
  { id: '2', name: 'John', email: 'john@example.com', subject: 'Question about API', content: 'Hi, I have a question about your API...', isRead: true, createdAt: '2026-01-21 08:15' },
  { id: '3', name: '李四', email: 'li@example.com', subject: '技术问题', content: '请问如何配置...', isRead: false, createdAt: '2026-01-20 16:45' },
])

// 标记已读
const markAsRead = (id: string) => {
  const message = messages.value.find(m => m.id === id)
  if (message) {
    message.isRead = true
  }
}

// 删除留言
const handleDelete = (id: string) => {
  if (confirm('确定要删除这条留言吗？')) {
    messages.value = messages.value.filter(m => m.id !== id)
  }
}

// 未读数
const unreadCount = computed(() => messages.value.filter(m => !m.isRead).length)

// SEO
useSeoMeta({
  title: `${t('admin.messages')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">{{ t('messages.title') }}</h1>
      <p class="text-muted-foreground">
        共 {{ messages.length }} 条留言，{{ unreadCount }} 条未读
      </p>
    </div>

    <!-- Messages List -->
    <div class="space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'rounded-lg border bg-card p-4 transition-colors',
          !message.isRead && 'border-primary/50 bg-primary/5'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div
              :class="[
                'flex h-10 w-10 items-center justify-center rounded-full',
                message.isRead ? 'bg-muted' : 'bg-primary/10'
              ]"
            >
              <Icon
                icon="lucide:user"
                :class="['h-5 w-5', message.isRead ? 'text-muted-foreground' : 'text-primary']"
              />
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="mb-1 flex items-center gap-2">
                <span class="font-semibold">{{ message.name }}</span>
                <span v-if="!message.isRead" class="rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {{ t('messages.unread') }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">{{ message.email }}</p>
              <h3 class="mt-2 font-medium">{{ message.subject }}</h3>
              <p class="mt-1 text-sm text-muted-foreground line-clamp-2">
                {{ message.content }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">{{ message.createdAt }}</span>
            <button
              v-if="!message.isRead"
              class="rounded p-1.5 hover:bg-accent"
              title="标记已读"
              @click="markAsRead(message.id)"
            >
              <Icon icon="lucide:check" class="h-4 w-4" />
            </button>
            <button
              class="rounded p-1.5 text-destructive hover:bg-destructive/10"
              title="删除"
              @click="handleDelete(message.id)"
            >
              <Icon icon="lucide:trash" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="messages.length === 0" class="py-24 text-center">
        <Icon icon="lucide:inbox" class="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-semibold">{{ t('common.noData') }}</h3>
        <p class="mt-2 text-muted-foreground">暂无留言</p>
      </div>
    </div>
  </div>
</template>
