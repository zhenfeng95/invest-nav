export const SITE_NAME = '投资导航'
export const SITE_NAME_EN = 'Investment Navigation'
export const SITE_TAGLINE = '美股、加密货币、跨境出海一站式投资导航'
export const SITE_DESCRIPTION = '提供美股、加密货币、基金、ETF、香港银行、美股券商、投资工具和投资教程的一站式导航。'
export const SITE_DISCLAIMER = '本站内容仅用于信息整理与学习交流，不构成投资建议。'

export interface NavLink {
  label: string
  to: string
}

export const mainNav: NavLink[] = [
  { label: '首页', to: '/' },
  { label: '日报', to: '/reports' },
  { label: '持仓', to: '/portfolio' },
  { label: '教程', to: '/tutorials' },
  { label: '工具', to: '/tools' },
  { label: '导航', to: '/nav' },
]

export const footerAboutLinks: NavLink[] = [
  { label: '关于我们', to: '/about' },
  { label: '免责声明', to: '/disclaimer' },
  { label: '隐私政策', to: '/privacy' },
  { label: '联系我们', to: '/contact' },
]

export const footerCategoryLinks: NavLink[] = [
  { label: '美股', to: '/nav/stocks' },
  { label: '加密货币', to: '/nav/crypto' },
  { label: '基金', to: '/nav/funds' },
  { label: 'ETF', to: '/nav/etf' },
  { label: '境外银行卡', to: '/nav/overseas-banks' },
  { label: '美股券商', to: '/nav/overseas-brokers' },
]

export const homeSeo = {
  title: '投资导航｜美股、加密货币、跨境出海一站式导航',
  description: SITE_DESCRIPTION,
}
