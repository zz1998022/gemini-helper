import fs from 'fs'
import path from 'path'

import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gemini生成短视频文案',
      version: '1.0.0',
      description: 'API 文档',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '基准请求地址',
      },
    ],
  },
  apis: ['./src/routes/gemini/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

// 获取当前环境变量
const mode = process.env.NODE_ENV as string
const outFile =
  mode === 'dev' ? '../../public/swagger.json' : '../public/swagger.json'
// 确定输出路径
const outputFilePath = path.resolve(__dirname, outFile)

// 开发环境下写入swagger.json
if (mode === 'dev') {
  fs.writeFileSync(outputFilePath, JSON.stringify(swaggerSpec, null, 2))

  console.log(`✅ Swagger JSON 已生成在：${outputFilePath}`)
}

export default swaggerSpec
