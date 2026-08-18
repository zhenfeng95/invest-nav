<script setup lang="ts">
import type { InsightTone } from '~/types/portfolio'

defineProps<{
  tone?: InsightTone
  title: string
  body: string
}>()
</script>

<template>
  <div
    class="rounded-2xl border px-5 py-4"
    :class="{
      'border-sky-200/80 bg-sky-50/70 dark:border-sky-500/20 dark:bg-sky-500/10': tone === 'info',
      'border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10': tone === 'success',
      'border-amber-200/80 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/10': tone === 'warning',
      'border-rose-200/80 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/10': tone === 'danger',
      'border-zinc-200/80 bg-white dark:border-white/10 dark:bg-white/[0.03]': !tone || tone === 'neutral',
    }"
  >
    <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{{ title }}</p>
    <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{{ body }}</p>
  </div>
</template>
