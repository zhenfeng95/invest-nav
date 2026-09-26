import { getTutorials } from '~/utils/tutorials'

/**
 * 全站统一 SEO：仅教程 + 导航 + 信任页进 sitemap / IndexNow；
 * 笔记、投研、工具、持仓复盘等对用户开放但 noindex（见 nuxt.config routeRules）。
 */
export const INDEXABLE_STATIC_PATHS: readonly string[] = [
  '/',
  '/tutorials',
  '/tutorials/articles',
  '/tutorials/videos',
  '/tutorials/infographics',
  '/nav',
  '/nav/stocks',
  '/nav/funds',
  '/nav/etf',
  '/nav/stocks-cn',
  '/nav/options',
  '/nav/overseas-banks',
  '/nav/overseas-sim',
  '/nav/overseas-brokers',
  '/nav/fund-transfer',
  '/nav/digital-infra',
  '/nav/deposit-withdraw',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

/** 不对搜索引擎开放收录的路径前缀（页面仍可正常访问）。 */
export const NOINDEX_PATH_PREFIXES: readonly string[] = [
  '/notes',
  '/tools',
  '/market',
  '/reports',
  '/reviews',
  '/portfolio',
]

export function isPublicIndexablePath(path: string): boolean {
  const normalized = path.startsWith('/') ? path : `/${path}`

  for (const prefix of NOINDEX_PATH_PREFIXES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return false
    }
  }

  if (normalized === '/') {
    return true
  }

  if (normalized.startsWith('/tutorials')) {
    return true
  }

  if (normalized.startsWith('/nav')) {
    return true
  }

  return INDEXABLE_STATIC_PATHS.includes(normalized)
}

/** sitemap.xml 与 IndexNow 共用：可收录 URL 列表（去重）。 */
export function listPublicIndexablePaths(extraPaths: string[] = []): string[] {
  const tutorialPaths = getTutorials().map(item => `/tutorials/${item.slug}`)
  const merged = [...INDEXABLE_STATIC_PATHS, ...tutorialPaths, ...extraPaths]
  const seen = new Set<string>()
  const out: string[] = []

  for (const path of merged) {
    if (!isPublicIndexablePath(path)) {
      continue
    }
    if (!seen.has(path)) {
      seen.add(path)
      out.push(path)
    }
  }

  return out
}
