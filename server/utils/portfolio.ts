import portfolioConfig from '../../data/portfolio.json'
import type {
  AllocationRow,
  ClosedTrade,
  ComparisonRow,
  CurrencyCode,
  EquityPoint,
  Insight,
  MarketBook,
  MarketCode,
  OpenPosition,
  PortfolioAnalysis,
} from '~/types/portfolio'
import type { GitHubReportsConfig } from './github-reports'
import { getRepoFileText, GitHubReportsError, listRepoBlobs } from './github-reports'
import type { DailyClose, LiveQuote } from './quotes'
import { fetchDailyCloses, fetchQuotes } from './quotes'

const TRADES_TTL_MS = 5 * 60 * 1000

interface RawTrade {
  date: string
  market: MarketCode
  ticker: string
  name: string
  side: 'buy' | 'sell'
  qty: number
  price: number
  currency: CurrencyCode
  note: string
}

interface Lot {
  date: string
  qty: number
  price: number
  name: string
  note: string
}

interface SnapshotPosition {
  market: MarketCode
  ticker: string
  name: string
  qty: number
  avg_cost: number
  currency: CurrencyCode
  note?: string
}

interface SnapshotFile {
  as_of?: string
  notes?: string
  positions?: SnapshotPosition[]
}

interface UsTarget {
  ticker: string
  weight: number
  role: string
}

interface TradeBundle {
  trades: RawTrade[]
  snapshot: SnapshotFile | null
  source: string
  tradesPath: string
}

export async function buildPortfolioAnalysis(config: GitHubReportsConfig | null): Promise<PortfolioAnalysis> {
  const bundle = await loadTradeBundle(config)
  if (!bundle) {
    throw new GitHubReportsError('未找到交易记录 CSV。', 404)
  }

  const reconstructed = reconstruct(bundle.trades)
  const instruments = uniqueInstruments(bundle.trades, bundle.snapshot)
  const startDate = earliestActivity(bundle.trades, bundle.snapshot)
  const [quotes, closes] = await Promise.all([
    fetchQuotes(instruments),
    fetchDailyCloses(instruments, startDate || '1970-01-01'),
  ])

  const a = buildBook('A', 'CNY', reconstructed, bundle.snapshot, quotes, bundle.trades, closes)
  const us = buildBook('US', 'USD', reconstructed, bundle.snapshot, quotes, bundle.trades, closes)
  const usAllocation = buildUsAllocation(us)
  const comparison = buildComparison(a, us)

  return {
    configured: true,
    source: bundle.source,
    tradesPath: bundle.tradesPath,
    snapshotAsOf: bundle.snapshot?.as_of || latestDate(bundle.trades),
    quotesAsOf: collectQuoteAsOf(a, us),
    notes: bundle.snapshot?.notes || null,
    disclaimer: portfolioConfig.disclaimer,
    a,
    us,
    usAllocation,
    comparison,
    summaryInsights: buildSummaryInsights(),
  }
}

async function loadTradeBundle(config: GitHubReportsConfig | null): Promise<TradeBundle | null> {
  if (config) {
    try {
      const remote = await loadFromGitHub(config)
      if (remote) {
        return remote
      }
    }
    catch {
      // Fall through to the sibling invest-agent checkout used in local dev.
    }
  }

  return await loadFromLocal(config?.tradesPath || 'data/raw/trades')
}

async function loadFromGitHub(config: GitHubReportsConfig): Promise<TradeBundle | null> {
  const prefix = config.tradesPath
  const blobs = await listRepoBlobs(config, prefix)
  const csvPaths = blobs.filter(path => /trades-\d{4}-\d{2}\.csv$/i.test(path)).sort()
  const snapshotPaths = blobs.filter(path => /positions-\d{4}-\d{2}-\d{2}\.json$/i.test(path)).sort()
  if (!csvPaths.length) {
    return null
  }

  const csvFiles = await Promise.all(csvPaths.map(path => getRepoFileText(config, path, TRADES_TTL_MS)))
  const trades = csvFiles.flatMap((text, index) => parseTradesCsv(text || '', csvPaths[index]))
  if (!trades.length) {
    return null
  }

  const latestSnapshotPath = snapshotPaths.at(-1)
  const snapshot = latestSnapshotPath
    ? parseSnapshot(await getRepoFileText(config, latestSnapshotPath, TRADES_TTL_MS))
    : null

  return {
    trades,
    snapshot,
    source: `${config.owner}/${config.repo}`,
    tradesPath: prefix,
  }
}

async function loadFromLocal(tradesPath: string): Promise<TradeBundle | null> {
  try {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const root = path.join(process.cwd(), '..', 'invest-agent', tradesPath)
    const entries = await fs.readdir(root)
    const csvNames = entries.filter(name => /trades-\d{4}-\d{2}\.csv$/i.test(name)).sort()
    if (!csvNames.length) {
      return null
    }

    const csvFiles = await Promise.all(csvNames.map(name => fs.readFile(path.join(root, name), 'utf8')))
    const trades = csvFiles.flatMap((text, index) => parseTradesCsv(text, csvNames[index]))
    if (!trades.length) {
      return null
    }

    const snapshotNames = entries.filter(name => /positions-\d{4}-\d{2}-\d{2}\.json$/i.test(name)).sort()
    const latest = snapshotNames.at(-1)
    const snapshot = latest ? parseSnapshot(await fs.readFile(path.join(root, latest), 'utf8')) : null

    return {
      trades,
      snapshot,
      source: 'local:invest-agent',
      tradesPath,
    }
  }
  catch {
    return null
  }
}

function parseTradesCsv(text: string, path: string): RawTrade[] {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/)
  if (lines.length < 2) {
    return []
  }

  const headers = splitCsvLine(lines[0]).map(header => header.trim())
  const rows: RawTrade[] = []

  for (const line of lines.slice(1)) {
    if (!line.trim()) {
      continue
    }
    const cols = splitCsvLine(line)
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = (cols[index] || '').trim()
    })

    const market = record.market === 'A' || record.market === 'US' ? record.market : null
    const side = record.side === 'buy' || record.side === 'sell' ? record.side : null
    const qty = Number(record.qty)
    const price = Number(record.price)
    if (!market || !side || !record.ticker || !Number.isFinite(qty) || !Number.isFinite(price)) {
      continue
    }

    rows.push({
      date: record.date,
      market,
      ticker: record.ticker.toUpperCase(),
      name: record.name || record.ticker,
      side,
      qty,
      price,
      currency: record.currency === 'USD' ? 'USD' : 'CNY',
      note: record.note || path,
    })
  }

  return rows
}

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
      continue
    }
    current += char
  }
  result.push(current)
  return result
}

function parseSnapshot(text: string | null): SnapshotFile | null {
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text) as SnapshotFile
  }
  catch {
    return null
  }
}

function reconstruct(trades: RawTrade[]) {
  const lots = new Map<string, Lot[]>()
  const openNames = new Map<string, { name: string, currency: CurrencyCode, market: MarketCode }>()
  const closed: ClosedTrade[] = []

  for (const trade of [...trades].sort((a, b) => a.date.localeCompare(b.date))) {
    const key = `${trade.market}:${trade.ticker}`
    openNames.set(key, { name: trade.name, currency: trade.currency, market: trade.market })
    const queue = lots.get(key) ?? []

    if (trade.side === 'buy') {
      queue.push({ date: trade.date, qty: trade.qty, price: trade.price, name: trade.name, note: trade.note })
      lots.set(key, queue)
      continue
    }

    let remain = trade.qty
    let matchedQty = 0
    let buyCost = 0
    let buyDate = trade.date
    let buyNote = ''

    while (remain > 1e-12 && queue.length) {
      const lot = queue[0]
      const take = Math.min(lot.qty, remain)
      if (matchedQty === 0) {
        buyDate = lot.date
        buyNote = lot.note
      }
      buyCost += take * lot.price
      matchedQty += take
      lot.qty -= take
      remain -= take
      if (lot.qty <= 1e-12) {
        queue.shift()
      }
    }

    lots.set(key, queue)
    if (matchedQty > 0) {
      closed.push({
        market: trade.market,
        ticker: trade.ticker,
        name: trade.name,
        qty: roundQty(matchedQty),
        buyDate,
        sellDate: trade.date,
        buyPrice: buyCost / matchedQty,
        sellPrice: trade.price,
        pnl: roundMoney((trade.price - buyCost / matchedQty) * matchedQty, trade.currency),
        pnlPct: ((trade.price - buyCost / matchedQty) / (buyCost / matchedQty)) * 100,
        currency: trade.currency,
        holdDays: daysBetween(buyDate, trade.date),
        buyNote: buyNote || undefined,
      })
    }
  }

  const open: OpenPosition[] = []
  for (const [key, queue] of lots.entries()) {
    const qty = queue.reduce((sum, lot) => sum + lot.qty, 0)
    if (qty <= 1e-12) {
      continue
    }
    const cost = queue.reduce((sum, lot) => sum + lot.qty * lot.price, 0)
    const meta = openNames.get(key)!
    open.push(baseOpenPosition({
      market: meta.market,
      ticker: key.split(':')[1],
      name: queue[0]?.name || meta.name,
      qty,
      avgCost: cost / qty,
      currency: meta.currency,
      openedAt: queue[0]?.date,
    }))
  }

  return { open, closed }
}

function buildBook(
  market: MarketCode,
  currency: CurrencyCode,
  reconstructed: { open: OpenPosition[], closed: ClosedTrade[] },
  snapshot: SnapshotFile | null,
  quotes: Map<string, LiveQuote>,
  trades: RawTrade[],
  closes: Map<string, DailyClose[]>,
): MarketBook {
  const closed = reconstructed.closed.filter(item => item.market === market)
  const fifoOpen = reconstructed.open.filter(item => item.market === market)
  const snapshotPositions = (snapshot?.positions || []).filter(item => item.market === market)
  const merged = mergeOpenPositions(fifoOpen, snapshotPositions, market, currency)

  const valued = merged
    .map((position) => {
    const quote = quotes.get(`${market}:${position.ticker}`) || null
    const last = quote?.last
    const marketValue = last != null ? roundMoney(position.qty * last, currency) : null
    const unrealized = last != null ? roundMoney((last - position.avgCost) * position.qty, currency) : null
    const vsMa5Pct = quote?.ma5 ? (last! / quote.ma5 - 1) * 100 : null
    const costVsMa5Pct = quote?.ma5 ? (position.avgCost / quote.ma5 - 1) * 100 : null
    return {
      ...position,
      name: position.name,
      quote,
      marketValue,
      unrealized,
      unrealizedPct: last != null ? (last / position.avgCost - 1) * 100 : null,
      vsMa5Pct,
      costVsMa5Pct,
      role: usRole(position.ticker),
    }
  })
    .sort((left, right) => compareOpen(left.ticker, right.ticker, market))

  const totalValue = sumNullable(valued.map(item => item.marketValue))
  const open = valued.map((item) => ({
    ...item,
    weightPct: totalValue && item.marketValue != null ? (item.marketValue / totalValue) * 100 : null,
  }))

  const realized = roundMoney(closed.reduce((sum, item) => sum + item.pnl, 0), currency)
  const wins = closed.filter(item => item.pnl > 0)
  const losses = closed.filter(item => item.pnl < 0)
  const grossProfit = wins.reduce((sum, item) => sum + item.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((sum, item) => sum + item.pnl, 0))
  const unrealized = sumNullable(open.map(item => item.unrealized))
  const config = market === 'A' ? portfolioConfig.aShare : portfolioConfig.us

  const book: MarketBook = {
    market,
    label: config.label,
    strategy: config.strategy,
    stopRule: config.stopRule,
    currency,
    open,
    closed,
    realized,
    unrealized,
    marketValue: totalValue,
    costBasis: roundMoney(open.reduce((sum, item) => sum + item.costBasis, 0), currency),
    winCount: wins.length,
    lossCount: losses.length,
    winRate: closed.length ? wins.length / closed.length : null,
    profitFactor: grossLoss > 0 ? Math.round((grossProfit / grossLoss) * 100) / 100 : null,
    equityCurve: alignCurveTail(
      buildEquityCurve(market, currency, trades, snapshotPositions, closes, quotes),
      {
        realized,
        unrealized,
        marketValue: totalValue,
        costBasis: roundMoney(open.reduce((sum, item) => sum + item.costBasis, 0), currency),
        currency,
      },
    ),
    insights: [],
  }
  book.insights = market === 'A' ? aInsights(book) : usInsights(book)
  return book
}

function mergeOpenPositions(
  fifoOpen: OpenPosition[],
  snapshotPositions: SnapshotPosition[],
  market: MarketCode,
  currency: CurrencyCode,
): OpenPosition[] {
  const map = new Map<string, OpenPosition>()
  for (const position of fifoOpen) {
    map.set(position.ticker, position)
  }

  for (const snapshot of snapshotPositions) {
    const current = map.get(snapshot.ticker)
    map.set(snapshot.ticker, baseOpenPosition({
      market,
      ticker: snapshot.ticker,
      name: snapshot.name || current?.name || snapshot.ticker,
      qty: snapshot.qty,
      avgCost: snapshot.avg_cost,
      currency: snapshot.currency || currency,
      openedAt: current?.openedAt,
      note: snapshot.note,
    }))
  }

  return [...map.values()].sort((a, b) => a.ticker.localeCompare(b.ticker))
}

function baseOpenPosition(input: {
  market: MarketCode
  ticker: string
  name: string
  qty: number
  avgCost: number
  currency: CurrencyCode
  openedAt?: string
  note?: string
}): OpenPosition {
  return {
    market: input.market,
    ticker: input.ticker,
    name: input.name,
    qty: roundQty(input.qty),
    avgCost: input.avgCost,
    currency: input.currency,
    costBasis: roundMoney(input.qty * input.avgCost, input.currency),
    marketValue: null,
    unrealized: null,
    unrealizedPct: null,
    weightPct: null,
    quote: null,
    vsMa5Pct: null,
    costVsMa5Pct: null,
    openedAt: input.openedAt,
    note: input.note,
  }
}

function uniqueInstruments(trades: RawTrade[], snapshot: SnapshotFile | null): Array<{ market: MarketCode, ticker: string }> {
  const map = new Map<string, { market: MarketCode, ticker: string }>()
  for (const trade of trades) {
    map.set(`${trade.market}:${trade.ticker}`, { market: trade.market, ticker: trade.ticker })
  }
  for (const position of snapshot?.positions || []) {
    map.set(`${position.market}:${position.ticker}`, { market: position.market, ticker: position.ticker })
  }
  return [...map.values()]
}

function alignCurveTail(
  points: EquityPoint[],
  tail: {
    realized: number
    unrealized: number | null
    marketValue: number | null
    costBasis: number
    currency: CurrencyCode
  },
): EquityPoint[] {
  const last = points[points.length - 1]
  if (!last) {
    return points
  }
  const unrealized = tail.unrealized == null ? last.unrealized : tail.unrealized
  points[points.length - 1] = {
    ...last,
    realized: tail.realized,
    unrealized,
    total: roundMoney(tail.realized + unrealized, tail.currency),
    marketValue: tail.marketValue == null ? last.marketValue : tail.marketValue,
    costBasis: tail.costBasis,
  }
  return points
}

function earliestActivity(trades: RawTrade[], snapshot: SnapshotFile | null): string | null {
  let earliest: string | null = null
  for (const trade of trades) {
    if (!earliest || trade.date < earliest) {
      earliest = trade.date
    }
  }
  if (snapshot?.as_of && (!earliest || snapshot.as_of < earliest)) {
    earliest = snapshot.as_of
  }
  return earliest
}

function buildEquityCurve(
  market: MarketCode,
  currency: CurrencyCode,
  trades: RawTrade[],
  snapshotPositions: SnapshotPosition[],
  closes: Map<string, DailyClose[]>,
  liveQuotes: Map<string, LiveQuote>,
): EquityPoint[] {
  const marketTrades = [...trades]
    .filter(item => item.market === market)
    .sort((a, b) => a.date.localeCompare(b.date))

  let startDate: string | null = null
  for (const trade of marketTrades) {
    if (!startDate || trade.date < startDate) {
      startDate = trade.date
    }
  }

  const tradedTickers = new Set(marketTrades.map(item => item.ticker))
  const seeded: SnapshotPosition[] = []
  for (const position of snapshotPositions) {
    if (tradedTickers.has(position.ticker) || position.qty <= 1e-12) {
      continue
    }
    seeded.push(position)
    if (!startDate) {
      startDate = position.note?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || null
    }
  }

  const seriesByTicker = new Map<string, Map<string, number>>()
  const dateSet = new Set<string>()
  for (const [key, series] of closes) {
    if (!key.startsWith(`${market}:`)) {
      continue
    }
    const ticker = key.slice(market.length + 1)
    const byDate = new Map<string, number>()
    for (const bar of series) {
      byDate.set(bar.date, bar.close)
      dateSet.add(bar.date)
    }
    seriesByTicker.set(ticker, byDate)
  }

  for (const trade of marketTrades) {
    dateSet.add(trade.date)
  }

  if (!startDate) {
    startDate = [...dateSet].sort()[0] || null
  }
  const origin = startDate
  if (!origin) {
    return []
  }

  const dates = [...dateSet].filter(date => date >= origin).sort()
  if (!dates.length) {
    return []
  }

  const lastPx = new Map<string, number>()
  for (const [ticker, byDate] of seriesByTicker) {
    for (const [date, close] of [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (date < origin) {
        lastPx.set(ticker, close)
      }
    }
  }

  const lots = new Map<string, Lot[]>()
  for (const position of seeded) {
    lots.set(position.ticker, [{
      date: origin,
      qty: position.qty,
      price: position.avg_cost,
      name: position.name,
      note: position.note || '',
    }])
  }

  let realized = 0
  let tradeIndex = 0
  const points: EquityPoint[] = []

  for (let index = 0; index < dates.length; index += 1) {
    const date = dates[index]
    const isLast = index === dates.length - 1

    while (tradeIndex < marketTrades.length && marketTrades[tradeIndex].date === date) {
      const trade = marketTrades[tradeIndex]
      tradeIndex += 1
      const queue = lots.get(trade.ticker) ?? []

      if (trade.side === 'buy') {
        queue.push({
          date: trade.date,
          qty: trade.qty,
          price: trade.price,
          name: trade.name,
          note: trade.note,
        })
        lots.set(trade.ticker, queue)
        continue
      }

      let remain = trade.qty
      let matchedQty = 0
      let buyCost = 0
      while (remain > 1e-12 && queue.length) {
        const lot = queue[0]
        const take = Math.min(lot.qty, remain)
        buyCost += take * lot.price
        matchedQty += take
        lot.qty -= take
        remain -= take
        if (lot.qty <= 1e-12) {
          queue.shift()
        }
      }
      lots.set(trade.ticker, queue)
      if (matchedQty > 0) {
        realized += (trade.price - buyCost / matchedQty) * matchedQty
      }
    }

    for (const [ticker, byDate] of seriesByTicker) {
      const close = byDate.get(date)
      if (close != null) {
        lastPx.set(ticker, close)
      }
    }

    if (isLast) {
      for (const [key, quote] of liveQuotes) {
        if (!key.startsWith(`${market}:`) || !quote.last) {
          continue
        }
        lastPx.set(key.slice(market.length + 1), quote.last)
      }
    }

    let costBasis = 0
    let marketValue = 0
    for (const [ticker, queue] of lots) {
      const qty = queue.reduce((sum, lot) => sum + lot.qty, 0)
      if (qty <= 1e-12) {
        continue
      }
      const cost = queue.reduce((sum, lot) => sum + lot.qty * lot.price, 0)
      const mark = lastPx.get(ticker) ?? (cost / qty)
      costBasis += cost
      marketValue += qty * mark
    }

    const roundedRealized = roundMoney(realized, currency)
    const roundedUnrealized = roundMoney(marketValue - costBasis, currency)
    points.push({
      date,
      realized: roundedRealized,
      unrealized: roundedUnrealized,
      total: roundMoney(roundedRealized + roundedUnrealized, currency),
      marketValue: roundMoney(marketValue, currency),
      costBasis: roundMoney(costBasis, currency),
    })
  }

  return points
}

function aInsights(book: MarketBook): Insight[] {
  const insights: Insight[] = []
  const cap = portfolioConfig.aShare.maExtensionCapPct
  const openCount = book.open.length
  const unevenLots = describeUnevenShareLots(book)

  if (book.closed.length) {
    const profitFactorLabel = book.profitFactor == null ? '—' : book.profitFactor.toFixed(2)
    if ((book.winRate || 0) >= 0.6 && (book.profitFactor || 0) < 1) {
      insights.push({
        tone: 'danger',
        title: '结构问题：赢的太碎，亏的太整',
        body: describeFragileWins(book, unevenLots),
      })
    }
    else if (book.realized >= 0) {
      insights.push({
        tone: 'success',
        title: '短线已实现为正',
        body: `已平 ${book.closed.length} 笔，胜率 ${pctLabel(book.winRate)}，盈亏比 ${profitFactorLabel}。`,
      })
    }
  }

  const fragileWins = (book.winRate || 0) >= 0.6 && (book.profitFactor || 0) < 1
  if (unevenLots && !fragileWins) {
    insights.push({
      tone: 'warning',
      title: '仓位按手数而不是按金额',
      body: unevenLots,
    })
  }

  if (openCount > portfolioConfig.aShare.maxPositions) {
    insights.push({
      tone: 'danger',
      title: `持仓超过 ${portfolioConfig.aShare.maxPositions} 只上限`,
      body: `当前 A 股持仓 ${openCount} 只。`,
    })
  }

  for (const position of book.open) {
    if (position.quote?.ma5 && position.costVsMa5Pct != null && position.costVsMa5Pct > cap) {
      insights.push({
        tone: 'warning',
        title: `${position.name} 成本距 MA5 延伸偏大`,
        body: `成本相对 MA5 延伸 ${position.costVsMa5Pct.toFixed(1)}%，超过约 ${cap}% 的追涨上限。`,
      })
    }
    else if (position.quote?.ma5 && position.vsMa5Pct != null && position.vsMa5Pct < 0) {
      insights.push({
        tone: 'danger',
        title: `${position.name} 已跌破 MA5`,
        body: `现价相对 MA5 ${position.vsMa5Pct.toFixed(2)}%。按纪律应视为止损信号。`,
      })
    }
    else if (position.quote?.ma5 && position.vsMa5Pct != null) {
      const room = position.avgCost && position.quote.ma5
        ? ((position.quote.ma5 / position.avgCost) - 1) * 100
        : null
      insights.push({
        tone: 'warning',
        title: `${position.name} 仍在 MA5 上方，止损空间偏窄`,
        body: `现价相对 MA5 ${position.vsMa5Pct >= 0 ? '+' : ''}${position.vsMa5Pct.toFixed(2)}%。${room != null ? `从成本到 MA5 大约 ${room.toFixed(1)}%。` : ''}有效跌破均线即按原纪律离场。`,
      })
    }
  }

  if (!book.open.length) {
    insights.push({
      tone: 'info',
      title: '当前无 A 股持仓',
      body: '账本只保留已平仓复盘。',
    })
  }

  return insights
}

function usInsights(book: MarketBook): Insight[] {
  const insights: Insight[] = []
  const allocation = buildUsAllocation(book)
  const overweight = allocation.filter(row => row.key !== 'FLEX' && row.actualPct - row.targetPct >= 5)
  const underweight = allocation.filter(row => row.key !== 'FLEX' && row.targetPct - row.actualPct >= 4)

  if (overweight.length) {
    insights.push({
      tone: 'warning',
      title: overweight.map(row => row.label).join('、') + ' 超过目标配置',
      body: overweight
        .map(row => `${row.label} 目标 ${row.targetPct.toFixed(0)}%，当前 ${row.actualPct.toFixed(1)}%。`)
        .join(' ')
        + (overweight.some(row => row.key === 'QQQ')
          ? ' 网格按「每档 0.01 股」时，QQQ 单价高，容易把卫星做成第二只底仓。'
          : ''),
    })
  }

  if (underweight.length) {
    insights.push({
      tone: 'info',
      title: underweight.map(row => row.label).join('、') + ' 低于目标配置',
      body: underweight
        .map(row => `${row.label} 目标 ${row.targetPct.toFixed(0)}%，当前 ${row.actualPct.toFixed(1)}%。`)
        .join(' ')
        + ' 若要贴近锚点，下一档优先补低配而不是再加超配标的。',
    })
  }

  const flex = allocation.find(row => row.key === 'FLEX')
  if (flex && flex.actualPct < 1 && flex.targetPct > 0) {
    insights.push({
      tone: 'info',
      title: '机动仓为空',
      body: '目标约 20% 留给个股卫星（如 NVDA），当前指数仓已占满现有市值。',
    })
  }

  if (book.closed.length && book.lossCount === 0) {
    insights.push({
      tone: 'success',
      title: '网格已平仓笔笔小胜',
      body: `已平 ${book.closed.length} 笔，已实现 ${formatBookMoney(book.realized, book.currency)}。这是碎股网格的兑现，不是趋势单的盈亏比。`,
    })
  }

  const gridNames = ['VOO', 'QQQ']
  const grid = book.open.filter(item => gridNames.includes(item.ticker) && item.quote)
  if (grid.length) {
    const step = portfolioConfig.us.gridStepUsd
    insights.push({
      tone: 'info',
      title: '下一档网格参考',
      body: grid
        .map((item) => {
          const last = item.quote!.last
          const sell = item.avgCost + step
          const buy = item.avgCost - step
          const side = last >= sell - 1 ? `接近卖档 ${sell.toFixed(0)}` : last <= buy + 1 ? `接近买档 ${buy.toFixed(0)}` : '贴成本观望'
          return `${item.ticker} 现价 ${last.toFixed(2)}，${side}。`
        })
        .join(' '),
    })
  }

  return insights
}

function buildUsAllocation(book: MarketBook): AllocationRow[] {
  const targets = portfolioConfig.us.targets as UsTarget[]
  const value = book.marketValue || 0
  const known = new Set(targets.filter(item => item.ticker !== 'FLEX').map(item => item.ticker))
  const actualByTicker = new Map(book.open.map(item => [item.ticker, item.marketValue || 0]))
  const flexValue = book.open
    .filter(item => !known.has(item.ticker))
    .reduce((sum, item) => sum + (item.marketValue || 0), 0)

  return targets.map((target) => {
    const actualValue = target.ticker === 'FLEX' ? flexValue : (actualByTicker.get(target.ticker) || 0)
    return {
      key: target.ticker,
      label: target.ticker === 'FLEX' ? '机动' : target.ticker,
      targetPct: target.weight * 100,
      actualPct: value > 0 ? (actualValue / value) * 100 : 0,
      actualValue,
    }
  })
}

function buildComparison(a: MarketBook, us: MarketBook): ComparisonRow[] {
  return [
    { dimension: '策略', a: a.strategy, us: us.strategy },
    { dimension: '现持', a: holdingLabel(a), us: holdingLabel(us) },
    { dimension: '已实现', a: formatBookMoney(a.realized, a.currency), us: formatBookMoney(us.realized, us.currency) },
    { dimension: '浮盈亏', a: nullableMoney(a.unrealized, a.currency), us: nullableMoney(us.unrealized, us.currency) },
    { dimension: '止损', a: a.stopRule, us: us.stopRule },
    { dimension: '主要风险', a: a.insights[0]?.title || '—', us: us.insights[0]?.title || '—' },
  ]
}

function buildSummaryInsights(): Insight[] {
  return [
    {
      tone: 'neutral',
      title: '两市规则不要串用',
      body: 'A 股破 MA5 离场是纪律；美股指数浮亏几个点仍可能只是网格下一档。人民币与美元两本账分开看，不合并市值。',
    },
  ]
}

function holdingLabel(book: MarketBook): string {
  if (!book.open.length) {
    return '空仓'
  }
  return book.open.map(item => item.name).join('、')
}

function usRole(ticker: string): string | undefined {
  const target = (portfolioConfig.us.targets as UsTarget[]).find(item => item.ticker === ticker)
  return target?.role
}

function compareOpen(left: string, right: string, market: MarketCode): number {
  if (market !== 'US') {
    return left.localeCompare(right)
  }
  const order = (portfolioConfig.us.targets as UsTarget[]).map(item => item.ticker)
  const leftIndex = order.indexOf(left)
  const rightIndex = order.indexOf(right)
  const leftRank = leftIndex === -1 ? order.length : leftIndex
  const rightRank = rightIndex === -1 ? order.length : rightIndex
  if (leftRank !== rightRank) {
    return leftRank - rightRank
  }
  return left.localeCompare(right)
}

function sumNullable(values: Array<number | null>): number | null {
  if (values.some(value => value == null)) {
    return values.every(value => value == null) ? null : values.reduce<number>((sum, value) => sum + (value || 0), 0)
  }
  return values.reduce<number>((sum, value) => sum + (value || 0), 0)
}

function roundMoney(value: number, currency: CurrencyCode): number {
  const digits = currency === 'CNY' ? 2 : 4
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function roundQty(value: number): number {
  return Math.round(value * 1e6) / 1e6
}

function daysBetween(start: string, end: string): number {
  const from = Date.parse(`${start}T00:00:00Z`)
  const to = Date.parse(`${end}T00:00:00Z`)
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
    return 0
  }
  let days = 0
  for (let stamp = from + 86_400_000; stamp <= to; stamp += 86_400_000) {
    const weekday = new Date(stamp).getUTCDay()
    if (weekday !== 0 && weekday !== 6) {
      days += 1
    }
  }
  return days
}

function describeFragileWins(book: MarketBook, unevenLots: string | null): string {
  const wins = book.closed.filter(item => item.pnl > 0)
  const losses = book.closed.filter(item => item.pnl < 0)
  const grossProfit = wins.reduce((sum, item) => sum + item.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((sum, item) => sum + item.pnl, 0))
  const avgWinPct = wins.length
    ? wins.reduce((sum, item) => sum + item.pnlPct, 0) / wins.length
    : 0
  const profitFactorLabel = book.profitFactor == null ? '—' : book.profitFactor.toFixed(2)

  const parts = [
    `${wins.length} 笔盈利合计 ${formatProseMoney(grossProfit, book.currency)}（平均约 ${signedPct(avgWinPct)}），${losses.length} 笔亏损 ${formatProseMoney(-grossLoss, book.currency)}。胜率 ${pctLabel(book.winRate)}，盈亏比只有 ${profitFactorLabel}，系统期望值为负。`,
  ]

  const holdDays = book.closed.map(item => item.holdDays)
  const holdMin = Math.min(...holdDays)
  const holdMax = Math.max(...holdDays)
  const nearCost = wins.filter(item => item.pnlPct > 0 && item.pnlPct < 1.5)
  const exemplars = (nearCost.length ? nearCost : [...wins].sort((a, b) => a.pnlPct - b.pnlPct).slice(0, 2))
  const namedWins = exemplars
    .map(item => `${shortName(item.name)} ${signedPct(item.pnlPct)}`)
    .join('、')

  const worst = [...losses].sort((a, b) => a.pnl - b.pnl)[0]
  const style = setupLabel(worst?.buyNote)
  let holdSentence = holdMax <= 7
    ? `持仓天数基本是 ${holdMin}–${holdMax} 个交易日`
    : ''
  if (namedWins) {
    holdSentence = holdSentence
      ? `${holdSentence}，赢的票（${namedWins}）都在成本附近就走了`
      : `赢的票（${namedWins}）都在成本附近就走了`
  }
  if (worst) {
    const lossBit = losses.length === 1
      ? `唯一深亏来自${style ? `「${style}」失败的` : ''}${shortName(worst.name)}`
      : `最深一笔来自${style ? `「${style}」失败的` : ''}${shortName(worst.name)}（${formatProseMoney(worst.pnl, book.currency)}）`
    holdSentence = holdSentence ? `${holdSentence}；${lossBit}` : lossBit
  }
  if (holdSentence) {
    parts.push(`${holdSentence}。`)
  }

  if (unevenLots) {
    parts.push(`另外仓位按手数而不是按金额：${unevenLots}`)
  }

  return parts.join('')
}

function describeUnevenShareLots(book: MarketBook): string | null {
  const rows = [
    ...book.closed.map(item => ({ name: item.name, qty: item.qty, cost: item.qty * item.buyPrice })),
    ...book.open.map(item => ({ name: item.name, qty: item.qty, cost: item.costBasis })),
  ]
  const byQty = new Map<number, Array<{ name: string, qty: number, cost: number }>>()
  for (const row of rows) {
    const list = byQty.get(row.qty) || []
    if (!list.some(item => item.name === row.name)) {
      list.push(row)
    }
    byQty.set(row.qty, list)
  }

  let best: { qty: number, high: { name: string, cost: number }, low: { name: string, cost: number } } | null = null
  for (const [qty, list] of byQty) {
    if (list.length < 2) {
      continue
    }
    const high = list.reduce((left, right) => left.cost >= right.cost ? left : right)
    const low = list.reduce((left, right) => left.cost <= right.cost ? left : right)
    if (low.cost <= 0 || high.cost / low.cost < 2) {
      continue
    }
    if (!best || high.cost / low.cost > best.high.cost / best.low.cost) {
      best = { qty, high, low }
    }
  }
  if (!best) {
    return null
  }

  return `同样 ${best.qty} 股，${shortName(best.high.name)}成本 ${formatProseMoney(best.high.cost, book.currency, false)}，${joinName(shortName(best.low.name), '只有')} ${formatProseMoney(best.low.cost, book.currency, false)}，单票风险并不均匀。`
}

function setupLabel(note?: string): string | null {
  if (!note) {
    return null
  }
  if (/低吸/.test(note) && /(MA5|5日均线|5日)/.test(note)) {
    return 'MA5 低吸'
  }
  if (/回踩/.test(note) && /MA5/.test(note)) {
    return '回踩 MA5'
  }
  return null
}

function shortName(name: string): string {
  const trimmed = name.replace(/股份|集团|科技$/u, '')
  return trimmed || name
}

function joinName(name: string, next: string): string {
  return /[A-Za-z0-9]$/.test(name) ? `${name} ${next}` : `${name}${next}`
}

function signedPct(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(2)}%`
}

function formatProseMoney(value: number, currency: CurrencyCode, signed = true): string {
  const abs = Math.abs(value)
  const prefix = currency === 'CNY' ? '¥' : '$'
  const sign = signed ? (value > 0 ? '+' : value < 0 ? '−' : '') : ''
  if (currency === 'CNY' && Math.abs(abs - Math.round(abs)) < 1e-6) {
    return `${sign}${prefix}${Math.round(abs).toLocaleString('en-US')}`
  }
  return `${sign}${prefix}${abs.toFixed(2)}`
}

function latestDate(trades: RawTrade[]): string | null {
  return trades.reduce<string | null>((latest, trade) => {
    if (!latest || trade.date > latest) {
      return trade.date
    }
    return latest
  }, null)
}

function collectQuoteAsOf(a: MarketBook, us: MarketBook): string | null {
  const stamps = [...a.open, ...us.open]
    .map(item => item.quote?.asOf)
    .filter((value): value is string => Boolean(value))
  return stamps[0] || null
}

function pctLabel(value: number | null): string {
  if (value == null) {
    return '—'
  }
  return `${(value * 100).toFixed(0)}%`
}

function formatBookMoney(value: number, currency: CurrencyCode): string {
  const abs = Math.abs(value)
  const digits = currency === 'CNY' ? 2 : abs >= 1 ? 2 : 2
  const prefix = currency === 'CNY' ? '¥' : '$'
  const signed = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${signed}${prefix}${abs.toFixed(digits)}`
}

function nullableMoney(value: number | null, currency: CurrencyCode): string {
  if (value == null) {
    return '行情暂缺'
  }
  return formatBookMoney(value, currency)
}
