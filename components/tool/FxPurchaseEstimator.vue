<script setup lang="ts">
import {
  DEFAULT_FX_RATES,
  FX_CURRENCY_OPTIONS,
  estimateFxPurchase,
  type FxCurrency,
  type FxEstimateMode,
} from '~/utils/fx-estimate'
import { formatMoney } from '~/utils/format'

const currency = ref<FxCurrency>('USD')
const mode = ref<FxEstimateMode>('spend')
const amount = ref(50_000)
const rateCnyPerUnit = ref(DEFAULT_FX_RATES.USD)
const markupPercent = ref(0.3)
const fixedFeeCny = ref(0)

watch(currency, (next) => {
  rateCnyPerUnit.value = DEFAULT_FX_RATES[next]
})

const result = computed(() =>
  estimateFxPurchase({
    currency: currency.value,
    mode: mode.value,
    amount: Number(amount.value) || 0,
    rateCnyPerUnit: Number(rateCnyPerUnit.value) || 0,
    markupPercent: Number(markupPercent.value) || 0,
    fixedFeeCny: Number(fixedFeeCny.value) || 0,
  }),
)

const currencyMeta = computed(
  () => FX_CURRENCY_OPTIONS.find(item => item.id === currency.value) ?? FX_CURRENCY_OPTIONS[0],
)

const amountLabel = computed(() =>
  mode.value === 'spend' ? '人民币金额（元）' : `目标到账（${currencyMeta.value.unit}）`,
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

function formatForeign(value: number) {
  const symbol = currency.value === 'USD' ? '$' : 'HK$'
  return `${symbol}${value.toFixed(2)}`
}

function onAmountBlur() {
  amount.value = clampNumber(Number(amount.value), 0)
}

function onRateBlur() {
  rateCnyPerUnit.value = clampNumber(Number(rateCnyPerUnit.value), 0.0001)
}

function onMarkupBlur() {
  markupPercent.value = clampNumber(Number(markupPercent.value), 0, 20)
}

function onFeeBlur() {
  fixedFeeCny.value = clampNumber(Number(fixedFeeCny.value), 0)
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="card space-y-5 p-5 sm:p-6">
        <div>
          <h2 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            购汇参数
          </h2>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            按银行卖出价示意估算到账外币或所需人民币。默认汇率仅作起点，请按当日牌价自行修改。
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">目标外币</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in FX_CURRENCY_OPTIONS"
              :key="item.id"
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(currency === item.id)"
              @click="currency = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">计算方式</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(mode === 'spend')"
              @click="mode = 'spend'"
            >
              已知人民币
            </button>
            <button
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(mode === 'receive')"
              @click="mode = 'receive'"
            >
              已知目标外币
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">{{ amountLabel }}</span>
            <input
              v-model.number="amount"
              type="number"
              min="0"
              step="100"
              inputmode="decimal"
              :class="inputClass"
              @blur="onAmountBlur"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">
              示意牌价（1 {{ currency }} = ? 人民币）
            </span>
            <input
              v-model.number="rateCnyPerUnit"
              type="number"
              min="0"
              step="0.0001"
              inputmode="decimal"
              :class="inputClass"
              @blur="onRateBlur"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">额外加点（%）</span>
            <input
              v-model.number="markupPercent"
              type="number"
              min="0"
              max="20"
              step="0.1"
              inputmode="decimal"
              :class="inputClass"
              @blur="onMarkupBlur"
            >
            <span class="block text-[11px] text-zinc-400">已含在牌价里时可填 0</span>
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">固定费用（人民币）</span>
            <input
              v-model.number="fixedFeeCny"
              type="number"
              min="0"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="onFeeBlur"
            >
            <span class="block text-[11px] text-zinc-400">汇款手续费、电报费等</span>
          </label>
        </div>
      </section>

      <section class="space-y-4">
        <div class="card space-y-4 p-5 sm:p-6">
          <template v-if="result.valid">
            <div>
              <p class="text-xs text-zinc-400">
                {{ mode === 'spend' ? '预估到账外币' : '预估需支付人民币' }}
              </p>
              <p class="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                {{ mode === 'spend' ? formatForeign(result.receiveForeign) : formatMoney(result.spendCny, 'CNY') }}
              </p>
              <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                有效汇率 1 {{ currency }} ≈ ¥{{ result.effectiveRate.toFixed(4) }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">人民币支出</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatMoney(result.spendCny, 'CNY') }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">到账 {{ currencyMeta.unit }}</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatForeign(result.receiveForeign) }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">换汇占用</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatMoney(result.rateCostCny, 'CNY') }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">固定费用</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatMoney(result.feeCny, 'CNY') }}
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
            本页不接入实时牌价，结果仅供出入金规划参考。实际到账以银行/牌照机构成交价、额度与费用为准。
          </p>
        </div>
      </section>
    </div>

    <p class="text-xs leading-5 text-zinc-400">
      购汇与跨境汇款受个人年度便利化额度、用途证明与机构风控约束，本工具不构成任何交易或合规建议。
    </p>
  </div>
</template>
