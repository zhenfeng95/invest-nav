import type { Note } from '~/types/note'
import { getNoteMetaBySlug } from '~/utils/note-meta'

/**
 * 笔记正文按文件懒加载（Vite 会拆成独立 async chunk）。
 * 列表 / 搜索只应使用 ~/utils/note-meta。
 */
const markdownModules = import.meta.glob<{ [exportName: string]: unknown }>(
  '~/data/notes/*.ts',
)

const markdownCache = new Map<string, Promise<string | undefined>>()

function markdownModuleKey(markdownFile: string): string | undefined {
  const suffix = `/data/notes/${markdownFile}.ts`
  return Object.keys(markdownModules).find(key => key.endsWith(suffix))
}

function pickMarkdownString(mod: Record<string, unknown>): string | undefined {
  for (const value of Object.values(mod)) {
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }
  return undefined
}

export function loadNoteMarkdown(markdownFile: string): Promise<string | undefined> {
  const cached = markdownCache.get(markdownFile)
  if (cached) {
    return cached
  }

  const key = markdownModuleKey(markdownFile)
  const pending = key
    ? markdownModules[key]!().then(pickMarkdownString)
    : Promise.resolve(undefined)

  markdownCache.set(markdownFile, pending)
  return pending
}

export function prefetchNoteBySlug(slug: string) {
  if (!import.meta.client) {
    return
  }
  const meta = getNoteMetaBySlug(slug)
  if (meta?.markdownFile) {
    void loadNoteMarkdown(meta.markdownFile)
  }
}

/** 元数据 + 正文；仅详情页使用 */
export async function getNoteBySlug(slug: string): Promise<Note | undefined> {
  const meta = getNoteMetaBySlug(slug)
  if (!meta) {
    return undefined
  }

  if (!meta.markdownFile) {
    return meta
  }

  const markdown = await loadNoteMarkdown(meta.markdownFile)
  return {
    ...meta,
    markdown: markdown ?? meta.markdown,
  }
}
