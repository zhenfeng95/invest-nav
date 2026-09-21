<script setup lang="ts">
import { formatDate, formatReadingTime } from '~/utils/format'
import { buildNoteJsonLd } from '~/utils/jsonld'
import { renderMarkdown } from '~/utils/markdown'
import { getNoteBySlug } from '~/utils/notes'

const route = useRoute()
const slug = String(route.params.slug)
const note = getNoteBySlug(slug)

if (!note) {
  throw createError({
    statusCode: 404,
    statusMessage: '笔记不存在',
  })
}

const markdownHtml = note.markdown ? renderMarkdown(note.markdown) : ''

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

usePageSeo({
  title: note.title,
  description: note.description,
  path: `/notes/${note.slug}`,
})

useJsonLd('ld-json-note', buildNoteJsonLd(siteUrl, note))
</script>

<template>
  <AppContainer v-if="note" class="py-12 sm:py-16">
    <NuxtLink
      to="/notes"
      class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
    >
      返回笔记
    </NuxtLink>
    <article class="mt-8 max-w-3xl">
      <p class="text-xs text-zinc-400">
        {{ note.category }}
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {{ note.title }}
      </h1>
      <p class="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
        {{ note.description }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span v-if="note.readingMinutes">{{ formatReadingTime(note.readingMinutes) }}</span>
        <span>更新 {{ formatDate(note.updatedAt) }}</span>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in note.tags"
          :key="tag"
          class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
        >
          {{ tag }}
        </span>
      </div>
      <div
        v-if="markdownHtml"
        class="markdown-body mt-10"
        v-html="markdownHtml"
      />
    </article>
  </AppContainer>
</template>
