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
