import type { H3Event } from 'h3'

/** 站内服务 API 根域名（日报等） */
export const DEFAULT_API_BASE_URL = 'https://api.zheninvest.com'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

/** 读取 `NUXT_API_BASE_URL` / runtimeConfig.apiBaseUrl */
export function getApiBaseUrl(event?: H3Event): string {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const raw = String(config.apiBaseUrl || DEFAULT_API_BASE_URL).trim()
  return trimTrailingSlash(raw || DEFAULT_API_BASE_URL)
}

/**
 * 日报 API 前缀，默认 `${apiBaseUrl}/v1/reports`。
 * 可用 `NUXT_REPORTS_API_BASE` 整段覆盖。
 */
export function getReportsApiBase(event?: H3Event): string {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const override = String(config.reportsApiBase || '').trim()
  if (override) {
    return trimTrailingSlash(override)
  }
  return `${getApiBaseUrl(event)}/v1/reports`
}

/** 首页市场日报摘要 URL */
export function getReportsHomeUrl(event?: H3Event): string {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const explicit = String(config.reportsHomeUrl || '').trim()
  if (explicit) {
    return explicit
  }
  return `${getReportsApiBase(event)}/home`
}
