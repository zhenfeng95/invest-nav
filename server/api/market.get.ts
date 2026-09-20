import { fetchAshareSnapshot } from '../utils/ashare-snapshot'
import { GitHubReportsError } from '../utils/github-reports'

export default defineEventHandler(async (event) => {
  try {
    const result = await fetchAshareSnapshot(event)
    setHeader(
      event,
      'Cache-Control',
      result.items.length
        ? 'public, s-maxage=600, stale-while-revalidate=1800'
        : 'no-store',
    )
    return result
  }
  catch (error) {
    if (error instanceof GitHubReportsError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      })
    }
    console.error('[market] failed to load A-share snapshot:', error)
    throw createError({
      statusCode: 502,
      statusMessage: '读取市场评分失败。',
    })
  }
})
