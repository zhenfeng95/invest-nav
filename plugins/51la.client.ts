/**
 * 51.la 网站统计（仅客户端、仅生产、仅中国大陆）。
 * 国家码在客户端读 Cloudflare `/cdn-cgi/trace` 的 loc=，避免 SSR/预渲染按访客写入 payload，
 * 否则首页无法静态缓存（且 CF Workers 上 Nitro swr 也不会真正命中边缘）。
 */
const LA51_ID = '3RHTL8RwGW3UtM6w'
const LA51_CK = '3RHTL8RwGW3UtM6w'
const LA51_SDK = 'https://sdk.51.la/js-sdk-pro.min.js'

declare global {
  interface Window {
    LA?: {
      init: (options: {
        id: string
        ck: string
        autoTrack?: boolean
        hashMode?: boolean
        screenRecord?: boolean
      }) => void
    }
  }
}

async function isMainlandChina(): Promise<boolean> {
  try {
    const text = await fetch('/cdn-cgi/trace', { credentials: 'omit' }).then(r => r.text())
    const line = text.split('\n').find(row => row.startsWith('loc='))
    return (line?.slice(4) || '').trim().toUpperCase() === 'CN'
  } catch {
    return false
  }
}

export default defineNuxtPlugin(() => {
  // 用 import.meta.dev（构建会替换）。勿用 import.meta.prod：本站 CF 客户端包可能未替换。
  if (import.meta.dev) {
    return
  }

  void (async () => {
    if (!(await isMainlandChina())) {
      return
    }

    if (document.getElementById('LA_COLLECT')) {
      return
    }

    const script = document.createElement('script')
    script.charset = 'UTF-8'
    script.id = 'LA_COLLECT'
    script.src = LA51_SDK
    script.async = true
    script.onload = () => {
      window.LA?.init({
        id: LA51_ID,
        ck: LA51_CK,
        autoTrack: true,
        hashMode: true,
      })
    }
    document.head.appendChild(script)
  })()
})
