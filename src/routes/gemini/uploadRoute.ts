import express from 'express'

import controller from '@ctrls/gemini/UploadController'

import uploadMiddleware from '../../middlewares/uploadMiddleware'

/**
 * @openapi
 * servers:
 *   - url: http://localhost:3000/api/common
 *
 * tags:
 *   - name: Common
 *     description: 公共接口
 */

const router = express.Router()

/**
 * @openapi
 * /common/upload:
 *   post:
 *     summary: 文件上传
 *     tags:
 *       - Common
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *                 description: 文件
 *     responses:
 *        0:
 *          description: 成功返回结果
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                    example: 0
 *                    description: 状态码
 *                  message:
 *                    type: string
 *                    example: "成功"
 *                    description: 提示信息
 *                  data:
 *                    type: string
 *                    description: 文件url
 */
router.post('/upload', uploadMiddleware.single('file'), controller.uploadFile)

export default router
