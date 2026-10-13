export type TutorialType = 'article' | 'video' | 'infographic'

export interface Tutorial {
  id: string
  slug: string
  title: string
  description: string
  type: TutorialType
  category: string
  tags: string[]
  readingMinutes?: number
  duration?: string
  updatedAt: string
  publishedAt: string
  popular?: boolean
  /** 卡片角标，如「活动进行中」；活动结束删掉该字段即可 */
  statusBadge?: string
  cover?: string
  thumbnail?: string
  videoUrl?: string
  image?: string
  content?: string[]
  markdownFile?: string
  markdown?: string
}
