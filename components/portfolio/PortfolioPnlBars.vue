<script setup lang="ts">
import type { ClosedTrade } from '~/types/portfolio'
import { formatSignedMoney, pnlTextClass } from '~/utils/format'

const props = defineProps<{
  trades: ClosedTrade[]
}>()

const maxAbs = computed(() => {
  return Math.max(...props.trades.map(item => Math.abs(item.pnl)), 1)
})

function barStyle(pnl: number) {
  const width = `${(Math.abs(pnl) / maxAbs.value) * 50}%`
  const color = pnl >= 0 ? '#e11d48' : '#059669'
  return pnl >= 0
    ? { left: '50%', width, backgroundColor: color }
    : { right: '50%', width, backgroundColor: color }
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="trade in trades"
      :key="`${trade.ticker}-${trade.sellDate}`"
      class="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3"
    >
      <p class="truncate text-sm text-zinc-600 dark:text-zinc-300">{{ trade.name }}</p>
      <div class="relative h-2 rounded-full bg-zinc-100 dark:bg-white/10">
        <div
          class="absolute top-0 h-full rounded-full"
          :style="barStyle(trade.pnl)"
        />
        <div class="absolute inset-y-0 left-1/2 w-px bg-zinc-300 dark:bg-white/20" />
      </div>
      <p
        class="text-right text-xs tabular-nums"
        :class="pnlTextClass(trade.pnl)"
      >
        {{ formatSignedMoney(trade.pnl, trade.currency) }}
      </p>
    </div>
  </div>
</template>
