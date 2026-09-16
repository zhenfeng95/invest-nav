import { buildHomeJsonLd } from '~/utils/jsonld';
import { homeSeo, SITE_NAME } from '~/utils/site';

export function useJsonLd(key: string, data: unknown) {
    useHead({
        script: [
            {
                key,
                type: 'application/ld+json',
                innerHTML: JSON.stringify(data),
            },
        ],
    });
}

interface PageSeoInput {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
}

/** Bing 建议约 25–160 字符；过短常见阈值约 50–70，目标取 70+。 */
const META_DESCRIPTION_MIN = 70;
const META_DESCRIPTION_MAX = 160;

function clipMetaDescription(text: string): string {
    if (text.length <= META_DESCRIPTION_MAX) {
        return text;
    }

    const sliced = text.slice(0, META_DESCRIPTION_MAX);
    const breakAt = Math.max(sliced.lastIndexOf('。'), sliced.lastIndexOf('；'), sliced.lastIndexOf('，'));

    if (breakAt >= META_DESCRIPTION_MIN) {
        return sliced.slice(0, breakAt + 1);
    }

    return sliced;
}

/**
 * 页面展示文案可以短；写入 meta description 时补足长度，并尽量保留页面差异。
 * 避免改 tutorials/nav 卡片上的短描述。
 */
export function normalizeMetaDescription(description: string, pageTitle: string): string {
    const base = description.trim();
    if (base.length >= META_DESCRIPTION_MIN) {
        return clipMetaDescription(base);
    }

    const label = pageTitle.replace(/｜.*$/, '').trim() || pageTitle.trim();
    const suffix = `Zhen Invest（简投有道）为内地用户整理「${label}」相关要点、操作路径与注意事项，覆盖港美股开户、出入金与跨境资源导航，内容仅供学习交流，不构成投资建议。`;
    const joiner = /[。.!？?]$/.test(base) ? '' : '。';
    return clipMetaDescription(`${base}${joiner}${suffix}`);
}

export function usePageSeo(input: PageSeoInput) {
    const config = useRuntimeConfig();
    const siteUrl = String(config.public.siteUrl).replace(/\/$/, '');
    const image = input.ogImage ?? `${siteUrl}/og-image.png`;
    const title = input.title.includes(SITE_NAME) ? input.title : `${input.title}｜${SITE_NAME}`;
    const description = normalizeMetaDescription(input.description, input.title);

    useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        ogImage: image,
        ogImageWidth: 1200,
        ogImageHeight: 630,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
    });

    useHead({
        link: input.path ? [{ rel: 'canonical', href: `${siteUrl}${input.path}` }] : [],
    });
}

export function useHomeSeo() {
    const config = useRuntimeConfig();
    const siteUrl = String(config.public.siteUrl).replace(/\/$/, '');

    usePageSeo({
        title: homeSeo.title,
        description: homeSeo.description,
        path: '/',
    });

    useJsonLd('ld-json-home', buildHomeJsonLd(siteUrl));
}
