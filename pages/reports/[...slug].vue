<script setup lang="ts">
import type { ReportDetail } from '~/types/report'
import { formatDate, formatWeekday } from '~/utils/format'
import { SITE_DISCLAIMER } from '~/utils/site'

const route = useRoute()
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.join('/') : String(value || '')
})

const nuxtApp = useNuxtApp()
const { data, error, pending, status } = await useAsyncData(
  () => `report-${slug.value}`,
  () => $fetch<ReportDetail>(`/api/reports/${slug.value}`),
  {
    watch: [slug],
    lazy: import.meta.client,
    getCachedData: key => nuxtApp.payload.data[key],
  },
)

const isLoading = computed(() => !data.value && !error.value && (pending.value || status.value === 'idle'))
const report = computed(() => data.value)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 502,
    statusMessage: error.value.statusMessage || '日报不存在',
  })
}

watch(error, (value) => {
  if (!value) {
    return
  }
  showError({
    statusCode: value.statusCode || 502,
    statusMessage: value.statusMessage || '日报不存在',
  })
})

usePageSeo({
  title: report.value?.title || '收盘日报',
  description: report.value
    ? `${report.value.title}。投研 Agent 收盘日报，仅供学习整理，不构成投资建议。`
    : '投研 Agent 收盘日报。',
  path: `/reports/${slug.value}`,
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <NuxtLink
      to="/reports"
      class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
    >
      返回日报列表
    </NuxtLink>

    <PageLoading v-if="isLoading" class="mt-8" :rows="4" />

    <article v-else-if="report" class="mt-8 max-w-3xl">
      <p class="text-xs text-zinc-400">
        收盘日报
        <template v-if="report.date">
          · {{ formatDate(report.date) }}
          <template v-if="formatWeekday(report.date)"> · {{ formatWeekday(report.date) }}</template>
        </template>
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {{ report.title }}
      </h1>

      <div
        class="markdown-body mt-10"
        v-html="report.html"
      />

      <div class="mt-12 flex flex-wrap items-center gap-4 border-t border-zinc-200/80 pt-6 dark:border-white/[0.06]">
        <a
          v-if="report.htmlUrl"
          :href="report.htmlUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          在 GitHub 查看原文
          <AppIcon name="external" class="h-3.5 w-3.5" />
        </a>
        <p class="text-xs leading-5 text-zinc-400">
          {{ SITE_DISCLAIMER }}
        </p>
      </div>
    </article>
  </AppContainer>
</template>
