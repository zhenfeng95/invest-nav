import tutorialsData from '~/data/tutorials.json'
import type { Tutorial, TutorialType } from '~/types/tutorial'

/**
 * 只读 tutorials.json 元数据（无正文 markdown）。
 * 首页卡片、列表页、导航、搜索、sitemap 等轻量路径应走这里，
 * 避免把全部教程正文打进同一个 JS / Worker chunk。
 */
const tutorialMeta = tutorialsData.items as Tutorial[]

function cloneMeta(item: Tutorial): Tutorial {
  return { ...item }
}

export function getTutorialMetaList(): Tutorial[] {
  return tutorialMeta.map(cloneMeta)
}

export function getTutorialMetaBySlug(slug: string): Tutorial | undefined {
  const item = tutorialMeta.find(entry => entry.slug === slug)
  return item ? cloneMeta(item) : undefined
}

export function getTutorials(): Tutorial[] {
  return getTutorialMetaList()
}

export function getTutorialsByType(type: TutorialType): Tutorial[] {
  return tutorialMeta.filter(item => item.type === type).map(cloneMeta)
}

export function getTutorialsByCategories(categories: string[]): Tutorial[] {
  if (categories.length === 0) {
    return []
  }

  const set = new Set(categories)
  return tutorialMeta
    .filter(item => set.has(item.category))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(cloneMeta)
}

export function getPopularTutorials(limit = 6): Tutorial[] {
  return tutorialMeta
    .filter(item => item.popular)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
    .map(cloneMeta)
}

export function getLatestTutorials(limit = 4): Tutorial[] {
  return [...tutorialMeta]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
    .map(cloneMeta)
}

/** 首页 / 教程索引「热门教程」固定展示（顺序即展示顺序） */
export const FEATURED_TUTORIAL_SLUGS = [
  'bosco-account-guide',
  'cib-huanyu-account-guide',
  'za-bank-account-guide',
] as const

export function getFeaturedTutorials(): Tutorial[] {
  const bySlug = new Map(tutorialMeta.map(item => [item.slug, item]))
  return FEATURED_TUTORIAL_SLUGS
    .map(slug => bySlug.get(slug))
    .filter((item): item is Tutorial => Boolean(item))
    .map(cloneMeta)
}

export function getTutorialTypeLabel(type: TutorialType): string {
  switch (type) {
    case 'article':
      return '文字教程'
    case 'video':
      return '视频教程'
    case 'infographic':
      return '一图看懂'
    default:
      return '教程'
  }
}

/** 卡片 / 导航用短名；详情页可用全称 */
const tutorialCategoryFullNames: Record<string, string> = {
  数字基建: '跨境数字基建',
  副业变现: '副业变现分享',
}

export function getTutorialCategoryLabel(
  category: string,
  variant: 'short' | 'full' = 'short',
): string {
  if (variant === 'full') {
    return tutorialCategoryFullNames[category] ?? category
  }
  return category
}
