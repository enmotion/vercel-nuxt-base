<script setup lang="ts">
const { t } = useI18n()

// SEO
useSeoMeta({
  title: 'My CMS - Home',
  description: 'A modern CMS powered by Nuxt 3',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="container py-24 md:py-32">
      <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to
          <span class="text-primary">My CMS</span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg text-muted-foreground">
          A modern content management system built with Nuxt 3, Tailwind CSS, and shadcn-vue.
          Perfect for personal blogs and future e-commerce expansion.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/blog"
            class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {{ t('nav.blog') }}
            <Icon icon="lucide:arrow-right" class="ml-2 h-4 w-4" />
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            {{ t('nav.about') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container py-16 md:py-24">
      <h2 class="mb-12 text-center text-3xl font-bold tracking-tight">
        Features
      </h2>
      <div class="grid gap-8 md:grid-cols-3">
        <div class="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:palette" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="mb-2 text-lg font-semibold">Theme System</h3>
          <p class="text-muted-foreground">
            Light/Dark mode switching with customizable primary color.
          </p>
        </div>
        <div class="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:globe" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="mb-2 text-lg font-semibold">Internationalization</h3>
          <p class="text-muted-foreground">
            Multi-language support with Chinese and English built-in.
          </p>
        </div>
        <div class="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:zap" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="mb-2 text-lg font-semibold">Modern Stack</h3>
          <p class="text-muted-foreground">
            Built with Nuxt 3, TypeScript, Tailwind CSS, and Drizzle ORM.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
