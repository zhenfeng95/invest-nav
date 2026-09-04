import { fetchEconomicCalendar } from '../../utils/economic-calendar'
import { GitHubReportsError } from '../../utils/github-reports'

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const from = isDateKey(query.from) ? query.from : undefined
  const to = isDateKey(query.to) ? query.to : undefined

  if (from && to && from > to) {
    throw createError({
      statusCode: 400,
      statusMessage: '开始日期不能晚于结束日期。',
    })
  }

  try {
    const result = await fetchEconomicCalendar(event, { from, to })
    setHeader(event, 'Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800')
    return result
  }
  catch (error) {
    if (error instanceof GitHubReportsError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      })
    }
    console.error('[calendar] failed to load economic calendar:', error)
    throw createError({
      statusCode: 502,
      statusMessage: '读取财经日历失败。',
    })
  }
})
