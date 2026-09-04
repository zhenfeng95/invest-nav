import type { H3Event } from 'h3'
import type { CalendarEvent, CalendarImpact, CalendarResponse } from '~/types/calendar'
import { getGitHubReportsConfig, getRepoFileText } from './github-reports'

const CALENDAR_REPO_PATH = 'data/public/economic-calendar.json'
const FILE_TTL_MS = 10 * 60 * 1000

interface AgentCalendarItem {
  pub_time?: string
  star?: number
  title?: string
  previous?: string | null
  consensus?: string | null
  actual?: string | null
  revised?: string | null
  affect_txt?: string | null
}

interface AgentCalendarFile {
  updated_at?: string
  timezone?: string
  source?: string
  coverage?: string
  count?: number
  events?: AgentCalendarItem[]
}

const COUNTRY_PREFIXES: Array<{ prefix: string, code: string, label: string }> = [
  { prefix: '中国香港', code: 'HK', label: '香港' },
  { prefix: '中国台湾', code: 'TW', label: '台湾' },
  { prefix: '澳大利亚', code: 'AU', label: '澳大利亚' },
  { prefix: '新西兰', code: 'NZ', label: '新西兰' },
  { prefix: '欧元区', code: 'EU', label: '欧元区' },
  { prefix: '加拿大', code: 'CA', label: '加拿大' },
  { prefix: '意大利', code: 'IT', label: '意大利' },
  { prefix: '西班牙', code: 'ES', label: '西班牙' },
  { prefix: '俄罗斯', code: 'RU', label: '俄罗斯' },
  { prefix: '墨西哥', code: 'MX', label: '墨西哥' },
  { prefix: '新加坡', code: 'SG', label: '新加坡' },
  { prefix: '土耳其', code: 'TR', label: '土耳其' },
  { prefix: '印度尼西亚', code: 'ID', label: '印尼' },
  { prefix: '南非', code: 'ZA', label: '南非' },
  { prefix: '巴西', code: 'BR', label: '巴西' },
  { prefix: '泰国', code: 'TH', label: '泰国' },
  { prefix: '美国', code: 'US', label: '美国' },
  { prefix: '日本', code: 'JP', label: '日本' },
  { prefix: '中国', code: 'CN', label: '中国' },
  { prefix: '英国', code: 'GB', label: '英国' },
  { prefix: '德国', code: 'DE', label: '德国' },
  { prefix: '韩国', code: 'KR', label: '韩国' },
  { prefix: '越南', code: 'VN', label: '越南' },
  { prefix: '瑞士', code: 'CH', label: '瑞士' },
  { prefix: '法国', code: 'FR', label: '法国' },
  { prefix: '印度', code: 'IN', label: '印度' },
]

function matchCountry(title: string): { code: string, label: string } {
  for (const item of COUNTRY_PREFIXES) {
    if (title.startsWith(item.prefix)) {
      return { code: item.code, label: item.label }
    }
  }
  return { code: 'XX', label: '其他' }
}

function normalizeImpact(star: number | undefined): CalendarImpact {
  if (typeof star !== 'number' || !Number.isFinite(star) || star <= 0) {
    return 'unknown'
  }
  if (star >= 3) {
    return 'high'
  }
  if (star === 2) {
    return 'medium'
  }
  return 'low'
}

function formatMetric(value: string | null | undefined) {
  if (value == null) {
    return null
  }
  const text = String(value).trim()
  return text || null
}

function parsePubTime(value: string): { date: string, time: string } | null {
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2})(?::\d{2})?)?/)
  if (!match) {
    return null
  }
  return {
    date: match[1],
    time: match[2] || '00:00',
  }
}

function toEvent(item: AgentCalendarItem, index: number): CalendarEvent | null {
  const title = item.title?.trim()
  const pubTime = item.pub_time?.trim()
  if (!title || !pubTime) {
    return null
  }

  const parsed = parsePubTime(pubTime)
  if (!parsed) {
    return null
  }

  const country = matchCountry(title)
  const star = typeof item.star === 'number' && Number.isFinite(item.star) ? item.star : null

  return {
    id: `${parsed.date}-${parsed.time}-${index}-${title}`,
    time: parsed.time,
    date: parsed.date,
    country: country.code,
    countryLabel: country.label,
    category: country.code,
    categoryLabel: country.label,
    event: title,
    impact: normalizeImpact(item.star),
    star,
    actual: formatMetric(item.actual),
    estimate: formatMetric(item.consensus),
    prev: formatMetric(item.previous),
    revised: formatMetric(item.revised),
    affect: formatMetric(item.affect_txt),
    unit: null,
  }
}

async function loadCalendarText(event: H3Event): Promise<string | null> {
  const config = getGitHubReportsConfig(event)
  let remoteError: unknown
  if (config) {
    try {
      const remote = await getRepoFileText(config, CALENDAR_REPO_PATH, FILE_TTL_MS)
      if (remote) {
        return remote
      }
    }
    catch (error) {
      remoteError = error
    }
  }

  const local = await loadFromLocal()
  if (local) {
    return local
  }
  if (remoteError) {
    throw remoteError
  }
  return null
}

async function loadFromLocal(): Promise<string | null> {
  try {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const filePath = path.join(process.cwd(), '..', 'invest-agent', CALENDAR_REPO_PATH)
    return await fs.readFile(filePath, 'utf8')
  }
  catch {
    return null
  }
}

export async function fetchEconomicCalendar(
  event: H3Event,
  range: { from?: string, to?: string } = {},
): Promise<CalendarResponse> {
  const config = getGitHubReportsConfig(event)
  const text = await loadCalendarText(event)

  if (!text) {
    return {
      configured: Boolean(config),
      source: null,
      from: range.from || '',
      to: range.to || '',
      updatedAt: new Date().toISOString(),
      timezone: 'Asia/Shanghai',
      events: [],
      message: config
        ? `投研 Agent 仓库中未找到 ${CALENDAR_REPO_PATH}。`
        : `未配置 GitHub 仓库，且本地未找到 ${CALENDAR_REPO_PATH}。`,
    }
  }

  let payload: AgentCalendarFile
  try {
    payload = JSON.parse(text) as AgentCalendarFile
  }
  catch {
    return {
      configured: true,
      source: null,
      from: range.from || '',
      to: range.to || '',
      updatedAt: new Date().toISOString(),
      timezone: 'Asia/Shanghai',
      events: [],
      message: '财经日历 JSON 无法解析。',
    }
  }

  const events = (payload.events || [])
    .map((item, index) => toEvent(item, index))
    .filter((item): item is CalendarEvent => Boolean(item))
    .filter((item) => {
      if (range.from && item.date < range.from) {
        return false
      }
      if (range.to && item.date > range.to) {
        return false
      }
      return true
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time) || a.event.localeCompare(b.event, 'zh-CN'))

  const dates = events.map(item => item.date)
  const from = range.from || dates.at(-1) || ''
  const to = range.to || dates[0] || from

  return {
    configured: true,
    source: 'jin10',
    from,
    to,
    updatedAt: payload.updated_at || new Date().toISOString(),
    timezone: payload.timezone || 'Asia/Shanghai',
    events,
    message: events.length
      ? undefined
      : '当前日期区间内没有事件。',
  }
}
