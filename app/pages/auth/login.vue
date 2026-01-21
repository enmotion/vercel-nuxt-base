<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const { t } = useI18n()
const localePath = useLocalePath()
const { signIn, isAuthenticated } = useAuth()

// 如果已登录，重定向到管理后台
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo(localePath('/admin'))
  }
})

// 表单数据
const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const isSubmitting = ref(false)
const error = ref('')

// 登录处理
const handleLogin = async () => {
  isSubmitting.value = true
  error.value = ''
  
  try {
    await signIn(form.email, form.password)
    // 登录成功，跳转到管理后台
    navigateTo(localePath('/admin'))
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useSeoMeta({
  title: `${t('auth.login')} - My CMS`,
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-8rem)] items-center justify-center">
    <div class="w-full max-w-md space-y-8 px-4">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight">{{ t('auth.login') }}</h1>
        <p class="mt-2 text-muted-foreground">
          登录以访问管理后台
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
      >
        <div class="flex items-center gap-2">
          <Icon icon="lucide:alert-circle" class="h-4 w-4" />
          {{ error }}
        </div>
      </div>

      <!-- Login Form -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Email -->
        <div>
          <label class="mb-2 block text-sm font-medium">
            {{ t('auth.email') }}
          </label>
          <Input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@example.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="mb-2 block text-sm font-medium">
            {{ t('auth.password') }}
          </label>
          <Input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-input"
            />
            {{ t('auth.rememberMe') }}
          </label>
          <NuxtLink
            to="#"
            class="text-sm text-primary hover:underline"
          >
            {{ t('auth.forgotPassword') }}
          </NuxtLink>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full"
          :disabled="isSubmitting"
        >
          <Icon
            v-if="isSubmitting"
            icon="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSubmitting ? t('common.loading') : t('auth.login') }}
        </Button>
      </form>

      <!-- Back to Home -->
      <p class="text-center text-sm text-muted-foreground">
        <NuxtLink :to="localePath('/')" class="text-primary hover:underline">
          ← 返回首页
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
