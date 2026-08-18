export type MarketCode = 'A' | 'US'
export type CurrencyCode = 'CNY' | 'USD'
export type InsightTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

export interface Quote {
  last: number
  prevClose?: number
  changePct?: number
  high?: number
  low?: number
  open?: number
  asOf?: string
  ma5?: number
  source: string
}

export interface OpenPosition {
  market: MarketCode
  ticker: string
  name: string
  qty: number
  avgCost: number
  currency: CurrencyCode
  costBasis: number
  marketValue: number | null
  unrealized: number | null
  unrealizedPct: number | null
  weightPct: number | null
  quote: Quote | null
  vsMa5Pct: number | null
  costVsMa5Pct: number | null
  openedAt?: string
  role?: string
  note?: string
}

export interface ClosedTrade {
  market: MarketCode
  ticker: string
  name: string
  qty: number
  buyDate: string
  sellDate: string
  buyPrice: number
  sellPrice: number
  pnl: number
  pnlPct: number
  currency: CurrencyCode
  holdDays: number
  buyNote?: string
}

export interface Insight {
  tone: InsightTone
  title: string
  body: string
}

export interface EquityPoint {
  date: string
  realized: number
  unrealized: number
  total: number
  marketValue: number
  costBasis: number
}

export interface MarketBook {
  market: MarketCode
  label: string
  strategy: string
  stopRule: string
  currency: CurrencyCode
  open: OpenPosition[]
  closed: ClosedTrade[]
  realized: number
  unrealized: number | null
  marketValue: number | null
  costBasis: number
  winCount: number
  lossCount: number
  winRate: number | null
  profitFactor: number | null
  equityCurve: EquityPoint[]
  insights: Insight[]
}

export interface AllocationRow {
  key: string
  label: string
  targetPct: number
  actualPct: number
  actualValue: number
}

export interface ComparisonRow {
  dimension: string
  a: string
  us: string
}

export interface PortfolioAnalysis {
  configured: boolean
  source: string | null
  tradesPath: string | null
  snapshotAsOf: string | null
  quotesAsOf: string | null
  notes: string | null
  disclaimer: string
  a: MarketBook | null
  us: MarketBook | null
  usAllocation: AllocationRow[]
  comparison: ComparisonRow[]
  summaryInsights: Insight[]
}
