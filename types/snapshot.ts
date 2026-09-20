export type MarketStrategy = '防守' | '轻仓试错' | '积极参与' | '进攻'

export interface AshareSnapshotRow {
  date: string
  score: number
  confidence: string
  marketState: string
  strategy: string
  attackOk: boolean | null
  attackMet: number | null
  attackNote: string
  accountFocus: string
  suggestedPosition: string
  positionLow: number | null
  positionHigh: number | null
  operationHint: string
}

export interface AshareSnapshotResponse {
  configured: boolean
  source: string | null
  path: string
  items: AshareSnapshotRow[]
  message?: string
}
