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
