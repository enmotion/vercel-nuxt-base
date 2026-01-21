<script setup lang="ts">
const { t } = useI18n()
const { colorMode, toggleColorMode } = useTheme()
const localePath = useLocalePath()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full flex flex-row justify-center border-b bg-background/95 backdrop-blur">
      <div class="container flex h-14 max-w-7xl">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="mr-6 flex items-center space-x-2">
          <span class="text-xl font-bold text-primary">CMS111</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex flex-1 items-center space-x-6 text-sm font-medium">
          <NuxtLink :to="localePath('/')" class="transition-colors hover:text-foreground/80 text-foreground/60">
            {{ t('nav.home') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/blog')" class="transition-colors hover:text-foreground/80 text-foreground/60">
            {{ t('nav.blog') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/about')" class="transition-colors hover:text-foreground/80 text-foreground/60">
            {{ t('nav.about') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/contact')" class="transition-colors hover:text-foreground/80 text-foreground/60">
            {{ t('nav.contact') }}
          </NuxtLink>
        </nav>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            @click="toggleColorMode"
          >
            <Icon
              :icon="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
              class="h-4 w-4"
            />
          </button>

          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Login Button -->
          <NuxtLink
            :to="localePath('/auth/login')"
            class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {{ t('auth.login') }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t py-6 md:py-0">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {{ t('footer.copyright', { year: new Date().getFullYear(), name: 'My CMS' }) }}
        </p>
      </div>
    </footer>
  </div>
</template>
