<script setup lang="ts">
import type { ReportListResponse, ReportMarket } from '~/types/report'
import { currentYearMonth, formatYearMonth, isCurrentYearMonth } from '~/utils/format'

type MarketFilter = 'all' | ReportMarket

const route = useRoute()
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

function parseMarketQuery(raw: unknown): MarketFilter {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value === 'A' || value === 'US') {
    return value
  }
  return 'all'
}

const marketFilter = computed(() => parseMarketQuery(route.query.market))

const monthKey = currentYearMonth()
const monthLabel = monthKey ? formatYearMonth(monthKey) : '本月'

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

const seoByMarket: Record<MarketFilter, { title: string, description: string, heroTitle: string, heroDescription: string }> = {
  all: {
    title: '收盘日报｜A股与美股市场复盘',
    description: '阅读投研 Agent 本月生成的收盘日报：按日期归档 A 股与美股市场复盘、要点与观察清单，帮助回顾当日行情脉络；内容仅供学习整理，不构成投资建议。',
    heroTitle: '收盘日报',
    heroDescription: `展示 ${monthLabel} 的 A 股与美股收盘复盘，由投研 Agent 生成。内容仅供学习整理，不构成投资建议。`,
  },
  A: {
    title: 'A股日报｜收盘复盘',
    description: '阅读投研 Agent 本月生成的 A 股收盘日报：按日期归档市场复盘、要点与观察清单，帮助回顾当日行情脉络；内容仅供学习整理，不构成投资建议。',
    heroTitle: 'A股日报',
    heroDescription: `展示 ${monthLabel} 的 A 股收盘复盘，由投研 Agent 生成。内容仅供学习整理，不构成投资建议。`,
  },
  US: {
    title: '美股日报｜收盘复盘',
    description: '阅读投研 Agent 本月生成的美股收盘日报：按日期归档市场复盘、要点与观察清单，帮助回顾当日行情脉络；内容仅供学习整理，不构成投资建议。',
    heroTitle: '美股日报',
    heroDescription: `展示 ${monthLabel} 的美股收盘复盘，由投研 Agent 生成。内容仅供学习整理，不构成投资建议。`,
  },
}

const pageCopy = computed(() => seoByMarket[marketFilter.value])
const initialSeo = seoByMarket[parseMarketQuery(route.query.market)]

usePageSeo({
  title: initialSeo.title,
  description: initialSeo.description,
  path: '/reports',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Daily Brief"
      :title="pageCopy.heroTitle"
      :description="pageCopy.heroDescription"
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

    <EmptyState
      v-else-if="!filteredItems.length"
      eyebrow="Empty"
      title="该市场本月暂无日报"
      description="本月尚无对应市场的收盘日报文件，新文件写入投研 Agent 仓库后会自动出现。"
    />

    <div v-else class="grid gap-3">
      <ReportCard
        v-for="report in filteredItems"
        :key="report.slug"
        :report="report"
      />
    </div>
  </AppContainer>
</template>
