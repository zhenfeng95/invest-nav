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
  cover?: string
  thumbnail?: string
  videoUrl?: string
  image?: string
  content?: string[]
}
