<script setup lang="ts">
import type { HomeMarketBriefsResponse, ReportBrief, ReportMarket } from '~/types/report'
import { reportMarketLabel } from '~/types/report'
import { formatDate, formatWeekday, pnlTextClass } from '~/utils/format'

interface MarketSlot {
  market: ReportMarket
  label: string
  listTo: string
  readLabel: string
  dotClass: string
}

/** 首页暂时只展示美股日报；A 股仍可从历史日报进入 */
const slots: MarketSlot[] = [
  {
    market: 'US',
    label: '美股日报',
    listTo: '/reports?market=US',
    readLabel: '阅读美股日报',
    dotClass: 'bg-sky-500',
  },
]

/** 客户端再拉日报，避免 SSR 等待 GitHub 拖慢首屏 HTML */
const { data, pending, status } = useAsyncData(
  'home-market-daily',
  () => $fetch<HomeMarketBriefsResponse>('/api/reports/home'),
  {
    lazy: true,
    server: false,
  },
)

const isLoading = computed(() => !data.value && (pending.value || status.value === 'idle'))

const cards = computed(() =>
  slots.map((slot) => {
    const brief = data.value?.items.find(item => item.market === slot.market)?.brief ?? null
    return {
      ...slot,
      brief,
      to: brief ? `/reports/${brief.slug}` : slot.listTo,
      dateText: formatBriefDate(brief),
      headline: brief?.headline || `${reportMarketLabel(slot.market)}收盘日报即将更新`,
      summary: brief?.summary || '新文件写入后会自动出现在这里。',
      indices: brief?.indices ?? [],
      cta: brief ? slot.readLabel : `查看${slot.label}`,
    }
  }),
)

function formatBriefDate(brief: ReportBrief | null) {
  if (!brief?.date) {
    return '暂无更新'
  }
  const weekday = formatWeekday(brief.date)
  return weekday ? `${formatDate(brief.date)} · ${weekday}` : formatDate(brief.date)
}

function changeClass(changePct: number | null) {
  return pnlTextClass(changePct)
}
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="市场日报"
        description="美股收盘复盘，由投研 Agent 生成，仅供学习整理。"
      />
      <NuxtLink
        to="/reports?market=US"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        历史日报
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>

    <div class="mt-8 grid max-w-2xl gap-4">
      <div
        v-if="isLoading"
        class="card relative overflow-hidden p-5 sm:p-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span class="sr-only">正在加载市场日报</span>
        <div
          class="pointer-events-none absolute inset-0 -translate-x-full animate-[market-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/55 to-transparent dark:via-white/10"
          aria-hidden="true"
        />
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400/80" aria-hidden="true" />
            <span class="h-3 w-14 rounded bg-zinc-200/90 dark:bg-white/10" />
            <span class="h-3 w-24 rounded bg-zinc-100 dark:bg-white/5" />
          </div>
          <span class="h-3 w-20 rounded bg-zinc-100 dark:bg-white/5" />
        </div>
        <div class="mt-5 space-y-2.5">
          <div class="h-5 w-11/12 rounded-md bg-zinc-200/90 dark:bg-white/10" />
          <div class="h-5 w-2/3 rounded-md bg-zinc-200/70 dark:bg-white/[0.07]" />
        </div>
        <div class="mt-4 space-y-2">
          <div class="h-3.5 w-full rounded bg-zinc-100 dark:bg-white/5" />
          <div class="h-3.5 w-full rounded bg-zinc-100 dark:bg-white/5" />
          <div class="h-3.5 w-4/5 rounded bg-zinc-100 dark:bg-white/5" />
        </div>
        <div class="mt-6 flex items-center gap-2 text-xs text-zinc-400">
          <span
            class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-200 border-t-accent dark:border-white/15 dark:border-t-accent"
            aria-hidden="true"
          />
          正在拉取最新美股日报…
        </div>
      </div>

      <NuxtLink
        v-for="card in cards"
        v-else
        :key="card.market"
        :to="card.to"
        class="card card-hover group flex flex-col p-5 sm:p-6"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span class="inline-flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-200">
              <span class="h-1.5 w-1.5 rounded-full" :class="card.dotClass" aria-hidden="true" />
              {{ card.label }}
            </span>
            <span aria-hidden="true">·</span>
            <span>{{ card.dateText }}</span>
          </div>
          <span class="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
            {{ card.cta }}
            <AppIcon name="arrow-right" class="h-3.5 w-3.5" />
          </span>
        </div>

        <h3 class="mt-4 text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl">
          {{ card.headline }}
        </h3>
        <p class="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {{ card.summary }}
        </p>

        <div
          v-if="card.indices.length"
          class="mt-5 grid grid-cols-3 gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/10"
        >
          <div
            v-for="index in card.indices"
            :key="index.name"
            class="min-w-0"
          >
            <p class="truncate text-[11px] text-zinc-400">{{ index.name }}</p>
            <p class="mt-1 truncate text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {{ index.value }}
            </p>
            <p
              class="mt-0.5 text-xs font-medium tabular-nums"
              :class="changeClass(index.changePct)"
            >
              {{ index.changeText }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
