export interface PositionRiskInput {
  equity: number
  riskPercent: number
  entryPrice: number
  stopPrice: number
  /** 可选：仓位市值不超过权益的百分比；0 表示不限制 */
  maxPositionPercent: number
}

export interface PositionRiskResult {
  riskAmount: number
  riskPerUnit: number
  unitsExact: number
  unitsFloor: number
  positionValue: number
  positionPercentOfEquity: number
  cappedByMaxPosition: boolean
  valid: boolean
  message?: string
}

/**
 * 仓位风控：单笔可亏金额 / 每股（每单位）止损距离 = 建议仓位。
 * 若设置最大仓位占比，取更保守的一侧。
 */
export function calculatePositionRisk(input: PositionRiskInput): PositionRiskResult {
  const equity = Math.max(0, Number(input.equity) || 0)
  const riskPercent = Math.max(0, Number(input.riskPercent) || 0)
  const entryPrice = Math.max(0, Number(input.entryPrice) || 0)
  const stopPrice = Math.max(0, Number(input.stopPrice) || 0)
  const maxPositionPercent = Math.max(0, Number(input.maxPositionPercent) || 0)

  const empty = (message: string): PositionRiskResult => ({
    riskAmount: 0,
    riskPerUnit: 0,
    unitsExact: 0,
    unitsFloor: 0,
    positionValue: 0,
    positionPercentOfEquity: 0,
    cappedByMaxPosition: false,
    valid: false,
    message,
  })

  if (equity <= 0) {
    return empty('请填写账户权益')
  }
  if (riskPercent <= 0) {
    return empty('请填写单笔风险比例')
  }
  if (entryPrice <= 0) {
    return empty('请填写有效入场价')
  }
  if (stopPrice <= 0) {
    return empty('请填写有效止损价')
  }
  if (stopPrice === entryPrice) {
    return empty('止损价不能等于入场价')
  }

  const riskAmount = equity * (riskPercent / 100)
  const riskPerUnit = Math.abs(entryPrice - stopPrice)
  let unitsExact = riskAmount / riskPerUnit
  let cappedByMaxPosition = false

  if (maxPositionPercent > 0) {
    const maxValue = equity * (maxPositionPercent / 100)
    const maxUnits = maxValue / entryPrice
    if (maxUnits < unitsExact) {
      unitsExact = maxUnits
      cappedByMaxPosition = true
    }
  }

  const unitsFloor = Math.floor(unitsExact)
  const positionValue = unitsFloor * entryPrice
  const positionPercentOfEquity = equity > 0 ? (positionValue / equity) * 100 : 0

  return {
    riskAmount,
    riskPerUnit,
    unitsExact,
    unitsFloor,
    positionValue,
    positionPercentOfEquity,
    cappedByMaxPosition,
    valid: true,
  }
}
