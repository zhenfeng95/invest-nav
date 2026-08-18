<script setup lang="ts">
import type { CurrencyCode, EquityPoint, MarketCode } from '~/types/portfolio'
import { formatDate, formatSignedMoney, formatWeekday } from '~/utils/format'

const props = defineProps<{
  points: EquityPoint[]
  currency: CurrencyCode
  market: MarketCode
  compact?: boolean
}>()

const WIDTH = 720
const HEIGHT = 248
const PAD = { top: 18, right: 16, bottom: 32, left: 60 }

const SPARK_WIDTH = 160
const SPARK_HEIGHT = 40

const svgRef = ref<SVGSVGElement | null>(null)
const hoverIndex = ref<number | null>(null)

const last = computed(() => props.points[props.points.length - 1] || null)
const positive = computed(() => (last.value?.total || 0) >= -1e-9)

const bounds = computed(() => {
  const values = props.points.map(item => item.total)
  const min = Math.min(0, ...values)
  const max = Math.max(0, ...values)
  const span = Math.max(max - min, props.currency === 'USD' ? 0.04 : 4)
  const pad = span * 0.12
  let yMin = min < -1e-9 ? min - pad : min
  let yMax = max > 1e-9 ? max + pad : max
  if (Math.abs(yMax - yMin) < 1e-9) {
    yMin -= span / 2
    yMax += span / 2
  }
  return { yMin, yMax }
})

const inner = computed(() => ({
  w: (props.compact ? SPARK_WIDTH : WIDTH) - (props.compact ? 0 : PAD.left + PAD.right),
  h: (props.compact ? SPARK_HEIGHT : HEIGHT) - (props.compact ? 0 : PAD.top + PAD.bottom),
  left: props.compact ? 0 : PAD.left,
  top: props.compact ? 0 : PAD.top,
}))

function xAt(index: number) {
  const count = props.points.length
  if (count <= 1) {
    return inner.value.left + inner.value.w / 2
  }
  return inner.value.left + (index / (count - 1)) * inner.value.w
}

function yAt(value: number) {
  const { yMin, yMax } = bounds.value
  const ratio = (value - yMin) / (yMax - yMin)
  return inner.value.top + (1 - ratio) * inner.value.h
}

const linePath = computed(() => {
  if (!props.points.length) {
    return ''
  }
  return props.points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index).toFixed(2)} ${yAt(point.total).toFixed(2)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (!props.points.length) {
    return ''
  }
  const zeroY = yAt(0).toFixed(2)
  const firstX = xAt(0).toFixed(2)
  const lastX = xAt(props.points.length - 1).toFixed(2)
  return `${linePath.value} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`
})

const yTicks = computed(() => {
  const { yMin, yMax } = bounds.value
  const candidates = [yMax, 0, yMin]
  const seen = new Set<string>()
  return candidates.filter((value) => {
    if (value < yMin - 1e-9 || value > yMax + 1e-9) {
      return false
    }
    const key = value.toFixed(4)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
})

const xTicks = computed(() => {
  const count = props.points.length
  if (count <= 3) {
    return props.points.map((point, index) => ({ index, date: point.date }))
  }
  const middle = Math.round((count - 1) / 2)
  const indexes = [...new Set([0, middle, count - 1])]
  return indexes.map(index => ({ index, date: props.points[index].date }))
})

const hover = computed(() => {
  if (hoverIndex.value == null) {
    return last.value
  }
  return props.points[hoverIndex.value] || last.value
})

const fillId = computed(() => `equity-fill-${props.market}`)

function shortDate(value: string) {
  const match = value.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!match) {
    return value
  }
  return `${Number(match[1])}/${Number(match[2])}`
}

function axisLabel(value: number) {
  const abs = Math.abs(value)
  const sign = value < -1e-9 ? '−' : ''
  if (props.currency === 'USD' || abs < 10) {
    return `${sign}${abs.toFixed(abs >= 1 ? 2 : 2)}`
  }
  return `${sign}${Math.round(abs)}`
}

function onPointerMove(event: PointerEvent) {
  if (props.compact || !svgRef.value || props.points.length < 2) {
    return
  }
  const rect = svgRef.value.getBoundingClientRect()
  const svgX = ((event.clientX - rect.left) / rect.width) * WIDTH
  let nearest = 0
  let best = Infinity
  for (let index = 0; index < props.points.length; index += 1) {
    const delta = Math.abs(xAt(index) - svgX)
    if (delta < best) {
      best = delta
      nearest = index
    }
  }
  hoverIndex.value = nearest
}

function onPointerLeave() {
  hoverIndex.value = null
}
</script>

<template>
  <div
    v-if="compact"
    class="pointer-events-none h-10 w-full"
    :class="positive ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
  >
    <svg
      class="h-full w-full"
      :viewBox="`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path :d="areaPath" fill="currentColor" class="opacity-15" />
      <path :d="linePath" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
  </div>

  <div
    v-else
    class="card overflow-hidden p-5"
  >
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs text-zinc-400">累计盈亏（按日盯市）</p>
        <p
          class="mt-1 text-2xl font-semibold tracking-tight tabular-nums"
          :class="positive ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'"
        >
          {{ hover ? formatSignedMoney(hover.total, currency) : '—' }}
        </p>
        <p v-if="hover" class="mt-1 text-xs text-zinc-400">
          已实现 {{ formatSignedMoney(hover.realized, currency) }}
          · 浮动 {{ formatSignedMoney(hover.unrealized, currency) }}
        </p>
      </div>
      <p v-if="hover" class="text-xs text-zinc-400">
        {{ formatDate(hover.date) }} {{ formatWeekday(hover.date) }}
      </p>
    </div>

    <div
      class="relative mt-4"
      :class="positive ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
    >
      <svg
        ref="svgRef"
        class="h-[220px] w-full touch-pan-y"
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        role="img"
        :aria-label="`${market === 'A' ? 'A股' : '美股'}按日累计盈亏曲线`"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
        @pointerdown="onPointerMove"
      >
        <defs>
          <linearGradient :id="fillId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>

        <line
          v-for="tick in yTicks"
          :key="`grid-${tick}`"
          :x1="PAD.left"
          :x2="WIDTH - PAD.right"
          :y1="yAt(tick)"
          :y2="yAt(tick)"
          class="stroke-zinc-200 dark:stroke-white/10"
          stroke-width="1"
          :stroke-dasharray="Math.abs(tick) < 1e-9 ? '4 4' : undefined"
        />

        <path :d="areaPath" :fill="`url(#${fillId})`" />
        <path
          :d="linePath"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <circle
          v-if="hover && points.length"
          :cx="xAt(hoverIndex ?? points.length - 1)"
          :cy="yAt(hover.total)"
          r="4"
          fill="currentColor"
        />
        <line
          v-if="hoverIndex != null"
          :x1="xAt(hoverIndex)"
          :x2="xAt(hoverIndex)"
          :y1="PAD.top"
          :y2="HEIGHT - PAD.bottom"
          class="stroke-zinc-300 dark:stroke-white/20"
          stroke-width="1"
          stroke-dasharray="3 3"
        />

        <text
          v-for="tick in yTicks"
          :key="`ylabel-${tick}`"
          :x="PAD.left - 8"
          :y="yAt(tick) + 4"
          text-anchor="end"
          class="fill-zinc-400"
          font-size="11"
          font-variant="tabular-nums"
        >
          {{ axisLabel(tick) }}
        </text>
        <text
          v-for="tick in xTicks"
          :key="`xlabel-${tick.date}`"
          :x="xAt(tick.index)"
          :y="HEIGHT - 10"
          text-anchor="middle"
          class="fill-zinc-400"
          font-size="11"
          font-variant="tabular-nums"
        >
          {{ shortDate(tick.date) }}
        </text>
      </svg>
    </div>

    <p class="mt-2 text-xs text-zinc-400">
      每个交易日用收盘价盯市：累计盈亏 = 已实现 + 浮动。未计佣金与印花税。
      {{ market === 'US' ? '美股按美东交易日。' : 'A 股按内地交易日。' }}
    </p>
  </div>
</template>
