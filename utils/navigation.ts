import navigationData from '~/data/navigation.json'
import type { NavigationCategory, NavigationItem } from '~/types/navigation'

const categories = navigationData.categories as NavigationCategory[]

/** 导航索引页分组：跨境账户与资金 / 数字基建（投资品种分组暂不展示，数据仍保留） */
export interface NavigationGroup {
  id: string
  title: string
  description: string
  slugs: string[]
}

/** 投资品种二级分类：不在导航 Tab / 首页与页脚站点地图中展示，/nav/:slug 仍可访问 */
export const investmentVarietyNavSlugs: readonly string[] = [
  'stocks',
  'funds',
  'etf',
  'stocks-cn',
  'options',
]

export function isInvestmentVarietyNavSlug(slug: string): boolean {
  return investmentVarietyNavSlugs.includes(slug)
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'cross-border',
    title: '跨境账户与资金',
    description: '境外银行卡、手机卡、券商、汇款与出入金路径。',
    slugs: ['overseas-banks', 'overseas-sim', 'overseas-brokers', 'fund-transfer'],
  },
  {
    id: 'digital-infra',
    title: '数字基建',
    description: '域名、Workspace、Cloudflare、DNSHE、海外邮箱等跨境数字基础设施。',
    slugs: ['digital-infra'],
  },
]

const shortDescriptions: Record<string, string> = {
  stocks: '美股交易所与行情、披露入口',
  funds: '基金研究与 QDII 相关入口',
  etf: '主流 ETF 发行方与工具入口',
  'stocks-cn': '个股研究与中概相关入口',
  options: '期权交易所与投资者教育入口',
  'overseas-banks': '香港及境外银行开户相关入口',
  'overseas-sim': '境外 SIM / eSIM 与接码入口',
  'overseas-brokers': '港美股券商开户与交易入口',
  'fund-transfer': '出入金、跨境汇款、多币种账户与港卡内地使用',
  'digital-infra': '域名、Workspace、Cloudflare、DNSHE 与邮箱',
}

/** 导航分类 slug → 站内教程 category 字段 */
const tutorialCategoriesByNavSlug: Record<string, string[]> = {
  stocks: ['美股'],
  funds: ['基金'],
  etf: ['ETF'],
  'stocks-cn': [],
  options: ['期权'],
  'overseas-banks': ['香港银行'],
  'overseas-sim': ['境外手机卡'],
  'overseas-brokers': ['美股券商'],
  'fund-transfer': ['资金流转', '出入金'],
  'digital-infra': ['数字基建'],
}

export function getNavigationCategories(): NavigationCategory[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items],
  }))
}

/** 在导航索引、首页与页脚等站点地图中列出的分类 */
export function getListedNavigationCategories(): NavigationCategory[] {
  return getNavigationCategories().filter(
    category => !isInvestmentVarietyNavSlug(category.slug),
  )
}

export function getNavigationCategory(slug: string): NavigationCategory | undefined {
  const category = categories.find(item => item.slug === slug)
  if (!category) {
    return undefined
  }

  return {
    ...category,
    items: [...category.items],
  }
}

export function getNavigationShortDescription(slug: string): string {
  return shortDescriptions[slug]
    ?? getNavigationCategory(slug)?.description
    ?? ''
}

export function getTutorialCategoriesForNavSlug(slug: string): string[] {
  return tutorialCategoriesByNavSlug[slug] ?? []
}

export function getGroupedNavigationCategories(): Array<
  NavigationGroup & { categories: NavigationCategory[] }
> {
  const bySlug = new Map(getNavigationCategories().map(item => [item.slug, item]))

  return navigationGroups.map(group => ({
    ...group,
    categories: group.slugs
      .map(slug => bySlug.get(slug))
      .filter((item): item is NavigationCategory => Boolean(item)),
  }))
}

export function getFeaturedNavigationItems(limit = 4): Array<NavigationItem & { categoryName: string, categorySlug: string }> {
  return categories
    .flatMap(category => category.items
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        categoryName: category.name,
        categorySlug: category.slug,
      })))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, limit)
}

export function getNavigationItemCount(slug: string): number {
  return getNavigationCategory(slug)?.items.length ?? 0
}

export function getNavigationGroupIdForSlug(slug: string): string | undefined {
  return navigationGroups.find(group => group.slugs.includes(slug))?.id
}

export function getNavigationPath(slug?: string): string {
  if (!slug) {
    return '/nav'
  }
  return `/nav/${slug}`
}

/** 港美股券商按资金背景拆分：港资 / 美资。新加坡等其他主体仍只出现在总列表。 */
export type BrokerCapital = 'hk' | 'us'

export interface BrokerCapitalGroup {
  id: BrokerCapital
  label: string
  description: string
  /** overseas-brokers 分类下的资源 id，顺序即展示顺序 */
  itemIds: readonly string[]
  /** 与该组直接相关的站内教程 slug */
  tutorialSlugs: readonly string[]
}

export const brokerCapitalGroups: readonly BrokerCapitalGroup[] = [
  {
    id: 'hk',
    label: '港资券商',
    description: '香港证监会持牌的港资券商，覆盖港股、美股、期货期权与港股打新等常见入口。',
    itemIds: ['chief', 'bosco'],
    tutorialSlugs: ['bosco-account-guide'],
  },
  {
    id: 'us',
    label: '美资券商',
    description: '美国经纪商，适合长期持有美股与 ETF，开户与入金以各家国际账户说明为准。',
    itemIds: ['schwab', 'firstrade'],
    tutorialSlugs: ['schwab-account-guide', 'firstrade-account-guide'],
  },
]

export function getBrokerCapitalGroup(id: string): BrokerCapitalGroup | undefined {
  return brokerCapitalGroups.find(group => group.id === id)
}

export function getBrokerCapitalPath(id: BrokerCapital): string {
  return `/nav/overseas-brokers/${id}`
}

/** 教程详情页的 category → 头部菜单对应路径（教程 URL 不变，仅用于高亮） */
const headerNavPathByTutorialCategory: Record<string, string> = {
  美股券商: getNavigationPath('overseas-brokers'),
  香港银行: getNavigationPath('overseas-banks'),
  境外手机卡: getNavigationPath('overseas-sim'),
  资金流转: getNavigationPath('fund-transfer'),
  出入金: getNavigationPath('fund-transfer'),
  数字基建: getNavigationPath('digital-infra'),
}

const tutorialIndexSlugs = new Set(['articles', 'videos', 'infographics'])

/**
 * 将当前路由映射为头部菜单应高亮的路径。
 * 教程详情仍走 /tutorials/:slug，不改路由，只把高亮归到港美股券商 / 资金流转等。
 */
export function getHeaderNavContextPath(
  routePath: string,
  tutorialCategory?: string,
): string | undefined {
  const match = routePath.match(/^\/tutorials\/([^/]+)$/)
  if (!match) {
    return undefined
  }

  const slug = match[1]
  if (tutorialIndexSlugs.has(slug)) {
    return undefined
  }

  const capital = brokerCapitalGroups.find(group => group.tutorialSlugs.includes(slug))
  if (capital) {
    return getBrokerCapitalPath(capital.id)
  }

  if (tutorialCategory) {
    return headerNavPathByTutorialCategory[tutorialCategory]
  }

  return undefined
}

export function getBrokerCapitalItems(group: BrokerCapitalGroup): NavigationItem[] {
  const category = getNavigationCategory('overseas-brokers')
  if (!category) {
    return []
  }

  const byId = new Map(category.items.map(item => [item.id, item]))
  return group.itemIds
    .map(id => byId.get(id))
    .filter((item): item is NavigationItem => Boolean(item))
}

export function getNavigationGroupPath(groupId: string): string {
  return `/nav?group=${groupId}`
}

export function sortNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return [...items].sort((a, b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDiff !== 0) {
      return featuredDiff
    }
    return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')
  })
}
