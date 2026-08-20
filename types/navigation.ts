export type NavigationIcon =
  | 'stocks'
  | 'crypto'
  | 'funds'
  | 'etf'
  | 'company'
  | 'options'
  | 'bank'
  | 'broker'
  | 'transfer'
  | 'deposit'

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
  description: string
  icon: NavigationIcon
  items: NavigationItem[]
}
