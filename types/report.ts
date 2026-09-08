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

export function reportMarketLabel(market?: ReportMarket | null): string {
  if (market === 'A') {
    return 'A股'
  }
  if (market === 'US') {
    return '美股'
  }
  return ''
}
