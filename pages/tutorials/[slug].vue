<script setup lang="ts">
import { formatDate, formatReadingTime } from '~/utils/format'
import { buildTutorialJsonLd } from '~/utils/jsonld'
import { renderMarkdown } from '~/utils/markdown'
import {
  getTutorialBySlug,
  getTutorialCategoryLabel,
  getTutorialCategoryNavPath,
  getTutorialTypeLabel,
} from '~/utils/tutorials'

const route = useRoute()
const slug = String(route.params.slug)
const tutorial = getTutorialBySlug(slug)

if (!tutorial) {
  throw createError({
    statusCode: 404,
    statusMessage: '教程不存在',
  })
}

const markdownHtml = tutorial.markdown
  ? renderMarkdown(tutorial.markdown)
  : tutorial.content?.length
    ? renderMarkdown(tutorial.content.join('\n\n'))
    : ''

const categoryNavPath = getTutorialCategoryNavPath(tutorial.category)
const categoryFullLabel = getTutorialCategoryLabel(tutorial.category, 'full')
const categoryShortLabel = getTutorialCategoryLabel(tutorial.category)

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

usePageSeo({
  title: tutorial.title,
  description: tutorial.description,
  path: `/tutorials/${tutorial.slug}`,
})

useJsonLd('ld-json-tutorial', buildTutorialJsonLd(siteUrl, tutorial))
</script>

<template>
  <AppContainer v-if="tutorial" class="py-12 sm:py-16">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <NuxtLink
        to="/tutorials"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        返回教程
      </NuxtLink>
      <NuxtLink
        v-if="categoryNavPath"
        :to="categoryNavPath"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        返回{{ categoryShortLabel }}
      </NuxtLink>
    </div>
    <article class="mt-8 max-w-3xl">
      <p class="text-xs text-zinc-400">
        {{ getTutorialTypeLabel(tutorial.type) }} · {{ categoryFullLabel }}
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
        v-if="tutorial.type === 'video' && tutorial.videoUrl"
        class="card mt-8 overflow-hidden p-0"
      >
        <div class="aspect-video w-full bg-zinc-100 dark:bg-white/[0.04]">
          <iframe
            class="h-full w-full"
            :src="tutorial.videoUrl"
            title="tutorial video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
      <div
        v-else-if="tutorial.type === 'video'"
        class="card mt-8 p-6"
      >
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          本条暂未接入播放源。可先阅读下方图文说明，或前往相关文字教程。
        </p>
      </div>

      <div
        v-if="markdownHtml"
        class="markdown-body mt-10"
        v-html="markdownHtml"
      />
    </article>
  </AppContainer>
</template>
