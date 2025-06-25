import fs from 'fs'
import path from 'path'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swaggerDocument from '@config/swagger'
import ChatRoute from '@src/routes/gemini/chatRoute'
import MenuRoute from '@src/routes/gemini/menuRoute'
import UploadRoute from '@src/routes/gemini/uploadRoute'

// 加载 .env.dev 文件中的环境变量
dotenv.config()

// 获取当前环境
const mode = process.env.NODE_ENV ?? 'dev'

class App {
  public express: express.Application

  constructor() {
    this.express = express()
    this.cors()
    this.middleware()
    this.routes()
    this.staticFile()
    this.swagger()
    this.notFound()
  }

  private middleware(): void {
    this.express.use(express.json())
  }

  private routes(): void {
    this.express.use('/api/common', UploadRoute)
    this.express.use('/api/gemini', ChatRoute)
    this.express.use('/api/menu', MenuRoute)
  }

  private swagger(): void {
    const staticFile = mode === 'dev' ? '../public' : './public'
    // 👇 读取 swagger.json 文件
    // const swaggerPath = path.join(__dirname, staticFile, 'swagger.json') // 根据实际路径调整
    // const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))
    // console.log(swaggerDocument)

    this.express.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument),
    )
  }

  private cors(): void {
    this.express.use(cors())
  }

  private staticFile(): void {
    const staticFile = mode === 'dev' ? '../public' : './public'
    this.express.use(express.static(path.join(__dirname, staticFile)))
  }

  /**
   * 处理404
   * @private
   */
  private notFound(): void {
    this.express.use(((
      req: Request,
      res: Response,
      next: NextFunction,
    ): void => {
      const accept = req.headers.accept || ''

      if (req.path.startsWith('/api')) {
        res.status(404).json({
          code: 404,
          message: '接口不存在',
        })
        return
      }

      if (accept.includes('text/html')) {
        const staticFile = mode === 'dev' ? '../public' : './public'
        const filePath = path.join(__dirname, `${staticFile}/404.html`)
        res.status(404).sendFile(filePath)
        return
      }

      res.status(404).type('txt').send('Not Found')
    }) as express.RequestHandler)
  }
}

export default App
