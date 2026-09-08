export function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatReadingTime(minutes?: number): string {
  if (!minutes) {
    return ''
  }
  return `${minutes} 分钟阅读`
}

/** 中文语境下的字数（按去掉 Markdown 后的字符数估算） */
export function countPlainTextChars(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|+\-]+/g, ' ')
    .replace(/\s+/g, '')

  return plain.length
}

export function formatWordCount(chars: number): string {
  if (chars <= 0) {
    return '约 0 字'
  }
  if (chars < 1000) {
    return `约 ${chars} 字`
  }
  const rounded = Math.round(chars / 100) * 100
  return `约 ${rounded} 字`
}

export function estimateReadingMinutes(chars: number, fallback?: number): number {
  if (fallback && fallback > 0) {
    return fallback
  }
  return Math.max(1, Math.ceil(chars / 400))
}

export function formatWeekday(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getUTCDay()] ?? ''
}

export function formatYearMonth(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})/)
  if (!match) {
    return value
  }
  return `${match[1]}年${Number(match[2])}月`
}

export function formatWeekOfMonth(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) {
    return formatYearMonth(value)
  }
  const week = Math.min(5, Math.max(1, Math.ceil(Number(match[3]) / 7)))
  return `${match[1]}年${Number(match[2])}月第${week}周`
}

export function currentYearMonth(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now)
  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value
  return year && month ? `${year}-${month}` : ''
}

/** 是否属于上海时区下的当前自然月（YYYY-MM-DD） */
export function isCurrentYearMonth(date: string | null | undefined, now = new Date()): boolean {
  if (!date) {
    return false
  }
  const ym = currentYearMonth(now)
  return Boolean(ym) && date.slice(0, 7) === ym
}

export function formatMoney(value: number, currency: 'CNY' | 'USD', digits?: number): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  const places = digits ?? (currency === 'CNY' ? 2 : 2)
  return `${symbol}${value.toFixed(places)}`
}

export function formatSignedMoney(value: number, currency: 'CNY' | 'USD', digits?: number): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  const places = digits ?? (currency === 'CNY' || Math.abs(value) >= 1 ? 2 : 2)
  const body = `${symbol}${Math.abs(value).toFixed(places)}`
  if (value > 1e-9) {
    return `+${body}`
  }
  if (value < -1e-9) {
    return `−${body}`
  }
  return body
}

export function formatSignedPct(value: number, digits = 2): string {
  const sign = value > 1e-9 ? '+' : value < -1e-9 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(digits)}%`
}

export function pnlTextClass(value: number | null | undefined): string {
  if (value == null || Math.abs(value) < 1e-9) {
    return 'text-zinc-500 dark:text-zinc-400'
  }
  // A-share convention: profit red, loss green
  return value > 0
    ? 'text-rose-700 dark:text-rose-400'
    : 'text-emerald-700 dark:text-emerald-400'
}

export function formatQty(value: number): string {
  if (Number.isInteger(value)) {
    return String(value)
  }
  return value.toFixed(4).replace(/\.?0+$/, '')
}
