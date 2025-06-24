// src/utils/proxySetup.ts
import { fetch, ProxyAgent, setGlobalDispatcher } from 'undici'

import { env } from '@config/env'

export function setupUndiciProxy() {
  if (env.USE_PROXY) {
    if (!env.PROXY_URL) {
      throw new Error('USE_PROXY 为 true 时必须提供 PROXY_URL')
    }

    const proxyAgent = new ProxyAgent({
      uri: env.PROXY_URL,
    })

    setGlobalDispatcher(proxyAgent)

    // ;(global as any).fetch = proxiedFetch
    console.log(`✅ 已启用 undici fetch 代理: ${env.PROXY_URL}`)
  } else {
    console.log('ℹ️ 未启用代理，使用默认 fetch')
  }
}
