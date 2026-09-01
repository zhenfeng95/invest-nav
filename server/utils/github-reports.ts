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
  reviewsPath: string
  tradesPath: string
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
    reviewsPath: readEnv(runtime.githubReviewsPath, env.NUXT_GITHUB_REVIEWS_PATH).replace(/^\/+|\/+$/g, '') || 'output/reviews',
    tradesPath: readEnv(runtime.githubTradesPath, env.NUXT_GITHUB_TRADES_PATH).replace(/^\/+|\/+$/g, '') || 'data/raw/trades',
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
  return listMarkdownDocs(config, config.path, 'daily')
}

export async function listReviews(config: GitHubReportsConfig): Promise<ReportListItem[]> {
  return listMarkdownDocs(config, config.reviewsPath, 'monthly')
}

async function listMarkdownDocs(
  config: GitHubReportsConfig,
  basePath: string,
  kind: 'daily' | 'monthly',
): Promise<ReportListItem[]> {
  const cacheKey = `list:${kind}:${config.owner}/${config.repo}/${config.ref}/${basePath}`
  const cached = getCached<ReportListItem[]>(cacheKey)
  if (cached) {
    return cached
  }

  const treeUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees/${encodeURIComponent(config.ref)}?recursive=1`
  const tree = await githubJson<GitHubTreeResponse>(treeUrl, config.token)
  const paths = tree.truncated || !tree.tree?.length
    ? await collectMarkdownPaths(config, basePath)
    : tree.tree
      .filter(entry => entry.type === 'blob')
      .map(entry => entry.path)

  const prefix = basePath ? `${basePath}/` : ''
  const items: ReportListItem[] = []

  for (const repoPath of paths) {
    if (!isReportPath(repoPath, prefix, basePath)) {
      continue
    }

    const name = repoPath.split('/').pop() || ''
    const relative = prefix
      ? (repoPath === basePath ? name : repoPath.slice(prefix.length))
      : repoPath
    const slug = relative.replace(/\.md$/i, '')
    const date = extractDate(name) ?? extractDate(relative)

    items.push({
      slug,
      title: titleFromName(name, date, kind),
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

export async function listRepoBlobs(config: GitHubReportsConfig, prefix: string): Promise<string[]> {
  const normalized = prefix.replace(/^\/+|\/+$/g, '')
  const cacheKey = `blobs:${config.owner}/${config.repo}/${config.ref}/${normalized}`
  const cached = getCached<string[]>(cacheKey)
  if (cached) {
    return cached
  }

  const treeUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees/${encodeURIComponent(config.ref)}?recursive=1`
  const tree = await githubJson<GitHubTreeResponse>(treeUrl, config.token)
  const start = normalized ? `${normalized}/` : ''
  const paths = tree.truncated || !tree.tree?.length
    ? await collectDirFiles(config, normalized)
    : tree.tree
      .filter(entry => entry.type === 'blob')
      .map(entry => entry.path)
      .filter(path => !normalized || path === normalized || path.startsWith(start))

  setCached(cacheKey, paths, LIST_TTL_MS)
  return paths
}

export async function getRepoFileText(config: GitHubReportsConfig, repoPath: string, ttlMs = FILE_TTL_MS): Promise<string | null> {
  const cacheKey = `text:${config.owner}/${config.repo}/${config.ref}/${repoPath}`
  const cached = getCached<string>(cacheKey)
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

  const text = await readFileContent(data, config.token)
  if (text !== null) {
    setCached(cacheKey, text, ttlMs)
  }
  return text
}

export async function getReport(config: GitHubReportsConfig, slug: string): Promise<ReportDetail | null> {
  return getMarkdownDoc(config, config.path, slug, 'daily')
}

export async function getReview(config: GitHubReportsConfig, slug: string): Promise<ReportDetail | null> {
  return getMarkdownDoc(config, config.reviewsPath, slug, 'monthly')
}

async function getMarkdownDoc(
  config: GitHubReportsConfig,
  basePath: string,
  slug: string,
  kind: 'daily' | 'monthly',
): Promise<ReportDetail | null> {
  const relativePath = resolveSlugPath(slug)
  if (!relativePath) {
    return null
  }

  const repoPath = basePath ? `${basePath}/${relativePath}` : relativePath
  const cacheKey = `file:${kind}:${config.owner}/${config.repo}/${config.ref}/${repoPath}`
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
  const title = frontmatter.title || heading || titleFromName(name, date, kind)
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

function titleFromName(name: string, date: string | null, kind: 'daily' | 'monthly' = 'daily'): string {
  const base = name.replace(/\.md$/i, '')
  const monthly = base.match(/^(?:monthly[-_])?(\d{4})-(\d{2})$/i)
  if (kind === 'monthly' || monthly) {
    if (monthly) {
      return `${monthly[1]}年${Number(monthly[2])}月交易复盘`
    }
    if (date) {
      const parts = date.match(/^(\d{4})-(\d{2})/)
      if (parts) {
        return `${parts[1]}年${Number(parts[2])}月交易复盘`
      }
    }
  }

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
  const day = value.match(/(\d{4}-\d{2}-\d{2})/)
  if (day) {
    return normalizeDate(day[1])
  }
  const month = value.match(/(?:monthly[-_])?(\d{4})-(\d{2})(?!\d)/i)
  if (month) {
    return `${month[1]}-${month[2]}-01`
  }
  return null
}

function normalizeDate(value?: string): string | null {
  if (!value) {
    return null
  }
  const day = value.trim().match(/^(\d{4}-\d{2}-\d{2})/)
  if (day) {
    return day[1]
  }
  const month = value.trim().match(/^(\d{4})-(\d{2})$/)
  if (month) {
    return `${month[1]}-${month[2]}-01`
  }
  return null
}

async function collectMarkdownPaths(config: GitHubReportsConfig, dirPath: string, depth = 0): Promise<string[]> {
  return (await collectDirFiles(config, dirPath, depth)).filter(path => /\.md$/i.test(path))
}

async function collectDirFiles(config: GitHubReportsConfig, dirPath: string, depth = 0): Promise<string[]> {
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
    if (entry.type === 'file') {
      paths.push(entry.path)
    }
    else if (entry.type === 'dir') {
      paths.push(...await collectDirFiles(config, entry.path, depth + 1))
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
