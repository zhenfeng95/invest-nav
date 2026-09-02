import { Marked, type Renderer, type Tokens } from 'marked'
import type { GitHubReportsConfig } from './github-reports'

interface MarkdownContext {
  config: GitHubReportsConfig
  fileDir: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function splitFrontmatter(source: string): { data: Record<string, string>, content: string } {
  const match = source.match(FRONTMATTER_RE)
  if (!match) {
    return { data: {}, content: source }
  }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const index = line.indexOf(':')
    if (index === -1) {
      continue
    }
    const key = line.slice(0, index).trim()
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key) {
      data[key] = value
    }
  }

  return {
    data,
    content: source.slice(match[0].length),
  }
}

export function extractHeading(source: string): string | null {
  const match = source.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() || null
}

export function renderMarkdown(source: string, ctx: MarkdownContext): string {
  const marked = new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      html() {
        return ''
      },
      link(this: Renderer, { href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens)
        const resolved = rewriteHref(href || '', ctx)
        const extra = /^https?:\/\//i.test(resolved)
          ? ' target="_blank" rel="noopener noreferrer"'
          : ''
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
        return `<a href="${escapeAttr(resolved)}"${titleAttr}${extra}>${text}</a>`
      },
      image({ href, title, text }) {
        const src = rewriteHref(href || '', ctx)
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
        return `<img src="${escapeAttr(src)}" alt="${escapeAttr(text || '')}"${titleAttr} loading="lazy">`
      },
    },
  })

  return marked.parse(source, { async: false }) as string
}

function rewriteHref(href: string, ctx: MarkdownContext): string {
  const raw = href.trim()
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return raw
  }
  if (/^(https?:|data:|blob:)/i.test(raw)) {
    return raw
  }

  const hashIndex = raw.indexOf('#')
  const pathPart = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw
  const hashSuffix = hashIndex >= 0 ? raw.slice(hashIndex) : ''
  const withoutQuery = pathPart.split('?')[0]
  const resolved = resolveRelativePath(ctx.fileDir, withoutQuery)
  if (!resolved) {
    return raw
  }

  if (/\.md$/i.test(withoutQuery)) {
    const sitePath = sitePathForMarkdown(resolved, ctx.config)
    if (sitePath) {
      return `${sitePath}${hashSuffix}`
    }
  }

  const { owner, repo, ref } = ctx.config
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${resolved}${hashSuffix}`
}

function sitePathForMarkdown(resolved: string, config: GitHubReportsConfig): string | null {
  const mappings: Array<{ base: string, route: string }> = [
    { base: config.path, route: '/reports' },
    { base: config.reviewsPath, route: '/reviews/monthly' },
    { base: config.weeklyReviewsPath, route: '/reviews/weekly' },
  ]

  for (const { base, route } of mappings) {
    if (!base) {
      continue
    }
    if (resolved === base) {
      return route
    }
    if (resolved.startsWith(`${base}/`)) {
      const slug = resolved.slice(base.length + 1).replace(/\.md$/i, '')
      return slug ? `${route}/${slug}` : route
    }
  }

  return null
}

function resolveRelativePath(fileDir: string, href: string): string | null {
  const base = href.startsWith('/')
    ? href.replace(/^\/+/, '')
    : [fileDir, href].filter(Boolean).join('/')
  const parts: string[] = []

  for (const part of base.split('/')) {
    if (!part || part === '.') {
      continue
    }
    if (part === '..') {
      if (parts.length === 0) {
        return null
      }
      parts.pop()
      continue
    }
    parts.push(part)
  }

  return parts.join('/')
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
