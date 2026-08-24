import { Marked, type Renderer, type Tokens } from 'marked'

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html() {
      return ''
    },
    link(this: Renderer, { href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens)
      const url = href || ''
      const extra = /^https?:\/\//i.test(url)
        ? ' target="_blank" rel="noopener noreferrer"'
        : ''
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
      return `<a href="${escapeAttr(url)}"${titleAttr}${extra}>${text}</a>`
    },
    image({ href, title, text }: Tokens.Image) {
      const src = href || ''
      const alt = text || ''
      const width = parseImageWidth(title)
      const widthAttr = width ? ` width="${width}" style="width:${width}px;max-width:100%"` : ''
      const titleAttr = title && !width ? ` title="${escapeAttr(title)}"` : ''
      return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${widthAttr}${titleAttr} loading="lazy">`
    },
  },
})

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false }) as string
}

/** Accept title as width, e.g. "320" / "320px" / "w=320". */
function parseImageWidth(title: string | null | undefined): number | null {
  if (!title) {
    return null
  }
  const match = title.trim().match(/^(?:w[=:]?\s*)?(\d{2,4})(?:px)?$/i)
  if (!match) {
    return null
  }
  const value = Number(match[1])
  return value >= 40 && value <= 1600 ? value : null
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
