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
