// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    // Vite 冷启动会在 Nitro 写出 manifest 之前扫描 #app-manifest，导致 pre-transform 报错。
    // 本站未使用客户端 payload，关闭即可。
    experimental: {
        appManifest: false,
    },

    routeRules: {
        '/tutorials/bosco-china-account-guide': {
            redirect: { to: '/tutorials/bosco-account-guide', statusCode: 301 },
        },
        '/tutorials/firstrade-china-account-guide': {
            redirect: { to: '/tutorials/firstrade-account-guide', statusCode: 301 },
        },
        '/tutorials/schwab-china-account-guide': {
            redirect: { to: '/tutorials/schwab-account-guide', statusCode: 301 },
        },
    },

    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

    css: ['~/assets/css/main.css'],

    colorMode: {
        preference: 'light',
        fallback: 'light',
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'invest-nav-color-mode-v2',
    },

    tailwindcss: {
        cssPath: '~/assets/css/main.css',
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],

    app: {
        head: {
            htmlAttrs: {
                lang: 'zh-CN',
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap',
                },
            ],
            meta: [{ name: 'theme-color', content: '#F7F7F5' }],
        },
    },

    runtimeConfig: {
        githubToken: '',
        githubReportsOwner: '',
        githubReportsRepo: '',
        githubReportsPath: '',
        githubMonthlyReviewsPath: 'output/reviews/monthly',
        githubWeeklyReviewsPath: 'output/reviews/weekly',
        githubReportsRef: 'main',
        githubTradesPath: 'data/raw/trades',
        public: {
            siteUrl: 'http://localhost:3000',
            siteName: 'Zhen Invest',
        },
    },

    nitro: {
        preset: 'cloudflare_module',
        cloudflare: {
            deployConfig: true,
            nodeCompat: true,
            wrangler: {
                name: 'invest-nav',
                vars: {
                    NUXT_PUBLIC_SITE_URL: 'https://zheninvest.com',
                    NUXT_GITHUB_REPORTS_OWNER: 'zhenfeng95',
                    NUXT_GITHUB_REPORTS_REPO: 'invest-agent',
                    NUXT_GITHUB_REPORTS_PATH: 'output/daily',
                    NUXT_GITHUB_MONTHLY_REVIEWS_PATH: 'output/reviews/monthly',
                    NUXT_GITHUB_WEEKLY_REVIEWS_PATH: 'output/reviews/weekly',
                    NUXT_GITHUB_REPORTS_REF: 'main',
                    NUXT_GITHUB_TRADES_PATH: 'data/raw/trades',
                },
            },
        },
    },

    typescript: {
        strict: true,
    },
});
