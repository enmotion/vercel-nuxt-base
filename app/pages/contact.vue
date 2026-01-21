<script setup lang="ts">
const { t } = useI18n()

// 表单数据
const form = reactive({
  name: '',
  email: '',
  subject: '',
  content: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

// 提交留言
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // TODO: 调用 API 提交留言
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    isSubmitted.value = true
    // 重置表单
    form.name = ''
    form.email = ''
    form.subject = ''
    form.content = ''
  } catch (error) {
    console.error('Failed to submit message:', error)
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useSeoMeta({
  title: `${t('nav.contact')} - My CMS`,
  description: 'Get in touch with us. We would love to hear from you.',
})
</script>

<template>
  <div class="container py-12">
    <div class="mx-auto max-w-2xl">
      <!-- Page Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold tracking-tight">{{ t('nav.contact') }}</h1>
        <p class="mt-4 text-lg text-muted-foreground">
          有任何问题或建议？欢迎给我们留言！
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="isSubmitted"
        class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950"
      >
        <Icon icon="lucide:check-circle" class="mx-auto h-12 w-12 text-green-500" />
        <h3 class="mt-4 text-lg font-semibold text-green-800 dark:text-green-200">
          {{ t('messages.success') }}
        </h3>
        <p class="mt-2 text-green-700 dark:text-green-300">
          我们会尽快回复您的留言。
        </p>
        <button
          class="mt-4 text-sm text-green-600 underline hover:no-underline dark:text-green-400"
          @click="isSubmitted = false"
        >
          继续留言
        </button>
      </div>

      <!-- Contact Form -->
      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Name -->
          <div>
            <label class="mb-2 block text-sm font-medium">
              {{ t('messages.name') }} <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="您的姓名"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="mb-2 block text-sm font-medium">
              {{ t('messages.email') }} <span class="text-destructive">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <!-- Subject -->
        <div>
          <label class="mb-2 block text-sm font-medium">
            {{ t('messages.subject') }}
          </label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="留言主题"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="mb-2 block text-sm font-medium">
            {{ t('messages.content') }} <span class="text-destructive">*</span>
          </label>
          <textarea
            v-model="form.content"
            required
            rows="6"
            class="w-full resize-none rounded-md border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="请输入您的留言内容..."
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            v-if="isSubmitting"
            icon="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSubmitting ? t('common.loading') : t('messages.send') }}
        </button>
      </form>

      <!-- Contact Info -->
      <div class="mt-12 grid gap-6 border-t pt-12 md:grid-cols-3">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:mail" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="font-semibold">邮箱</h3>
          <p class="mt-1 text-sm text-muted-foreground">contact@example.com</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:map-pin" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="font-semibold">地址</h3>
          <p class="mt-1 text-sm text-muted-foreground">中国，北京</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:github" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="font-semibold">GitHub</h3>
          <p class="mt-1 text-sm text-muted-foreground">@username</p>
        </div>
      </div>
    </div>
  </div>
</template>
