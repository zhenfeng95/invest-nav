import tutorialsData from '~/data/tutorials.json'
import { firstradeChinaAccountGuide } from '~/data/tutorials/firstrade-china-account-guide'
import { schwabChinaAccountGuide } from '~/data/tutorials/schwab-china-account-guide'
import { usmartSgAccountGuide } from '~/data/tutorials/usmart-sg-account-guide'
import { ccbAsiaAccountGuide } from '~/data/tutorials/ccb-asia-account-guide'
import { zaBankAccountGuide } from '~/data/tutorials/za-bank-account-guide'
import { esimGgAccountGuide } from '~/data/tutorials/esim-gg-account-guide'
import { lebaraAccountGuide } from '~/data/tutorials/lebara-account-guide'
import { xesimEsimAdapterGuide } from '~/data/tutorials/xesim-esim-adapter-guide'
import type { Tutorial, TutorialType } from '~/types/tutorial'

const markdownFiles: Record<string, string> = {
  'firstrade-china-account-guide': firstradeChinaAccountGuide,
  'schwab-china-account-guide': schwabChinaAccountGuide,
  'usmart-sg-account-guide': usmartSgAccountGuide,
  'ccb-asia-account-guide': ccbAsiaAccountGuide,
  'za-bank-account-guide': zaBankAccountGuide,
  'esim-gg-account-guide': esimGgAccountGuide,
  'lebara-account-guide': lebaraAccountGuide,
  'xesim-esim-adapter-guide': xesimEsimAdapterGuide,
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
