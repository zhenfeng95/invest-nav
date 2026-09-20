<script setup lang="ts">
import type { EquityPoint, PortfolioAnalysis } from '~/types/portfolio'
import type { ReportListResponse } from '~/types/report'
import { formatDate, formatSignedMoney, formatYearMonth, isCurrentYearMonth, pnlTextClass } from '~/utils/format'

const nuxtApp = useNuxtApp()
const getCachedData = (key: string) => nuxtApp.payload.data[key]

const [{ data: reportsData }, { data: reviewsData }, { data: portfolioData }] = await Promise.all([
  useAsyncData(
    'reports',
    () => $fetch<ReportListResponse>('/api/reports'),
    {
      lazy: import.meta.client,
      getCachedData,
    },
  ),
  useAsyncData(
    'reviews-monthly',
    () => $fetch<ReportListResponse>('/api/reviews/monthly'),
    {
      lazy: import.meta.client,
      getCachedData,
    },
  ),
  useAsyncData(
    'portfolio-analysis',
    () => $fetch<PortfolioAnalysis>('/api/portfolio'),
    {
      lazy: import.meta.client,
      getCachedData,
    },
  ),
])

const reports = computed(() => {
  const items = (reportsData.value?.items ?? []).filter(item => isCurrentYearMonth(item.date))
  const ashare = items.find(item => item.market === 'A')
  const us = items.find(item => item.market === 'US')
  if (ashare || us) {
    return [ashare, us].filter((item): item is NonNullable<typeof item> => Boolean(item))
  }
  return items.slice(0, 2)
})
const reviews = computed(() => reviewsData.value?.items.slice(0, 2) ?? [])
const portfolioReady = computed(() =>
  Boolean(portfolioData.value?.configured && (portfolioData.value.a || portfolioData.value.us)),
)
const hasContent = computed(() =>
  portfolioReady.value || reports.value.length > 0 || reviews.value.length > 0,
)

function lastTotal(points: EquityPoint[] | undefined, fallback: number) {
  return points?.length ? points[points.length - 1].total : fallback
}
</script>

<template>
  <section v-if="hasContent">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="投研速览"
        description="持仓分账、市场评分、收盘日报与月度复盘，由投研 Agent 生成。"
      />
      <NuxtLink
        to="/portfolio"
        class="inline-flex shrink-0 items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        查看投研
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>

    <div
      v-if="portfolioReady && portfolioData"
      class="mt-8 grid gap-3 md:grid-cols-2"
    >
      <NuxtLink
        v-if="portfolioData.a"
        to="/portfolio"
        class="card card-hover p-5"
      >
        <p class="text-xs uppercase tracking-[0.18em] text-accent">A 股</p>
        <p class="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {{ portfolioData.a.open.length ? portfolioData.a.open.map(item => item.name).join('、') : '当前空仓' }}
        </p>
        <p
          class="mt-2 text-sm"
          :class="pnlTextClass(lastTotal(portfolioData.a.equityCurve, portfolioData.a.realized))"
        >
          累计 {{ formatSignedMoney(lastTotal(portfolioData.a.equityCurve, portfolioData.a.realized), portfolioData.a.currency) }}
        </p>
        <PortfolioEquityChart
          v-if="portfolioData.a.equityCurve.length > 1"
          class="mt-4"
          :points="portfolioData.a.equityCurve"
          :currency="portfolioData.a.currency"
          market="A"
          compact
        />
      </NuxtLink>
      <NuxtLink
        v-if="portfolioData.us"
        to="/portfolio"
        class="card card-hover p-5"
      >
        <p class="text-xs uppercase tracking-[0.18em] text-accent">美股</p>
        <p class="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {{ portfolioData.us.open.length ? portfolioData.us.open.map(item => item.ticker).join(' / ') : '当前空仓' }}
        </p>
        <p
          class="mt-2 text-sm"
          :class="pnlTextClass(lastTotal(portfolioData.us.equityCurve, portfolioData.us.realized))"
        >
          累计 {{ formatSignedMoney(lastTotal(portfolioData.us.equityCurve, portfolioData.us.realized), portfolioData.us.currency) }}
        </p>
        <PortfolioEquityChart
          v-if="portfolioData.us.equityCurve.length > 1"
          class="mt-4"
          :points="portfolioData.us.equityCurve"
          :currency="portfolioData.us.currency"
          market="US"
          compact
        />
      </NuxtLink>
    </div>

    <div
      v-if="reports.length || reviews.length"
      class="mt-6 grid gap-6 lg:grid-cols-2"
      :class="{ 'mt-8': !portfolioReady }"
    >
      <div v-if="reports.length" class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">收盘日报</p>
          <NuxtLink
            to="/reports"
            class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
          >
            全部
          </NuxtLink>
        </div>
        <NuxtLink
          v-for="item in reports"
          :key="item.slug"
          :to="`/reports/${item.slug}`"
          class="card card-hover flex items-start justify-between gap-4 p-4"
        >
          <div class="min-w-0">
            <p class="text-xs text-zinc-400">
              <template v-if="item.market === 'A'">A股</template>
              <template v-else-if="item.market === 'US'">美股</template>
              <template v-if="item.market && item.date"> · </template>
              {{ item.date ? formatDate(item.date) : '收盘日报' }}
            </p>
            <p class="mt-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {{ item.title }}
            </p>
          </div>
          <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        </NuxtLink>
      </div>

      <div v-if="reviews.length" class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">月度复盘</p>
          <NuxtLink
            to="/reviews/monthly"
            class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
          >
            全部
          </NuxtLink>
        </div>
        <NuxtLink
          v-for="item in reviews"
          :key="item.slug"
          :to="`/reviews/monthly/${item.slug}`"
          class="card card-hover flex items-start justify-between gap-4 p-4"
        >
          <div class="min-w-0">
            <p class="text-xs text-zinc-400">
              {{ item.date ? formatYearMonth(item.date) : '每月复盘' }}
            </p>
            <p class="mt-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {{ item.title }}
            </p>
          </div>
          <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
