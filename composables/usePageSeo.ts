import { homeSeo, SITE_NAME } from '~/utils/site'

interface PageSeoInput {
  title: string
  description: string
  path?: string
  ogImage?: string
}

export function usePageSeo(input: PageSeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const image = input.ogImage ?? `${siteUrl}/og-image.png`
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title}｜${SITE_NAME}`

  useSeoMeta({
    title,
    description: input.description,
    ogTitle: title,
    ogDescription: input.description,
    ogImage: image,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: input.description,
    twitterImage: image,
  })

  useHead({
    link: input.path
      ? [{ rel: 'canonical', href: `${siteUrl}${input.path}` }]
      : [],
  })
}

export function useHomeSeo() {
  usePageSeo({
    title: homeSeo.title,
    description: homeSeo.description,
    path: '/',
  })
}
