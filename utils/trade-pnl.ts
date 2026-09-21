export interface TradePnlInput {
  buyPrice: number
  sellPrice: number
  shares: number
  buyFee: number
  sellFee: number
}

export interface TradePnlResult {
  cost: number
  proceeds: number
  pnl: number
  returnPercent: number
  valid: boolean
  message?: string
}

/**
 * 单笔买卖盈亏：成本 = 买入价×股数+买入费用；到账 = 卖出价×股数−卖出费用。
 */
export function calculateTradePnl(input: TradePnlInput): TradePnlResult {
  const buyPrice = Math.max(0, Number(input.buyPrice) || 0)
  const sellPrice = Math.max(0, Number(input.sellPrice) || 0)
  const shares = Math.max(0, Number(input.shares) || 0)
  const buyFee = Math.max(0, Number(input.buyFee) || 0)
  const sellFee = Math.max(0, Number(input.sellFee) || 0)

  const empty = (message: string): TradePnlResult => ({
    cost: 0,
    proceeds: 0,
    pnl: 0,
    returnPercent: 0,
    valid: false,
    message,
  })

  if (buyPrice <= 0) {
    return empty('请填写有效买入价')
  }
  if (sellPrice < 0) {
    return empty('卖出价不能为负')
  }
  if (shares <= 0) {
    return empty('请填写有效股数')
  }

  const cost = buyPrice * shares + buyFee
  const proceeds = sellPrice * shares - sellFee
  const pnl = proceeds - cost
  const returnPercent = cost > 0 ? (pnl / cost) * 100 : 0

  return {
    cost,
    proceeds,
    pnl,
    returnPercent,
    valid: true,
  }
}
