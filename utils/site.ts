export const SITE_NAME = 'Zhen Invest';
export const SITE_NAME_EN = 'Zhen Invest';
export const SITE_TAGLINE = '跨境投资入口 · 开户教程 / 资金路径 / 数字基建';
/** 首页 Hero 介绍（两行展示，见 HeroSection） */
export const SITE_HERO_INTRO_LINES = [
    '港美股与跨境投资入口',
    '开户教程 · 出入金路径 · 数字基建导航',
] as const;
export const SITE_HERO_INTRO = SITE_HERO_INTRO_LINES.join('：');
export const SITE_DESCRIPTION =
    'Zhen Invest 整理港美股与跨境投资入口，涵盖开户教程、出入金路径、域名与邮箱等数字基建，以及银行、券商与资金流转资源导航，帮助你更快找到可靠信息与操作路径，让跨境投资更简单。';
export const SITE_DISCLAIMER =
    '本站内容仅用于信息整理与学习交流，不构成投资建议、邀约或任何交易推荐；开户、转账与资产配置请以各机构官方披露为准，并请独立判断风险与合规要求。';
/** 公开联系邮箱；请确保该邮箱可正常收信 */
export const SITE_CONTACT_EMAIL = 'zen@zheninvest.com';
export const SITE_URL = 'https://zheninvest.com';

export interface NavLink {
    label: string;
    to: string;
}

export interface NavItem {
    label: string;
    to?: string;
    children?: NavLink[];
}

/** 投研子菜单（导航展示；复盘与持仓等见 researchNavLinksHidden） */
export const researchNavLinks: NavLink[] = [
    { label: '投资笔记', to: '/notes' },
    { label: '美股日报', to: '/reports?market=US' },
    { label: 'A股日报', to: '/reports?market=A' },
];

/** 暂不展示在导航，页面与直达链接仍保留 */
export const researchNavLinksHidden: NavLink[] = [
    { label: '日复盘', to: '/reports' },
    { label: '周复盘', to: '/reviews/weekly' },
    { label: '月复盘', to: '/reviews/monthly' },
    { label: '现持仓', to: '/portfolio' },
    { label: '市场评分', to: '/market' },
];

/** 头部「港美股券商」下拉（港资 / 美资列表页） */
export const brokerNavLinks: NavLink[] = [
    { label: '港资券商', to: '/nav/overseas-brokers/hk' },
    { label: '美资券商', to: '/nav/overseas-brokers/us' },
];

/** 头部「资金流转」下拉 */
export const fundNavLinks: NavLink[] = [
    { label: '汇款与出入金', to: '/nav/fund-transfer' },
    { label: '境外银行卡', to: '/nav/overseas-banks' },
    { label: '境外手机卡', to: '/nav/overseas-sim' },
];

export const mainNav: NavItem[] = [
    { label: '首页', to: '/' },
    {
        label: '港美股券商',
        children: brokerNavLinks,
    },
    {
        label: '资金流转',
        children: fundNavLinks,
    },
    {
        label: '投资研究',
        children: researchNavLinks,
    },
    { label: '投资工具', to: '/tools' },
    { label: '数字基建', to: '/nav/digital-infra' },
];

export const footerAboutLinks: NavLink[] = [
    { label: '交易笔记', to: '/notes' },
    { label: '关于我们', to: '/about' },
    { label: '免责声明', to: '/disclaimer' },
    { label: '隐私政策', to: '/privacy' },
    { label: '联系我们', to: '/contact' },
];

export const footerCategoryLinks: NavLink[] = [
    { label: '境外银行卡', to: '/nav/overseas-banks' },
    { label: '境外手机卡', to: '/nav/overseas-sim' },
    { label: '美股券商', to: '/nav/overseas-brokers' },
    { label: '汇款与出入金', to: '/nav/fund-transfer' },
    { label: '数字基建', to: '/nav/digital-infra' },
];

export const homeSeo = {
    title: 'Zhen Invest｜港美股与跨境投资入口，让跨境投资更简单',
    description: SITE_DESCRIPTION,
};
