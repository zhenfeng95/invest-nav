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
  },
})

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false }) as string
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
