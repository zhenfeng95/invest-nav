<script setup lang="ts">
import type { Tutorial } from '~/types/tutorial'
import { formatDate } from '~/utils/format'
import { prefetchTutorialBySlug } from '~/utils/tutorials'
import { getTutorialTypeLabel } from '~/utils/tutorial-meta'

defineProps<{
  items: Tutorial[]
}>()
</script>

<template>
  <div v-if="items.length" class="space-y-3">
    <NuxtLink
      v-for="tutorial in items"
      :key="tutorial.id"
      :to="`/tutorials/${tutorial.slug}`"
      class="group block rounded-2xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/20"
      @pointerenter="prefetchTutorialBySlug(tutorial.slug)"
      @focusin="prefetchTutorialBySlug(tutorial.slug)"
    >
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span>{{ getTutorialTypeLabel(tutorial.type) }}</span>
        <span>·</span>
        <span>{{ tutorial.category }}</span>
      </div>
      <h3 class="mt-2 text-base font-semibold tracking-tight text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-200 sm:text-lg">
        {{ tutorial.title }}
      </h3>
      <p class="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {{ tutorial.description }}
      </p>
      <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
        <span>发布 {{ formatDate(tutorial.publishedAt) }}</span>
        <span>更新 {{ formatDate(tutorial.updatedAt) }}</span>
        <span v-if="tutorial.readingMinutes">阅读约 {{ tutorial.readingMinutes }} 分钟</span>
      </div>
    </NuxtLink>
  </div>
  <EmptyState
    v-else
    title="暂无相关教程"
    description="这个分类还没有整理教程，后续会持续补充。"
  />
</template>
