import { getTutorials } from '~/utils/tutorials'

/**
 * 全站统一 SEO：教程列表/分区 + 信任页进 sitemap / IndexNow；
 * 导航、笔记、投研、工具等对用户开放但 noindex（见 nuxt.config routeRules）。
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

/** 教程详情页 slug：站内可访问但不收录。 */
export const NOINDEX_TUTORIAL_SLUGS: readonly string[] = [
  'mainland-hk-us-stock-tax-guide',
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

  if (INDEXABLE_STATIC_PATHS.includes(normalized)) {
    return true
  }

  if (normalized.startsWith('/tutorials/')) {
    const slug = normalized.slice('/tutorials/'.length).split('/')[0]
    if (NOINDEX_TUTORIAL_SLUGS.includes(slug)) {
      return false
    }
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
