<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

definePageMeta({
  layout: 'admin',
})

// 表单数据
const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  status: 'draft' as 'draft' | 'published',
  metaTitle: '',
  metaDescription: '',
})

const isSubmitting = ref(false)
const isLoading = ref(true)

// 获取文章详情
interface PostDetail {
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  coverImage: string | null
  status: 'draft' | 'published'
  metaTitle: string | null
  metaDescription: string | null
}

interface ApiDetailResponse {
  code: number
  msg: string
  data: PostDetail
}

const { data: fetchResult, error } = await useFetch<ApiDetailResponse>(`/api/posts/${id}`)

if (fetchResult.value?.data) {
  const post = fetchResult.value.data
  form.title = post.title
  form.slug = post.slug
  form.excerpt = post.excerpt || ''
  form.content = post.content || ''
  form.coverImage = post.coverImage || ''
  form.status = post.status
  form.metaTitle = post.metaTitle || ''
  form.metaDescription = post.metaDescription || ''
  isLoading.value = false
} else if (error.value) {
  alert('加载文章失败')
  router.push(localePath('/admin/posts'))
}

// 自动生成 slug (仅当 slug 为空且正在输入标题时)
watch(() => form.title, (title) => {
  // 编辑模式下通常不自动修改已有的 slug，除非用户清空了
  if (!form.slug) {
    form.slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100)
  }
})

// 提交表单
const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  
  try {
    await $fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: {
        ...form,
      }
    })
    
    // 成功提示
    // toast.success(t('messages.success'))
    
    // 成功后跳转到文章列表
    router.push(localePath('/admin/posts'))
  } catch (error: any) {
    console.error('Failed to update post:', error)
    // 失败提示
    alert(error.message || 'Failed to update post')
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useSeoMeta({
  title: `${t('posts.edit')} - My CMS`,
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <NuxtLink
          :to="localePath('/admin/posts')"
          class="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Icon icon="lucide:arrow-left" class="mr-1 h-4 w-4" />
          返回文章列表
        </NuxtLink>
        <h1 class="text-2xl font-bold">{{ t('posts.edit') }}</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="router.back()">
          {{ t('common.cancel') }}
        </Button>
        <Button :disabled="isSubmitting" @click="handleSubmit">
          <Icon
            v-if="isSubmitting"
            icon="lucide:loader-2"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ t('common.save') }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-12 text-center text-muted-foreground">
      <Icon icon="lucide:loader-2" class="mx-auto h-8 w-8 animate-spin" />
      <p class="mt-2">正在加载...</p>
    </div>

    <form v-else class="grid gap-6 lg:grid-cols-3" @submit.prevent="handleSubmit">
      <!-- Main Content -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Title -->
        <div>
          <label class="mb-2 block text-sm font-medium">标题</label>
          <Input
            v-model="form.title"
            placeholder="文章标题"
            required
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="mb-2 block text-sm font-medium">Slug (URL)</label>
          <Input
            v-model="form.slug"
            placeholder="article-slug"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="mb-2 block text-sm font-medium">摘要</label>
          <Textarea
            v-model="form.excerpt"
            placeholder="文章摘要，将显示在列表页"
            class="min-h-[80px]"
          />
        </div>

        <!-- Content Editor -->
        <div>
          <label class="mb-2 block text-sm font-medium">内容</label>
          <TiptapEditor v-model="form.content" placeholder="开始编写文章内容..." />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status -->
        <div class="rounded-lg border bg-card p-4">
          <h3 class="mb-4 font-semibold">发布状态</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input
                v-model="form.status"
                type="radio"
                value="draft"
                class="h-4 w-4"
              />
              <span>{{ t('posts.draft') }}</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                v-model="form.status"
                type="radio"
                value="published"
                class="h-4 w-4"
              />
              <span>{{ t('posts.published') }}</span>
            </label>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="rounded-lg border bg-card p-4">
          <h3 class="mb-4 font-semibold">封面图片</h3>
          <div class="aspect-video overflow-hidden rounded-lg border border-dashed bg-muted">
            <img
              v-if="form.coverImage"
              :src="form.coverImage"
              alt="Cover"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center">
              <div class="text-center">
                <Icon icon="lucide:image" class="mx-auto h-8 w-8 text-muted-foreground" />
                <p class="mt-2 text-sm text-muted-foreground">点击上传封面</p>
              </div>
            </div>
          </div>
          <Input
            v-model="form.coverImage"
            class="mt-4"
            placeholder="或输入图片 URL"
          />
        </div>

        <!-- SEO Settings -->
        <div class="rounded-lg border bg-card p-4">
          <h3 class="mb-4 font-semibold">SEO 设置</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm">Meta 标题</label>
              <Input
                v-model="form.metaTitle"
                placeholder="SEO 标题"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm">Meta 描述</label>
              <Textarea
                v-model="form.metaDescription"
                placeholder="SEO 描述"
                class="min-h-[60px]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
