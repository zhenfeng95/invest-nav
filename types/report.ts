export type ReportMarket = 'A' | 'US'

export interface ReportListItem {
  slug: string
  title: string
  date: string | null
  path: string
  /** 日复盘市场：从文件名 ashare-close / us-close 解析 */
  market?: ReportMarket | null
}

export interface ReportListResponse {
  configured: boolean
  source: string | null
  items: ReportListItem[]
}

export interface ReportDetail {
  slug: string
  title: string
  date: string | null
  path: string
  market?: ReportMarket | null
  htmlUrl: string
  html: string
}

/** 首页市场日报卡片用的指数摘要 */
export interface ReportIndexQuote {
  name: string
  value: string
  changePct: number | null
  changeText: string
}

export interface ReportBrief {
  slug: string
  title: string
  date: string | null
  market: ReportMarket
  /** 一句话 / 市场状态，作卡片主标题 */
  headline: string
  /** §0 摘要摘录 */
  summary: string
  indices: ReportIndexQuote[]
}

export interface HomeMarketBriefItem {
  market: ReportMarket
  brief: ReportBrief | null
}

export interface HomeMarketBriefsResponse {
  configured: boolean
  source: string | null
  items: HomeMarketBriefItem[]
}

export function reportMarketLabel(market?: ReportMarket | null): string {
  if (market === 'A') {
    return 'A股'
  }
  if (market === 'US') {
    return '美股'
  }
  return ''
}
