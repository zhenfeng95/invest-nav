import { siteAuthor } from '~/data/author'
import type { Tutorial, TutorialType } from '~/types/tutorial'
import { SITE_CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME } from '~/utils/site'

const tutorialListingByType: Record<TutorialType, { name: string; path: string }> = {
    article: { name: '文字教程', path: '/tutorials/articles' },
    video: { name: '视频教程', path: '/tutorials/videos' },
    infographic: { name: '一图看懂', path: '/tutorials/infographics' },
}

function absoluteUrl(siteUrl: string, path: string): string {
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildHomeJsonLd(siteUrl: string) {
    const organizationId = `${siteUrl}/#organization`
    const websiteId = `${siteUrl}/#website`
    const sameAs = siteAuthor.socials.map(item => item.url.trim()).filter(Boolean)

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': organizationId,
                name: SITE_NAME,
                alternateName: '简投有道',
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: absoluteUrl(siteUrl, '/logo.png'),
                },
                email: SITE_CONTACT_EMAIL,
                sameAs,
            },
            {
                '@type': 'WebSite',
                '@id': websiteId,
                name: SITE_NAME,
                alternateName: '简投有道',
                url: siteUrl,
                description: SITE_DESCRIPTION,
                inLanguage: 'zh-CN',
                publisher: {
                    '@id': organizationId,
                },
            },
        ],
    }
}

function toIsoDate(value: string): string {
    return value.slice(0, 10)
}

function mediaUrl(siteUrl: string, path?: string): string | undefined {
    const value = path?.trim()
    if (!value) {
        return undefined
    }

    if (/^https?:\/\//i.test(value)) {
        return value
    }

    return absoluteUrl(siteUrl, value)
}

export function buildTutorialJsonLd(siteUrl: string, tutorial: Tutorial) {
    const organizationId = `${siteUrl}/#organization`
    const pageUrl = absoluteUrl(siteUrl, `/tutorials/${tutorial.slug}`)
    const listing = tutorialListingByType[tutorial.type]
    const image = mediaUrl(siteUrl, tutorial.image || tutorial.thumbnail) ?? absoluteUrl(siteUrl, '/og-image.png')
    const videoUrl = tutorial.videoUrl?.trim()

    const article: Record<string, unknown> = {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: tutorial.title,
        description: tutorial.description,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: 'zh-CN',
        datePublished: toIsoDate(tutorial.publishedAt),
        dateModified: toIsoDate(tutorial.updatedAt),
        articleSection: tutorial.category,
        keywords: tutorial.tags,
        image,
        author: {
            '@id': organizationId,
        },
        publisher: {
            '@id': organizationId,
        },
        isPartOf: {
            '@id': `${siteUrl}/#website`,
        },
    }

    if (tutorial.readingMinutes) {
        article.timeRequired = `PT${tutorial.readingMinutes}M`
    }

    if (videoUrl) {
        article.video = {
            '@type': 'VideoObject',
            name: tutorial.title,
            description: tutorial.description,
            embedUrl: videoUrl,
            thumbnailUrl: mediaUrl(siteUrl, tutorial.thumbnail || tutorial.image),
            uploadDate: toIsoDate(tutorial.publishedAt),
        }
    }

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': organizationId,
                name: SITE_NAME,
                alternateName: '简投有道',
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: absoluteUrl(siteUrl, '/logo.png'),
                },
            },
            article,
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: SITE_NAME,
                        item: siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: '教程',
                        item: absoluteUrl(siteUrl, '/tutorials'),
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: listing.name,
                        item: absoluteUrl(siteUrl, listing.path),
                    },
                    {
                        '@type': 'ListItem',
                        position: 4,
                        name: tutorial.title,
                        item: pageUrl,
                    },
                ],
            },
        ],
    }
}
