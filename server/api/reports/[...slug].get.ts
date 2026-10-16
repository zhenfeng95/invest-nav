import type { H3Event } from 'h3'
import { isError } from 'h3'
import type { ReportDetail } from '~/types/report'
import { getReportsApiBase } from '../../utils/zhen-api'

export default defineEventHandler(async (event) => {
  const slug = readSlug(event)
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: '日报地址无效。',
    })
  }

  const base = getReportsApiBase(event)
  const url = `${base}/${slug.split('/').map(encodeURIComponent).join('/')}`

  try {
    const report = await $fetch<ReportDetail>(url, {
      timeout: 20_000,
    })

    if (!report?.slug || !report.html) {
      throw createError({
        statusCode: 404,
        statusMessage: '日报不存在',
      })
    }

    setHeader(event, 'Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')
    return {
      slug: report.slug,
      title: report.title || report.slug,
      date: report.date ?? null,
      path: report.path || report.slug,
      market: report.market ?? null,
      htmlUrl: report.htmlUrl || '',
      html: report.html,
    } satisfies ReportDetail
  }
  catch (error) {
    if (isError(error)) {
      throw error
    }

    const statusCode = Number((error as { statusCode?: number; status?: number })?.statusCode
      || (error as { status?: number })?.status
      || 0)

    if (statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: '日报不存在',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: '读取收盘日报失败。',
    })
  }
})

function readSlug(event: H3Event): string {
  const raw = getRouterParam(event, 'slug') || ''
  const value = Array.isArray(raw) ? raw.join('/') : String(raw)
  try {
    return decodeURIComponent(value).replace(/^\/+|\/+$/g, '')
  }
  catch {
    return value.replace(/^\/+|\/+$/g, '')
  }
}
