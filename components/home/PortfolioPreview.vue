<script setup lang="ts">
import type { EquityPoint, PortfolioAnalysis } from '~/types/portfolio'
import { formatSignedMoney, pnlTextClass } from '~/utils/format'

const { data } = await useAsyncData(
  'home-portfolio',
  () => $fetch<PortfolioAnalysis>('/api/portfolio').catch(() => null),
)

const ready = computed(() => Boolean(data.value?.configured && (data.value.a || data.value.us)))

function lastTotal(points: EquityPoint[] | undefined, fallback: number) {
  return points?.length ? points[points.length - 1].total : fallback
}
</script>

<template>
  <section v-if="ready && data">
    <div class="flex items-end justify-between gap-4">
      <SectionTitle
        title="持仓分账"
        description="A 股与美股两本账，读取投研 Agent 成交记录。"
      />
      <NuxtLink
        to="/portfolio"
        class="hidden shrink-0 text-sm text-zinc-500 hover:text-zinc-900 sm:inline dark:hover:text-white"
      >
        查看完整分析
      </NuxtLink>
    </div>
    <div class="mt-8 grid gap-3 md:grid-cols-2">
      <NuxtLink
        v-if="data.a"
        to="/portfolio"
        class="card card-hover p-5"
      >
        <p class="text-xs uppercase tracking-[0.18em] text-accent">A 股</p>
        <p class="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {{ data.a.open.length ? data.a.open.map(item => item.name).join('、') : '当前空仓' }}
        </p>
        <p class="mt-2 text-sm" :class="pnlTextClass(lastTotal(data.a.equityCurve, data.a.realized))">
          累计 {{ formatSignedMoney(lastTotal(data.a.equityCurve, data.a.realized), data.a.currency) }}
        </p>
        <PortfolioEquityChart
          v-if="data.a.equityCurve.length > 1"
          class="mt-4"
          :points="data.a.equityCurve"
          :currency="data.a.currency"
          market="A"
          compact
        />
      </NuxtLink>
      <NuxtLink
        v-if="data.us"
        to="/portfolio"
        class="card card-hover p-5"
      >
        <p class="text-xs uppercase tracking-[0.18em] text-accent">美股</p>
        <p class="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {{ data.us.open.length ? data.us.open.map(item => item.ticker).join(' / ') : '当前空仓' }}
        </p>
        <p class="mt-2 text-sm" :class="pnlTextClass(lastTotal(data.us.equityCurve, data.us.realized))">
          累计 {{ formatSignedMoney(lastTotal(data.us.equityCurve, data.us.realized), data.us.currency) }}
        </p>
        <PortfolioEquityChart
          v-if="data.us.equityCurve.length > 1"
          class="mt-4"
          :points="data.us.equityCurve"
          :currency="data.us.currency"
          market="US"
          compact
        />
      </NuxtLink>
    </div>
  </section>
</template>
