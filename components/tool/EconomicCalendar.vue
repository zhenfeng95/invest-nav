<script setup lang="ts">
import type { CalendarEvent, CalendarImpact, CalendarResponse } from '~/types/calendar'

const impactFilter = ref<'all' | CalendarImpact>('high')
const countryFilter = ref<'all' | string>('all')

const { data, error, pending, refresh, status } = await useAsyncData(
  'economic-calendar',
  () => $fetch<CalendarResponse>('/api/calendar'),
  {
    lazy: import.meta.client,
  },
)

const isLoading = computed(() => !data.value && !error.value && (pending.value || status.value === 'idle'))

const countryOptions = computed(() => {
  const counts = new Map<string, { id: string, label: string }>()
  for (const item of data.value?.events ?? []) {
    if (!counts.has(item.country)) {
      counts.set(item.country, { id: item.country, label: item.countryLabel || item.country })
    }
  }
  return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
})

const filteredEvents = computed(() => {
  const events = data.value?.events ?? []
  return events.filter((item) => {
    if (impactFilter.value !== 'all' && item.impact !== impactFilter.value) {
      return false
    }
    if (countryFilter.value !== 'all' && item.country !== countryFilter.value) {
      return false
    }
    return true
  })
})

const groupedEvents = computed(() => {
  const groups = new Map<string, CalendarEvent[]>()
  for (const item of filteredEvents.value) {
    const list = groups.get(item.date) || []
    list.push(item)
    groups.set(item.date, list)
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, events]) => ({ date, events }))
})

function impactLabel(impact: CalendarImpact) {
  switch (impact) {
    case 'high':
      return '高'
    case 'medium':
      return '中'
    case 'low':
      return '低'
    default:
      return '未知'
  }
}

function impactClass(impact: CalendarImpact) {
  switch (impact) {
    case 'high':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    case 'medium':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'low':
      return 'border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400'
    default:
      return 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400'
  }
}

function affectClass(affect: string) {
  if (affect === '利多') {
    return 'text-emerald-600 dark:text-emerald-400'
  }
  if (affect === '利空') {
    return 'text-rose-600 dark:text-rose-400'
  }
  return 'text-zinc-400'
}

function formatDateHeading(date: string) {
  const value = new Date(`${date}T00:00:00`)
  if (Number.isNaN(value.getTime())) {
    return date
  }
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${date} 周${weekdays[value.getDay()]}`
}

function formatUpdatedAt(value: string) {
  return value.replace('T', ' ').replace(/\+\d{2}:\d{2}$/, '').slice(0, 19)
}

const filterButtonClass = (active: boolean) =>
  active
    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
</script>

<template>
  <div class="space-y-5">
    <div class="card space-y-4 p-5 sm:p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            数据来自投研 Agent 整理的金十财经日历，覆盖本自然周；时间为北京时间。默认只看高重要性事件。
          </p>
          <p
            v-if="data?.from && data?.to"
            class="mt-1 text-xs text-zinc-400"
          >
            区间 {{ data.from }} → {{ data.to }}
            <span v-if="data.updatedAt"> · 更新于 {{ formatUpdatedAt(data.updatedAt) }}</span>
          </p>
        </div>
        <button
          type="button"
          class="focus-ring rounded-[6px] border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white"
          :disabled="pending"
          @click="refresh()"
        >
          {{ pending ? '刷新中…' : '刷新' }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in [
            { id: 'all', label: '全部影响' },
            { id: 'high', label: '高' },
            { id: 'medium', label: '中' },
            { id: 'low', label: '低' },
          ] as const"
          :key="item.id"
          type="button"
          class="rounded-[6px] px-2.5 py-1 text-xs transition"
          :class="filterButtonClass(impactFilter === item.id)"
          @click="impactFilter = item.id"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-[6px] px-2.5 py-1 text-xs transition"
          :class="filterButtonClass(countryFilter === 'all')"
          @click="countryFilter = 'all'"
        >
          全部国家
        </button>
        <button
          v-for="item in countryOptions"
          :key="item.id"
          type="button"
          class="rounded-[6px] px-2.5 py-1 text-xs transition"
          :class="filterButtonClass(countryFilter === item.id)"
          @click="countryFilter = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <EmptyState
      v-if="isLoading"
      eyebrow="Loading"
      title="正在加载财经日历"
      description="正在读取投研 Agent 生成的宏观发布日程。"
    />

    <EmptyState
      v-else-if="error"
      eyebrow="Error"
      title="财经日历暂时无法加载"
      description="请稍后重试，或确认投研 Agent 仓库里已生成日历文件。"
    />

    <EmptyState
      v-else-if="data && !data.configured"
      eyebrow="Config"
      title="尚未接入财经日历"
      :description="data.message || '请配置 GitHub 投研仓库，或在本地保留 invest-agent 目录。'"
    />

    <EmptyState
      v-else-if="data?.message && !filteredEvents.length"
      eyebrow="Calendar"
      title="暂时没有可展示的日历事件"
      :description="data.message"
    />

    <EmptyState
      v-else-if="!filteredEvents.length"
      eyebrow="Empty"
      title="当前筛选下没有事件"
      description="试试切换影响级别或国家，或稍后再刷新。"
    />

    <div
      v-else
      class="space-y-4"
    >
      <section
        v-for="group in groupedEvents"
        :key="group.date"
        class="card overflow-hidden"
      >
        <div class="border-b border-zinc-200/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:border-white/[0.08] dark:text-zinc-50">
          {{ formatDateHeading(group.date) }}
          <span class="ml-2 text-xs font-normal text-zinc-400">{{ group.events.length }} 条</span>
        </div>
        <ul class="divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
          <li
            v-for="item in group.events"
            :key="item.id"
            class="grid gap-3 px-5 py-4 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-start"
          >
            <p class="text-sm tabular-nums text-zinc-600 dark:text-zinc-300">
              {{ item.time }}
              <span class="mt-0.5 block text-[11px] text-zinc-400">北京时间</span>
            </p>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {{ item.event }}
              </p>
              <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {{ item.countryLabel }}
                <span
                  v-if="item.affect"
                  class="ml-1"
                  :class="affectClass(item.affect)"
                >· {{ item.affect }}</span>
              </p>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <span>预期 {{ item.estimate ?? '—' }}</span>
                <span>公布 {{ item.actual ?? '—' }}</span>
                <span>前值 {{ item.prev ?? '—' }}</span>
                <span v-if="item.revised">修正 {{ item.revised }}</span>
              </div>
            </div>
            <span
              class="inline-flex h-fit w-fit shrink-0 rounded-full border px-2 py-0.5 text-[11px]"
              :class="impactClass(item.impact)"
            >
              {{ impactLabel(item.impact) }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <p class="text-xs leading-5 text-zinc-400">
      本页仅整理宏观发布日程，不构成投资建议。数据由投研 Agent 从金十同步到仓库后在此展示。
    </p>
  </div>
</template>
