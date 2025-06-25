import express from 'express'

import MenuController from '@ctrls/gemini/MenuController'

/**
 * @openapi
 * servers:
 *   - url: http://localhost:3000/api/menu
 *
 * tags:
 *   - name: Menu
 *     description: 菜单
 */

const router = express.Router()

/**
 * @openapi
 * /menu/menuList:
 *   get:
 *     summary: 获取菜单列表
 *     description: 分页获取系统菜单列表
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: query
 *         name: pageNum
 *         required: true
 *         schema:
 *           type: integer
 *         description: 当前页码
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *         description: 每页数量
 *     responses:
 *       0:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items: []
 *                     total:
 *                       type: number
 *                       example: 100
 */
router.get('/menuList', MenuController.menuList)

export default router
