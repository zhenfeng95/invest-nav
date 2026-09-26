import { buildHomeJsonLd } from '~/utils/jsonld';
import { isPublicIndexablePath } from '~/utils/seo-index';
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

/** Bing：标题过短常见阈值约 25；描述过短约 70，目标取更稳的区间。 */
const META_TITLE_MIN = 25;
const META_TITLE_MAX = 60;
const META_DESCRIPTION_MIN = 90;
const META_DESCRIPTION_MAX = 160;

function stripBrandSuffix(title: string): string {
    const withoutBrand = title
        .replace(new RegExp(`[｜|]\\s*${SITE_NAME}\\s*$`), '')
        .replace(new RegExp(`^${SITE_NAME}\\s*[｜|]\\s*`), '')
        .trim();
    return withoutBrand || title.trim();
}

function clipMetaTitle(text: string): string {
    if (text.length <= META_TITLE_MAX) {
        return text;
    }

    const brandSuffix = `｜${SITE_NAME}`;
    const budget = META_TITLE_MAX - brandSuffix.length;
    if (budget < 8) {
        return text.slice(0, META_TITLE_MAX);
    }

    const core = stripBrandSuffix(text);
    const sliced = core.slice(0, budget);
    const breakAt = Math.max(sliced.lastIndexOf('｜'), sliced.lastIndexOf('，'), sliced.lastIndexOf(' '));
    const head = breakAt >= 10 ? sliced.slice(0, breakAt) : sliced;
    return `${head}${brandSuffix}`;
}

/**
 * 页面 H1 / 卡片可以短；写入 <title> 时补足长度，避免 Bing「标题太短」。
 */
export function normalizeMetaTitle(title: string): string {
    const raw = title.trim();
    const withBrand = raw.includes(SITE_NAME) ? raw : `${raw}｜${SITE_NAME}`;
    if (withBrand.length >= META_TITLE_MIN) {
        return clipMetaTitle(withBrand);
    }

    const label = stripBrandSuffix(raw);
    return clipMetaTitle(`${label}｜港美股开户教程与跨境投资入口｜${SITE_NAME}`);
}

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

    const label = stripBrandSuffix(pageTitle);
    const suffix = `Zhen Invest 为内地用户整理「${label}」相关要点、操作路径与注意事项，覆盖港美股开户、出入金与跨境资源导航，内容仅供学习交流，不构成投资建议。`;
    const joiner = /[。.!？?]$/.test(base) ? '' : '。';
    return clipMetaDescription(`${base}${joiner}${suffix}`);
}

export function usePageSeo(input: PageSeoInput) {
    const config = useRuntimeConfig();
    const siteUrl = String(config.public.siteUrl).replace(/\/$/, '');
    const image = input.ogImage ?? `${siteUrl}/og-image.png`;
    const title = normalizeMetaTitle(input.title);
    const description = normalizeMetaDescription(input.description, input.title);
    const indexable = Boolean(input.path && isPublicIndexablePath(input.path));

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
        robots: indexable ? 'index, follow' : 'noindex, follow',
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
