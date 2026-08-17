export type ToolStatus = 'available' | 'coming-soon' | 'external'
export type ToolIcon =
  | 'chart'
  | 'wallet'
  | 'calendar'
  | 'signal'
  | 'calculator'

export interface Tool {
  id: string
  name: string
  description: string
  icon: ToolIcon
  status: ToolStatus
  route: string
  apiRequired: boolean
  apiPath?: string
}
