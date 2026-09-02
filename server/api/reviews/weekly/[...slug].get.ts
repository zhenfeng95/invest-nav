import type { H3Event } from 'h3'
import { isError } from 'h3'
import { getGitHubReportsConfig, getWeeklyReview, GitHubReportsError } from '../../../utils/github-reports'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)
  if (!config) {
    throw createError({
      statusCode: 503,
      statusMessage: '每周复盘尚未配置。',
    })
  }

  const slug = readSlug(event)
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: '复盘地址无效。',
    })
  }

  try {
    const review = await getWeeklyReview(config, slug)
    if (!review) {
      throw createError({
        statusCode: 404,
        statusMessage: '复盘不存在',
      })
    }

    setHeader(event, 'Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400')
    return review
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
      statusMessage: '读取每周复盘失败。',
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
