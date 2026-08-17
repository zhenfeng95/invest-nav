<script setup lang="ts">
import type { ReportListResponse } from '~/types/report'
import { formatYearMonth } from '~/utils/format'

const { data, error } = await useAsyncData('reports', () => $fetch<ReportListResponse>('/api/reports'))

usePageSeo({
  title: '收盘日报',
  description: '投研 Agent 每个工作日生成的收盘日报，按日期阅读市场复盘与要点。',
  path: '/reports',
})

const groups = computed(() => {
  const items = data.value?.items ?? []
  const map = new Map<string, typeof items>()

  for (const item of items) {
    const key = item.date ? item.date.slice(0, 7) : 'other'
    const list = map.get(key) ?? []
    list.push(item)
    map.set(key, list)
  }

  return [...map.entries()].map(([key, reports]) => ({
    key,
    label: key === 'other' ? '其他' : formatYearMonth(key),
    reports,
  }))
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Daily Brief"
      title="收盘日报"
      description="读取投研 Agent 仓库中的 Markdown 日报，按工作日归档展示。内容仅供学习整理，不构成投资建议。"
    />

    <EmptyState
      v-if="error"
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

    <div v-else class="space-y-12">
      <section
        v-for="group in groups"
        :key="group.key"
        class="space-y-4"
      >
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ group.label }}
        </h2>
        <div class="grid gap-3">
          <ReportCard
            v-for="report in group.reports"
            :key="report.slug"
            :report="report"
          />
        </div>
      </section>
    </div>
  </AppContainer>
</template>
