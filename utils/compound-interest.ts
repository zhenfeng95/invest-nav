export type CompoundFrequency = 'yearly' | 'quarterly' | 'monthly' | 'daily'
export type ContributionTiming = 'end' | 'begin'

export interface CompoundInterestInput {
  principal: number
  annualRatePercent: number
  years: number
  frequency: CompoundFrequency
  contribution: number
  contributionTiming: ContributionTiming
}

export interface CompoundInterestYearRow {
  year: number
  contributionTotal: number
  balance: number
  interest: number
}

export interface CompoundInterestResult {
  futureValue: number
  totalContribution: number
  totalInterest: number
  periods: number
  ratePerPeriod: number
  schedule: CompoundInterestYearRow[]
}

export const COMPOUND_FREQUENCY_OPTIONS: { id: CompoundFrequency, label: string, periods: number }[] = [
  { id: 'yearly', label: '每年', periods: 1 },
  { id: 'quarterly', label: '每季', periods: 4 },
  { id: 'monthly', label: '每月', periods: 12 },
  { id: 'daily', label: '每日', periods: 365 },
]

export function getPeriodsPerYear(frequency: CompoundFrequency): number {
  return COMPOUND_FREQUENCY_OPTIONS.find(item => item.id === frequency)?.periods ?? 1
}

/**
 * 复利终值：本金按期复利，定投按每期定额（与复利频率一致）追加。
 * 定投时点可选期末（普通年金）或期初（预付年金）。
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const principal = Math.max(0, input.principal)
  const contribution = Math.max(0, input.contribution)
  const years = Math.max(0, input.years)
  const n = getPeriodsPerYear(input.frequency)
  const periods = Math.round(years * n)
  const ratePerPeriod = input.annualRatePercent / 100 / n

  let balance = principal
  let totalContribution = principal
  const schedule: CompoundInterestYearRow[] = []

  if (periods === 0) {
    return {
      futureValue: balance,
      totalContribution,
      totalInterest: 0,
      periods: 0,
      ratePerPeriod,
      schedule: [],
    }
  }

  for (let period = 1; period <= periods; period++) {
    if (input.contributionTiming === 'begin' && contribution > 0) {
      balance += contribution
      totalContribution += contribution
    }

    if (ratePerPeriod !== 0) {
      balance *= 1 + ratePerPeriod
    }

    if (input.contributionTiming === 'end' && contribution > 0) {
      balance += contribution
      totalContribution += contribution
    }

    if (period % n === 0 || period === periods) {
      schedule.push({
        year: Math.ceil(period / n),
        contributionTotal: totalContribution,
        balance,
        interest: balance - totalContribution,
      })
    }
  }

  return {
    futureValue: balance,
    totalContribution,
    totalInterest: balance - totalContribution,
    periods,
    ratePerPeriod,
    schedule,
  }
}
