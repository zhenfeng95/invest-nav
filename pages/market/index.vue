<script setup lang="ts">
import type { AshareSnapshotResponse } from '~/types/snapshot'
import {
  ATTACK_OK_COLOR,
  formatAttackLabel,
  snapshotDayLabel,
  snapshotReportPath,
  snapshotTooltipRows,
  STRATEGY_COLORS,
  STRATEGY_ORDER,
  strategyColor,
} from '~/utils/snapshot'

const nuxtApp = useNuxtApp()
const { data, error, pending, status } = await useAsyncData(
  'ashare-snapshot',
  () => $fetch<AshareSnapshotResponse>('/api/market'),
  {
    lazy: import.meta.client,
    getCachedData: key => nuxtApp.payload.data[key],
  },
)

const isLoading = computed(() => !data.value && !error.value && (pending.value || status.value === 'idle'))
const items = computed(() => data.value?.items ?? [])
const hoverIndex = ref<number | null>(null)

const activeItem = computed(() => {
  if (!items.value.length) {
    return null
  }
  return items.value[hoverIndex.value ?? items.value.length - 1] || items.value[items.value.length - 1]
})

const latestItem = computed(() => items.value[items.value.length - 1] || null)
const viewingLatest = computed(() => !activeItem.value || activeItem.value.date === latestItem.value?.date)

const stats = computed(() => {
  const item = activeItem.value
  if (!item) {
    return []
  }
  return [
    { label: '市场评分', value: String(item.score) },
    { label: '对应策略', value: item.strategy || '—', color: strategyColor(item.strategy) },
    { label: '建议仓位', value: item.suggestedPosition || '—' },
    { label: '进攻四条件', value: formatAttackLabel(item) || '—', color: item.attackOk ? ATTACK_OK_COLOR : undefined },
  ]
})

const detailRows = computed(() => (activeItem.value ? snapshotTooltipRows(activeItem.value) : []))

usePageSeo({
  title: '市场评分｜A股仓位与进攻条件',
  description: '查看投研 Agent 每日整理的 A 股市场评分柱状图：按日期对照评分、建议仓位、进攻四条件与账户重心，帮助回顾市场节奏；内容仅供学习整理，不构成投资建议。',
  path: '/market',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Market Score"
      title="市场评分"
      description="读取投研 Agent 仓库里的 A 股收盘评分快照。横轴为交易日，纵轴为 0–100 分；柱颜色对应防守 / 轻仓试错 / 积极参与 / 进攻，柱顶菱形表示当日满足进攻四条件。内容仅供学习整理，不构成投资建议。"
    />

    <PageLoading v-if="isLoading" :rows="4" />

    <EmptyState
      v-else-if="error"
      eyebrow="Unavailable"
      title="市场评分暂时无法加载"
      description="评分快照读取失败。请稍后重试，或检查投研 Agent 仓库地址、快照文件和访问权限。"
    />

    <EmptyState
      v-else-if="!data?.configured"
      eyebrow="Coming Soon"
      title="市场评分即将接入"
      description="配置投研 Agent 所在的 GitHub 仓库后，每日评分会自动出现在这里。"
    />

    <EmptyState
      v-else-if="!items.length"
      eyebrow="Empty"
      title="还没有评分记录"
      :description="data?.message || '仓库已连接，但快照文件里还没有可展示的评分。'"
    />

    <template v-else-if="activeItem">
      <div class="space-y-3">
        <p class="text-xs leading-6 text-zinc-400">
          数据源 {{ data?.source || 'invest-agent' }}
          <template v-if="data?.path"> · {{ data.path }}</template>
          <template v-if="latestItem"> · 最新 {{ snapshotDayLabel(latestItem.date) }}</template>
        </p>
        <div class="flex flex-wrap items-end justify-between gap-3">
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            {{ viewingLatest ? '当前展示最新交易日' : `当前查看 ${snapshotDayLabel(activeItem.date)}` }}
            · 默认近 15 个交易日，可拖动滑块查看更早
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <button
              v-if="!viewingLatest"
              type="button"
              class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
              @click="hoverIndex = null"
            >
              回到最新
            </button>
            <NuxtLink
              :to="snapshotReportPath(activeItem.date)"
              class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
            >
              查看当日复盘
              <AppIcon name="arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="card px-4 py-4 sm:px-5"
        >
          <p class="text-xs text-zinc-400">{{ stat.label }}</p>
          <p
            class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            :style="stat.color ? { color: stat.color } : undefined"
          >
            {{ stat.value }}
          </p>
        </div>
      </div>

      <section class="card overflow-hidden p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">每日评分</p>
          <ul class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <li
              v-for="strategy in STRATEGY_ORDER"
              :key="strategy"
              class="inline-flex items-center gap-1.5"
            >
              <span
                class="h-2.5 w-2.5 rounded-sm"
                :style="{ backgroundColor: STRATEGY_COLORS[strategy] }"
                aria-hidden="true"
              />
              {{ strategy }}
            </li>
            <li class="inline-flex items-center gap-1.5">
              <span
                class="h-2 w-2 rotate-45"
                :style="{ backgroundColor: ATTACK_OK_COLOR }"
                aria-hidden="true"
              />
              进攻四条件满足
            </li>
          </ul>
        </div>

        <ClientOnly>
          <AshareScoreChart
            class="mt-4"
            :items="items"
            @hover="hoverIndex = $event"
          />
          <template #fallback>
            <div class="mt-4 h-[280px] animate-pulse rounded-xl bg-zinc-100/80 sm:h-[380px] dark:bg-white/5" />
          </template>
        </ClientOnly>
      </section>

      <section class="card space-y-4 p-5">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs text-zinc-400">当日细节</p>
            <p class="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {{ snapshotDayLabel(activeItem.date) }}
            </p>
          </div>
          <p
            v-if="activeItem.strategy"
            class="text-sm"
            :style="{ color: strategyColor(activeItem.strategy) }"
          >
            {{ activeItem.strategy }}
          </p>
        </div>
        <dl class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="row in detailRows"
            :key="row.label"
            class="min-w-0"
          >
            <dt class="text-xs text-zinc-400">{{ row.label }}</dt>
            <dd class="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
              {{ row.value }}
            </dd>
          </div>
        </dl>
      </section>

      <p class="text-xs leading-6 text-zinc-400">
        评分与建议仓位来自投研 Agent 收盘日报摘录，空字段不会补写。本页仅用于回顾市场节奏，不构成投资建议。
      </p>
    </template>
  </AppContainer>
</template>
