<script setup lang="ts">
const { t } = useI18n()

// SEO
useSeoMeta({
  title: `${t('nav.about')} - My CMS`,
  description: 'Learn more about My CMS and the technology behind it.',
})
</script>

<template>
  <div class="container py-12">
    <!-- Hero Section -->
    <section class="mx-auto max-w-3xl text-center">
      <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
        {{ t('nav.about') }}
      </h1>
      <p class="mt-6 text-lg text-muted-foreground">
        构建现代化内容管理系统的愿景与实践
      </p>
    </section>

    <!-- Content -->
    <section class="mx-auto mt-16 max-w-3xl">
      <div class="space-y-12">
        <!-- About the Project -->
        <div>
          <h2 class="mb-4 text-2xl font-bold">关于项目</h2>
          <p class="text-muted-foreground leading-relaxed">
            My CMS 是一个现代化的内容管理系统，基于 Nuxt 3、TypeScript、Tailwind CSS 和 Drizzle ORM 构建。
            我们的目标是提供一个简洁、高效、易于扩展的内容管理解决方案，既适合个人博客，也支持未来扩展为电商平台。
          </p>
        </div>

        <!-- Tech Stack -->
        <div>
          <h2 class="mb-4 text-2xl font-bold">技术栈</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg border bg-card p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon icon="logos:nuxt-icon" class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-semibold">Nuxt 3</h3>
                  <p class="text-sm text-muted-foreground">全栈 Vue 框架</p>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon icon="logos:typescript-icon" class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-semibold">TypeScript</h3>
                  <p class="text-sm text-muted-foreground">类型安全</p>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon icon="logos:tailwindcss-icon" class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-semibold">Tailwind CSS</h3>
                  <p class="text-sm text-muted-foreground">原子化 CSS</p>
                </div>
              </div>
            </div>
            <div class="rounded-lg border bg-card p-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon icon="logos:postgresql" class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="font-semibold">PostgreSQL</h3>
                  <p class="text-sm text-muted-foreground">Supabase + Drizzle ORM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div>
          <h2 class="mb-4 text-2xl font-bold">核心特性</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <Icon icon="lucide:check-circle" class="mt-0.5 h-5 w-5 text-green-500" />
              <span>Light/Dark 主题切换，支持自定义主题色</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon icon="lucide:check-circle" class="mt-0.5 h-5 w-5 text-green-500" />
              <span>多语言支持（中文/英文）</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon icon="lucide:check-circle" class="mt-0.5 h-5 w-5 text-green-500" />
              <span>Tiptap 富文本编辑器</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon icon="lucide:check-circle" class="mt-0.5 h-5 w-5 text-green-500" />
              <span>Vercel Storage 文件存储</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon icon="lucide:check-circle" class="mt-0.5 h-5 w-5 text-green-500" />
              <span>SEO 优化 + Google Analytics</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
