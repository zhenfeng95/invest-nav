<script setup lang="ts">
import type { Note } from '~/types/note'
import { formatDate, formatReadingTime } from '~/utils/format'

defineProps<{
  note: Note
}>()
</script>

<template>
  <NuxtLink
    :to="`/notes/${note.slug}`"
    class="card card-hover flex h-full flex-col p-5"
  >
    <p class="text-xs text-zinc-400">
      {{ note.category }}
    </p>
    <h3 class="mt-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ note.title }}
    </h3>
    <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
      {{ note.description }}
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="tag in note.tags"
        :key="tag"
        class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
      >
        {{ tag }}
      </span>
    </div>
    <div class="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
      <span v-if="note.readingMinutes">{{ formatReadingTime(note.readingMinutes) }}</span>
      <span>更新 {{ formatDate(note.updatedAt) }}</span>
    </div>
  </NuxtLink>
</template>
