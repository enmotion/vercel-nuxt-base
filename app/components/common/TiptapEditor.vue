<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder || '开始编写内容...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// 更新内容
watch(() => props.modelValue, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(value || '')
  }
})

// 工具栏操作
const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
const toggleCode = () => editor.value?.chain().focus().toggleCode().run()
const toggleHeading1 = () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run()
const toggleHeading2 = () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
const toggleHeading3 = () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run()
const setHorizontalRule = () => editor.value?.chain().focus().setHorizontalRule().run()
const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()

// 插入图片
const insertImage = () => {
  const url = window.prompt('输入图片 URL')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// 插入链接
const insertLink = () => {
  const url = window.prompt('输入链接 URL')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="rounded-lg border bg-card">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-1 border-b p-2">
      <!-- Text Formatting -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('bold') }"
        @click="toggleBold"
      >
        <Icon icon="lucide:bold" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('italic') }"
        @click="toggleItalic"
      >
        <Icon icon="lucide:italic" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('strike') }"
        @click="toggleStrike"
      >
        <Icon icon="lucide:strikethrough" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('code') }"
        @click="toggleCode"
      >
        <Icon icon="lucide:code" class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-border" />

      <!-- Headings -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 1 }) }"
        @click="toggleHeading1"
      >
        <Icon icon="lucide:heading-1" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 2 }) }"
        @click="toggleHeading2"
      >
        <Icon icon="lucide:heading-2" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('heading', { level: 3 }) }"
        @click="toggleHeading3"
      >
        <Icon icon="lucide:heading-3" class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-border" />

      <!-- Lists -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('bulletList') }"
        @click="toggleBulletList"
      >
        <Icon icon="lucide:list" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('orderedList') }"
        @click="toggleOrderedList"
      >
        <Icon icon="lucide:list-ordered" class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-border" />

      <!-- Blocks -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('blockquote') }"
        @click="toggleBlockquote"
      >
        <Icon icon="lucide:quote" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('codeBlock') }"
        @click="toggleCodeBlock"
      >
        <Icon icon="lucide:file-code" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        @click="setHorizontalRule"
      >
        <Icon icon="lucide:minus" class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-border" />

      <!-- Media -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        @click="insertImage"
      >
        <Icon icon="lucide:image" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        :class="{ 'bg-accent': editor?.isActive('link') }"
        @click="insertLink"
      >
        <Icon icon="lucide:link" class="h-4 w-4" />
      </button>

      <div class="flex-1" />

      <!-- Undo/Redo -->
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        @click="undo"
      >
        <Icon icon="lucide:undo" class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="rounded p-2 hover:bg-accent"
        @click="redo"
      >
        <Icon icon="lucide:redo" class="h-4 w-4" />
      </button>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-muted-foreground);
  pointer-events: none;
  height: 0;
}
</style>
