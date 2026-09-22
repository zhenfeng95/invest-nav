import notesData from '~/data/notes.json'
import { eightRulesTradingFramework } from '~/data/notes/eight-rules-trading-framework'
import { howToReviewTrading } from '~/data/notes/how-to-review-trading'
import { trendStockTradingTips } from '~/data/notes/trend-stock-trading-tips'
import { winEasyTradingCore } from '~/data/notes/win-easy-trading-core'
import type { Note } from '~/types/note'

const markdownFiles: Record<string, string> = {
  'eight-rules-trading-framework': eightRulesTradingFramework,
  'win-easy-trading-core': winEasyTradingCore,
  'how-to-review-trading': howToReviewTrading,
  'trend-stock-trading-tips': trendStockTradingTips,
}

const notes = (notesData.items as Note[]).map((item) => {
  if (!item.markdownFile) {
    return item
  }

  return {
    ...item,
    markdown: markdownFiles[item.markdownFile] ?? item.markdown,
  }
})

function byPublishedDesc(a: Note, b: Note) {
  return b.publishedAt.localeCompare(a.publishedAt) || b.updatedAt.localeCompare(a.updatedAt)
}

export function getNotes(): Note[] {
  return [...notes].sort(byPublishedDesc)
}

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find(item => item.slug === slug)
}

export function getLatestNotes(limit = 6): Note[] {
  return getNotes().slice(0, limit)
}
