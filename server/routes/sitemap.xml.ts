import { getTutorials } from '~/utils/tutorials'
import { listPublicIndexablePaths } from '~/utils/seo-index'
import type { TutorialType } from '~/types/tutorial'

const listingTypeByPath: Record<string, TutorialType> = {
  '/tutorials/articles': 'article',
  '/tutorials/videos': 'video',
  '/tutorials/infographics': 'infographic',
}

function maxDate(dates: string[]): string | undefined {
  if (dates.length === 0) {
    return undefined
  }

  return dates.reduce((latest, date) => (date > latest ? date : latest))
}

function toLastmod(date: string): string {
  return date.slice(0, 10)
}

export default defineEventHandler((event) => {
  const siteUrl = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const tutorials = getTutorials()
  const tutorialBySlug = new Map(tutorials.map(item => [item.slug, item]))
  const latestContentDate = maxDate(tutorials.map(item => item.updatedAt))
    ?? new Date().toISOString().slice(0, 10)

  const lastmodForPath = (path: string): string => {
    const listingType = listingTypeByPath[path]
    if (listingType) {
      return toLastmod(
        maxDate(
          tutorials
            .filter(item => item.type === listingType)
            .map(item => item.updatedAt),
        ) ?? latestContentDate,
      )
    }

    if (path === '/tutorials') {
      return toLastmod(maxDate(tutorials.map(item => item.updatedAt)) ?? latestContentDate)
    }

    const tutorialMatch = path.match(/^\/tutorials\/([^/]+)$/)
    if (tutorialMatch) {
      const tutorial = tutorialBySlug.get(tutorialMatch[1])
      if (tutorial?.updatedAt) {
        return toLastmod(tutorial.updatedAt)
      }
    }

    return toLastmod(latestContentDate)
  }

  const routes = listPublicIndexablePaths()

  const urls = routes
    .map((path) => {
      return `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmodForPath(path)}</lastmod>
  </url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
