import navigationData from '~/data/navigation.json'
import type { NavigationCategory, NavigationItem } from '~/types/navigation'

const categories = navigationData.categories as NavigationCategory[]

export function getNavigationCategories(): NavigationCategory[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items],
  }))
}

export function getNavigationCategory(slug: string): NavigationCategory | undefined {
  const category = categories.find(item => item.slug === slug)
  if (!category) {
    return undefined
  }

  return {
    ...category,
    items: [...category.items],
  }
}

export function getFeaturedNavigationItems(limit = 4): Array<NavigationItem & { categoryName: string, categorySlug: string }> {
  return categories
    .flatMap(category => category.items
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        categoryName: category.name,
        categorySlug: category.slug,
      })))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, limit)
}

export function getNavigationItemCount(slug: string): number {
  return getNavigationCategory(slug)?.items.length ?? 0
}
