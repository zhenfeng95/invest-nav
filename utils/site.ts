export const SITE_NAME = 'Zhen Invest';
export const SITE_NAME_EN = 'Zhen Invest';
export const SITE_TAGLINE = '跨境投资入口 · 开户教程 / 资金路径 / 数字基建';
/** 首页 Hero 一句话介绍（与 SITE_DESCRIPTION 主题一致，更短） */
export const SITE_HERO_INTRO =
    '港美股与跨境投资入口：开户教程、出入金路径，以及域名与邮箱等数字基建导航。';
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

/** 投研子菜单（导航展示；现持仓 / 市场评分见 researchNavLinksHidden） */
export const researchNavLinks: NavLink[] = [
    { label: '日复盘', to: '/reports' },
    { label: '周复盘', to: '/reviews/weekly' },
    { label: '月复盘', to: '/reviews/monthly' },
];

/** 暂不展示在导航，页面与直达链接仍保留 */
export const researchNavLinksHidden: NavLink[] = [
    { label: '现持仓', to: '/portfolio' },
    { label: '市场评分', to: '/market' },
];

export const mainNav: NavItem[] = [
    { label: '首页', to: '/' },
    { label: '教程', to: '/tutorials' },
    { label: '导航', to: '/nav' },
    { label: '工具', to: '/tools' },
    { label: '笔记', to: '/notes' },
    {
        label: '投研',
        children: researchNavLinks,
    },
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
    { label: '资金流转', to: '/nav/fund-transfer' },
    { label: '出入金', to: '/nav/deposit-withdraw' },
    { label: '数字基建', to: '/nav/digital-infra' },
];

export const homeSeo = {
    title: 'Zhen Invest｜港美股与跨境投资入口，让跨境投资更简单',
    description: SITE_DESCRIPTION,
};
