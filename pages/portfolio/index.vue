<script setup lang="ts">
import type { MarketBook, PortfolioAnalysis } from '~/types/portfolio'
import { formatDate, formatMoney, formatQty, formatSignedMoney, formatSignedPct, pnlTextClass } from '~/utils/format'
import { SITE_DISCLAIMER } from '~/utils/site'

const { data, error } = await useAsyncData(
  'portfolio-analysis',
  () => $fetch<PortfolioAnalysis>('/api/portfolio'),
)

usePageSeo({
  title: '持仓分账',
  description: '读取投研 Agent 交易记录，按 A 股与美股分账复盘持仓、按日盯市收益曲线与纪律。',
  path: '/portfolio',
})

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
  const source = withQuote.quote.source === 'eastmoney' ? '东财' : withQuote.quote.source === 'tencent' ? '腾讯行情' : withQuote.quote.source
  return withQuote.quote.asOf
    ? `${source} · ${withQuote.quote.asOf}`
    : `${source} · 最近一次拉取`
}

function compositionCaption(book: MarketBook) {
  const total = book.marketValue == null ? '—' : formatMoney(book.marketValue, book.currency)
  const unit = book.currency === 'USD' ? 'USD' : 'CNY'
  const withQuote = book.open.find(item => item.quote?.asOf)
  const stamp = withQuote?.quote?.asOf
  const closeLabel = stamp
    ? (book.market === 'US' ? `${stamp.slice(0, 10)} 收盘` : stamp)
    : quoteCaption(book)
  return `${book.label}市值构成（${unit}）· 现持 ${total} · ${closeLabel}`
}
</script>

<template>
  <AppContainer class="space-y-14 py-12 sm:space-y-16 sm:py-16">
    <PageHero
      eyebrow="Ledger"
      title="持仓分账"
      description="读取投研 Agent 仓库里的成交 CSV 与持仓快照，A 股、美股分成两本账。已实现按 FIFO，现持成本以快照为准；人民币与美元不合并。"
    />

    <EmptyState
      v-if="error"
      eyebrow="Unavailable"
      title="持仓分账暂时无法加载"
      description="交易记录读取失败。请稍后重试，或检查投研 Agent 仓库地址、trades 目录和访问权限。"
    />

    <EmptyState
      v-else-if="!data?.configured"
      eyebrow="Coming Soon"
      title="持仓分账即将接入"
      description="配置投研 Agent 所在的 GitHub 仓库后，交易记录会自动出现在这里。"
    />

    <template v-else-if="data">
      <div class="space-y-3">
        <p class="text-xs leading-6 text-zinc-400">
          数据源 {{ data.source }}
          <template v-if="data.tradesPath"> · {{ data.tradesPath }}</template>
          <template v-if="data.snapshotAsOf"> · 快照 {{ formatDate(data.snapshotAsOf) }}</template>
        </p>
        <PortfolioInsight
          tone="info"
          title="两本账，不合并市值"
          :body="data.disclaimer"
        />
      </div>

      <section v-if="data.a" class="space-y-8">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ data.a.label }} · 趋势短线
          </h2>
          <p class="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {{ data.a.strategy }}。止损：{{ data.a.stopRule }}。
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PortfolioStat
            :value="formatSignedMoney(data.a.realized, data.a.currency)"
            label="已实现盈亏"
            :tone="realizedTone(data.a.realized)"
          />
          <PortfolioStat
            :value="data.a.unrealized == null ? '行情暂缺' : formatSignedMoney(data.a.unrealized, data.a.currency)"
            label="浮动盈亏"
            :tone="realizedTone(data.a.unrealized)"
          />
          <PortfolioStat
            :value="winRateLabel(data.a)"
            label="已平仓胜率"
            :tone="data.a.winRate && data.a.winRate >= 0.5 ? 'success' : 'neutral'"
          />
          <PortfolioStat
            :value="profitFactorLabel(data.a)"
            label="盈亏比（毛利/毛亏）"
            :tone="data.a.profitFactor != null && data.a.profitFactor < 1 ? 'warning' : 'neutral'"
          />
        </div>

        <PortfolioEquityChart
          v-if="data.a.equityCurve.length"
          :points="data.a.equityCurve"
          :currency="data.a.currency"
          market="A"
        />

        <div v-if="data.a.insights.length" class="grid gap-3">
          <PortfolioInsight
            v-for="insight in data.a.insights"
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
                  <th class="px-4 py-3 font-medium text-right">vs MA5</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="position in data.a.open"
                  :key="position.ticker"
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
                  <td class="px-4 py-3 text-right tabular-nums text-zinc-500">
                    {{ position.vsMa5Pct == null ? '—' : formatSignedPct(position.vsMa5Pct) }}
                  </td>
                </tr>
                <tr v-if="!data.a.open.length">
                  <td colspan="8" class="px-4 py-6 text-center text-zinc-400">当前无 A 股持仓</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-zinc-400">{{ quoteCaption(data.a) }}</p>
        </div>

        <div v-if="data.a.closed.length" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
                    v-for="trade in data.a.closed"
                    :key="`${trade.ticker}-${trade.sellDate}`"
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
              <PortfolioPnlBars :trades="data.a.closed" />
            </div>
          </div>
        </div>
      </section>

      <hr class="border-zinc-200/80 dark:border-white/[0.06]">

      <section v-if="data.us" class="space-y-8">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ data.us.label }} · 指数网格
          </h2>
          <p class="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {{ data.us.strategy }}。止损：{{ data.us.stopRule }}。
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PortfolioStat
            :value="formatSignedMoney(data.us.realized, data.us.currency)"
            label="已实现盈亏"
            :tone="realizedTone(data.us.realized)"
          />
          <PortfolioStat
            :value="data.us.unrealized == null ? '行情暂缺' : formatSignedMoney(data.us.unrealized, data.us.currency)"
            label="浮动盈亏"
            :tone="realizedTone(data.us.unrealized)"
          />
          <PortfolioStat
            :value="winRateLabel(data.us)"
            label="已平仓胜率"
            :tone="data.us.lossCount === 0 && data.us.closed.length ? 'success' : 'neutral'"
          />
          <PortfolioStat
            :value="data.us.marketValue == null ? '—' : formatMoney(data.us.marketValue, data.us.currency)"
            label="现持市值"
          />
        </div>

        <PortfolioEquityChart
          v-if="data.us.equityCurve.length"
          :points="data.us.equityCurve"
          :currency="data.us.currency"
          market="US"
        />

        <div class="space-y-3">
          <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">现持仓</h3>
          <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
            <table class="min-w-full text-left text-sm">
              <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
                <tr>
                  <th class="px-4 py-3 font-medium">代码</th>
                  <th class="px-4 py-3 font-medium">角色</th>
                  <th class="px-4 py-3 font-medium text-right">数量</th>
                  <th class="px-4 py-3 font-medium text-right">成本</th>
                  <th class="px-4 py-3 font-medium text-right">现价</th>
                  <th class="px-4 py-3 font-medium text-right">市值</th>
                  <th class="px-4 py-3 font-medium text-right">浮盈亏</th>
                  <th class="px-4 py-3 font-medium text-right">占比</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="position in data.us.open"
                  :key="position.ticker"
                  class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
                >
                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{{ position.ticker }}</td>
                  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ position.role || position.name }}</td>
                  <td class="px-4 py-3 text-right tabular-nums">{{ formatQty(position.qty) }}</td>
                  <td class="px-4 py-3 text-right tabular-nums">{{ formatMoney(position.avgCost, position.currency) }}</td>
                  <td class="px-4 py-3 text-right tabular-nums">
                    {{ position.quote ? formatMoney(position.quote.last, position.currency) : '—' }}
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums">
                    {{ position.marketValue == null ? '—' : formatMoney(position.marketValue, position.currency) }}
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums" :class="pnlTextClass(position.unrealized)">
                    <template v-if="position.unrealized == null">—</template>
                    <template v-else>
                      {{ formatSignedMoney(position.unrealized, position.currency) }}
                      <span v-if="position.unrealizedPct != null" class="text-xs">
                        （{{ formatSignedPct(position.unrealizedPct) }}）
                      </span>
                    </template>
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums text-zinc-500">
                    {{ position.weightPct == null ? '—' : `${position.weightPct.toFixed(1)}%` }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-zinc-400">{{ quoteCaption(data.us) }}</p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div v-if="data.us.open.some(item => item.marketValue)" class="space-y-3">
            <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">当前市值构成</h3>
            <div class="card p-5">
              <PortfolioComposition
                :positions="data.us.open"
                :total="data.us.marketValue"
                :currency="data.us.currency"
                :caption="compositionCaption(data.us)"
              />
            </div>
          </div>
          <div v-if="data.usAllocation.length" class="space-y-3">
            <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">对照目标配置</h3>
            <div class="card p-5">
              <PortfolioAllocation :rows="data.usAllocation" />
            </div>
          </div>
        </div>

        <div v-if="data.us.closed.length" class="space-y-3">
          <h3 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">网格已平仓</h3>
          <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
            <table class="min-w-full text-left text-sm">
              <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
                <tr>
                  <th class="px-4 py-3 font-medium">代码</th>
                  <th class="px-4 py-3 font-medium">日期</th>
                  <th class="px-4 py-3 font-medium text-right">买 / 卖</th>
                  <th class="px-4 py-3 font-medium text-right">盈亏</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="trade in data.us.closed"
                  :key="`${trade.ticker}-${trade.sellDate}-${trade.buyPrice}`"
                  class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
                >
                  <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{{ trade.ticker }}</td>
                  <td class="px-4 py-3 text-zinc-500">{{ formatDate(trade.buyDate) }} – {{ formatDate(trade.sellDate) }}</td>
                  <td class="px-4 py-3 text-right tabular-nums text-zinc-500">
                    {{ formatMoney(trade.buyPrice, trade.currency) }} → {{ formatMoney(trade.sellPrice, trade.currency) }}
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums" :class="pnlTextClass(trade.pnl)">
                    {{ formatSignedMoney(trade.pnl, trade.currency) }}
                    <span class="text-xs">（{{ formatSignedPct(trade.pnlPct) }}）</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="data.us.insights.length" class="grid gap-3">
          <PortfolioInsight
            v-for="insight in data.us.insights"
            :key="insight.title"
            :tone="insight.tone"
            :title="insight.title"
            :body="insight.body"
          />
        </div>
      </section>

      <hr class="border-zinc-200/80 dark:border-white/[0.06]">

      <section v-if="data.comparison.length" class="space-y-6">
        <h2 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          两市对照
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">只比纪律与结构，不比合并市值。</p>
        <div class="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-zinc-200 text-xs text-zinc-400 dark:border-white/10">
              <tr>
                <th class="px-4 py-3 font-medium">维度</th>
                <th class="px-4 py-3 font-medium">A 股</th>
                <th class="px-4 py-3 font-medium">美股</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in data.comparison"
                :key="row.dimension"
                class="border-b border-zinc-100 last:border-0 dark:border-white/[0.04]"
              >
                <td class="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{{ row.dimension }}</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ row.a }}</td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">{{ row.us }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PortfolioInsight
          v-for="insight in data.summaryInsights"
          :key="insight.title"
          :tone="insight.tone"
          :title="insight.title"
          :body="insight.body"
        />
      </section>

      <p class="text-xs leading-5 text-zinc-400">
        {{ SITE_DISCLAIMER }}
        <template v-if="data.notes"> 快照备注：{{ data.notes }}</template>
      </p>
    </template>
  </AppContainer>
</template>
