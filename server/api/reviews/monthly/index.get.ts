import { getGitHubReportsConfig, GitHubReportsError, listReviews } from '../../../utils/github-reports'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)
  if (!config) {
    console.warn('[reviews/monthly] GitHub reports are not configured. Set NUXT_GITHUB_REPORTS_OWNER and NUXT_GITHUB_REPORTS_REPO.')
    return {
      configured: false,
      source: null,
      items: [],
    }
  }

  try {
    const items = await listReviews(config)
    setHeader(
      event,
      'Cache-Control',
      items.length
        ? 'public, s-maxage=600, stale-while-revalidate=3600'
        : 'no-store',
    )
    return {
      configured: true,
      source: `${config.owner}/${config.repo}`,
      items,
    }
  }
  catch (error) {
    if (error instanceof GitHubReportsError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      })
    }
    throw createError({
      statusCode: 502,
      statusMessage: '读取月度复盘失败。',
    })
  }
})
