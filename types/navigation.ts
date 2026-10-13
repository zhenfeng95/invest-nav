export type NavigationIcon =
  | 'stocks'
  | 'funds'
  | 'etf'
  | 'company'
  | 'options'
  | 'bank'
  | 'broker'
  | 'transfer'
  | 'deposit'
  | 'sim'
  | 'infra'

export interface NavigationItem {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  officialUrlConfirmed: boolean
  featured?: boolean
  /** 卡片标题旁状态徽标，如「开户活动」；活动结束删掉该字段即可 */
  statusBadge?: string
  updatedAt?: string
  guideUrl?: string
  guideLabel?: string
}

export interface NavigationCategory {
  id: string
  slug: string
  name: string
  /** 详情页标题；未设置时与 name 相同 */
  fullName?: string
  description: string
  icon: NavigationIcon
  items: NavigationItem[]
}
