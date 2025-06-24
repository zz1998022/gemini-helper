import swaggerJSDoc from 'swagger-jsdoc'
import fs from 'fs'
import path from 'path'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API with Swagger',
      version: '1.0.0',
      description: 'API 文档',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/gemini/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

// 确定输出路径
const outputFilePath = path.resolve(__dirname, '../swagger.json')

// 写入文件
fs.writeFileSync(outputFilePath, JSON.stringify(swaggerSpec, null, 2))

console.log(`✅ Swagger JSON 已生成在：${outputFilePath}`)
