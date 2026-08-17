import { getGitHubReportsConfig, GitHubReportsError, listReports } from '../../utils/github-reports'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)
  if (!config) {
    console.warn('[reports] GitHub reports are not configured. Set NUXT_GITHUB_REPORTS_OWNER and NUXT_GITHUB_REPORTS_REPO.')
    return {
      configured: false,
      source: null,
      items: [],
    }
  }

  try {
    const items = await listReports(config)
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
      statusMessage: '读取收盘日报失败。',
    })
  }
})
