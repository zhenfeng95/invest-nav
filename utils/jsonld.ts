import { siteAuthor } from '~/data/author'
import type { Note } from '~/types/note'
import type { ToolGuide } from '~/types/tool-guide'
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
                alternateName: '真投有道',
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
                alternateName: '真投有道',
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
                alternateName: '真投有道',
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

export function buildNoteJsonLd(siteUrl: string, note: Note) {
    const organizationId = `${siteUrl}/#organization`
    const pageUrl = absoluteUrl(siteUrl, `/notes/${note.slug}`)

    const article: Record<string, unknown> = {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: note.title,
        description: note.description,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: 'zh-CN',
        datePublished: toIsoDate(note.publishedAt),
        dateModified: toIsoDate(note.updatedAt),
        articleSection: note.category,
        keywords: note.tags,
        image: absoluteUrl(siteUrl, '/og-image.png'),
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

    if (note.readingMinutes) {
        article.timeRequired = `PT${note.readingMinutes}M`
    }

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': organizationId,
                name: SITE_NAME,
                alternateName: '真投有道',
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
                        name: '交易笔记',
                        item: absoluteUrl(siteUrl, '/notes'),
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: note.title,
                        item: pageUrl,
                    },
                ],
            },
        ],
    }
}

export function buildToolGuideJsonLd(
    siteUrl: string,
    input: { name: string; description: string; path: string; guide: ToolGuide },
) {
    const pageUrl = absoluteUrl(siteUrl, input.path)

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebApplication',
                '@id': `${pageUrl}#app`,
                name: input.name,
                description: input.description,
                url: pageUrl,
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Any',
                inLanguage: 'zh-CN',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'CNY',
                },
                isPartOf: {
                    '@id': `${siteUrl}/#website`,
                },
            },
            {
                '@type': 'FAQPage',
                '@id': `${pageUrl}#faq`,
                mainEntity: input.guide.faq.map(item => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.answer,
                    },
                })),
            },
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
                        name: '投资工具',
                        item: absoluteUrl(siteUrl, '/tools'),
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: input.name,
                        item: pageUrl,
                    },
                ],
            },
        ],
    }
}
