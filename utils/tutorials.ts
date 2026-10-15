import type { Tutorial } from '~/types/tutorial'
import { getTutorialMetaBySlug } from '~/utils/tutorial-meta'

/**
 * 教程正文按文件懒加载（Vite 会拆成独立 async chunk）。
 * 列表 / 导航 / 搜索只应使用 ~/utils/tutorial-meta，不要静态 import 本模块的正文表。
 */
const markdownModules = import.meta.glob<{ [exportName: string]: unknown }>(
  '~/data/tutorials/*.ts',
)

const markdownCache = new Map<string, Promise<string | undefined>>()

function markdownModuleKey(markdownFile: string): string | undefined {
  const suffix = `/data/tutorials/${markdownFile}.ts`
  return Object.keys(markdownModules).find(key => key.endsWith(suffix))
}

/** 从一个教程模块里取出 markdown 字符串（每个文件通常只有一个命名导出） */
function pickMarkdownString(mod: Record<string, unknown>): string | undefined {
  for (const value of Object.values(mod)) {
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }
  return undefined
}

export function loadTutorialMarkdown(markdownFile: string): Promise<string | undefined> {
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

/** 悬停 / 空闲时预取正文 chunk，点击后可直接命中缓存 */
export function prefetchTutorialBySlug(slug: string) {
  if (!import.meta.client) {
    return
  }
  const meta = getTutorialMetaBySlug(slug)
  if (meta?.markdownFile) {
    void loadTutorialMarkdown(meta.markdownFile)
  }
}

/** 元数据 + 正文；仅详情页等需要全文的路径使用 */
export async function getTutorialBySlug(slug: string): Promise<Tutorial | undefined> {
  const meta = getTutorialMetaBySlug(slug)
  if (!meta) {
    return undefined
  }

  if (!meta.markdownFile) {
    return meta
  }

  const markdown = await loadTutorialMarkdown(meta.markdownFile)
  return {
    ...meta,
    markdown: markdown ?? meta.markdown,
  }
}
