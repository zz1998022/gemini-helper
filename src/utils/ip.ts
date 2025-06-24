import os from 'os'

export interface IPInfo {
  localhost: string
  lan: string
}

/**
 * 获取本地的 localhost 和局域网 IP 地址
 */
export function getIPInfo(): IPInfo {
  const interfaces = os.networkInterfaces()
  let lanIP = '127.0.0.1'

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        lanIP = iface.address
        break
      }
    }
  }

  return {
    localhost: '127.0.0.1',
    lan: lanIP,
  }
}

/**
 * 打印 IP 地址信息
 * @param port 服务端口号
 */
export function printServerInfo(port: number) {
  const ipInfo = getIPInfo()

  console.log(`\n🚀 服务已启动：`)
  console.log(`👉 本地访问:     http://${ipInfo.localhost}:${port}`)
  console.log(`👉 局域网访问:   http://${ipInfo.lan}:${port}`)
  console.log(`👉 API文档地址:   http://${ipInfo.localhost}:${port}/api-docs\n`)
}
