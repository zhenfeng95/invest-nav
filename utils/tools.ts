import toolsData from '~/data/tools.json'
import type { Tool } from '~/types/tool'

const tools = toolsData.items as Tool[]

export function getTools(): Tool[] {
  return [...tools]
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
