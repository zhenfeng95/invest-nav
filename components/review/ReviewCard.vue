<script setup lang="ts">
import type { ReportListItem } from '~/types/report'
import { formatWeekOfMonth, formatYearMonth } from '~/utils/format'

const props = withDefaults(defineProps<{
  review: ReportListItem
  basePath?: string
  kind?: 'monthly' | 'weekly'
}>(), {
  basePath: '/reviews/monthly',
  kind: 'monthly',
})

const periodLabel = computed(() => {
  if (!props.review.date) {
    return props.kind === 'weekly' ? '每周复盘' : '每月复盘'
  }
  return props.kind === 'weekly'
    ? formatWeekOfMonth(props.review.date)
    : formatYearMonth(props.review.date)
})
</script>

<template>
  <NuxtLink
    :to="`${basePath}/${review.slug}`"
    class="card card-hover flex items-start justify-between gap-4 p-5"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span>{{ periodLabel }}</span>
      </div>
      <h3 class="mt-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ review.title }}
      </h3>
    </div>
    <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
  </NuxtLink>
</template>
