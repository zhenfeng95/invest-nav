<script setup lang="ts">
import { calculateTradePnl } from '~/utils/trade-pnl'
import { formatMoney } from '~/utils/format'

type DisplayCurrency = 'USD' | 'HKD' | 'CNY'

const buyPrice = ref(100)
const sellPrice = ref(120)
const shares = ref(100)
const buyFee = ref(0)
const sellFee = ref(0)
const displayCurrency = ref<DisplayCurrency>('USD')

const result = computed(() =>
  calculateTradePnl({
    buyPrice: Number(buyPrice.value) || 0,
    sellPrice: Number(sellPrice.value) || 0,
    shares: Number(shares.value) || 0,
    buyFee: Number(buyFee.value) || 0,
    sellFee: Number(sellFee.value) || 0,
  }),
)

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
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="card space-y-5 p-5 sm:p-6">
        <div>
          <h2 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            成交参数
          </h2>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            按买入价、卖出价与股数估算盈亏额与收益率，可叠加买卖费用。
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
            <span class="text-xs text-zinc-500 dark:text-zinc-400">买入价</span>
            <input
              v-model.number="buyPrice"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              :class="inputClass"
              @blur="buyPrice = clampNumber(Number(buyPrice), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">卖出价</span>
            <input
              v-model.number="sellPrice"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              :class="inputClass"
              @blur="sellPrice = clampNumber(Number(sellPrice), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">股数</span>
            <input
              v-model.number="shares"
              type="number"
              min="0"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="shares = clampNumber(Number(shares), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">买入费用</span>
            <input
              v-model.number="buyFee"
              type="number"
              min="0"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="buyFee = clampNumber(Number(buyFee), 0)"
            >
          </label>

          <label class="block space-y-1.5 sm:col-span-2">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">卖出费用</span>
            <input
              v-model.number="sellFee"
              type="number"
              min="0"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="sellFee = clampNumber(Number(sellFee), 0)"
            >
            <span class="block text-[11px] text-zinc-400">佣金、平台费、印花税等可折算后填入</span>
          </label>
        </div>
      </section>

      <section class="space-y-4">
        <div class="card space-y-4 p-5 sm:p-6">
          <template v-if="result.valid">
            <div>
              <p class="text-xs text-zinc-400">盈亏金额</p>
              <p
                class="mt-2 text-3xl font-semibold tracking-tight tabular-nums"
                :class="result.pnl >= 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'"
              >
                {{ formatAmount(result.pnl) }}
              </p>
              <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                收益率 {{ result.returnPercent >= 0 ? '+' : '' }}{{ result.returnPercent.toFixed(2) }}%
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">买入成本</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatAmount(result.cost) }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">卖出到账</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatAmount(result.proceeds) }}
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
            收益率按「盈亏 ÷ 买入成本」计算。未计入融资利息、汇兑与税务；结果仅供复盘学习。
          </p>
        </div>
      </section>
    </div>

    <p class="text-xs leading-5 text-zinc-400">
      本工具为简化盈亏模型，不构成任何投资建议或收益承诺。实际成交以券商账单为准。
    </p>
  </div>
</template>
