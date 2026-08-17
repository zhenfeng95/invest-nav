<script setup lang="ts">
import type { Tutorial } from '~/types/tutorial'
import { formatDate, formatReadingTime } from '~/utils/format'
import { getTutorialTypeLabel } from '~/utils/tutorials'

defineProps<{
  tutorial: Tutorial
}>()
</script>

<template>
  <NuxtLink
    :to="`/tutorials/${tutorial.slug}`"
    class="card card-hover flex h-full flex-col overflow-hidden"
  >
    <div
      v-if="tutorial.image || tutorial.thumbnail"
      class="border-b border-zinc-200/80 dark:border-white/[0.06]"
    >
      <img
        :src="tutorial.image || tutorial.thumbnail"
        :alt="tutorial.title"
        class="h-40 w-full object-cover"
      >
    </div>
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-center gap-2 text-xs text-zinc-400">
        <span>{{ getTutorialTypeLabel(tutorial.type) }}</span>
        <span>·</span>
        <span>{{ tutorial.category }}</span>
      </div>
      <h3 class="mt-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ tutorial.title }}
      </h3>
      <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {{ tutorial.description }}
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in tutorial.tags"
          :key="tag"
          class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
        <span v-if="tutorial.readingMinutes">{{ formatReadingTime(tutorial.readingMinutes) }}</span>
        <span v-if="tutorial.duration">{{ tutorial.duration }}</span>
        <span>更新 {{ formatDate(tutorial.updatedAt) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
