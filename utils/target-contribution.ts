import {
  getPeriodsPerYear,
  type CompoundFrequency,
  type ContributionTiming,
} from '~/utils/compound-interest'

export interface TargetContributionInput {
  principal: number
  targetAmount: number
  annualRatePercent: number
  years: number
  frequency: CompoundFrequency
  contributionTiming: ContributionTiming
}

export interface TargetContributionResult {
  contribution: number
  periods: number
  ratePerPeriod: number
  principalFutureValue: number
  totalContribution: number
  /** 本金复利已达或超过目标，无需定投 */
  alreadyReached: boolean
  valid: boolean
  message?: string
}

/**
 * 目标金额倒推：在给定本金、年化、期限与频率下，求每期需追加的定额。
 * 与复利计算器同一套期末/期初年金假设。
 */
export function calculateTargetContribution(input: TargetContributionInput): TargetContributionResult {
  const principal = Math.max(0, Number(input.principal) || 0)
  const targetAmount = Math.max(0, Number(input.targetAmount) || 0)
  const years = Math.max(0, Number(input.years) || 0)
  const n = getPeriodsPerYear(input.frequency)
  const periods = Math.round(years * n)
  const ratePerPeriod = input.annualRatePercent / 100 / n

  const empty = (message: string): TargetContributionResult => ({
    contribution: 0,
    periods,
    ratePerPeriod,
    principalFutureValue: principal,
    totalContribution: principal,
    alreadyReached: false,
    valid: false,
    message,
  })

  if (targetAmount <= 0) {
    return empty('请填写目标金额')
  }
  if (years <= 0 || periods <= 0) {
    return empty('请填写有效投资年限')
  }

  const growth = ratePerPeriod === 0 ? 1 : (1 + ratePerPeriod) ** periods
  const principalFutureValue = principal * growth

  if (principalFutureValue >= targetAmount) {
    return {
      contribution: 0,
      periods,
      ratePerPeriod,
      principalFutureValue,
      totalContribution: principal,
      alreadyReached: true,
      valid: true,
    }
  }

  const gap = targetAmount - principalFutureValue
  let contribution: number

  if (ratePerPeriod === 0) {
    contribution = gap / periods
  }
  else {
    const annuityFactor = ((1 + ratePerPeriod) ** periods - 1) / ratePerPeriod
    if (input.contributionTiming === 'begin') {
      contribution = gap / (annuityFactor * (1 + ratePerPeriod))
    }
    else {
      contribution = gap / annuityFactor
    }
  }

  const totalContribution = principal + contribution * periods

  return {
    contribution,
    periods,
    ratePerPeriod,
    principalFutureValue,
    totalContribution,
    alreadyReached: false,
    valid: true,
  }
}
