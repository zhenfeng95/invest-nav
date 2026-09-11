export type FxCurrency = 'USD' | 'HKD'

export type FxEstimateMode = 'spend' | 'receive'

export interface FxEstimateInput {
  /** 目标外币 */
  currency: FxCurrency
  /** spend: 花多少人民币；receive: 想得到多少外币 */
  mode: FxEstimateMode
  amount: number
  /** 1 单位外币 = 多少人民币（银行卖出价示意） */
  rateCnyPerUnit: number
  /** 在牌价之上额外加点（%），可与牌价二选一使用 */
  markupPercent: number
  /** 固定费用（人民币） */
  fixedFeeCny: number
}

export interface FxEstimateResult {
  currency: FxCurrency
  effectiveRate: number
  spendCny: number
  receiveForeign: number
  feeCny: number
  rateCostCny: number
  valid: boolean
  message?: string
}

/** 示意默认牌价（非实时，仅作表单起点） */
export const DEFAULT_FX_RATES: Record<FxCurrency, number> = {
  USD: 7.25,
  HKD: 0.93,
}

export const FX_CURRENCY_OPTIONS: { id: FxCurrency, label: string, unit: string }[] = [
  { id: 'USD', label: '美元 USD', unit: '美元' },
  { id: 'HKD', label: '港币 HKD', unit: '港币' },
]

/**
 * 购汇粗算：外币到账 = (人民币支出 − 固定费) / 有效汇率
 * 有效汇率 = 牌价 × (1 + 加点%)
 */
export function estimateFxPurchase(input: FxEstimateInput): FxEstimateResult {
  const amount = Math.max(0, Number(input.amount) || 0)
  const baseRate = Math.max(0, Number(input.rateCnyPerUnit) || 0)
  const markup = Math.max(0, Number(input.markupPercent) || 0)
  const fixedFeeCny = Math.max(0, Number(input.fixedFeeCny) || 0)
  const effectiveRate = baseRate * (1 + markup / 100)

  if (baseRate <= 0 || effectiveRate <= 0) {
    return {
      currency: input.currency,
      effectiveRate: 0,
      spendCny: 0,
      receiveForeign: 0,
      feeCny: fixedFeeCny,
      rateCostCny: 0,
      valid: false,
      message: '请填写有效的外币兑人民币汇率',
    }
  }

  if (input.mode === 'spend') {
    const spendCny = amount
    const usable = spendCny - fixedFeeCny
    if (usable <= 0) {
      return {
        currency: input.currency,
        effectiveRate,
        spendCny,
        receiveForeign: 0,
        feeCny: fixedFeeCny,
        rateCostCny: 0,
        valid: false,
        message: '人民币金额需大于固定费用',
      }
    }
    const receiveForeign = usable / effectiveRate
    return {
      currency: input.currency,
      effectiveRate,
      spendCny,
      receiveForeign,
      feeCny: fixedFeeCny,
      rateCostCny: usable,
      valid: true,
    }
  }

  const receiveForeign = amount
  const rateCostCny = receiveForeign * effectiveRate
  const spendCny = rateCostCny + fixedFeeCny
  return {
    currency: input.currency,
    effectiveRate,
    spendCny,
    receiveForeign,
    feeCny: fixedFeeCny,
    rateCostCny,
    valid: true,
  }
}
