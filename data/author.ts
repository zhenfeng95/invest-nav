import { SITE_NAME, SITE_NAME_EN } from '~/utils/site';

export interface AuthorSocialLink {
    id: 'x' | 'youtube' | 'telegram';
    label: string;
    /** 留空则页面显示为待完善，不跳转 */
    url: string;
}

export interface AuthorProfile {
    /** 展示名 */
    name: string;
    /** 头像路径；可换成你的照片，例如 /images/author-avatar.png */
    avatar: string;
    tags: string[];
    /** 简介段落（第三段含社交高亮，在页面模板中单独渲染） */
    bios: string[];
    socials: AuthorSocialLink[];
    intents: string[];
    communityTopics: Array<{ icon: 'megaphone' | 'bug' | 'lightbulb'; text: string }>;
    /** 交流群链接；留空则按钮为待完善 */
    communityUrl: string;
    communityCta: string;
}

/**
 * 关于页作者资料（头像、社交、交流群等）。
 * 已按站点已知信息填写；其余字段请自行补全。
 */
export const siteAuthor: AuthorProfile = {
    name: `简投有道｜${SITE_NAME}`,
    avatar: '/logo.png',
    tags: ['港美股', '跨境投资', '开户教程', '数字基建'],
    bios: [
        `我是 ${SITE_NAME_EN}（简投有道）的维护者，持续整理港美股开户、出入金与跨境资源路径，并把个人投研复盘公开在站内，方便对照学习。`,
        '站点会持续分享开户与资金流转教程、官方资源导航、轻量工具，以及跨境数字基建相关实践。',
    ],
    socials: [
        { id: 'x', label: 'X', url: '' },
        { id: 'youtube', label: 'YouTube', url: '' },
        { id: 'telegram', label: 'Telegram', url: 'https://t.me/ZhenInvest' },
    ],
    intents: [
        '汇聚跨境投资相关公开资源与教程，帮助新手少走弯路',
        '把个人踩坑与实践沉淀成可对照的文档，而不是口号式推荐',
        '后续逐步建设更有价值的交流与反馈渠道',
    ],
    communityTopics: [
        { icon: 'megaphone', text: '网站功能建议反馈' },
        { icon: 'bug', text: '提出 Bug' },
        { icon: 'lightbulb', text: '新功能需求讨论' },
    ],
    communityUrl: '',
    communityCta: '加入交流群',
};
