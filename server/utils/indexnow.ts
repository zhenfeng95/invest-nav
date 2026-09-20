import { getTutorials } from '~/utils/tutorials'

/** 与 public/{key}.txt 保持一致；可通过 NUXT_INDEXNOW_KEY 覆盖。 */
export const DEFAULT_INDEXNOW_KEY = 'zheninvest-indexnow-8f3a2c1b'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

const staticPaths = [
  '/',
  '/tutorials',
  '/tutorials/articles',
  '/tutorials/videos',
  '/tutorials/infographics',
  '/tools',
  '/tools/calendar',
  '/tools/spatial',
  '/tools/compound-interest',
  '/tools/fx-estimate',
  '/tools/position-risk',
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
  '/reports',
  '/reviews/monthly',
  '/reviews/weekly',
  '/portfolio',
  '/market',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

export function getIndexNowKey(event?: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const key = String(config.indexnowKey || DEFAULT_INDEXNOW_KEY).trim()
  return key || DEFAULT_INDEXNOW_KEY
}

export function getSiteOrigin(event?: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  return String(config.public.siteUrl).replace(/\/$/, '')
}

export function toAbsoluteUrls(siteUrl: string, paths: string[]): string[] {
  const origin = siteUrl.replace(/\/$/, '')
  const seen = new Set<string>()
  const urls: string[] = []

  for (const path of paths) {
    const normalized = path.startsWith('http')
      ? path.replace(/\/$/, '') || path
      : `${origin}${path.startsWith('/') ? path : `/${path}`}`
    if (!seen.has(normalized)) {
      seen.add(normalized)
      urls.push(normalized)
    }
  }

  return urls
}

export function listIndexNowCandidatePaths(extraPaths: string[] = []): string[] {
  const tutorialPaths = getTutorials().map(item => `/tutorials/${item.slug}`)
  return [...staticPaths, ...tutorialPaths, ...extraPaths]
}

export interface IndexNowSubmitResult {
  ok: boolean
  submitted: number
  statusCode?: number
  skipped?: string
  error?: string
}

/**
 * 向 IndexNow 提交 URL；失败只记日志，不阻断业务请求。
 */
export async function submitIndexNowUrls(
  event: Parameters<typeof useRuntimeConfig>[0],
  pathsOrUrls: string[],
): Promise<IndexNowSubmitResult> {
  const siteUrl = getSiteOrigin(event)
  const host = new URL(siteUrl).host

  // 本地开发不提交，避免用 localhost 污染索引。
  if (host === 'localhost' || host.endsWith('.local') || siteUrl.includes('127.0.0.1')) {
    return { ok: false, submitted: 0, skipped: 'local-site-url' }
  }

  const key = getIndexNowKey(event)
  const urlList = toAbsoluteUrls(siteUrl, pathsOrUrls).slice(0, 10000)

  if (urlList.length === 0) {
    return { ok: false, submitted: 0, skipped: 'empty-url-list' }
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList,
      }),
    })

    // IndexNow: 200/202 成功；可能对重复提交返回其他 2xx。
    if (response.status >= 200 && response.status < 300) {
      return { ok: true, submitted: urlList.length, statusCode: response.status }
    }

    const body = await response.text().catch(() => '')
    console.warn(`[indexnow] submit failed status=${response.status} body=${body.slice(0, 200)}`)
    return {
      ok: false,
      submitted: 0,
      statusCode: response.status,
      error: body.slice(0, 200) || response.statusText,
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[indexnow] submit error: ${message}`)
    return { ok: false, submitted: 0, error: message }
  }
}

/** 不阻塞调用方；适合在内容列表接口里 fire-and-forget。同进程 30 分钟内去重。 */
const notifyCooldownMs = 30 * 60 * 1000
const lastNotifyAt = new Map<string, number>()

export function notifyIndexNow(event: Parameters<typeof useRuntimeConfig>[0], pathsOrUrls: string[]) {
  const fingerprint = pathsOrUrls.slice(0, 5).join('|')
  const now = Date.now()
  const last = lastNotifyAt.get(fingerprint) ?? 0
  if (now - last < notifyCooldownMs) {
    return
  }
  lastNotifyAt.set(fingerprint, now)
  void submitIndexNowUrls(event, pathsOrUrls)
}
