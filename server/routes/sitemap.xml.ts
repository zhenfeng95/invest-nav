import { getTutorials } from '~/utils/tutorials'

const routes = [
  '/',
  '/tutorials',
  '/tutorials/articles',
  '/tutorials/videos',
  '/tutorials/infographics',
  ...getTutorials().map(item => `/tutorials/${item.slug}`),
  '/tools',
  '/tools/portfolio',
  '/tools/qdii',
  '/tools/calendar',
  '/tools/signal',
  '/tools/spatial',
  '/nav',
  '/nav/stocks',
  '/nav/crypto',
  '/nav/funds',
  '/nav/etf',
  '/nav/stocks-cn',
  '/nav/options',
  '/nav/overseas-banks',
  '/nav/overseas-sim',
  '/nav/overseas-brokers',
  '/nav/fund-transfer',
  '/nav/deposit-withdraw',
  '/reports',
  '/reviews/monthly',
  '/reviews/weekly',
  '/portfolio',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

export default defineEventHandler((event) => {
  const siteUrl = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const lastmod = '2026-08-18'

  const urls = routes
    .map((path) => {
      return `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
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
