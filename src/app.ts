import path from 'path'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import ChatRoute from '@src/routes/gemini/chatRoute'
import UploadRoute from '@src/routes/gemini/uploadRoute'

import swaggerDocument from './config/swagger'

// 加载 .env 文件中的环境变量
dotenv.config()

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
  }

  private swagger(): void {
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
    this.express.use(express.static(path.join(__dirname, '../public')))
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
        const filePath = path.join(__dirname, '../public/404.html')
        res.status(404).sendFile(filePath)
        return
      }

      res.status(404).type('txt').send('Not Found')
    }) as express.RequestHandler) // 👈 加上类型断言
  }
}

export default App
