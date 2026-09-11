<script setup lang="ts">
import {
  COMPOUND_FREQUENCY_OPTIONS,
  calculateCompoundInterest,
  type CompoundFrequency,
  type ContributionTiming,
} from '~/utils/compound-interest'
import { formatMoney } from '~/utils/format'

const principal = ref(10_000)
const annualRatePercent = ref(8)
const years = ref(10)
const frequency = ref<CompoundFrequency>('yearly')
const contribution = ref(1_000)
const contributionTiming = ref<ContributionTiming>('end')

const result = computed(() =>
  calculateCompoundInterest({
    principal: Number(principal.value) || 0,
    annualRatePercent: Number(annualRatePercent.value) || 0,
    years: Number(years.value) || 0,
    frequency: frequency.value,
    contribution: Number(contribution.value) || 0,
    contributionTiming: contributionTiming.value,
  }),
)

const frequencyLabel = computed(
  () => COMPOUND_FREQUENCY_OPTIONS.find(item => item.id === frequency.value)?.label ?? '每年',
)

const contributionHint = computed(() => {
  if (!(Number(contribution.value) > 0)) {
    return '可选：按复利频率追加定额投入'
  }
  return contributionTiming.value === 'begin'
    ? `每期期初追加 ${formatMoney(Number(contribution.value) || 0, 'CNY')}`
    : `每期期末追加 ${formatMoney(Number(contribution.value) || 0, 'CNY')}`
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

function onPrincipalBlur() {
  principal.value = clampNumber(Number(principal.value), 0)
}

function onRateBlur() {
  annualRatePercent.value = clampNumber(Number(annualRatePercent.value), -99, 1000)
}

function onYearsBlur() {
  years.value = clampNumber(Number(years.value), 0, 100)
}

function onContributionBlur() {
  contribution.value = clampNumber(Number(contribution.value), 0)
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="card space-y-5 p-5 sm:p-6">
        <div>
          <h2 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            计算参数
          </h2>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            调整本金、收益率与期限，结果会即时更新。定投金额与复利频率同步。
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">初始本金（元）</span>
            <input
              v-model.number="principal"
              type="number"
              min="0"
              step="1000"
              inputmode="decimal"
              :class="inputClass"
              @blur="onPrincipalBlur"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">年化收益率（%）</span>
            <input
              v-model.number="annualRatePercent"
              type="number"
              min="-99"
              max="1000"
              step="0.1"
              inputmode="decimal"
              :class="inputClass"
              @blur="onRateBlur"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">投资年限</span>
            <input
              v-model.number="years"
              type="number"
              min="0"
              max="100"
              step="1"
              inputmode="decimal"
              :class="inputClass"
              @blur="onYearsBlur"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">每期定投（元）</span>
            <input
              v-model.number="contribution"
              type="number"
              min="0"
              step="100"
              inputmode="decimal"
              :class="inputClass"
              @blur="onContributionBlur"
            >
            <span class="block text-[11px] text-zinc-400">{{ contributionHint }}</span>
          </label>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">复利频率</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in COMPOUND_FREQUENCY_OPTIONS"
              :key="item.id"
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(frequency === item.id)"
              @click="frequency = item.id"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">定投时点</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(contributionTiming === 'end')"
              @click="contributionTiming = 'end'"
            >
              期末投入
            </button>
            <button
              type="button"
              class="rounded-[6px] px-2.5 py-1 text-xs transition"
              :class="chipClass(contributionTiming === 'begin')"
              @click="contributionTiming = 'begin'"
            >
              期初投入
            </button>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="card space-y-4 p-5 sm:p-6">
          <div>
            <p class="text-xs text-zinc-400">预估终值</p>
            <p class="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
              {{ formatMoney(result.futureValue, 'CNY') }}
            </p>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {{ frequencyLabel }}复利 · 共 {{ result.periods }} 期
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
              <p class="text-xs text-zinc-400">累计投入</p>
              <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                {{ formatMoney(result.totalContribution, 'CNY') }}
              </p>
            </div>
            <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
              <p class="text-xs text-zinc-400">复利收益</p>
              <p
                class="mt-1 text-lg font-semibold tabular-nums tracking-tight"
                :class="result.totalInterest >= 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'"
              >
                {{ formatMoney(result.totalInterest, 'CNY') }}
              </p>
            </div>
          </div>
        </div>

        <div class="card px-5 py-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          <p>
            终值按「本金 + 各期定投」以给定年化收益率、所选频率复利滚动估算。
            未计入税费、费用与本金变动，结果仅供学习参考。
          </p>
        </div>
      </section>
    </div>

    <section
      v-if="result.schedule.length"
      class="card overflow-hidden"
    >
      <div class="border-b border-zinc-200/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:border-white/[0.08] dark:text-zinc-50">
        年度明细
        <span class="ml-2 text-xs font-normal text-zinc-400">{{ result.schedule.length }} 年</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-zinc-50 text-xs text-zinc-500 dark:bg-white/[0.03] dark:text-zinc-400">
            <tr>
              <th class="px-5 py-3 font-medium">年份</th>
              <th class="px-5 py-3 text-right font-medium">累计投入</th>
              <th class="px-5 py-3 text-right font-medium">期末资产</th>
              <th class="px-5 py-3 text-right font-medium">累计收益</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
            <tr
              v-for="row in result.schedule"
              :key="row.year"
            >
              <td class="px-5 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                第 {{ row.year }} 年
              </td>
              <td class="px-5 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-300">
                {{ formatMoney(row.contributionTotal, 'CNY') }}
              </td>
              <td class="px-5 py-3 text-right tabular-nums text-zinc-900 dark:text-zinc-50">
                {{ formatMoney(row.balance, 'CNY') }}
              </td>
              <td
                class="px-5 py-3 text-right tabular-nums"
                :class="row.interest >= 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-emerald-700 dark:text-emerald-400'"
              >
                {{ formatMoney(row.interest, 'CNY') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs leading-5 text-zinc-400">
      本工具为简化复利模型，不构成任何投资建议或收益承诺。实际投资收益可能因市场波动、费用与税务等因素显著不同。
    </p>
  </div>
</template>
