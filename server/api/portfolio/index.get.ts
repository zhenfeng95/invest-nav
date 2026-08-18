import { getGitHubReportsConfig, GitHubReportsError } from '../../utils/github-reports'
import { buildPortfolioAnalysis } from '../../utils/portfolio'

export default defineEventHandler(async (event) => {
  const config = getGitHubReportsConfig(event)

  try {
    const analysis = await buildPortfolioAnalysis(config)
    setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return analysis
  }
  catch (error) {
    if (!config) {
      console.warn('[portfolio] GitHub trades are not configured, and local invest-agent trades were not found.')
      return {
        configured: false,
        source: null,
        tradesPath: null,
        snapshotAsOf: null,
        quotesAsOf: null,
        notes: null,
        disclaimer: '本页为个人实盘交易复盘，不构成投资建议。',
        a: null,
        us: null,
        usAllocation: [],
        comparison: [],
        summaryInsights: [],
      }
    }
    if (error instanceof GitHubReportsError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      })
    }
    throw createError({
      statusCode: 502,
      statusMessage: '读取持仓分账失败。',
    })
  }
})
