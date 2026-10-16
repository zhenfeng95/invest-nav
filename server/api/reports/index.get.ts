import type { ReportListItem, ReportListResponse, ReportMarket } from '~/types/report'
import { getReportsApiBase } from '../../utils/zhen-api'

function parseMarket(raw: unknown): ReportMarket | null {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value === 'A' || value === 'US') {
    return value
  }
  return null
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const market = parseMarket(query.market)
  const base = getReportsApiBase(event)
  const url = market ? `${base}?market=${encodeURIComponent(market)}` : base

  try {
    const payload = await $fetch<ReportListResponse>(url, {
      timeout: 12_000,
    })

    const items: ReportListItem[] = Array.isArray(payload?.items)
      ? payload.items.map(item => ({
          slug: item.slug,
          title: item.title || item.slug,
          date: item.date ?? null,
          path: item.path || item.slug,
          market: item.market ?? null,
        }))
      : []

    setHeader(
      event,
      'Cache-Control',
      items.length
        ? 'public, s-maxage=300, stale-while-revalidate=1800'
        : 'no-store',
    )

    return {
      configured: Boolean(payload?.configured ?? true),
      source: payload?.source ?? 'api',
      items,
    } satisfies ReportListResponse
  }
  catch {
    throw createError({
      statusCode: 502,
      statusMessage: '读取收盘日报失败。',
    })
  }
})
