import express from 'express'

import controller from '../../controllers/v1/ChatController'
import chatController from '../../controllers/v1/ChatController'

/**
 * @openapi
 * servers:
 *   - url: http://localhost:3000/api/gemini
 *
 * tags:
 *   - name: Chat
 *     description: 聊天相关接口
 */

const router = express.Router()

/**
 * @openapi
 * /gemini/chat:
 *   post:
 *     summary: 聊天-一次性返回
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: 聊天内容
 *           example:
 *             message: "你好世界"
 *     responses:
 *       0:
 *         description: 成功返回结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                   description: 状态码
 *                 message:
 *                   type: string
 *                   example: "成功"
 *                   description: 提示信息
 *                 data:
 *                   type: string
 *                   description: 返回数据
 *                   example: "你好世界"
 */
router.post('/chat', controller.handleChat.bind(chatController))

/**
 * @openapi
 * /gemini/chat-stream:
 *   post:
 *     summary: 聊天-流式返回
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: 用户输入的消息内容
 *           example:
 *             message: "你好世界"
 *     responses:
 *       0:
 *         description: 流式返回聊天结果（SSE）
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: "text/event-stream"
 */
router.post('/chat-stream', controller.handleChatStream.bind(chatController))

export default router
