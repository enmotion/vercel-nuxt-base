<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { colorMode, toggleColorMode } = useTheme()

// 侧边栏菜单
const menuItems = [
  { icon: 'lucide:layout-dashboard', label: 'admin.dashboard', path: '/admin' },
  { icon: 'lucide:file-text', label: 'admin.posts', path: '/admin/posts' },
  { icon: 'lucide:image', label: 'admin.media', path: '/admin/media' },
  { icon: 'lucide:message-circle', label: 'admin.messages', path: '/admin/messages' },
  { icon: 'lucide:users', label: 'admin.users', path: '/admin/users' },
  { icon: 'lucide:settings', label: 'admin.settings', path: '/admin/settings' },
]

// 判断菜单是否激活
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin' || route.path === localePath('/admin')
  }
  return route.path.startsWith(path) || route.path.startsWith(localePath(path))
}

// 侧边栏展开状态
const isSidebarOpen = ref(true)
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Logo -->
      <div class="flex h-14 items-center border-b px-4">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary">CMS</span>
          <span v-if="isSidebarOpen" class="text-sm text-muted-foreground">Admin</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="space-y-1 p-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="localePath(item.path)"
          :class="[
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(item.path)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
        >
          <Icon :icon="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="isSidebarOpen">{{ t(item.label) }}</span>
        </NuxtLink>
      </nav>

      <!-- Toggle Button -->
      <button
        class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <Icon
          :icon="isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'"
          class="h-4 w-4"
        />
      </button>
    </aside>

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 transition-all duration-300',
        isSidebarOpen ? 'ml-64' : 'ml-16'
      ]"
    >
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/95 px-6 backdrop-blur">
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-semibold">
            {{ t('admin.dashboard') }}
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
            @click="toggleColorMode"
          >
            <Icon
              :icon="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
              class="h-4 w-4"
            />
          </button>

          <!-- User Menu -->
          <button class="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-accent">
            <img
              src="https://picsum.photos/seed/admin/100/100"
              alt="Admin"
              class="h-8 w-8 rounded-full"
            />
            <span class="text-sm font-medium">Admin</span>
            <Icon icon="lucide:chevron-down" class="h-4 w-4" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
