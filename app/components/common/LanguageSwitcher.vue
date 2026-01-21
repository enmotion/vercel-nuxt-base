<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter((l): l is { code: string; name: string } => typeof l !== 'string')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLocale = target.value
  if (newLocale) {
    navigateTo(switchLocalePath(newLocale))
  }
}
</script>

<template>
  <select
    :value="locale"
    class="h-9 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
    @change="handleChange"
  >
    <option
      v-for="loc in availableLocales"
      :key="loc.code"
      :value="loc.code"
    >
      {{ loc.name }}
    </option>
  </select>
</template>
