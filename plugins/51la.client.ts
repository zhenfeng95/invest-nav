/**
 * 51.la 网站统计（仅客户端、仅生产环境）。
 * 参数与站长后台「同步安装」一致：autoTrack + hashMode（SPA）。
 * 未开启屏幕录制。
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
  if (!import.meta.prod) {
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
