import tutorialsData from '~/data/tutorials.json'
import { firstradeAccountGuide } from '~/data/tutorials/firstrade-account-guide'
import { schwabAccountGuide } from '~/data/tutorials/schwab-account-guide'
import { usmartSgAccountGuide } from '~/data/tutorials/usmart-sg-account-guide'
import { boscoAccountGuide } from '~/data/tutorials/bosco-account-guide'
import { ccbAsiaAccountGuide } from '~/data/tutorials/ccb-asia-account-guide'
import { hsbcHkAccountGuide } from '~/data/tutorials/hsbc-hk-account-guide'
import { zaBankAccountGuide } from '~/data/tutorials/za-bank-account-guide'
import { esimGgAccountGuide } from '~/data/tutorials/esim-gg-account-guide'
import { lebaraAccountGuide } from '~/data/tutorials/lebara-account-guide'
import { xesimEsimAdapterGuide } from '~/data/tutorials/xesim-esim-adapter-guide'
import { wiseAccountGuide } from '~/data/tutorials/wise-account-guide'
import { starrybluAccountGuide } from '~/data/tutorials/starryblu-account-guide'
import { googleWorkspaceDomainGuide } from '~/data/tutorials/google-workspace-domain-guide'
import { dnsheFreeDomainGuide } from '~/data/tutorials/dnshe-free-domain-guide'
import { usStockDepositAndTransferGuide } from '~/data/tutorials/us-stock-deposit-and-transfer'
import { howToChooseUsBrokerGuide } from '~/data/tutorials/how-to-choose-us-broker'
import { usAccountSystemInfographic } from '~/data/tutorials/us-account-system-infographic'
import { hkFundPathInfographic } from '~/data/tutorials/hk-fund-path-infographic'
import { etfTypesInfographic } from '~/data/tutorials/etf-types-infographic'
import { etfVsFundGuide } from '~/data/tutorials/etf-vs-fund'
import { usBrokerAccountIn5Min } from '~/data/tutorials/us-broker-account-in-5-min'
import { hkBankFundFlowDemo } from '~/data/tutorials/hk-bank-fund-flow-demo'
import { hkCardMainlandAtmCashGuide } from '~/data/tutorials/hk-card-mainland-atm-cash'
import { hkCardBindWechatAlipayGuide } from '~/data/tutorials/hk-card-bind-wechat-alipay'
import type { Tutorial, TutorialType } from '~/types/tutorial'
import { getNavigationPath } from '~/utils/navigation'

const markdownFiles: Record<string, string> = {
  'firstrade-account-guide': firstradeAccountGuide,
  'schwab-account-guide': schwabAccountGuide,
  'usmart-sg-account-guide': usmartSgAccountGuide,
  'bosco-account-guide': boscoAccountGuide,
  'ccb-asia-account-guide': ccbAsiaAccountGuide,
  'hsbc-hk-account-guide': hsbcHkAccountGuide,
  'za-bank-account-guide': zaBankAccountGuide,
  'esim-gg-account-guide': esimGgAccountGuide,
  'lebara-account-guide': lebaraAccountGuide,
  'xesim-esim-adapter-guide': xesimEsimAdapterGuide,
  'wise-account-guide': wiseAccountGuide,
  'starryblu-account-guide': starrybluAccountGuide,
  'google-workspace-domain-guide': googleWorkspaceDomainGuide,
  'dnshe-free-domain-guide': dnsheFreeDomainGuide,
  'us-stock-deposit-and-transfer': usStockDepositAndTransferGuide,
  'how-to-choose-us-broker': howToChooseUsBrokerGuide,
  'us-account-system-infographic': usAccountSystemInfographic,
  'hk-fund-path-infographic': hkFundPathInfographic,
  'etf-types-infographic': etfTypesInfographic,
  'etf-vs-fund': etfVsFundGuide,
  'us-broker-account-in-5-min': usBrokerAccountIn5Min,
  'hk-bank-fund-flow-demo': hkBankFundFlowDemo,
  'hk-card-mainland-atm-cash': hkCardMainlandAtmCashGuide,
  'hk-card-bind-wechat-alipay': hkCardBindWechatAlipayGuide,
}

const tutorials = (tutorialsData.items as Tutorial[]).map((item) => {
  if (!item.markdownFile) {
    return item
  }

  return {
    ...item,
    markdown: markdownFiles[item.markdownFile] ?? item.markdown,
  }
})

export function getTutorials(): Tutorial[] {
  return [...tutorials]
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find(item => item.slug === slug)
}

export function getTutorialsByType(type: TutorialType): Tutorial[] {
  return tutorials.filter(item => item.type === type)
}

export function getTutorialsByCategories(categories: string[]): Tutorial[] {
  if (categories.length === 0) {
    return []
  }

  const set = new Set(categories)
  return tutorials
    .filter(item => set.has(item.category))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getTutorialPlainText(tutorial: Tutorial): string {
  if (tutorial.markdown) {
    return tutorial.markdown
  }
  if (tutorial.content?.length) {
    return tutorial.content.join('\n\n')
  }
  return tutorial.description || ''
}

export function getPopularTutorials(limit = 6): Tutorial[] {
  return tutorials
    .filter(item => item.popular)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}

export function getLatestTutorials(limit = 4): Tutorial[] {
  return [...tutorials]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}

export function getTutorialTypeLabel(type: TutorialType): string {
  switch (type) {
    case 'article':
      return '文字教程'
    case 'video':
      return '视频教程'
    case 'infographic':
      return '一图看懂'
    default:
      return '教程'
  }
}

/** 卡片 / 导航用短名；详情页可用全称 */
const tutorialCategoryFullNames: Record<string, string> = {
  数字基建: '跨境数字基建',
}

export function getTutorialCategoryLabel(
  category: string,
  variant: 'short' | 'full' = 'short',
): string {
  if (variant === 'full') {
    return tutorialCategoryFullNames[category] ?? category
  }
  return category
}

export function getTutorialCategoryNavSlug(category: string): string | undefined {
  switch (category) {
    case '美股券商':
      return 'overseas-brokers'
    case '香港银行':
      return 'overseas-banks'
    case '境外手机卡':
      return 'overseas-sim'
    case '资金流转':
      return 'fund-transfer'
    case '出入金':
      return 'deposit-withdraw'
    case '数字基建':
      return 'digital-infra'
    case 'ETF':
      return 'etf'
    case '基金':
      return 'funds'
    default:
      return undefined
  }
}

export function getTutorialCategoryNavPath(category: string): string | undefined {
  const slug = getTutorialCategoryNavSlug(category)
  return slug ? getNavigationPath(slug) : undefined
}
