<script setup lang="ts">
defineProps<{
  value: string
  label: string
  tone?: 'success' | 'danger' | 'warning' | 'neutral'
}>()
</script>

<template>
  <div class="card px-4 py-4 sm:px-5">
    <p class="text-xs text-zinc-400">{{ label }}</p>
    <p
      class="mt-2 text-2xl font-semibold tracking-tight"
      :class="{
        'text-rose-700 dark:text-rose-400': tone === 'success',
        'text-emerald-700 dark:text-emerald-400': tone === 'danger',
        'text-amber-700 dark:text-amber-400': tone === 'warning',
        'text-zinc-900 dark:text-zinc-50': !tone || tone === 'neutral',
      }"
    >
      {{ value }}
    </p>
  </div>
</template>
