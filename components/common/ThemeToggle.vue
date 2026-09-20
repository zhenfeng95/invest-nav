<script setup lang="ts">
const colorMode = useColorMode()

const currentIcon = computed(() => (colorMode.value === 'dark' ? 'moon' : 'sun'))

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
    aria-label="切换主题"
    @click="toggle"
  >
    <AppIcon :name="currentIcon" class="h-4 w-4" />
  </button>
</template>
