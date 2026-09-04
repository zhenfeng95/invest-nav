import { getNavigationCategories } from '~/utils/navigation'
import { getTutorials, getTutorialTypeLabel } from '~/utils/tutorials'
import { getTools, getToolStatusLabel } from '~/utils/tools'
import { researchNavLinks } from '~/utils/site'

export type SearchResultGroup = 'page' | 'tutorial' | 'tool' | 'nav'

export interface SearchResult {
  id: string
  group: SearchResultGroup
  groupLabel: string
  title: string
  description: string
  /** 站内路径 */
  to?: string
  /** 站外链接 */
  href?: string
  meta?: string
}

interface IndexedItem extends SearchResult {
  haystack: string
}

const GROUP_LABEL: Record<SearchResultGroup, string> = {
  page: '页面',
  tutorial: '教程',
  tool: '工具',
  nav: '导航',
}

const GROUP_ORDER: SearchResultGroup[] = ['page', 'tutorial', 'tool', 'nav']

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function buildHaystack(...parts: Array<string | string[] | undefined>) {
  return parts
    .flatMap((part) => {
      if (!part) {
        return []
      }
      return Array.isArray(part) ? part : [part]
    })
    .join(' ')
    .toLowerCase()
}

function buildIndex(): IndexedItem[] {
  const pages: IndexedItem[] = [
    {
      id: 'page-home',
      group: 'page',
      groupLabel: GROUP_LABEL.page,
      title: '首页',
      description: '跨境投资入口总览',
      to: '/',
      haystack: buildHaystack('首页', 'home', '跨境投资'),
    },
    {
      id: 'page-tutorials',
      group: 'page',
      groupLabel: GROUP_LABEL.page,
      title: '教程',
      description: '开户、eSIM 与跨境相关教程列表',
      to: '/tutorials',
      haystack: buildHaystack('教程', '开户', 'articles'),
    },
    {
      id: 'page-tools',
      group: 'page',
      groupLabel: GROUP_LABEL.page,
      title: '工具',
      description: '持仓、计算器等站内工具',
      to: '/tools',
      haystack: buildHaystack('工具', 'tools'),
    },
    {
      id: 'page-nav',
      group: 'page',
      groupLabel: GROUP_LABEL.page,
      title: '导航',
      description: '港美股、加密、银行与券商资源导航',
      to: '/nav',
      haystack: buildHaystack('导航', 'nav', '资源'),
    },
    ...researchNavLinks.map(link => ({
      id: `page-${link.to}`,
      group: 'page' as const,
      groupLabel: GROUP_LABEL.page,
      title: link.label,
      description: '投研相关页面',
      to: link.to,
      haystack: buildHaystack(link.label, '投研', link.to),
    })),
  ]

  const tutorials: IndexedItem[] = getTutorials().map(item => ({
    id: `tutorial-${item.id}`,
    group: 'tutorial',
    groupLabel: GROUP_LABEL.tutorial,
    title: item.title,
    description: item.description,
    to: `/tutorials/${item.slug}`,
    meta: `${item.category} · ${getTutorialTypeLabel(item.type)}`,
    haystack: buildHaystack(item.title, item.description, item.category, item.tags, item.slug),
  }))

  const tools: IndexedItem[] = getTools().map(item => ({
    id: `tool-${item.id}`,
    group: 'tool',
    groupLabel: GROUP_LABEL.tool,
    title: item.name,
    description: item.description,
    to: item.route,
    meta: getToolStatusLabel(item.status),
    haystack: buildHaystack(item.name, item.description, item.id, item.status),
  }))

  const nav: IndexedItem[] = getNavigationCategories().flatMap(category =>
    category.items.map(item => ({
      id: `nav-${item.id}`,
      group: 'nav' as const,
      groupLabel: GROUP_LABEL.nav,
      title: item.name,
      description: item.description,
      to: item.guideUrl || `/nav/${category.slug}`,
      meta: category.name,
      haystack: buildHaystack(item.name, item.description, item.tags, category.name, category.slug),
    })),
  )

  return [...pages, ...tutorials, ...tools, ...nav]
}

let cachedIndex: IndexedItem[] | null = null

function getIndex() {
  if (!cachedIndex) {
    cachedIndex = buildIndex()
  }
  return cachedIndex
}

function scoreItem(item: IndexedItem, terms: string[]) {
  const title = item.title.toLowerCase()
  let score = 0

  for (const term of terms) {
    if (title === term) {
      score += 100
    }
    else if (title.startsWith(term)) {
      score += 60
    }
    else if (title.includes(term)) {
      score += 40
    }
    else if (item.haystack.includes(term)) {
      score += 15
    }
    else {
      return 0
    }
  }

  return score
}

export function searchSite(query: string, limit = 24): SearchResult[] {
  const normalized = normalize(query)
  if (!normalized) {
    return []
  }

  const terms = normalized.split(/\s+/).filter(Boolean)
  const ranked = getIndex()
    .map(item => ({ item, score: scoreItem(item, terms) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group)
    })
    .slice(0, limit)
    .map(({ item }) => {
      const { haystack: _haystack, ...result } = item
      return result
    })

  return ranked
}

export function groupSearchResults(results: SearchResult[]) {
  return GROUP_ORDER
    .map(group => ({
      group,
      label: GROUP_LABEL[group],
      items: results.filter(item => item.group === group),
    }))
    .filter(section => section.items.length > 0)
}
