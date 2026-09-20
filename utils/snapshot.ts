import type { AshareSnapshotRow, MarketStrategy } from '~/types/snapshot'
import { formatDate, formatWeekday } from '~/utils/format'

export const STRATEGY_ORDER: MarketStrategy[] = ['防守', '轻仓试错', '积极参与', '进攻']

export const STRATEGY_COLORS: Record<MarketStrategy, string> = {
  防守: '#8c8c8c',
  轻仓试错: '#faad14',
  积极参与: '#fa8c16',
  进攻: '#f5222d',
}

/** Marker for days that meet all four attack conditions. Distinct from strategy colors. */
export const ATTACK_OK_COLOR = '#6F8F82'

const FALLBACK_BAR_COLOR = '#bfbfbf'

export function isMarketStrategy(value: string): value is MarketStrategy {
  return STRATEGY_ORDER.includes(value as MarketStrategy)
}

export function strategyColor(strategy: string) {
  return isMarketStrategy(strategy) ? STRATEGY_COLORS[strategy] : FALLBACK_BAR_COLOR
}

export function formatAttackLabel(item: Pick<AshareSnapshotRow, 'attackOk' | 'attackMet'>) {
  if (item.attackOk == null && item.attackMet == null) {
    return ''
  }
  const yesNo = item.attackOk == null ? '' : item.attackOk ? '是' : '否'
  const met = item.attackMet == null ? '' : `${item.attackMet}/4`
  if (yesNo && met) {
    return `${yesNo}（${met}）`
  }
  return yesNo || met
}

export function snapshotReportPath(date: string) {
  return `/reports/ashare-close-${date}`
}

export function snapshotDayLabel(date: string) {
  const weekday = formatWeekday(date)
  return weekday ? `${formatDate(date)} ${weekday}` : formatDate(date)
}

export function snapshotTooltipRows(item: AshareSnapshotRow): Array<{ label: string, value: string }> {
  const attack = formatAttackLabel(item)
  const rows: Array<{ label: string, value: string }> = [
    { label: '市场评分', value: String(item.score) },
    { label: '建议仓位', value: item.suggestedPosition },
    { label: '策略', value: item.strategy },
    { label: '进攻四条件', value: attack },
    { label: '账户重心', value: item.accountFocus },
    { label: '市场状态', value: item.marketState },
    { label: '置信度', value: item.confidence },
    { label: '操作提示', value: item.operationHint },
    { label: '进攻说明', value: item.attackNote },
  ]
  return rows.filter(row => row.value)
}
