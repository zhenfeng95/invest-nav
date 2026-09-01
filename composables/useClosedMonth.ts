import type { ClosedTrade, MonthlyPnl } from '~/types/portfolio'
import { currentYearMonth } from '~/utils/format'

export function useClosedMonth(
  closed: MaybeRefOrGetter<ClosedTrade[]>,
  monthly: MaybeRefOrGetter<MonthlyPnl[]>,
  resetKey?: MaybeRefOrGetter<unknown>,
) {
  const selectedMonth = ref(currentYearMonth())

  const monthTrades = computed(() =>
    toValue(closed)
      .filter(item => item.sellDate.startsWith(selectedMonth.value))
      .slice()
      .sort((left, right) => right.sellDate.localeCompare(left.sellDate) || left.ticker.localeCompare(right.ticker)),
  )

  const monthSummary = computed(() =>
    (toValue(monthly) || []).find(row => row.month === selectedMonth.value) || null,
  )

  function selectMonth(month: string) {
    selectedMonth.value = month
  }

  if (resetKey !== undefined) {
    watch(() => toValue(resetKey), () => {
      selectedMonth.value = currentYearMonth()
    })
  }

  return { selectedMonth, monthTrades, monthSummary, selectMonth }
}
