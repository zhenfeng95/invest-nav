export interface ToolGuideFaq {
  question: string
  answer: string
}

export interface ToolGuide {
  /** 对应 tools.json 的 id */
  toolId: string
  /** 用于 meta description 的补充文案（可选） */
  seoDescription?: string
  /** 「怎么用」段落 */
  howTo: string[]
  /** 操作步骤（可选） */
  steps?: string[]
  /** 假设与局限 */
  assumptions: string[]
  faq: ToolGuideFaq[]
}
