<script setup lang="ts">
import type { Tutorial } from '~/types/tutorial'
import {
  countPlainTextChars,
  estimateReadingMinutes,
  formatDate,
  formatWordCount,
} from '~/utils/format'
import {
  getTutorialPlainText,
  getTutorialTypeLabel,
} from '~/utils/tutorials'

const props = defineProps<{
  items: Tutorial[]
}>()

const rows = computed(() => props.items.map((tutorial) => {
  const chars = countPlainTextChars(getTutorialPlainText(tutorial))
  const minutes = estimateReadingMinutes(chars, tutorial.readingMinutes)
  return {
    tutorial,
    wordLabel: formatWordCount(chars),
    readingLabel: `${minutes} 分钟`,
  }
}))
</script>

<template>
  <div v-if="rows.length" class="space-y-3">
    <NuxtLink
      v-for="row in rows"
      :key="row.tutorial.id"
      :to="`/tutorials/${row.tutorial.slug}`"
      class="group block rounded-2xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/20"
    >
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span>{{ getTutorialTypeLabel(row.tutorial.type) }}</span>
        <span>·</span>
        <span>{{ row.tutorial.category }}</span>
      </div>
      <h3 class="mt-2 text-base font-semibold tracking-tight text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-200 sm:text-lg">
        {{ row.tutorial.title }}
      </h3>
      <p class="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {{ row.tutorial.description }}
      </p>
      <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
        <span>发布 {{ formatDate(row.tutorial.publishedAt) }}</span>
        <span>更新 {{ formatDate(row.tutorial.updatedAt) }}</span>
        <span>{{ row.wordLabel }}</span>
        <span>阅读约 {{ row.readingLabel }}</span>
      </div>
    </NuxtLink>
  </div>
  <EmptyState
    v-else
    title="暂无相关教程"
    description="这个分类还没有整理教程，后续会持续补充。"
  />
</template>
