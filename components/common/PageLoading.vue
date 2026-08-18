<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
}>(), {
  rows: 3,
})
</script>

<template>
  <div
    class="space-y-3"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span class="sr-only">正在加载</span>
    <div
      v-for="index in rows"
      :key="index"
      class="card animate-pulse px-5 py-6"
    >
      <div class="h-3 w-24 rounded bg-zinc-200/80 dark:bg-white/10" />
      <div class="mt-4 h-4 w-3/4 rounded bg-zinc-200/80 dark:bg-white/10" />
      <div class="mt-2 h-4 w-1/2 rounded bg-zinc-100 dark:bg-white/5" />
    </div>
  </div>
</template>
