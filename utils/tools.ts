import toolsData from '~/data/tools.json'
import type { Tool } from '~/types/tool'

const tools = toolsData.items as Tool[]

/** 首页「常用工具」固定展示（顺序即展示顺序） */
export const FEATURED_TOOL_IDS = ['spatial', 'compound-interest'] as const

export function getTools(): Tool[] {
  return [...tools]
}

export function getFeaturedTools(): Tool[] {
  const byId = new Map(tools.map(item => [item.id, item]))
  return FEATURED_TOOL_IDS
    .map(id => byId.get(id))
    .filter((item): item is Tool => Boolean(item))
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(item => item.id === slug)
}

export function getToolStatusLabel(status: Tool['status']): string {
  switch (status) {
    case 'available':
      return '可用'
    case 'coming-soon':
      return 'Coming Soon'
    case 'external':
      return '外部工具'
    default:
      return status
  }
}
