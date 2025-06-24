import 'module-alias/register'
import dotenv from 'dotenv'

import { env } from '@config/env'
import { printServerInfo } from '@utils/ip'
import { setupUndiciProxy } from '@utils/proxySetup'

// 加载环境变量
dotenv.config()
// 设置全局代理
setupUndiciProxy()

import App from './app'

const PORT = process.env.PORT || 4000
const app = new App()

app.express.listen(PORT, () => {
  printServerInfo(env.PORT)
})
