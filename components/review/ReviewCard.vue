<script setup lang="ts">
import type { ReportListItem } from '~/types/report'
import { formatYearMonth } from '~/utils/format'

defineProps<{
  review: ReportListItem
}>()
</script>

<template>
  <NuxtLink
    :to="`/reviews/${review.slug}`"
    class="card card-hover flex items-start justify-between gap-4 p-5"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span v-if="review.date">{{ formatYearMonth(review.date) }}</span>
        <span v-else>月度复盘</span>
      </div>
      <h3 class="mt-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ review.title }}
      </h3>
    </div>
    <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
  </NuxtLink>
</template>
