<script setup lang="ts">
import { formatDate, formatReadingTime } from '~/utils/format'
import { buildNoteJsonLd } from '~/utils/jsonld'
import { renderMarkdown } from '~/utils/markdown'
import { getNoteMetaBySlug } from '~/utils/note-meta'
import { loadNoteMarkdown } from '~/utils/notes'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const meta = computed(() => getNoteMetaBySlug(slug.value))

if (!meta.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '笔记不存在',
  })
}

const { data: markdown, pending: markdownPending } = await useAsyncData(
  () => `note-md-${slug.value}`,
  async () => {
    const item = getNoteMetaBySlug(slug.value)
    if (!item) {
      return ''
    }
    if (item.markdownFile) {
      return (await loadNoteMarkdown(item.markdownFile)) ?? ''
    }
    return item.markdown ?? ''
  },
  {
    watch: [slug],
    lazy: import.meta.client,
  },
)

watch(slug, (next) => {
  if (!getNoteMetaBySlug(next)) {
    showError(createError({
      statusCode: 404,
      statusMessage: '笔记不存在',
    }))
  }
})

const markdownHtml = computed(() => {
  const source = markdown.value
  return source ? renderMarkdown(source) : ''
})

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

function applySeo() {
  const item = meta.value
  if (!item) {
    return
  }
  usePageSeo({
    title: item.title,
    description: item.description,
    path: `/notes/${item.slug}`,
  })
  useJsonLd(
    'ld-json-note',
    buildNoteJsonLd(siteUrl, {
      ...item,
      markdown: markdown.value || item.markdown,
    }),
  )
}

applySeo()
watch([meta, markdown], applySeo)
</script>

<template>
  <AppContainer v-if="meta" class="py-12 sm:py-16">
    <article class="max-w-3xl">
      <p class="text-xs text-zinc-400">
        {{ meta.category }}
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {{ meta.title }}
      </h1>
      <p class="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
        {{ meta.description }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span v-if="meta.readingMinutes">{{ formatReadingTime(meta.readingMinutes) }}</span>
        <span>更新 {{ formatDate(meta.updatedAt) }}</span>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in meta.tags"
          :key="tag"
          class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
        >
          {{ tag }}
        </span>
      </div>
      <div
        v-if="markdownPending && !markdownHtml"
        class="mt-10 space-y-3"
        aria-busy="true"
        aria-label="正文加载中"
      >
        <div class="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-white/[0.06]" />
        <div class="h-4 w-11/12 animate-pulse rounded bg-zinc-100 dark:bg-white/[0.06]" />
        <div class="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-white/[0.06]" />
        <div class="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-white/[0.06]" />
        <div class="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-white/[0.06]" />
      </div>
      <div
        v-else-if="markdownHtml"
        class="markdown-body mt-10"
        v-html="markdownHtml"
      />
    </article>
  </AppContainer>
</template>
