import {
  listIndexNowCandidatePaths,
  submitIndexNowUrls,
} from '../utils/indexnow'

/**
 * 手动/部署后触发 IndexNow 批量提交。
 * 可选鉴权：设置 NUXT_INDEXNOW_SYNC_SECRET 后，请求头需带 x-indexnow-secret。
 *
 * POST /api/indexnow/sync
 * body?: { paths?: string[], includeContent?: boolean }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const expectedSecret = String(config.indexnowSyncSecret || '').trim()
  if (expectedSecret) {
    const provided = getHeader(event, 'x-indexnow-secret') || ''
    if (provided !== expectedSecret) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  }

  const body = await readBody<{ paths?: string[], includeContent?: boolean }>(event).catch(() => ({}))
  const includeContent = body?.includeContent !== false
  const extra = Array.isArray(body?.paths) ? body.paths.filter(item => typeof item === 'string') : []
  const paths = includeContent
    ? listIndexNowCandidatePaths(extra)
    : [...extra]

  if (paths.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No URLs to submit',
    })
  }

  const result = await submitIndexNowUrls(event, paths)
  setHeader(event, 'Cache-Control', 'no-store')
  return {
    ...result,
    host: new URL(String(config.public.siteUrl)).host,
    pathCount: paths.length,
  }
})
