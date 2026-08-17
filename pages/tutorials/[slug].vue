<script setup lang="ts">
import { formatDate, formatReadingTime } from '~/utils/format'
import { getTutorialBySlug, getTutorialTypeLabel } from '~/utils/tutorials'

const route = useRoute()
const slug = String(route.params.slug)
const tutorial = getTutorialBySlug(slug)

if (!tutorial) {
  throw createError({
    statusCode: 404,
    statusMessage: '教程不存在',
  })
}

usePageSeo({
  title: tutorial.title,
  description: tutorial.description,
  path: `/tutorials/${tutorial.slug}`,
})
</script>

<template>
  <AppContainer v-if="tutorial" class="py-12 sm:py-16">
    <NuxtLink
      to="/tutorials"
      class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
    >
      返回教程
    </NuxtLink>
    <article class="mt-8 max-w-3xl">
      <p class="text-xs text-zinc-400">
        {{ getTutorialTypeLabel(tutorial.type) }} · {{ tutorial.category }}
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {{ tutorial.title }}
      </h1>
      <p class="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
        {{ tutorial.description }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span v-if="tutorial.readingMinutes">{{ formatReadingTime(tutorial.readingMinutes) }}</span>
        <span v-if="tutorial.duration">时长 {{ tutorial.duration }}</span>
        <span>更新 {{ formatDate(tutorial.updatedAt) }}</span>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in tutorial.tags"
          :key="tag"
          class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
        >
          {{ tag }}
        </span>
      </div>

      <img
        v-if="tutorial.image || tutorial.thumbnail"
        :src="tutorial.image || tutorial.thumbnail"
        :alt="tutorial.title"
        class="mt-8 w-full rounded-2xl border border-zinc-200/80 dark:border-white/10"
      >

      <div
        v-if="tutorial.type === 'video'"
        class="card mt-8 p-6"
      >
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          视频播放源尚未接入。当前 `videoUrl` 仅作为数据结构预留。
        </p>
      </div>

      <div
        v-if="tutorial.content?.length"
        class="mt-10 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base"
      >
        <p v-for="(paragraph, index) in tutorial.content" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </article>
  </AppContainer>
</template>
