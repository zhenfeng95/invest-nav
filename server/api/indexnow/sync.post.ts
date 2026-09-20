import {
  buildIndexNowPayload,
  INDEXNOW_ENDPOINT,
  listIndexNowCandidatePaths,
  submitIndexNowUrls,
} from '../../utils/indexnow'

/**
 * 准备 / 提交 IndexNow URL 列表。
 * 可选鉴权：设置 NUXT_INDEXNOW_SYNC_SECRET 后，请求头需带 x-indexnow-secret。
 *
 * POST /api/indexnow/sync
 * body?: { paths?: string[], includeContent?: boolean, dryRun?: boolean }
 *
 * 说明：从 Cloudflare Worker 代提交经常 429。推荐 dryRun 取 payload 后在本机提交。
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

  const body = await readBody<{
    paths?: string[]
    includeContent?: boolean
    dryRun?: boolean
  }>(event).catch(() => ({}))

  const includeContent = body?.includeContent !== false
  const dryRun = body?.dryRun === true || getQuery(event).dryRun === '1'
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

  const payload = buildIndexNowPayload(event, paths)
  setHeader(event, 'Cache-Control', 'no-store')

  if (!payload) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No URLs to submit',
    })
  }

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      submitted: 0,
      pathCount: paths.length,
      endpoint: INDEXNOW_ENDPOINT,
      payload,
      hint: `在本机执行：curl -X POST '${INDEXNOW_ENDPOINT}' -H 'Content-Type: application/json; charset=utf-8' -d @payload.json`,
    }
  }

  const result = await submitIndexNowUrls(event, paths)
  return {
    ...result,
    dryRun: false,
    host: payload.host,
    pathCount: paths.length,
    endpoint: INDEXNOW_ENDPOINT,
  }
})
