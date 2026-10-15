<script setup lang="ts">
import { formatDate, formatReadingTime } from '~/utils/format'
import { buildTutorialJsonLd } from '~/utils/jsonld'
import { renderMarkdown } from '~/utils/markdown'
import { loadTutorialMarkdown } from '~/utils/tutorials'
import {
  getTutorialCategoryLabel,
  getTutorialMetaBySlug,
  getTutorialTypeLabel,
} from '~/utils/tutorial-meta'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const meta = computed(() => getTutorialMetaBySlug(slug.value))

if (!meta.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '教程不存在',
  })
}

/**
 * 元数据同步可用，正文异步拉取。
 * lazy: 客户端导航不阻塞切页（避免「路由已变、页面半天才跳」）；
 * SSR 仍会 await，保证首屏 HTML 带正文利于 SEO。
 */
const { data: markdown, pending: markdownPending } = await useAsyncData(
  () => `tutorial-md-${slug.value}`,
  async () => {
    const item = getTutorialMetaBySlug(slug.value)
    if (!item) {
      return ''
    }
    if (item.markdownFile) {
      return (await loadTutorialMarkdown(item.markdownFile)) ?? ''
    }
    if (item.content?.length) {
      return item.content.join('\n\n')
    }
    return item.markdown ?? ''
  },
  {
    watch: [slug],
    lazy: import.meta.client,
  },
)

watch(slug, (next) => {
  if (!getTutorialMetaBySlug(next)) {
    showError(createError({
      statusCode: 404,
      statusMessage: '教程不存在',
    }))
  }
})

const markdownHtml = computed(() => {
  const source = markdown.value
  return source ? renderMarkdown(source) : ''
})

const categoryFullLabel = computed(() =>
  getTutorialCategoryLabel(meta.value!.category, 'full'),
)

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
    path: `/tutorials/${item.slug}`,
  })
  useJsonLd(
    'ld-json-tutorial',
    buildTutorialJsonLd(siteUrl, {
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
        {{ getTutorialTypeLabel(meta.type) }} · {{ categoryFullLabel }}
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {{ meta.title }}
      </h1>
      <p class="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
        {{ meta.description }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3 text-xs text-zinc-400">
        <span v-if="meta.readingMinutes">{{ formatReadingTime(meta.readingMinutes) }}</span>
        <span v-if="meta.duration">时长 {{ meta.duration }}</span>
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

      <img
        v-if="meta.image || meta.thumbnail"
        :src="meta.image || meta.thumbnail"
        :alt="meta.title"
        class="mt-8 w-full rounded-2xl border border-zinc-200/80 dark:border-white/10"
      >

      <div
        v-if="meta.type === 'video' && meta.videoUrl"
        class="card mt-8 overflow-hidden p-0"
      >
        <div class="aspect-video w-full bg-zinc-100 dark:bg-white/[0.04]">
          <iframe
            class="h-full w-full"
            :src="meta.videoUrl"
            title="tutorial video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
      <div
        v-else-if="meta.type === 'video'"
        class="card mt-8 p-6"
      >
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          本条暂未接入播放源。可先阅读下方图文说明，或前往相关文字教程。
        </p>
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
