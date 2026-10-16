import type { HomeMarketBriefsResponse, ReportBrief } from '~/types/report'
import { getReportsHomeUrl } from '../../utils/zhen-api'

/** 新接口偶发把状态码写进 headline；卡片主标题优先用有效文案 */
function normalizeBrief(brief: ReportBrief | null): ReportBrief | null {
  if (!brief) {
    return null
  }

  const rawHeadline = brief.headline?.trim() || ''
  const looksLikeStatus = !rawHeadline || /^(ok|success|done|true|null)$/i.test(rawHeadline)
  const headline = looksLikeStatus
    ? (brief.title?.trim() || rawHeadline || '美股收盘日报')
    : rawHeadline

  return {
    ...brief,
    headline,
    summary: brief.summary?.trim() || '',
    indices: Array.isArray(brief.indices) ? brief.indices : [],
  }
}

export default defineEventHandler(async (event) => {
  const url = getReportsHomeUrl(event)

  try {
    const payload = await $fetch<HomeMarketBriefsResponse>(url, {
      timeout: 12_000,
    })

    const items = Array.isArray(payload?.items)
      ? payload.items.map(item => ({
          market: item.market,
          brief: normalizeBrief(item.brief ?? null),
        }))
      : [
          { market: 'US' as const, brief: null },
          { market: 'A' as const, brief: null },
        ]

    setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800')

    return {
      configured: Boolean(payload?.configured),
      source: payload?.source ?? 'api',
      items,
    } satisfies HomeMarketBriefsResponse
  }
  catch {
    throw createError({
      statusCode: 502,
      statusMessage: '读取首页市场日报失败。',
    })
  }
})
