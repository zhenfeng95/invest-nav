/** 仅以下路径对搜索引擎开放收录（sitemap / IndexNow / meta robots）。 */
export const INDEXABLE_PATHS: readonly string[] = [
  '/',
  '/tutorials/wise-account-guide',
  '/tutorials/bosco-account-guide',
]

export function normalizeSitePath(path: string): string {
  const withLeading = path.startsWith('/') ? path : `/${path}`
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1)
  }
  return withLeading
}

export function isPublicIndexablePath(path: string): boolean {
  return INDEXABLE_PATHS.includes(normalizeSitePath(path))
}

/** sitemap.xml 与 IndexNow 共用：可收录 URL 列表（去重）。 */
export function listPublicIndexablePaths(extraPaths: string[] = []): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const path of [...INDEXABLE_PATHS, ...extraPaths]) {
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
