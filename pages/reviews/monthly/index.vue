<script setup lang="ts">
import type { ReportListResponse } from '~/types/report'

const nuxtApp = useNuxtApp()
const { data, error, pending, status } = await useAsyncData(
  'reviews-monthly',
  () => $fetch<ReportListResponse>('/api/reviews/monthly'),
  {
    lazy: import.meta.client,
    getCachedData: key => nuxtApp.payload.data[key],
  },
)

const isLoading = computed(() => !data.value && !error.value && (pending.value || status.value === 'idle'))

usePageSeo({
  title: '每月复盘',
  description: '投研 Agent 每月生成的交易复盘，按月阅读盈亏、纪律与下月改进。',
  path: '/reviews/monthly',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Monthly Review"
      title="每月复盘"
      description="读取投研 Agent 仓库中的 Markdown 月报复盘，归档展示当月盈亏、纪律问题与改进清单。内容仅供学习整理，不构成投资建议。"
    />

    <PageLoading v-if="isLoading" />

    <EmptyState
      v-else-if="error"
      eyebrow="Unavailable"
      title="复盘暂时无法加载"
      description="GitHub 仓库读取失败。请稍后重试，或检查仓库地址、目录和访问权限。"
    />

    <EmptyState
      v-else-if="!data?.configured"
      eyebrow="Coming Soon"
      title="每月复盘即将接入"
      description="配置投研 Agent 所在的 GitHub 仓库后，每月复盘会自动出现在这里。"
    />

    <EmptyState
      v-else-if="!data.items.length"
      eyebrow="Empty"
      title="还没有复盘文件"
      description="仓库已连接，但每月复盘目录里还没有可展示的 Markdown 文件。"
    />

    <div v-else class="grid gap-3">
      <ReviewCard
        v-for="review in data.items"
        :key="review.slug"
        :review="review"
        base-path="/reviews/monthly"
        kind="monthly"
      />
    </div>
  </AppContainer>
</template>
