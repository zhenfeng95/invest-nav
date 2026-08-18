export interface LiveQuote {
  last: number
  prevClose?: number
  changePct?: number
  high?: number
  low?: number
  open?: number
  asOf?: string
  ma5?: number
  source: string
}

export interface DailyClose {
  date: string
  close: number
}

const QUOTE_TTL_MS = 60 * 1000
const KLINE_TTL_MS = 30 * 60 * 1000
const EMPTY_KLINE_TTL_MS = 2 * 60 * 1000
const quoteCache = new Map<string, { expiresAt: number, value: LiveQuote | null }>()
const klineCache = new Map<string, { expiresAt: number, value: DailyClose[] }>()

const US_SECID_HINT: Record<string, string> = {
  AAPL: '105.AAPL',
  QQQ: '105.QQQ',
  IBIT: '105.IBIT',
  NVDA: '105.NVDA',
  TSLA: '105.TSLA',
  SGOV: '106.SGOV',
  VOO: '107.VOO',
}

export async function fetchQuotes(tickers: Array<{ market: 'A' | 'US', ticker: string }>): Promise<Map<string, LiveQuote>> {
  const unique = [...new Map(tickers.map(item => [`${item.market}:${item.ticker}`, item])).values()]
  const results = await Promise.all(unique.map(async (item) => {
    const key = `${item.market}:${item.ticker}`
    try {
      const quote = item.market === 'A'
        ? await fetchAShareQuote(item.ticker)
        : await fetchUsQuote(item.ticker)
      return [key, quote] as const
    }
    catch {
      return [key, null] as const
    }
  }))

  const map = new Map<string, LiveQuote>()
  for (const [key, quote] of results) {
    if (quote) {
      map.set(key, quote)
    }
  }
  return map
}

export async function fetchDailyCloses(
  tickers: Array<{ market: 'A' | 'US', ticker: string }>,
  startDate: string,
): Promise<Map<string, DailyClose[]>> {
  const unique = [...new Map(tickers.map(item => [`${item.market}:${item.ticker}`, item])).values()]
  const lookback = shiftIsoDate(startDate, -21)
  const rows = await mapPool(unique, 4, async (item) => {
    const key = `${item.market}:${item.ticker}`
    try {
      const series = item.market === 'A'
        ? await fetchAShareDailyCloses(item.ticker)
        : await fetchUsDailyCloses(item.ticker)
      return [key, lookback ? series.filter(bar => bar.date >= lookback) : series] as const
    }
    catch {
      return [key, [] as DailyClose[]] as const
    }
  })

  const map = new Map<string, DailyClose[]>()
  for (const [key, series] of rows) {
    if (series.length) {
      map.set(key, series)
    }
  }
  return map
}

async function fetchAShareQuote(ticker: string): Promise<LiveQuote | null> {
  const cached = getCached(`A:${ticker}`)
  if (cached !== undefined) {
    return cached
  }

  const secid = toEastmoneySecid(ticker)
  const [spot, kline] = await Promise.all([
    fetchJson(`https://push2.eastmoney.com/api/qt/stock/get?secid=${secid}&fields=f43,f44,f45,f46,f57,f58,f60,f152,f169,f170`, 'https://quote.eastmoney.com/'),
    fetchJson(`https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&klt=101&fqt=1&lmt=10&end=20500101&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58`, 'https://quote.eastmoney.com/'),
  ])

  const data = spot && typeof spot === 'object' ? (spot as { data?: Record<string, number | string> }).data : null
  if (!data || data.f43 == null) {
    setCached(`A:${ticker}`, null)
    return null
  }

  const decimals = Number(data.f152 ?? 2)
  const scale = 10 ** (Number.isFinite(decimals) ? decimals : 2)
  const last = Number(data.f43) / scale
  const prevClose = data.f60 != null ? Number(data.f60) / scale : undefined
  const changePct = data.f170 != null ? Number(data.f170) / 100 : (prevClose ? (last / prevClose - 1) * 100 : undefined)
  const ma5 = parseMa5((kline as { data?: { klines?: string[] } } | null)?.data?.klines, last)

  const quote: LiveQuote = {
    last,
    prevClose,
    changePct,
    high: data.f44 != null ? Number(data.f44) / scale : undefined,
    low: data.f45 != null ? Number(data.f45) / scale : undefined,
    open: data.f46 != null ? Number(data.f46) / scale : undefined,
    ma5,
    source: 'eastmoney',
  }
  setCached(`A:${ticker}`, quote)
  return quote
}

async function fetchUsQuote(ticker: string): Promise<LiveQuote | null> {
  const cached = getCached(`US:${ticker}`)
  if (cached !== undefined) {
    return cached
  }

  const eastmoney = await fetchUsQuoteEastmoney(ticker)
  if (eastmoney) {
    setCached(`US:${ticker}`, eastmoney)
    return eastmoney
  }

  const tencent = await fetchUsQuoteTencent(ticker)
  setCached(`US:${ticker}`, tencent)
  return tencent
}

async function fetchUsQuoteEastmoney(ticker: string): Promise<LiveQuote | null> {
  const payload = await fetchJson(
    `https://push2.eastmoney.com/api/qt/stock/get?secid=105.${encodeURIComponent(ticker)}&fields=f43,f44,f45,f46,f57,f58,f60,f152,f169,f170`,
    'https://quote.eastmoney.com/',
  )
  const data = payload && typeof payload === 'object' ? (payload as { data?: Record<string, number | string> }).data : null
  if (!data || data.f43 == null || data.f57 !== ticker) {
    return null
  }

  const decimals = Number(data.f152 ?? 3)
  const scale = 10 ** (Number.isFinite(decimals) ? decimals : 3)
  const last = Number(data.f43) / scale
  const prevClose = data.f60 != null ? Number(data.f60) / scale : undefined
  const normalizedLast = normalizeUsLast(ticker, last)
  const ratio = last > 0 ? normalizedLast / last : 1
  return {
    last: normalizedLast,
    prevClose: prevClose != null ? prevClose * ratio : undefined,
    changePct: data.f170 != null ? Number(data.f170) / 100 : undefined,
    high: data.f44 != null ? Number(data.f44) / scale * ratio : undefined,
    low: data.f45 != null ? Number(data.f45) / scale * ratio : undefined,
    open: data.f46 != null ? Number(data.f46) / scale * ratio : undefined,
    source: 'eastmoney',
  }
}

async function fetchUsQuoteTencent(ticker: string): Promise<LiveQuote | null> {
  const text = await fetchText(`https://qt.gtimg.cn/q=us${encodeURIComponent(ticker)}`, 'https://finance.qq.com/')
  if (!text || !text.includes('~')) {
    return null
  }

  const quoted = text.split('"')[1]
  if (!quoted) {
    return null
  }
  const fields = quoted.split('~')
  const last = Number(fields[3])
  const prevClose = Number(fields[4])
  if (!Number.isFinite(last) || last <= 0) {
    return null
  }

  const datetime = fields.find(field => /^\d{4}-\d{2}-\d{2}/.test(field))
  return {
    last,
    prevClose: Number.isFinite(prevClose) ? prevClose : undefined,
    changePct: Number.isFinite(prevClose) && prevClose ? (last / prevClose - 1) * 100 : undefined,
    asOf: datetime,
    source: 'tencent',
  }
}

function parseMa5(klines: string[] | undefined, fallbackLast: number): number | undefined {
  if (!klines?.length) {
    return undefined
  }

  const closes = klines
    .map(line => Number(line.split(',')[2]))
    .filter(value => Number.isFinite(value) && value > 0)

  if (!closes.length) {
    return undefined
  }

  if (Math.abs(closes[closes.length - 1] - fallbackLast) > 0.0001) {
    closes[closes.length - 1] = fallbackLast
  }

  const window = closes.slice(-5)
  if (window.length < 5) {
    return undefined
  }
  return window.reduce((sum, value) => sum + value, 0) / window.length
}

function toEastmoneySecid(ticker: string): string {
  const code = ticker.replace(/\.(SH|SZ|BJ)$/i, '')
  if (/^(6|9)\d{5}$/.test(code)) {
    return `1.${code}`
  }
  return `0.${code}`
}

function normalizeUsLast(ticker: string, last: number): number {
  if (ticker === 'IBIT' && last > 200) {
    return last / 10
  }
  if ((ticker === 'QQQ' || ticker === 'VOO') && last > 5000) {
    return last / 10
  }
  return last
}

function getCached(key: string): LiveQuote | null | undefined {
  const entry = quoteCache.get(key)
  if (!entry) {
    return undefined
  }
  if (Date.now() > entry.expiresAt) {
    quoteCache.delete(key)
    return undefined
  }
  return entry.value
}

function setCached(key: string, value: LiveQuote | null) {
  quoteCache.set(key, { value, expiresAt: Date.now() + QUOTE_TTL_MS })
}

async function fetchAShareDailyCloses(ticker: string): Promise<DailyClose[]> {
  const cached = getKlineCached(`A:${ticker}`)
  if (cached) {
    return cached
  }

  const tencent = await fetchTencentAShareKlines(ticker)
  if (tencent.length) {
    setKlineCached(`A:${ticker}`, tencent)
    return tencent
  }

  const eastmoney = await fetchEastmoneyKlines(toEastmoneySecid(ticker))
  setKlineCached(`A:${ticker}`, eastmoney)
  return eastmoney
}

async function fetchUsDailyCloses(ticker: string): Promise<DailyClose[]> {
  const cached = getKlineCached(`US:${ticker}`)
  if (cached) {
    return cached
  }

  const sina = await fetchSinaUsKlines(ticker)
  if (sina.length) {
    setKlineCached(`US:${ticker}`, sina)
    return sina
  }

  const hinted = US_SECID_HINT[ticker]
  const eastmoney = hinted ? await fetchEastmoneyKlines(hinted) : []
  const normalized = eastmoney.map(bar => ({
    date: bar.date,
    close: normalizeUsLast(ticker, bar.close),
  }))
  setKlineCached(`US:${ticker}`, normalized)
  return normalized
}

async function fetchEastmoneyKlines(secid: string): Promise<DailyClose[]> {
  const hosts = ['https://92.push2his.eastmoney.com', 'https://push2his.eastmoney.com']
  for (const host of hosts) {
    const payload = await fetchJson(
      `${host}/api/qt/stock/kline/get?secid=${encodeURIComponent(secid)}&klt=101&fqt=1&lmt=80&end=20500101&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53`,
      'https://quote.eastmoney.com/',
      3500,
    )
    const rows = parseEastmoneyKlines(payload)
    if (rows.length) {
      return rows
    }
  }
  return []
}

function parseEastmoneyKlines(payload: unknown): DailyClose[] {
  const klines = payload && typeof payload === 'object'
    ? (payload as { data?: { klines?: string[] } }).data?.klines
    : null
  if (!Array.isArray(klines) || !klines.length) {
    return []
  }

  const rows: DailyClose[] = []
  for (const line of klines) {
    const [date, , closeText] = String(line).split(',')
    const close = Number(closeText)
    if (!date || !Number.isFinite(close) || close <= 0) {
      continue
    }
    rows.push({ date: date.slice(0, 10), close })
  }
  return rows
}

async function fetchTencentAShareKlines(ticker: string): Promise<DailyClose[]> {
  const symbol = toTencentAShareSymbol(ticker)
  const payload = await fetchJson(
    `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${encodeURIComponent(symbol)},day,,,80,qfq`,
    'https://finance.qq.com/',
  )
  const node = payload && typeof payload === 'object'
    ? (payload as { data?: Record<string, { qfqday?: string[][], day?: string[][] }> }).data?.[symbol]
    : null
  const bars = node?.qfqday || node?.day
  if (!Array.isArray(bars)) {
    return []
  }

  const rows: DailyClose[] = []
  for (const bar of bars) {
    const date = String(bar?.[0] || '').slice(0, 10)
    const close = Number(bar?.[2])
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(close) || close <= 0) {
      continue
    }
    rows.push({ date, close })
  }
  return rows
}

async function fetchSinaUsKlines(ticker: string): Promise<DailyClose[]> {
  const text = await fetchText(
    `https://stock.finance.sina.com.cn/usstock/api/jsonp_v2.php/IO.X=/US_MinKService.getDailyK?symbol=${encodeURIComponent(ticker.toLowerCase())}&___qn=3`,
    'https://finance.sina.com.cn/',
    12000,
  )
  if (!text) {
    return []
  }

  const start = text.indexOf('(')
  const end = text.lastIndexOf(')')
  if (start < 0 || end <= start) {
    return []
  }

  try {
    const parsed = JSON.parse(text.slice(start + 1, end)) as Array<{ d?: string, c?: string | number }>
    if (!Array.isArray(parsed)) {
      return []
    }
    const rows: DailyClose[] = []
    for (const bar of parsed.slice(-80)) {
      const date = String(bar.d || '').slice(0, 10)
      const close = Number(bar.c)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(close) || close <= 0) {
        continue
      }
      rows.push({ date, close: normalizeUsLast(ticker, close) })
    }
    return rows
  }
  catch {
    return []
  }
}

function toTencentAShareSymbol(ticker: string): string {
  const code = ticker.replace(/\.(SH|SZ|BJ)$/i, '')
  if (/^(6|9)\d{5}$/.test(code)) {
    return `sh${code}`
  }
  if (/^(4|8)\d{5}$/.test(code)) {
    return `bj${code}`
  }
  return `sz${code}`
}

async function mapPool<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>): Promise<R[]> {
  if (!items.length) {
    return []
  }
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(Math.max(limit, 1), items.length) }, async () => {
    while (next < items.length) {
      const index = next
      next += 1
      const item = items[index]
      if (item === undefined) {
        continue
      }
      results[index] = await mapper(item)
    }
  })
  await Promise.all(workers)
  return results
}

function getKlineCached(key: string): DailyClose[] | null {
  const entry = klineCache.get(key)
  if (!entry) {
    return null
  }
  if (Date.now() > entry.expiresAt) {
    klineCache.delete(key)
    return null
  }
  return entry.value
}

function setKlineCached(key: string, value: DailyClose[]) {
  klineCache.set(key, {
    value,
    expiresAt: Date.now() + (value.length ? KLINE_TTL_MS : EMPTY_KLINE_TTL_MS),
  })
}

function shiftIsoDate(value: string, days: number): string {
  const stamp = Date.parse(`${value}T00:00:00Z`)
  if (Number.isNaN(stamp)) {
    return value
  }
  return new Date(stamp + days * 86_400_000).toISOString().slice(0, 10)
}

async function fetchJson(url: string, referer: string, timeoutMs = 8000): Promise<unknown | null> {
  const text = await fetchText(url, referer, timeoutMs)
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text)
  }
  catch {
    return null
  }
}

async function fetchText(url: string, referer: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 invest-nav',
        Referer: referer,
        Accept: '*/*',
      },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!response.ok) {
      return null
    }
    return await response.text()
  }
  catch {
    return null
  }
}
