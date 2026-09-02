<script setup lang="ts">
import type { MonthlyPnl } from '~/types/portfolio'
import { currentYearMonth, formatSignedMoney, formatYearMonth, pnlTextClass } from '~/utils/format'

const props = withDefaults(defineProps<{
  months: MonthlyPnl[]
  currency: 'CNY' | 'USD'
  selected?: string | null
  selectable?: boolean
  /** month (YYYY-MM) → review slug, e.g. monthly-2026-08 */
  reviewSlugs?: Record<string, string>
}>(), {
  selected: null,
  selectable: false,
  reviewSlugs: () => ({}),
})

const emit = defineEmits<{
  select: [month: string]
}>()

const thisMonth = currentYearMonth()

function reviewTo(month: string): string | null {
  const slug = props.reviewSlugs[month]
  return slug ? `/reviews/monthly/${slug}` : null
}

const rows = computed(() => {
  if (!thisMonth || props.months.some(row => row.month === thisMonth)) {
    return props.months
  }
  if (!props.months.length) {
    return props.months
  }
  return [{
    month: thisMonth,
    tradeCount: 0,
    winCount: 0,
    lossCount: 0,
    winRate: null,
    realized: 0,
    profitFactor: null,
  }, ...props.months]
})

function winLossLabel(row: MonthlyPnl) {
  if (!row.tradeCount) {
    return '—'
  }
  return `${row.winCount} / ${row.tradeCount}`
}

function onSelect(month: string) {
  if (props.selectable) {
    emit('select', month)
  }
}
</script>

<template>
  <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
    <table class="min-w-full text-left text-sm">
      <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
        <tr>
          <th class="px-4 py-3 font-medium">月份</th>
          <th class="px-4 py-3 font-medium text-right">笔数</th>
          <th class="px-4 py-3 font-medium text-right">胜 / 总</th>
          <th class="px-4 py-3 font-medium text-right">已实现</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.month"
          class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
          :class="{
            'cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.04]': selectable,
            'bg-zinc-50 dark:bg-white/[0.06]': selectable && selected === row.month,
          }"
          @click="onSelect(row.month)"
        >
          <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
            <NuxtLink
              v-if="reviewTo(row.month)"
              :to="reviewTo(row.month)!"
              class="hover:text-amber-700 dark:hover:text-amber-400"
              @click.stop
            >
              {{ formatYearMonth(row.month) }}
            </NuxtLink>
            <template v-else>
              {{ formatYearMonth(row.month) }}
            </template>
            <span
              v-if="row.month === thisMonth"
              class="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-normal text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
            >
              本月
            </span>
          </td>
          <td class="px-4 py-3 text-right tabular-nums text-zinc-500">{{ row.tradeCount }}</td>
          <td class="px-4 py-3 text-right tabular-nums text-zinc-500">{{ winLossLabel(row) }}</td>
          <td class="px-4 py-3 text-right tabular-nums" :class="pnlTextClass(row.realized)">
            {{ formatSignedMoney(row.realized, currency) }}
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="4" class="px-4 py-6 text-center text-zinc-400">暂无已平仓月份</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
