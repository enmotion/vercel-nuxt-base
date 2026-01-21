<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const { t } = useI18n()
const { colorMode, primaryColor, presetColors, setColorMode, setPrimaryColor } = useTheme()

definePageMeta({
  layout: 'admin',
})

// 网站设置
const siteSettings = reactive({
  name: 'My CMS',
  description: 'A modern CMS powered by Nuxt 3',
  url: 'https://example.com',
  logo: '',
  favicon: '',
})

// SEO 设置
const seoSettings = reactive({
  defaultTitle: 'My CMS',
  titleTemplate: '%s - My CMS',
  defaultDescription: '',
  keywords: '',
})

// GA 设置
const analyticsSettings = reactive({
  gaId: '',
  enabled: false,
})

const isSaving = ref(false)
const activeTab = ref('general')

const tabs = [
  { id: 'general', label: '基本设置', icon: 'lucide:settings' },
  { id: 'appearance', label: '外观设置', icon: 'lucide:palette' },
  { id: 'seo', label: 'SEO 设置', icon: 'lucide:search' },
  { id: 'analytics', label: '数据分析', icon: 'lucide:bar-chart' },
]

// 保存设置
const handleSave = async () => {
  isSaving.value = true
  try {
    // TODO: 保存到数据库
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isSaving.value = false
  }
}

// SEO
useSeoMeta({
  title: `${t('admin.settings')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ t('settings.title') }}</h1>
        <p class="text-muted-foreground">管理网站配置</p>
      </div>
      <Button :disabled="isSaving" @click="handleSave">
        <Icon
          v-if="isSaving"
          icon="lucide:loader-2"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ t('common.save') }}
      </Button>
    </div>

    <div class="flex gap-6">
      <!-- Sidebar Tabs -->
      <div class="w-48 shrink-0">
        <nav class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            ]"
            @click="activeTab = tab.id"
          >
            <Icon :icon="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="flex-1 rounded-lg border bg-card p-6">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <h2 class="text-lg font-semibold">{{ t('settings.general') }}</h2>
          <div class="grid gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">网站名称</label>
              <Input v-model="siteSettings.name" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">网站描述</label>
              <Textarea v-model="siteSettings.description" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">网站 URL</label>
              <Input v-model="siteSettings.url" type="url" />
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="space-y-6">
          <h2 class="text-lg font-semibold">{{ t('settings.appearance') }}</h2>
          
          <!-- Theme Mode -->
          <div>
            <label class="mb-3 block text-sm font-medium">{{ t('settings.theme') }}</label>
            <div class="flex gap-2">
              <button
                v-for="mode in ['light', 'dark', 'system']"
                :key="mode"
                :class="[
                  'flex items-center gap-2 rounded-md border px-4 py-2 text-sm',
                  colorMode.preference === mode
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-accent'
                ]"
                @click="setColorMode(mode as 'light' | 'dark' | 'system')"
              >
                <Icon
                  :icon="mode === 'light' ? 'lucide:sun' : mode === 'dark' ? 'lucide:moon' : 'lucide:laptop'"
                  class="h-4 w-4"
                />
                {{ t(`settings.${mode}Mode`) }}
              </button>
            </div>
          </div>

          <!-- Primary Color -->
          <div>
            <label class="mb-3 block text-sm font-medium">{{ t('settings.primaryColor') }}</label>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="color in presetColors"
                :key="color.value"
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-110',
                  primaryColor === color.value ? 'border-foreground' : 'border-transparent'
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
                @click="setPrimaryColor(color.value)"
              >
                <Icon
                  v-if="primaryColor === color.value"
                  icon="lucide:check"
                  class="h-5 w-5 text-white"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- SEO Settings -->
        <div v-if="activeTab === 'seo'" class="space-y-6">
          <h2 class="text-lg font-semibold">SEO 设置</h2>
          <div class="grid gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">默认标题</label>
              <Input v-model="seoSettings.defaultTitle" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">标题模板</label>
              <Input v-model="seoSettings.titleTemplate" placeholder="%s - My CMS" />
              <p class="mt-1 text-xs text-muted-foreground">使用 %s 作为页面标题占位符</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">默认描述</label>
              <Textarea v-model="seoSettings.defaultDescription" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">关键词</label>
              <Input v-model="seoSettings.keywords" placeholder="关键词用逗号分隔" />
            </div>
          </div>
        </div>

        <!-- Analytics Settings -->
        <div v-if="activeTab === 'analytics'" class="space-y-6">
          <h2 class="text-lg font-semibold">Google Analytics</h2>
          <div class="grid gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">GA 跟踪 ID</label>
              <Input v-model="analyticsSettings.gaId" placeholder="G-XXXXXXXXXX" />
            </div>
            <div class="flex items-center gap-2">
              <input
                id="ga-enabled"
                v-model="analyticsSettings.enabled"
                type="checkbox"
                class="h-4 w-4 rounded"
              />
              <label for="ga-enabled" class="text-sm">启用 Google Analytics</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
