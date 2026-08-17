import type { H3Event } from 'h3'
import { isError } from 'h3'
import { getGitHubReportsConfig, getReport, GitHubReportsError } from '../../utils/github-reports'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)
  if (!config) {
    throw createError({
      statusCode: 503,
      statusMessage: '收盘日报尚未配置。',
    })
  }

  const slug = readSlug(event)
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: '日报地址无效。',
    })
  }

  try {
    const report = await getReport(config, slug)
    if (!report) {
      throw createError({
        statusCode: 404,
        statusMessage: '日报不存在',
      })
    }

    setHeader(event, 'Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400')
    return report
  }
  catch (error) {
    if (isError(error)) {
      throw error
    }
    if (error instanceof GitHubReportsError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
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
