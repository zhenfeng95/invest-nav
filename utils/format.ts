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
