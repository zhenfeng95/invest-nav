<script setup lang="ts">
import type { MarketBook } from '~/types/portfolio'
import { formatDate, formatMoney, formatQty, formatSignedMoney, formatSignedPct, pnlTextClass } from '~/utils/format'

const props = defineProps<{
  book: MarketBook
}>()

function winRateLabel(book: MarketBook) {
  const total = book.winCount + book.lossCount
  if (!total) {
    return '—'
  }
  return `${book.winCount} / ${total}`
}

function profitFactorLabel(book: MarketBook) {
  if (book.profitFactor == null) {
    return book.closed.length && book.lossCount === 0 ? '无亏损单' : '—'
  }
  return book.profitFactor.toFixed(2)
}

function realizedTone(value: number | null): 'success' | 'danger' | 'neutral' {
  if (value == null || Math.abs(value) < 1e-9) {
    return 'neutral'
  }
  return value > 0 ? 'success' : 'danger'
}

function quoteCaption(book: MarketBook) {
  const withQuote = book.open.find(item => item.quote)
  if (!withQuote?.quote) {
    return '现价暂未取到，表格只展示成本。'
  }
  const source = withQuote.quote.source === 'eastmoney'
    ? '东财'
    : withQuote.quote.source === 'tencent'
      ? '腾讯行情'
      : withQuote.quote.source === '10jqka'
        ? '同花顺'
        : withQuote.quote.source
  return withQuote.quote.asOf
    ? `${source} · ${withQuote.quote.asOf}`
    : `${source} · 最近一次拉取`
}

const styleLabel = computed(() => {
  if (props.book.style === 'index-hold') {
    return '指数配置'
  }
  if (props.book.style === 'tail-scalp') {
    return '尾盘超短'
  }
  return '趋势短线'
})

const showMa5 = computed(() => props.book.style === 'trend-swing')
</script>

<template>
  <section class="space-y-8">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ book.label }} · {{ styleLabel }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        <template v-if="book.broker">{{ book.broker }}（{{ book.account }}）。</template>
        {{ book.strategy }}。止损：{{ book.stopRule }}。
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <PortfolioStat
        :value="formatSignedMoney(book.realized, book.currency)"
        label="已实现盈亏"
        :tone="realizedTone(book.realized)"
      />
      <PortfolioStat
        :value="book.unrealized == null ? '行情暂缺' : formatSignedMoney(book.unrealized, book.currency)"
        label="浮动盈亏"
        :tone="realizedTone(book.unrealized)"
      />
      <PortfolioStat
        :value="winRateLabel(book)"
        label="已平仓胜率"
        :tone="book.winRate && book.winRate >= 0.5 ? 'success' : 'neutral'"
      />
      <PortfolioStat
        :value="profitFactorLabel(book)"
        label="盈亏比（毛利/毛亏）"
        :tone="book.profitFactor != null && book.profitFactor < 1 ? 'warning' : 'neutral'"
      />
    </div>

    <PortfolioEquityChart
      v-if="book.equityCurve.length"
      :points="book.equityCurve"
      :currency="book.currency"
      market="A"
    />

    <div v-if="book.insights.length" class="grid gap-3">
      <PortfolioInsight
        v-for="insight in book.insights"
        :key="insight.title"
        :tone="insight.tone"
        :title="insight.title"
        :body="insight.body"
      />
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">现持仓</h3>
      <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
            <tr>
              <th class="px-4 py-3 font-medium">代码</th>
              <th class="px-4 py-3 font-medium">简称</th>
              <th class="px-4 py-3 font-medium text-right">数量</th>
              <th class="px-4 py-3 font-medium text-right">成本</th>
              <th class="px-4 py-3 font-medium text-right">现价</th>
              <th class="px-4 py-3 font-medium text-right">市值</th>
              <th class="px-4 py-3 font-medium text-right">浮盈亏</th>
              <th v-if="showMa5" class="px-4 py-3 font-medium text-right">vs MA5</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="position in book.open"
              :key="`${position.account}-${position.ticker}`"
              class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
            >
              <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{{ position.ticker }}</td>
              <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ position.name }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ formatQty(position.qty) }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ formatMoney(position.avgCost, position.currency) }}</td>
              <td class="px-4 py-3 text-right tabular-nums">
                {{ position.quote ? formatMoney(position.quote.last, position.currency) : '—' }}
              </td>
              <td class="px-4 py-3 text-right tabular-nums">
                {{ position.marketValue == null ? '—' : formatMoney(position.marketValue, position.currency) }}
              </td>
              <td
                class="px-4 py-3 text-right tabular-nums"
                :class="pnlTextClass(position.unrealized)"
              >
                <template v-if="position.unrealized == null">—</template>
                <template v-else>
                  {{ formatSignedMoney(position.unrealized, position.currency) }}
                  <span v-if="position.unrealizedPct != null" class="text-xs">
                    （{{ formatSignedPct(position.unrealizedPct) }}）
                  </span>
                </template>
              </td>
              <td v-if="showMa5" class="px-4 py-3 text-right tabular-nums text-zinc-500">
                {{ position.vsMa5Pct == null ? '—' : formatSignedPct(position.vsMa5Pct) }}
              </td>
            </tr>
            <tr v-if="!book.open.length">
              <td :colspan="showMa5 ? 8 : 7" class="px-4 py-6 text-center text-zinc-400">当前无持仓</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-zinc-400">{{ quoteCaption(book) }}</p>
    </div>

    <div v-if="book.closed.length" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="space-y-3">
        <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">已平仓</h3>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
              <tr>
                <th class="px-4 py-3 font-medium">代码</th>
                <th class="px-4 py-3 font-medium">简称</th>
                <th class="px-4 py-3 font-medium">买卖日期</th>
                <th class="px-4 py-3 font-medium text-right">买 / 卖</th>
                <th class="px-4 py-3 font-medium text-right">盈亏</th>
                <th class="px-4 py-3 font-medium text-right">收益率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="trade in book.closed"
                :key="`${trade.account}-${trade.ticker}-${trade.sellDate}`"
                class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
              >
                <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{{ trade.ticker }}</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ trade.name }}</td>
                <td class="px-4 py-3 text-zinc-500">{{ formatDate(trade.buyDate) }} – {{ formatDate(trade.sellDate) }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-zinc-500">
                  {{ formatMoney(trade.buyPrice, trade.currency) }} → {{ formatMoney(trade.sellPrice, trade.currency) }}
                </td>
                <td class="px-4 py-3 text-right tabular-nums" :class="pnlTextClass(trade.pnl)">
                  {{ formatSignedMoney(trade.pnl, trade.currency) }}
                </td>
                <td class="px-4 py-3 text-right tabular-nums" :class="pnlTextClass(trade.pnlPct)">
                  {{ formatSignedPct(trade.pnlPct) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="space-y-3">
        <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">已实现分布</h3>
        <div class="card p-5">
          <PortfolioPnlBars :trades="book.closed" />
        </div>
      </div>
    </div>
  </section>
</template>
