/**
 * 读取 Cloudflare 边缘国家码，供 51.la 仅在中国大陆加载。
 * 规则：仅 CF-IPCountry === CN 时允许；缺失或其它地区一律不允许。
 */
export default defineNuxtPlugin(() => {
  const allowLa51 = useState<boolean>('la51-cn-only', () => false)
  const country = (useRequestHeader('cf-ipcountry') || '').trim().toUpperCase()
  allowLa51.value = country === 'CN'
})
