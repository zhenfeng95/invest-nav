/** 首页「本周推荐」细条；活动结束将 items 清空或整段设为 null 即可下线 */
export interface HomeWeeklySpotlightItem {
  badge?: string
  title: string
  description: string
  to: string
}

export interface HomeWeeklySpotlight {
  label: string
  items: HomeWeeklySpotlightItem[]
}

export const homeWeeklySpotlight: HomeWeeklySpotlight | null = {
  label: '本周推荐',
  items: [
    {
      badge: '活动进行中',
      title: '兴业银行寰宇人生借记卡开户教程',
      description: '大陆银行卡购汇后汇往香港汇丰：新办 / 一类户换卡、提额与费用对照',
      to: '/tutorials/cib-huanyu-account-guide',
    },
    {
      badge: '活动进行中',
      title: '宝时证券开户教程',
      description: '线上开户材料、见证流程与入金注意点，供对照官方页面',
      to: '/tutorials/bosco-account-guide',
    },
  ],
}
