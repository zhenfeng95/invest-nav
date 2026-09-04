export type CalendarImpact = 'high' | 'medium' | 'low' | 'unknown'

export interface CalendarEvent {
  id: string
  time: string
  date: string
  country: string
  countryLabel: string
  category: string
  categoryLabel: string
  event: string
  impact: CalendarImpact
  star: number | null
  actual: string | null
  estimate: string | null
  prev: string | null
  revised: string | null
  affect: string | null
  unit: string | null
}

export interface CalendarResponse {
  configured: boolean
  source: 'jin10' | null
  from: string
  to: string
  updatedAt: string
  timezone: string
  events: CalendarEvent[]
  message?: string
}
