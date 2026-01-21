---
name: 组件开发规范
description: Vue 组件开发的标准工作范式，包括 shadcn-vue 使用、组件结构、样式规范等
---

# 组件开发规范

## 1. 组件分类

```
app/components/
├── ui/                     # shadcn-vue 基础组件
│   ├── button/
│   ├── input/
│   ├── dialog/
│   └── ...
├── common/                 # 通用业务组件
│   ├── ThemeToggle.vue
│   ├── LocaleSwitcher.vue
│   └── UserAvatar.vue
├── layout/                 # 布局组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── AppSidebar.vue
│   └── AdminLayout.vue
├── blog/                   # 博客相关组件
│   ├── PostCard.vue
│   ├── PostList.vue
│   └── PostContent.vue
└── admin/                  # 管理后台组件
    ├── PostEditor.vue
    ├── MediaUploader.vue
    └── DashboardStats.vue
```

## 2. 组件模板

### 2.1 基础组件模板

```vue
<script setup lang="ts">
// ==================== 导入 ====================
// 1. 类型导入
import type { Post } from "~/shared/types";

// 2. 组件导入
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/vue";

// 3. 组合式函数
const { t } = useI18n();

// ==================== Props & Emits ====================
interface Props {
  post: Post;
  editable?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  loading: false,
});

const emit = defineEmits<{
  edit: [post: Post];
  delete: [id: string];
}>();

// ==================== 状态 ====================
const isExpanded = ref(false);

// ==================== 计算属性 ====================
const isPublished = computed(() => props.post.status === "published");
const formattedDate = computed(() => {
  return new Date(props.post.createdAt).toLocaleDateString();
});

// ==================== 方法 ====================
const handleEdit = () => {
  emit("edit", props.post);
};

const handleDelete = () => {
  emit("delete", props.post.id);
};
</script>

<template>
  <article
    class="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
  >
    <header class="mb-3 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-card-foreground">
        {{ post.title }}
      </h3>
      <span
        v-if="isPublished"
        class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
      >
        {{ t("posts.published") }}
      </span>
    </header>

    <p class="mb-4 text-muted-foreground">
      {{ post.excerpt }}
    </p>

    <footer class="flex items-center justify-between">
      <time class="text-sm text-muted-foreground">
        {{ formattedDate }}
      </time>

      <div v-if="editable" class="flex gap-2">
        <Button variant="outline" size="sm" @click="handleEdit">
          <Icon icon="lucide:edit" class="mr-1 h-4 w-4" />
          {{ t("common.edit") }}
        </Button>
        <Button variant="destructive" size="sm" @click="handleDelete">
          <Icon icon="lucide:trash" class="mr-1 h-4 w-4" />
          {{ t("common.delete") }}
        </Button>
      </div>
    </footer>
  </article>
</template>
```

### 2.2 表单组件模板

```vue
<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

// ==================== Props & Emits ====================
interface Props {
  initialData?: Partial<FormValues>;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: FormValues];
  cancel: [];
}>();

// ==================== 表单验证 ====================
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, "标题不能为空").max(200, "标题最多200字"),
    slug: z
      .string()
      .min(1, "Slug不能为空")
      .regex(/^[a-z0-9-]+$/, "只能包含小写字母、数字和连字符"),
    excerpt: z.string().max(500, "摘要最多500字").optional(),
    content: z.string().optional(),
  }),
);

type FormValues = z.infer<typeof formSchema>;

// ==================== 表单实例 ====================
const form = useForm({
  validationSchema: formSchema,
  initialValues: props.initialData,
});

// ==================== 方法 ====================
const onSubmit = form.handleSubmit((values) => {
  emit("submit", values);
});
</script>

<template>
  <Form v-slot="{ isSubmitting }" class="space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>标题</FormLabel>
        <FormControl>
          <Input placeholder="请输入文章标题" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="slug">
      <FormItem>
        <FormLabel>Slug</FormLabel>
        <FormControl>
          <Input placeholder="url-friendly-slug" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="excerpt">
      <FormItem>
        <FormLabel>摘要</FormLabel>
        <FormControl>
          <Textarea placeholder="请输入文章摘要" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-end gap-3">
      <Button type="button" variant="outline" @click="emit('cancel')">
        取消
      </Button>
      <Button type="submit" :disabled="loading || isSubmitting">
        {{ loading ? "保存中..." : "保存" }}
      </Button>
    </div>
  </Form>
</template>
```

## 3. shadcn-vue 使用规范

### 3.1 安装组件

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add dialog
```

### 3.2 组件导入

```vue
<script setup lang="ts">
// 从组件目录导入
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
</script>
```

### 3.3 变体使用

```vue
<template>
  <!-- Button 变体 -->
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>

  <!-- Button 尺寸 -->
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon"><Icon icon="lucide:plus" /></Button>
</template>
```

## 4. 图标使用规范

### 4.1 使用 Iconify

```vue
<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <!-- Lucide 图标 (推荐) -->
  <Icon icon="lucide:home" class="h-5 w-5" />
  <Icon icon="lucide:settings" class="h-5 w-5" />

  <!-- 其他图标集 -->
  <Icon icon="mdi:github" class="h-5 w-5" />
  <Icon icon="logos:vue" class="h-5 w-5" />
</template>
```

### 4.2 图标尺寸规范

| 用途       | 尺寸类         |
| ---------- | -------------- |
| 按钮内图标 | h-4 w-4        |
| 导航图标   | h-5 w-5        |
| 标题图标   | h-6 w-6        |
| 大图标     | h-8 w-8 或更大 |

## 5. 样式规范

### 5.1 使用 Tailwind CSS 变量

```vue
<template>
  <!-- ✅ 正确: 使用语义化颜色 -->
  <div class="bg-background text-foreground">
    <div class="border-border rounded-lg border bg-card p-4">
      <h2 class="text-card-foreground">标题</h2>
      <p class="text-muted-foreground">描述文字</p>
      <Button class="bg-primary text-primary-foreground"> 按钮 </Button>
    </div>
  </div>

  <!-- ❌ 错误: 硬编码颜色 -->
  <div class="bg-white text-black">
    <div class="border-gray-200 rounded-lg border bg-gray-50 p-4">
      <h2 class="text-gray-900">标题</h2>
    </div>
  </div>
</template>
```

### 5.2 响应式设计

```vue
<template>
  <!-- 移动优先 -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in items" :key="item.id">
      {{ item.title }}
    </div>
  </div>

  <!-- 响应式间距 -->
  <div class="p-4 md:p-6 lg:p-8">Content</div>

  <!-- 响应式显示/隐藏 -->
  <div class="hidden md:block">仅桌面端显示</div>
  <div class="md:hidden">仅移动端显示</div>
</template>
```

### 5.3 暗色模式

```vue
<template>
  <!-- 自动适配 -->
  <div class="bg-white dark:bg-gray-900">
    <p class="text-gray-900 dark:text-gray-100">自动适配暗色模式</p>
  </div>

  <!-- 推荐: 使用 CSS 变量 (自动适配) -->
  <div class="bg-background">
    <p class="text-foreground">使用 CSS 变量自动适配</p>
  </div>
</template>
```

## 6. 组合式函数

### 6.1 创建组合式函数

```typescript
// composables/usePosts.ts
import type { Post } from "~/shared/types";

export function usePosts() {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchPosts = async (options?: { page?: number; limit?: number }) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch("/api/posts", { query: options });
      posts.value = data.data;
      return data;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const createPost = async (post: Partial<Post>) => {
    const data = await $fetch("/api/posts", {
      method: "POST",
      body: post,
    });
    posts.value.unshift(data.data);
    return data.data;
  };

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts,
    createPost,
  };
}
```

### 6.2 使用组合式函数

```vue
<script setup lang="ts">
const { posts, loading, fetchPosts } = usePosts();

onMounted(() => {
  fetchPosts({ limit: 10 });
});
</script>

<template>
  <div v-if="loading">加载中...</div>
  <PostList v-else :posts="posts" />
</template>
```

## 7. 国际化使用

```vue
<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();
</script>

<template>
  <!-- 基础翻译 -->
  <h1>{{ t("posts.title") }}</h1>

  <!-- 带参数翻译 -->
  <p>{{ t("posts.count", { count: posts.length }) }}</p>

  <!-- 切换语言 -->
  <select v-model="locale" @change="setLocale($event.target.value)">
    <option v-for="loc in locales" :key="loc.code" :value="loc.code">
      {{ loc.name }}
    </option>
  </select>
</template>
```
