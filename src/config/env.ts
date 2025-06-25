import * as path from 'path'

import { config } from 'dotenv'
import { z } from 'zod'

const mode = process.env.NODE_ENV ?? 'dev'
const envFile = `.env.${mode}`

config({
  path: path.resolve(process.cwd(), envFile),
}) // 读取对应环境变量文件

// 1️⃣ 定义 zod schema
const envSchema = z.object({
  USE_PROXY: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('false')
    .transform(Boolean),
  PROXY_URL: z.string().url().optional(),
  PORT: z.string().regex(/^\d+$/).transform(Number), // 转为 number 类型
  GEMINI_API_KEY: z.string(),
})

// 2️⃣ 校验 process.env
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ 环境变量验证失败！')
  console.error(_env.error.format())
  process.exit(1) // 退出进程
}

// 3️⃣ 导出验证后的、类型安全的 env
export const env = _env.data
