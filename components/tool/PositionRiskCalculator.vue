<script setup lang="ts">
import { calculatePositionRisk } from '~/utils/position-risk'
import { formatMoney } from '~/utils/format'

type DisplayCurrency = 'USD' | 'HKD' | 'CNY'

const equity = ref(10_000)
const riskPercent = ref(2)
const entryPrice = ref(10)
const stopPrice = ref(9.5)
const maxPositionPercent = ref(20)
const displayCurrency = ref<DisplayCurrency>('USD')

const result = computed(() =>
  calculatePositionRisk({
    equity: Number(equity.value) || 0,
    riskPercent: Number(riskPercent.value) || 0,
    entryPrice: Number(entryPrice.value) || 0,
    stopPrice: Number(stopPrice.value) || 0,
    maxPositionPercent: Number(maxPositionPercent.value) || 0,
  }),
)

const stopDistancePercent = computed(() => {
  const entry = Number(entryPrice.value) || 0
  const stop = Number(stopPrice.value) || 0
  if (entry <= 0 || stop <= 0 || entry === stop) {
    return null
  }
  return (Math.abs(entry - stop) / entry) * 100
})

const directionHint = computed(() => {
  const entry = Number(entryPrice.value) || 0
  const stop = Number(stopPrice.value) || 0
  if (entry <= 0 || stop <= 0 || entry === stop) {
    return '止损价相对入场价决定多空方向距离'
  }
  return stop < entry ? '止损低于入场：按做多风控估算' : '止损高于入场：按做空风控估算'
})

const chipClass = (active: boolean) =>
  active
    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'

const inputClass =
  'focus-ring w-full rounded-[6px] border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 outline-none transition placeholder:text-zinc-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-50'

function clampNumber(value: number, min?: number, max?: number) {
  if (!Number.isFinite(value)) {
    return min ?? 0
  }
  let next = value
  if (min != null) {
    next = Math.max(min, next)
  }
  if (max != null) {
    next = Math.min(max, next)
  }
  return next
}

function formatAmount(value: number) {
  if (displayCurrency.value === 'CNY') {
    return formatMoney(value, 'CNY')
  }
  if (displayCurrency.value === 'HKD') {
    return `HK$${value.toFixed(2)}`
  }
  return formatMoney(value, 'USD')
}

function formatUnits(value: number) {
  if (Number.isInteger(value)) {
    return String(value)
  }
  return value.toFixed(4).replace(/\.?0+$/, '')
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="card space-y-5 p-5 sm:p-6">
        <div>
          <h2 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            风控参数
          </h2>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            用「账户权益 × 单笔风险% ÷ 止损距离」估算建议仓位。可设最大仓位占比做二次约束。
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">金额币种（仅展示）</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in [
                { id: 'USD', label: '美元' },
                { id: 'HKD', label: '港币' },
                { id: 'CNY', label: '人民币' },
              ] as const"
              :key="item.id"
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(displayCurrency === item.id)"
              @click="displayCurrency = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">账户权益</span>
            <input
              v-model.number="equity"
              type="number"
              min="0"
              step="1000"
              inputmode="decimal"
              :class="inputClass"
              @blur="equity = clampNumber(Number(equity), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">单笔风险（%）</span>
            <input
              v-model.number="riskPercent"
              type="number"
              min="0"
              max="100"
              step="0.1"
              inputmode="decimal"
              :class="inputClass"
              @blur="riskPercent = clampNumber(Number(riskPercent), 0, 100)"
            >
            <span class="block text-[11px] text-zinc-400">常见区间 0.5%–2%</span>
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">入场价</span>
            <input
              v-model.number="entryPrice"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              :class="inputClass"
              @blur="entryPrice = clampNumber(Number(entryPrice), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">止损价</span>
            <input
              v-model.number="stopPrice"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              :class="inputClass"
              @blur="stopPrice = clampNumber(Number(stopPrice), 0)"
            >
            <span class="block text-[11px] text-zinc-400">{{ directionHint }}</span>
          </label>

          <label class="block space-y-1.5 sm:col-span-2">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">最大仓位占权益（%，0 表示不限制）</span>
            <input
              v-model.number="maxPositionPercent"
              type="number"
              min="0"
              max="100"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="maxPositionPercent = clampNumber(Number(maxPositionPercent), 0, 100)"
            >
          </label>
        </div>
      </section>

      <section class="space-y-4">
        <div class="card space-y-4 p-5 sm:p-6">
          <template v-if="result.valid">
            <div>
              <p class="text-xs text-zinc-400">建议仓位（整股）</p>
              <p class="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                {{ result.unitsFloor }} 股
              </p>
              <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                理论值 {{ formatUnits(result.unitsExact) }} 股
                <span v-if="stopDistancePercent != null">
                  · 止损距离 {{ stopDistancePercent.toFixed(2) }}%
                </span>
              </p>
              <p
                v-if="result.cappedByMaxPosition"
                class="mt-2 text-xs text-amber-700 dark:text-amber-400"
              >
                已受「最大仓位占比」约束下调
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">单笔可亏金额</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatAmount(result.riskAmount) }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">每单位止损距离</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatAmount(result.riskPerUnit) }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">仓位市值（整股）</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatAmount(result.positionValue) }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">占权益</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ result.positionPercentOfEquity.toFixed(2) }}%
                </p>
              </div>
            </div>
          </template>
          <p
            v-else
            class="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {{ result.message || '请完善参数后查看估算结果' }}
          </p>
        </div>

        <div class="card px-5 py-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          <p>
            未计入滑点、佣金、融资利息与整手规则（如港股一手股数）。仓位结果仅供学习风控方法，不构成交易信号。
          </p>
        </div>
      </section>
    </div>

    <p class="text-xs leading-5 text-zinc-400">
      本工具为简化风控模型，实际下单请结合流动性、波动与个人风险承受能力独立判断。
    </p>
  </div>
</template>
