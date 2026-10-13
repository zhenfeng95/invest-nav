import { getGitHubReportsConfig, getHomeMarketBriefs, GitHubReportsError } from '../../utils/github-reports'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)
  if (!config) {
    return {
      configured: false,
      source: null,
      items: [
        { market: 'US' as const, brief: null },
        { market: 'A' as const, brief: null },
      ],
    }
  }

  try {
    const payload = await getHomeMarketBriefs(config)
    setHeader(event, 'Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')
    return payload
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
      statusMessage: '读取首页市场日报失败。',
    })
  }
})
