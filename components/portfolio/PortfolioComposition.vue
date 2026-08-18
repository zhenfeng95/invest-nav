<script setup lang="ts">
import type { CurrencyCode, OpenPosition } from '~/types/portfolio'
import { formatMoney } from '~/utils/format'

const props = defineProps<{
  positions: OpenPosition[]
  total: number | null
  currency: CurrencyCode
  caption?: string
}>()

const COLOR_BY_TICKER: Record<string, { fill: string, swatch: string }> = {
  VOO: { fill: 'fill-zinc-800 dark:fill-zinc-200', swatch: 'bg-zinc-800 dark:bg-zinc-200' },
  QQQ: { fill: 'fill-accent', swatch: 'bg-accent' },
  IBIT: { fill: 'fill-amber-700 dark:fill-amber-500', swatch: 'bg-amber-700 dark:bg-amber-500' },
  SGOV: { fill: 'fill-zinc-400 dark:fill-zinc-500', swatch: 'bg-zinc-400 dark:bg-zinc-500' },
}

const FALLBACK_COLORS = [
  { fill: 'fill-zinc-600 dark:fill-zinc-300', swatch: 'bg-zinc-600 dark:bg-zinc-300' },
  { fill: 'fill-zinc-500 dark:fill-zinc-400', swatch: 'bg-zinc-500 dark:bg-zinc-400' },
  { fill: 'fill-stone-400 dark:fill-stone-500', swatch: 'bg-stone-400 dark:bg-stone-500' },
]

const SIZE = 168
const CX = SIZE / 2
const CY = SIZE / 2
const OUTER = 72
const INNER = 46
const GAP = 1.6

interface Slice {
  key: string
  label: string
  value: number
  pct: number
  fill: string
  swatch: string
  path: string
}

const slices = computed<Slice[]>(() => {
  const rows = props.positions
    .filter((item): item is OpenPosition & { marketValue: number } => item.marketValue != null && item.marketValue > 0)
    .sort((left, right) => right.marketValue - left.marketValue)
  const total = props.total && props.total > 0
    ? props.total
    : rows.reduce((sum, item) => sum + item.marketValue, 0)
  if (!total) {
    return []
  }

  let cursor = 0
  return rows.map((item, index) => {
    const pct = (item.marketValue / total) * 100
    const sweep = (pct / 100) * 360
    const gap = rows.length > 1 ? Math.min(GAP, sweep / 4) : 0
    const start = cursor + gap / 2
    const end = cursor + sweep - gap / 2
    cursor += sweep
    const color = COLOR_BY_TICKER[item.ticker] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
    return {
      key: item.ticker,
      label: item.ticker,
      value: item.marketValue,
      pct,
      fill: color.fill,
      swatch: color.swatch,
      path: donutPath(start, Math.max(end, start + 0.2)),
    }
  })
})

function donutPath(startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle
  if (sweep >= 359.2) {
    return [
      `M ${CX} ${CY - OUTER}`,
      `A ${OUTER} ${OUTER} 0 1 1 ${CX} ${CY + OUTER}`,
      `A ${OUTER} ${OUTER} 0 1 1 ${CX} ${CY - OUTER}`,
      `M ${CX} ${CY - INNER}`,
      `A ${INNER} ${INNER} 0 1 0 ${CX} ${CY + INNER}`,
      `A ${INNER} ${INNER} 0 1 0 ${CX} ${CY - INNER}`,
    ].join(' ')
  }

  const outerStart = polar(OUTER, startAngle)
  const outerEnd = polar(OUTER, endAngle)
  const innerEnd = polar(INNER, endAngle)
  const innerStart = polar(INNER, startAngle)
  const large = sweep > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

function polar(radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: +(CX + radius * Math.cos(rad)).toFixed(3),
    y: +(CY + radius * Math.sin(rad)).toFixed(3),
  }
}

function pctLabel(value: number): string {
  return value >= 10 ? `${Math.round(value)}%` : `${value.toFixed(1)}%`
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div class="relative shrink-0">
        <svg
          :width="SIZE"
          :height="SIZE"
          :viewBox="`0 0 ${SIZE} ${SIZE}`"
          class="block"
          aria-hidden="true"
        >
          <path
            v-for="slice in slices"
            :key="slice.key"
            :d="slice.path"
            :class="slice.fill"
            fill-rule="evenodd"
          />
        </svg>
        <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p class="text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ total == null ? '—' : formatMoney(total, currency) }}
          </p>
          <p class="text-[11px] text-zinc-400">现持</p>
        </div>
      </div>
      <ul class="w-full min-w-0 space-y-2.5">
        <li
          v-for="slice in slices"
          :key="slice.key"
          class="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-sm"
        >
          <span class="h-2 w-2 rounded-full" :class="slice.swatch" />
          <p class="truncate text-zinc-600 dark:text-zinc-300">
            {{ slice.label }}
            <span class="tabular-nums text-zinc-400">{{ formatMoney(slice.value, currency) }}</span>
          </p>
          <p class="tabular-nums text-zinc-500 dark:text-zinc-400">{{ pctLabel(slice.pct) }}</p>
        </li>
      </ul>
    </div>
    <p v-if="caption" class="text-xs text-zinc-400">{{ caption }}</p>
  </div>
</template>
