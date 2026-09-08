<script setup lang="ts">
import type { ReportListResponse, ReportMarket } from '~/types/report'
import { currentYearMonth, formatYearMonth, isCurrentYearMonth } from '~/utils/format'

type MarketFilter = 'all' | ReportMarket

const nuxtApp = useNuxtApp()
const { data, error, pending, status } = await useAsyncData(
  'reports',
  () => $fetch<ReportListResponse>('/api/reports'),
  {
    lazy: import.meta.client,
    getCachedData: key => nuxtApp.payload.data[key],
  },
)

const isLoading = computed(() => !data.value && !error.value && (pending.value || status.value === 'idle'))
const marketFilter = ref<MarketFilter>('all')
const monthKey = currentYearMonth()
const monthLabel = monthKey ? formatYearMonth(monthKey) : '本月'

const filters: Array<{ id: MarketFilter, label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'A', label: 'A股' },
  { id: 'US', label: '美股' },
]

const monthItems = computed(() =>
  (data.value?.items ?? []).filter(item => isCurrentYearMonth(item.date)),
)

const filteredItems = computed(() => {
  const items = monthItems.value
  if (marketFilter.value === 'all') {
    return items
  }
  return items.filter(item => item.market === marketFilter.value)
})

const hasMarketSplit = computed(() =>
  monthItems.value.some(item => item.market === 'A')
  && monthItems.value.some(item => item.market === 'US'),
)

usePageSeo({
  title: '收盘日报',
  description: '阅读投研 Agent 本月生成的收盘日报：按日期归档 A 股与美股市场复盘、要点与观察清单，帮助回顾当日行情脉络；内容仅供学习整理，不构成投资建议。',
  path: '/reports',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Daily Brief"
      title="收盘日报"
      :description="`展示 ${monthLabel} 的 A 股与美股收盘复盘，由投研 Agent 生成。内容仅供学习整理，不构成投资建议。`"
    />

    <PageLoading v-if="isLoading" />

    <EmptyState
      v-else-if="error"
      eyebrow="Unavailable"
      title="日报暂时无法加载"
      description="GitHub 仓库读取失败。请稍后重试，或检查仓库地址、目录和访问权限。"
    />

    <EmptyState
      v-else-if="!data?.configured"
      eyebrow="Coming Soon"
      title="收盘日报即将接入"
      description="配置投研 Agent 所在的 GitHub 仓库后，工作日收盘日报会自动出现在这里。"
    />

    <EmptyState
      v-else-if="!data.items.length"
      eyebrow="Empty"
      title="还没有日报文件"
      description="仓库已连接，但指定目录里还没有可展示的 Markdown 文件。"
    />

    <EmptyState
      v-else-if="!monthItems.length"
      eyebrow="Empty"
      :title="`${monthLabel}暂无收盘日报`"
      description="本月尚无 A 股或美股收盘日报文件，新文件写入投研 Agent 仓库后会自动出现。"
    />

    <div v-else class="space-y-8">
      <div
        v-if="hasMarketSplit"
        class="flex flex-wrap gap-2"
        role="tablist"
        aria-label="按市场筛选日报"
      >
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          role="tab"
          class="rounded-full border px-3.5 py-1.5 text-sm transition"
          :class="marketFilter === filter.id
            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-100'"
          :aria-selected="marketFilter === filter.id"
          @click="marketFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <EmptyState
        v-if="!filteredItems.length"
        eyebrow="Empty"
        title="该市场本月暂无日报"
        description="切换到「全部」或其他市场看看。"
      />

      <div v-else class="grid gap-3">
        <ReportCard
          v-for="report in filteredItems"
          :key="report.slug"
          :report="report"
        />
      </div>
    </div>
  </AppContainer>
</template>
