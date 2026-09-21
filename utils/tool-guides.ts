import { calendarGuide } from '~/data/tool-guides/calendar'
import { compoundInterestGuide } from '~/data/tool-guides/compound-interest'
import { fxEstimateGuide } from '~/data/tool-guides/fx-estimate'
import { positionRiskGuide } from '~/data/tool-guides/position-risk'
import { spatialGuide } from '~/data/tool-guides/spatial'
import { targetContributionGuide } from '~/data/tool-guides/target-contribution'
import { tradePnlGuide } from '~/data/tool-guides/trade-pnl'
import type { ToolGuide } from '~/types/tool-guide'

const guides: Record<string, ToolGuide> = {
  [compoundInterestGuide.toolId]: compoundInterestGuide,
  [fxEstimateGuide.toolId]: fxEstimateGuide,
  [positionRiskGuide.toolId]: positionRiskGuide,
  [calendarGuide.toolId]: calendarGuide,
  [spatialGuide.toolId]: spatialGuide,
  [tradePnlGuide.toolId]: tradePnlGuide,
  [targetContributionGuide.toolId]: targetContributionGuide,
}

export function getToolGuide(toolId: string): ToolGuide | undefined {
  return guides[toolId]
}
