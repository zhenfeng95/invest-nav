import notesData from '~/data/notes.json'
import type { Note } from '~/types/note'

/**
 * 只读 notes.json 元数据（无正文 markdown）。
 * 列表页、搜索等轻量路径走这里，避免把全部笔记正文打进同一个 chunk。
 */
const noteMeta = notesData.items as Note[]

function cloneMeta(item: Note): Note {
  return { ...item }
}

function byPublishedDesc(a: Note, b: Note) {
  return b.publishedAt.localeCompare(a.publishedAt) || b.updatedAt.localeCompare(a.updatedAt)
}

export function getNoteMetaList(): Note[] {
  return [...noteMeta].sort(byPublishedDesc).map(cloneMeta)
}

export function getNoteMetaBySlug(slug: string): Note | undefined {
  const item = noteMeta.find(entry => entry.slug === slug)
  return item ? cloneMeta(item) : undefined
}

export function getNotes(): Note[] {
  return getNoteMetaList()
}

export function getLatestNotes(limit = 6): Note[] {
  return getNotes().slice(0, limit)
}
