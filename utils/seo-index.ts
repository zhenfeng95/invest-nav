import { getTutorials } from '~/utils/tutorials'

/**
 * 方案 C：教程 + 信任页 + 首页可收录；导航 / 笔记 / 工具 / 投研等功能区 noindex。
 */
export const INDEXABLE_STATIC_PATHS: readonly string[] = [
  '/',
  '/tutorials',
  '/tutorials/articles',
  '/tutorials/videos',
  '/tutorials/infographics',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

/** 不对搜索引擎开放收录的路径前缀（页面仍可正常访问）。 */
export const NOINDEX_PATH_PREFIXES: readonly string[] = [
  '/nav',
  '/notes',
  '/tools',
  '/market',
  '/reports',
  '/reviews',
  '/portfolio',
]

export function normalizeSitePath(path: string): string {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1)
  }
  return withLeading
}

export function isPublicIndexablePath(path: string): boolean {
  const normalized = normalizeSitePath(path)

  for (const prefix of NOINDEX_PATH_PREFIXES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return false
    }
  }

  if (normalized === '/') {
    return true
  }

  if (INDEXABLE_STATIC_PATHS.includes(normalized)) {
    return true
  }

  if (normalized.startsWith('/tutorials/')) {
    const slug = normalized.slice('/tutorials/'.length).split('/')[0]
    return slug.length > 0
  }

  return false
}

/** sitemap.xml 与 IndexNow 共用：可收录 URL 列表（去重）。 */
export function listPublicIndexablePaths(extraPaths: string[] = []): string[] {
  const tutorialPaths = getTutorials().map(item => `/tutorials/${item.slug}`)
  const merged = [...INDEXABLE_STATIC_PATHS, ...tutorialPaths, ...extraPaths]
  const seen = new Set<string>()
  const out: string[] = []

  for (const path of merged) {
    const normalized = normalizeSitePath(path)
    if (!isPublicIndexablePath(normalized)) {
      continue
    }
    if (!seen.has(normalized)) {
      seen.add(normalized)
      out.push(normalized)
    }
  }

  return out
}
