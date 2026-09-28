/**
 * 51.la 网站统计（仅客户端、仅生产、仅中国大陆）。
 * 是否加载由 plugins/la51-country.server.ts 根据 CF-IPCountry 写入的状态决定：
 * 仅 CN 为 true；缺失或不为 CN 则不加载。
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

export default defineNuxtPlugin(() => {
  // 用 import.meta.dev（构建会替换）。勿用 import.meta.prod：本站 CF 客户端包可能未替换。
  if (import.meta.dev) {
    return
  }

  const allowLa51 = useState<boolean>('la51-cn-only', () => false)
  if (!allowLa51.value) {
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
})
