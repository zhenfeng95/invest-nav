export const SITE_NAME = 'Zhen Invest';
export const SITE_NAME_EN = 'Zhen Invest';
export const SITE_TAGLINE = '跨境投资入口 · 港美股 / 开户教程';
export const SITE_DESCRIPTION =
    'Zhen Invest 面向内地用户整理港美股与跨境投资入口，涵盖开户教程、出入金路径与跨境资源导航，帮助你更快找到可靠信息与操作路径，让跨境投资更简单。';
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

/** 投研子菜单 */
export const researchNavLinks: NavLink[] = [
    { label: '现持仓', to: '/portfolio' },
    { label: '日复盘', to: '/reports' },
    { label: '周复盘', to: '/reviews/weekly' },
    { label: '月复盘', to: '/reviews/monthly' },
];

export const mainNav: NavItem[] = [
    { label: '首页', to: '/' },
    { label: '教程', to: '/tutorials' },
    { label: '导航', to: '/nav' },
    { label: '工具', to: '/tools' },
    {
        label: '投研',
        children: researchNavLinks,
    },
];

export const footerAboutLinks: NavLink[] = [
    { label: '关于我们', to: '/about' },
    { label: '免责声明', to: '/disclaimer' },
    { label: '隐私政策', to: '/privacy' },
    { label: '联系我们', to: '/contact' },
];

export const footerCategoryLinks: NavLink[] = [
    { label: '美股', to: '/nav/stocks' },
    { label: '基金', to: '/nav/funds' },
    { label: 'ETF', to: '/nav/etf' },
    { label: '境外银行卡', to: '/nav/overseas-banks' },
    { label: '美股券商', to: '/nav/overseas-brokers' },
    { label: '数字基建', to: '/nav/digital-infra' },
];

export const homeSeo = {
    title: 'Zhen Invest｜内地用户的港美股与跨境投资入口，让跨境投资更简单',
    description: SITE_DESCRIPTION,
};
