<script setup lang="ts">
import type { ReportListItem } from '~/types/report'
import { formatDate, formatWeekday } from '~/utils/format'

defineProps<{
  report: ReportListItem
}>()
</script>

<template>
  <NuxtLink
    :to="`/reports/${report.slug}`"
    class="card card-hover flex items-start justify-between gap-4 p-5"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span v-if="report.date">{{ formatDate(report.date) }}</span>
        <span v-if="report.date && formatWeekday(report.date)">·</span>
        <span v-if="report.date">{{ formatWeekday(report.date) }}</span>
        <span v-if="!report.date">收盘日报</span>
      </div>
      <h3 class="mt-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ report.title }}
      </h3>
    </div>
    <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
  </NuxtLink>
</template>
