import { Request, Response } from 'express'

import ChatService from '@svcs/gemini/ChatService'
import ResponseModel from '@utils/response'

class ChatController {
  public async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body
      if (!message) {
        res.status(400).json(ResponseModel.error(400, '请填写消息'))
        return
      }

      const reply = await ChatService.chat(message)
      res.json(ResponseModel.success(reply))
    } catch (error) {
      console.error('Error in chat:', error)
      res.status(500).json(ResponseModel.serverError())
    }
  }

  public async handleChatStream(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body
      if (!message) {
        res.status(400).json(ResponseModel.error(400, '请填写消息'))
        return
      }

      // 设置流式响应头
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.flushHeaders() // 确保浏览器立即开始监听流
      await ChatService.chatStream(message, (text: string) => {
        // 发送每个文本块给客户端
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      })

      res.end()
    } catch (error) {
      console.error('Error in chat:', error)
      res.status(500).json(ResponseModel.serverError())
    }
  }
}

export default new ChatController()
