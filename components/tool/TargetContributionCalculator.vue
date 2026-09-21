<script setup lang="ts">
import {
  COMPOUND_FREQUENCY_OPTIONS,
  type CompoundFrequency,
  type ContributionTiming,
} from '~/utils/compound-interest'
import { calculateTargetContribution } from '~/utils/target-contribution'
import { formatMoney } from '~/utils/format'

const principal = ref(10_000)
const targetAmount = ref(500_000)
const annualRatePercent = ref(8)
const years = ref(15)
const frequency = ref<CompoundFrequency>('monthly')
const contributionTiming = ref<ContributionTiming>('end')

const result = computed(() =>
  calculateTargetContribution({
    principal: Number(principal.value) || 0,
    targetAmount: Number(targetAmount.value) || 0,
    annualRatePercent: Number(annualRatePercent.value) || 0,
    years: Number(years.value) || 0,
    frequency: frequency.value,
    contributionTiming: contributionTiming.value,
  }),
)

const frequencyLabel = computed(
  () => COMPOUND_FREQUENCY_OPTIONS.find(item => item.id === frequency.value)?.label ?? '每月',
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
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section class="card space-y-5 p-5 sm:p-6">
        <div>
          <h2 class="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            目标参数
          </h2>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            已知目标金额，反推在给定收益率与期限下每期需要投入多少。假设与
            <NuxtLink
              to="/tools/compound-interest"
              class="text-zinc-800 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-200 dark:decoration-white/30"
            >
              复利计算器
            </NuxtLink>
            一致。
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
              @blur="principal = clampNumber(Number(principal), 0)"
            >
          </label>

          <label class="block space-y-1.5">
            <span class="text-xs text-zinc-500 dark:text-zinc-400">目标金额（元）</span>
            <input
              v-model.number="targetAmount"
              type="number"
              min="0"
              step="1000"
              inputmode="decimal"
              :class="inputClass"
              @blur="targetAmount = clampNumber(Number(targetAmount), 0)"
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
              @blur="annualRatePercent = clampNumber(Number(annualRatePercent), -99, 1000)"
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
              @blur="years = clampNumber(Number(years), 0, 100)"
            >
          </label>
        </div>

        <div class="space-y-2">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">复利 / 定投频率</p>
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
          <template v-if="result.valid">
            <div>
              <p class="text-xs text-zinc-400">
                {{ result.alreadyReached ? '无需额外定投' : `每期建议投入（${frequencyLabel}）` }}
              </p>
              <p class="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                {{ formatMoney(result.contribution, 'CNY') }}
              </p>
              <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                <template v-if="result.alreadyReached">
                  仅凭本金复利即可达到或超过目标
                </template>
                <template v-else>
                  共 {{ result.periods }} 期 · 目标 {{ formatMoney(Number(targetAmount) || 0, 'CNY') }}
                </template>
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">本金复利终值</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatMoney(result.principalFutureValue, 'CNY') }}
                </p>
              </div>
              <div class="rounded-xl border border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                <p class="text-xs text-zinc-400">累计投入（含本金）</p>
                <p class="mt-1 text-lg font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
                  {{ formatMoney(result.totalContribution, 'CNY') }}
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
            倒推结果可放回复利计算器交叉核对。未计入费用、税费与收益波动，仅供学习规划。
          </p>
        </div>
      </section>
    </div>

    <p class="text-xs leading-5 text-zinc-400">
      本工具为简化倒推模型，不构成任何投资建议或收益承诺。实际可达性取决于市场、储蓄能力与风险承受。
    </p>
  </div>
</template>
