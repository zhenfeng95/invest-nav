import type { H3Event } from 'h3'
import type { ReportDetail, ReportListItem } from '~/types/report'
import { extractHeading, renderMarkdown, splitFrontmatter } from './markdown'

const LIST_TTL_MS = 10 * 60 * 1000
const FILE_TTL_MS = 30 * 60 * 1000
const MAX_CACHE_ENTRIES = 80

const SKIP_NAMES = new Set([
  'readme.md',
  'contributing.md',
  'license.md',
  'changelog.md',
  'code_of_conduct.md',
])

export interface GitHubReportsConfig {
  owner: string
  repo: string
  path: string
  ref: string
  token: string
}

export class GitHubReportsError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 502) {
    super(message)
    this.name = 'GitHubReportsError'
    this.statusCode = statusCode
  }
}

interface CacheEntry<T> {
  expiresAt: number
  value: T
}

interface GitHubTreeResponse {
  truncated?: boolean
  tree?: Array<{
    path: string
    type: string
  }>
}

interface GitHubContentFile {
  type: string
  path: string
  name: string
  encoding?: string
  content?: string
  download_url?: string | null
  html_url?: string
}

interface GitHubContentDirEntry {
  type: 'file' | 'dir' | string
  path: string
  name: string
}

const cache = new Map<string, CacheEntry<unknown>>()

export function getGitHubReportsConfig(event: H3Event): GitHubReportsConfig | null {
  const runtime = useRuntimeConfig(event)
  const env = getWorkerEnv(event)
  const owner = readEnv(runtime.githubReportsOwner, env.NUXT_GITHUB_REPORTS_OWNER)
  const repo = readEnv(runtime.githubReportsRepo, env.NUXT_GITHUB_REPORTS_REPO)

  if (!owner || !repo) {
    return null
  }

  return {
    owner,
    repo,
    path: readEnv(runtime.githubReportsPath, env.NUXT_GITHUB_REPORTS_PATH).replace(/^\/+|\/+$/g, ''),
    ref: readEnv(runtime.githubReportsRef, env.NUXT_GITHUB_REPORTS_REF) || 'main',
    token: readEnv(runtime.githubToken, env.NUXT_GITHUB_TOKEN),
  }
}

function getWorkerEnv(event: H3Event): Record<string, string | undefined> {
  const cloudflareEnv = event.context.cloudflare?.env
  if (cloudflareEnv && typeof cloudflareEnv === 'object') {
    return cloudflareEnv as Record<string, string | undefined>
  }
  return {}
}

function readEnv(...values: unknown[]): string {
  for (const value of values) {
    const text = String(value || '').trim()
    if (text) {
      return text
    }
  }
  return ''
}

export async function listReports(config: GitHubReportsConfig): Promise<ReportListItem[]> {
  const cacheKey = `list:${config.owner}/${config.repo}/${config.ref}/${config.path}`
  const cached = getCached<ReportListItem[]>(cacheKey)
  if (cached) {
    return cached
  }

  const treeUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees/${encodeURIComponent(config.ref)}?recursive=1`
  const tree = await githubJson<GitHubTreeResponse>(treeUrl, config.token)
  const paths = tree.truncated || !tree.tree?.length
    ? await listMarkdownPathsViaContents(config)
    : tree.tree
      .filter(entry => entry.type === 'blob')
      .map(entry => entry.path)

  const prefix = config.path ? `${config.path}/` : ''
  const items: ReportListItem[] = []

  for (const repoPath of paths) {
    if (!isReportPath(repoPath, prefix, config.path)) {
      continue
    }

    const name = repoPath.split('/').pop() || ''
    const relative = prefix
      ? (repoPath === config.path ? name : repoPath.slice(prefix.length))
      : repoPath
    const slug = relative.replace(/\.md$/i, '')
    const date = extractDate(name) ?? extractDate(relative)

    items.push({
      slug,
      title: titleFromName(name, date),
      date,
      path: repoPath,
    })
  }

  items.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) {
      return a.date < b.date ? 1 : -1
    }
    if (a.date && !b.date) {
      return -1
    }
    if (!a.date && b.date) {
      return 1
    }
    return a.slug < b.slug ? 1 : a.slug > b.slug ? -1 : 0
  })

  setCached(cacheKey, items, LIST_TTL_MS)
  return items
}

export async function getReport(config: GitHubReportsConfig, slug: string): Promise<ReportDetail | null> {
  const relativePath = resolveSlugPath(slug)
  if (!relativePath) {
    return null
  }

  const repoPath = config.path ? `${config.path}/${relativePath}` : relativePath
  const cacheKey = `file:${config.owner}/${config.repo}/${config.ref}/${repoPath}`
  const cached = getCached<ReportDetail>(cacheKey)
  if (cached) {
    return cached
  }

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeRepoPath(repoPath)}?ref=${encodeURIComponent(config.ref)}`
  const response = await githubFetch(url, config.token, 'application/vnd.github+json')
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw await githubError(response)
  }

  const data = await response.json() as GitHubContentFile
  if (data.type !== 'file') {
    return null
  }

  const markdown = await readFileContent(data, config.token)
  if (markdown === null) {
    return null
  }

  const { data: frontmatter, content } = splitFrontmatter(markdown)
  const fileDir = repoPath.split('/').slice(0, -1).join('/')
  const name = repoPath.split('/').pop() || ''
  const date = normalizeDate(frontmatter.date) ?? extractDate(name)
  const heading = extractHeading(content)
  const title = frontmatter.title || heading || titleFromName(name, date)
  const body = heading ? content.replace(/^#\s+.+\r?\n+/, '') : content

  const detail: ReportDetail = {
    slug,
    title,
    date,
    path: repoPath,
    htmlUrl: data.html_url || `https://github.com/${config.owner}/${config.repo}/blob/${config.ref}/${repoPath}`,
    html: renderMarkdown(body, { config, fileDir }),
  }

  setCached(cacheKey, detail, FILE_TTL_MS)
  return detail
}

function isReportPath(repoPath: string, prefix: string, configuredPath: string): boolean {
  if (!/\.md$/i.test(repoPath)) {
    return false
  }
  if (repoPath.includes('.github/') || repoPath.includes('node_modules/')) {
    return false
  }

  const name = repoPath.split('/').pop() || ''
  if (SKIP_NAMES.has(name.toLowerCase())) {
    return false
  }

  if (configuredPath) {
    return repoPath === configuredPath || repoPath.startsWith(prefix)
  }

  return !repoPath.includes('/')
}

function resolveSlugPath(slug: string): string | null {
  const cleaned = slug.trim().replace(/\.md$/i, '')
  if (!cleaned) {
    return null
  }

  const parts = cleaned.split('/').filter(Boolean)
  if (parts.some(part => part === '.' || part === '..' || part.includes('\\') || part.startsWith('.'))) {
    return null
  }

  return `${parts.join('/')}.md`
}

function titleFromName(name: string, date: string | null): string {
  const base = name.replace(/\.md$/i, '')
  const match = base.match(/^(\d{4}-\d{2}-\d{2})(?:[-_.\s]+(.+))?$/)
  if (match) {
    const dateLabel = chineseDate(match[1])
    return match[2] ? `${dateLabel} ${humanize(match[2])}` : `${dateLabel}收盘日报`
  }
  if (date) {
    return `${chineseDate(date)}收盘日报`
  }
  return humanize(base)
}

function humanize(value: string): string {
  return value.replace(/[-_]+/g, ' ').trim()
}

function chineseDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return value
  }
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}日`
}

function extractDate(value: string): string | null {
  const match = value.match(/(\d{4}-\d{2}-\d{2})/)
  return match ? normalizeDate(match[1]) : null
}

function normalizeDate(value?: string): string | null {
  if (!value) {
    return null
  }
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1] ?? null
}

async function listMarkdownPathsViaContents(config: GitHubReportsConfig): Promise<string[]> {
  return collectMarkdownPaths(config, config.path)
}

async function collectMarkdownPaths(config: GitHubReportsConfig, dirPath: string, depth = 0): Promise<string[]> {
  if (depth > 4) {
    return []
  }

  const suffix = dirPath ? `/${encodeRepoPath(dirPath)}` : ''
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents${suffix}?ref=${encodeURIComponent(config.ref)}`
  const data = await githubJson<GitHubContentDirEntry[] | GitHubContentFile>(url, config.token)
  if (!Array.isArray(data)) {
    return data.type === 'file' ? [data.path] : []
  }

  const paths: string[] = []
  for (const entry of data) {
    if (entry.type === 'file' && /\.md$/i.test(entry.name)) {
      paths.push(entry.path)
    }
    else if (entry.type === 'dir') {
      paths.push(...await collectMarkdownPaths(config, entry.path, depth + 1))
    }
  }
  return paths
}

async function readFileContent(file: GitHubContentFile, token: string): Promise<string | null> {
  if (file.encoding === 'base64' && typeof file.content === 'string') {
    return decodeBase64(file.content)
  }
  if (file.download_url) {
    const response = await githubFetch(file.download_url, token, 'application/vnd.github.raw')
    if (!response.ok) {
      throw await githubError(response)
    }
    return await response.text()
  }
  return null
}

function decodeBase64(content: string): string {
  const binary = atob(content.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

function encodeRepoPath(path: string): string {
  return path.split('/').filter(Boolean).map(encodeURIComponent).join('/')
}

async function githubJson<T>(url: string, token: string): Promise<T> {
  const response = await githubFetch(url, token, 'application/vnd.github+json')
  if (!response.ok) {
    throw await githubError(response)
  }
  return await response.json() as T
}

function githubFetch(url: string, token: string, accept: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: accept,
    'User-Agent': 'invest-nav',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return fetch(url, { headers })
}

async function githubError(response: Response): Promise<GitHubReportsError> {
  if (response.status === 401 || response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    if (remaining === '0' || response.status === 403) {
      return new GitHubReportsError('GitHub 接口暂时不可用，请稍后重试。', 503)
    }
    return new GitHubReportsError('GitHub 仓库访问失败，请检查 Token 与仓库权限。', 502)
  }
  if (response.status === 404) {
    return new GitHubReportsError('未找到对应的 GitHub 仓库或日报目录。', 404)
  }
  return new GitHubReportsError('读取 GitHub 日报失败。', 502)
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) {
    return null
  }
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return entry.value
}

function setCached<T>(key: string, value: T, ttlMs: number) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const first = cache.keys().next().value
    if (typeof first === 'string') {
      cache.delete(first)
    }
  }
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  })
}
