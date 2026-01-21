<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { t } = useI18n()

definePageMeta({
  layout: 'admin',
})

// 模拟媒体文件
const mediaFiles = ref([
  { id: '1', filename: 'cover-1.jpg', originalName: 'Hero Image.jpg', path: 'https://picsum.photos/seed/m1/400/300', mimeType: 'image/jpeg', size: 245000, createdAt: '2026-01-20' },
  { id: '2', filename: 'cover-2.jpg', originalName: 'Blog Cover.jpg', path: 'https://picsum.photos/seed/m2/400/300', mimeType: 'image/jpeg', size: 186000, createdAt: '2026-01-19' },
  { id: '3', filename: 'avatar.png', originalName: 'Avatar.png', path: 'https://picsum.photos/seed/m3/400/300', mimeType: 'image/png', size: 52000, createdAt: '2026-01-18' },
  { id: '4', filename: 'product.jpg', originalName: 'Product Photo.jpg', path: 'https://picsum.photos/seed/m4/400/300', mimeType: 'image/jpeg', size: 320000, createdAt: '2026-01-17' },
])

const selectedFiles = ref<string[]>([])
const isUploading = ref(false)

// 格式化文件大小
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 上传文件
const handleUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  isUploading.value = true
  // TODO: 实现文件上传到 Vercel Blob
  await new Promise(resolve => setTimeout(resolve, 1000))
  isUploading.value = false
}

// 删除文件
const handleDelete = (id: string) => {
  if (confirm('确定要删除这个文件吗？')) {
    mediaFiles.value = mediaFiles.value.filter(f => f.id !== id)
  }
}

// 复制链接
const copyLink = (path: string) => {
  navigator.clipboard.writeText(path)
  // TODO: 显示提示
}

// SEO
useSeoMeta({
  title: `${t('admin.media')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ t('admin.media') }}</h1>
        <p class="text-muted-foreground">管理您的媒体文件</p>
      </div>
      <div>
        <label class="cursor-pointer">
          <input
            type="file"
            class="hidden"
            multiple
            accept="image/*,video/*"
            @change="handleUpload"
          />
          <Button as="span" :disabled="isUploading">
            <Icon
              :icon="isUploading ? 'lucide:loader-2' : 'lucide:upload'"
              :class="['mr-2 h-4 w-4', isUploading && 'animate-spin']"
            />
            上传文件
          </Button>
        </label>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="file in mediaFiles"
        :key="file.id"
        class="group relative overflow-hidden rounded-lg border bg-card"
      >
        <!-- Preview -->
        <div class="aspect-square overflow-hidden">
          <img
            :src="file.path"
            :alt="file.filename"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            class="rounded-full bg-white/20 p-2 hover:bg-white/30"
            title="复制链接"
            @click="copyLink(file.path)"
          >
            <Icon icon="lucide:link" class="h-5 w-5 text-white" />
          </button>
          <button
            class="rounded-full bg-white/20 p-2 hover:bg-white/30"
            title="预览"
          >
            <Icon icon="lucide:eye" class="h-5 w-5 text-white" />
          </button>
          <button
            class="rounded-full bg-destructive/80 p-2 hover:bg-destructive"
            title="删除"
            @click="handleDelete(file.id)"
          >
            <Icon icon="lucide:trash" class="h-5 w-5 text-white" />
          </button>
        </div>

        <!-- Info -->
        <div class="p-3">
          <p class="truncate text-sm font-medium">{{ file.originalName }}</p>
          <p class="text-xs text-muted-foreground">
            {{ formatSize(file.size) }} · {{ file.createdAt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="mediaFiles.length === 0" class="py-24 text-center">
      <Icon icon="lucide:image" class="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 class="mt-4 text-lg font-semibold">{{ t('common.noData') }}</h3>
      <p class="mt-2 text-muted-foreground">还没有上传任何媒体文件</p>
    </div>
  </div>
</template>
