import type { ReportIndexQuote, ReportMarket } from '~/types/report'

const US_INDEX_ORDER = ['S&P 500', 'Nasdaq Composite', 'Dow Jones'] as const
const A_INDEX_ORDER = ['上证指数', '深证成指', '创业板指'] as const

const INDEX_DISPLAY: Record<string, string> = {
  'S&P 500': '标普500',
  'Nasdaq Composite': '纳斯达克综合指数',
  'Dow Jones': '道琼斯工业平均指数',
  上证指数: '上证指数',
  深证成指: '深证成指',
  创业板指: '创业板指',
}

export function extractReportBriefFields(markdown: string, market: ReportMarket): {
  headline: string
  summary: string
  indices: ReportIndexQuote[]
} {
  const { content } = splitSimpleFrontmatter(markdown)
  const section0 = extractNumberedSection(content, 0)
  const paragraphs = section0
    .split(/\n\s*\n/)
    .map(stripInlineMarkdown)
    .map(text => text.replace(/^一句话总结[：:]\s*/, ''))
    .filter(text => text.length >= 12)
    .filter(text => !/^(进攻四条件|防守四条件|账户重心)/.test(text))

  const status = matchMarketStatus(section0)
  const lead = (paragraphs[0] || '').replace(/^今日\s*/, '')
  const headline = clipText(status || firstSentence(lead) || lead, 56)
  const summary = clipText(paragraphs[0] || lead, 128)
  const indices = extractIndexQuotes(content, market)

  return { headline, summary, indices }
}

function splitSimpleFrontmatter(source: string): { content: string } {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  return { content: match ? source.slice(match[0].length) : source }
}

function extractNumberedSection(content: string, number: number): string {
  const pattern = new RegExp(
    `##\\s*${number}\\.[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s*\\d|\\n---\\s*\\n|$)`,
  )
  return content.match(pattern)?.[1]?.trim() || ''
}

function matchMarketStatus(section0: string): string {
  const match = section0.match(/\*\*今日市场状态[：:]\s*([^*]+)\*\*/)
  return match ? stripInlineMarkdown(match[1]) : ''
}

function firstSentence(text: string): string {
  const match = text.match(/^(.+?[。！？；]|.+?[，,、].+?[，,、].+?)(?=[，,、。！？；]|$)/)
  if (match && match[1].length >= 12) {
    return match[1]
  }
  return text
}

function clipText(text: string, max: number): string {
  const value = text.trim()
  if (value.length <= max) {
    return value
  }
  const sliced = value.slice(0, max - 1)
  const breakAt = Math.max(sliced.lastIndexOf('，'), sliced.lastIndexOf('。'), sliced.lastIndexOf('；'), sliced.lastIndexOf('、'))
  const head = breakAt >= Math.floor(max * 0.45) ? sliced.slice(0, breakAt) : sliced
  return `${head}…`
}

export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractIndexQuotes(content: string, market: ReportMarket): ReportIndexQuote[] {
  const tableBody = findIndexTableBody(content)
  if (!tableBody) {
    return []
  }

  const rows = tableBody
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith('|'))
    .map(line => line.split('|').slice(1, -1).map(cell => stripInlineMarkdown(cell)))
    .filter(cells => cells.length >= 3)

  const preferred = market === 'US' ? US_INDEX_ORDER : A_INDEX_ORDER
  const byName = new Map<string, ReportIndexQuote>()

  for (const cells of rows) {
    const rawName = cells[0] || ''
    const key = matchPreferredIndex(rawName, preferred)
    if (!key || byName.has(key)) {
      continue
    }
    const value = normalizeIndexValue(cells[1] || '')
    const change = parseChangePct(cells[2] || '')
    byName.set(key, {
      name: INDEX_DISPLAY[key] || key,
      value,
      changePct: change.pct,
      changeText: change.text,
    })
  }

  return preferred
    .map(name => byName.get(name))
    .filter((item): item is ReportIndexQuote => Boolean(item))
}

/** 定位「指数 | 收盘点位 | 涨跌幅」表（可能在 §1 或 §2） */
function findIndexTableBody(content: string): string | null {
  const tables = content.matchAll(/\|([^\n]+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|[^\n]+\|\r?\n?)*)/g)
  for (const match of tables) {
    const header = stripInlineMarkdown(match[1])
    if (/指数/.test(header) && /收盘/.test(header) && /涨跌/.test(header)) {
      return match[2]
    }
  }
  return null
}

function matchPreferredIndex(rawName: string, preferred: readonly string[]): string | null {
  const name = rawName.replace(/\s+/g, ' ').trim()
  for (const key of preferred) {
    if (name === key || name.startsWith(key) || name.includes(key)) {
      return key
    }
  }
  // Dow Jones Industrial Average etc.
  if (preferred.includes('Dow Jones') && /dow/i.test(name)) {
    return 'Dow Jones'
  }
  if (preferred.includes('S&P 500') && /s&p|标普\s*500/i.test(name)) {
    return 'S&P 500'
  }
  if (preferred.includes('Nasdaq Composite') && /nasdaq\s*composite|纳斯达克综合/i.test(name)) {
    return 'Nasdaq Composite'
  }
  return null
}

function normalizeIndexValue(raw: string): string {
  const primary = raw.split(/[／/]/)[0]?.trim() || raw.trim()
  return primary.replace(/[^\d.,]/g, '') || primary
}

function parseChangePct(raw: string): { pct: number | null, text: string } {
  const match = raw.replace(/−/g, '-').match(/([+-]?\d+(?:\.\d+)?)\s*%/)
  if (!match) {
    return { pct: null, text: stripInlineMarkdown(raw).slice(0, 12) || '—' }
  }
  const pct = Number(match[1])
  if (!Number.isFinite(pct)) {
    return { pct: null, text: `${match[1]}%` }
  }
  const sign = pct > 0 ? '+' : ''
  return { pct, text: `${sign}${pct.toFixed(2)}%` }
}
