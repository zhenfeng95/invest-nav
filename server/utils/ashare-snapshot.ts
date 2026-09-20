import type { H3Event } from 'h3'
import type { AshareSnapshotResponse, AshareSnapshotRow } from '~/types/snapshot'
import { getGitHubReportsConfig, getRepoFileText } from './github-reports'

const SNAPSHOT_REPO_PATH = 'data/public/ashare-daily-snapshot.csv'
const FILE_TTL_MS = 10 * 60 * 1000

const HEADER_ALIASES: Record<string, keyof RawSnapshotFields> = {
  date: 'date',
  score: 'score',
  confidence: 'confidence',
  market_state: 'marketState',
  strategy: 'strategy',
  attack_ok: 'attackOk',
  attack_met: 'attackMet',
  attack_note: 'attackNote',
  account_focus: 'accountFocus',
  suggested_position: 'suggestedPosition',
  position_low: 'positionLow',
  position_high: 'positionHigh',
  operation_hint: 'operationHint',
}

interface RawSnapshotFields {
  date: string
  score: string
  confidence: string
  marketState: string
  strategy: string
  attackOk: string
  attackMet: string
  attackNote: string
  accountFocus: string
  suggestedPosition: string
  positionLow: string
  positionHigh: string
  operationHint: string
}

const EMPTY_FIELDS: RawSnapshotFields = {
  date: '',
  score: '',
  confidence: '',
  marketState: '',
  strategy: '',
  attackOk: '',
  attackMet: '',
  attackNote: '',
  accountFocus: '',
  suggestedPosition: '',
  positionLow: '',
  positionHigh: '',
  operationHint: '',
}

export async function fetchAshareSnapshot(event: H3Event): Promise<AshareSnapshotResponse> {
  const config = getGitHubReportsConfig(event)
  let remoteError: unknown
  let source: string | null = null
  let text: string | null = null

  if (config) {
    try {
      const remote = await getRepoFileText(config, SNAPSHOT_REPO_PATH, FILE_TTL_MS)
      if (remote) {
        text = remote
        source = `${config.owner}/${config.repo}`
      }
    }
    catch (error) {
      remoteError = error
    }
  }

  if (!text) {
    const local = await loadFromLocal()
    if (local) {
      text = local
      source = 'local:invest-agent'
    }
  }

  if (!text) {
    if (remoteError) {
      throw remoteError
    }
    return {
      configured: Boolean(config),
      source: null,
      path: SNAPSHOT_REPO_PATH,
      items: [],
      message: config
        ? `投研 Agent 仓库中未找到 ${SNAPSHOT_REPO_PATH}。`
        : `未配置 GitHub 仓库，且本地未找到 ${SNAPSHOT_REPO_PATH}。`,
    }
  }

  const items = parseSnapshotCsv(text)
  return {
    configured: true,
    source,
    path: SNAPSHOT_REPO_PATH,
    items,
    message: items.length ? undefined : '快照文件已读取，但没有可展示的评分记录。',
  }
}

async function loadFromLocal(): Promise<string | null> {
  try {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    const filePath = path.join(process.cwd(), '..', 'invest-agent', SNAPSHOT_REPO_PATH)
    return await fs.readFile(filePath, 'utf8')
  }
  catch {
    return null
  }
}

export function parseSnapshotCsv(text: string): AshareSnapshotRow[] {
  const table = parseCsv(text)
  if (table.length < 2) {
    return []
  }

  const headers = table[0].map(header => HEADER_ALIASES[header.trim().toLowerCase()])
  const items: AshareSnapshotRow[] = []
  const seen = new Set<string>()

  for (const cells of table.slice(1)) {
    const raw: RawSnapshotFields = { ...EMPTY_FIELDS }
    headers.forEach((key, index) => {
      if (!key) {
        return
      }
      raw[key] = (cells[index] ?? '').trim()
    })

    const row = toSnapshotRow(raw)
    if (!row || seen.has(row.date)) {
      continue
    }
    seen.add(row.date)
    items.push(row)
  }

  return items.sort((a, b) => a.date.localeCompare(b.date))
}

function toSnapshotRow(raw: RawSnapshotFields): AshareSnapshotRow | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) {
    return null
  }
  const score = Number(raw.score)
  if (!Number.isFinite(score)) {
    return null
  }

  return {
    date: raw.date,
    score: Math.min(100, Math.max(0, Math.round(score))),
    confidence: raw.confidence,
    marketState: raw.marketState,
    strategy: raw.strategy,
    attackOk: parseBool(raw.attackOk),
    attackMet: parseCount(raw.attackMet),
    attackNote: raw.attackNote,
    accountFocus: raw.accountFocus,
    suggestedPosition: raw.suggestedPosition,
    positionLow: parseCount(raw.positionLow),
    positionHigh: parseCount(raw.positionHigh),
    operationHint: raw.operationHint,
  }
}

function parseBool(value: string): boolean | null {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是') {
    return true
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === '否') {
    return false
  }
  return null
}

function parseCount(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  const number = Number(trimmed)
  return Number.isFinite(number) ? number : null
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  const input = text.replace(/^\uFEFF/, '')

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"'
          index += 1
        }
        else {
          inQuotes = false
        }
      }
      else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }
    if (char === '\n') {
      if (field.endsWith('\r')) {
        field = field.slice(0, -1)
      }
      row.push(field)
      if (row.some(cell => cell.trim())) {
        rows.push(row)
      }
      row = []
      field = ''
      continue
    }
    field += char
  }

  if (field || row.length) {
    row.push(field)
    if (row.some(cell => cell.trim())) {
      rows.push(row)
    }
  }

  return rows
}
