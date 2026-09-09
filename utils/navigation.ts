import navigationData from '~/data/navigation.json'
import type { NavigationCategory, NavigationItem } from '~/types/navigation'

const categories = navigationData.categories as NavigationCategory[]

/** 导航索引页分组：投资品种 / 跨境账户与资金 / 数字基建 */
export interface NavigationGroup {
  id: string
  title: string
  description: string
  slugs: string[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'markets',
    title: '投资品种',
    description: '美股、加密货币、基金、ETF、个股与期权相关公开入口。',
    slugs: ['stocks', 'crypto', 'funds', 'etf', 'stocks-cn', 'options'],
  },
  {
    id: 'cross-border',
    title: '跨境账户与资金',
    description: '境外银行卡、手机卡、券商、资金流转与出入金路径。',
    slugs: ['overseas-banks', 'overseas-sim', 'overseas-brokers', 'fund-transfer', 'deposit-withdraw'],
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
  crypto: '交易所、钱包与安全相关入口',
  funds: '基金研究与 QDII 相关入口',
  etf: '主流 ETF 发行方与工具入口',
  'stocks-cn': '个股研究与中概相关入口',
  options: '期权交易所与投资者教育入口',
  'overseas-banks': '香港及境外银行开户相关入口',
  'overseas-sim': '境外 SIM / eSIM 与接码入口',
  'overseas-brokers': '港美股券商开户与交易入口',
  'fund-transfer': '跨境汇款与多币种账户入口',
  'deposit-withdraw': '券商入金、出金与核对入口',
  'digital-infra': '域名、Workspace、Cloudflare、DNSHE 与邮箱',
}

/** 导航分类 slug → 站内教程 category 字段 */
const tutorialCategoriesByNavSlug: Record<string, string[]> = {
  stocks: ['美股'],
  crypto: ['加密货币'],
  funds: [],
  etf: ['ETF'],
  'stocks-cn': [],
  options: ['期权'],
  'overseas-banks': ['香港银行'],
  'overseas-sim': ['境外手机卡'],
  'overseas-brokers': ['美股券商'],
  'fund-transfer': ['资金流转'],
  'deposit-withdraw': ['出入金'],
  'digital-infra': ['数字基建'],
}

export function getNavigationCategories(): NavigationCategory[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items],
  }))
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
