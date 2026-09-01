export const SITE_NAME = 'Zhen Invest'
export const SITE_NAME_EN = 'Zhen Invest'
export const SITE_TAGLINE = '跨境投资入口 · 港美股 / 加密 / 开户教程'
export const SITE_DESCRIPTION = '内地用户的港美股与跨境投资入口，涵盖开户教程、加密货币与跨境资源整理，让跨境投资更简单。'
export const SITE_DISCLAIMER = '本站内容仅用于信息整理与学习交流，不构成投资建议。'

export interface NavLink {
  label: string
  to: string
}

export const mainNav: NavLink[] = [
  { label: '首页', to: '/' },
  { label: '日报', to: '/reports' },
  { label: '复盘', to: '/reviews' },
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
  title: 'Zhen Invest｜内地用户的港美股与跨境投资入口，让跨境投资更简单',
  description: SITE_DESCRIPTION,
}
