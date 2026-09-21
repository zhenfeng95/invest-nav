export interface Note {
  id: string
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  readingMinutes?: number
  updatedAt: string
  publishedAt: string
  markdownFile?: string
  markdown?: string
}
