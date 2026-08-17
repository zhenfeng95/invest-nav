export interface ReportListItem {
  slug: string
  title: string
  date: string | null
  path: string
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
  htmlUrl: string
  html: string
}
