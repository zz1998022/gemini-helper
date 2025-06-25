import express from 'express'

import validatePagination from '@src/middlewares/validatePagination'
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
 * @swagger
 * /menu/menuList:
 *   post:
 *     summary: 获取菜单分页列表
 *     description: 分页查询菜单数据，返回统一格式的分页结果。
 *     tags:
 *       - Menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageNum:
 *                 type: integer
 *                 description: 当前页码（从1开始）
 *                 example: 1
 *               pageSize:
 *                 type: integer
 *                 description: 每页条数
 *                 example: 10
 *     responses:
 *       '200':
 *         description: 请求成功，返回分页数据
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMenuResponse'
 *
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 菜单ID
 *         name:
 *           type: string
 *           description: 菜单名称
 *         path:
 *           type: string
 *           description: 路由路径
 *         component:
 *           type: string
 *           description: 组件路径
 *         parentId:
 *           type: integer
 *           description: 父菜单ID
 *         sort:
 *           type: integer
 *           description: 排序号
 *
 *     PaginatedMenuResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: 响应状态码 (0 表示成功)
 *         message:
 *           type: string
 *           description: 响应消息
 *         data:
 *           type: object
 *           properties:
 *             endRow:
 *               type: integer
 *               description: 当前页最后一条数据的索引（从1开始）
 *             firstPage:
 *               type: integer
 *               description: 第一页页码（通常为1）
 *             hasNextPage:
 *               type: boolean
 *               description: 是否有下一页
 *             hasPreviousPage:
 *               type: boolean
 *               description: 是否有上一页
 *             isFirstPage:
 *               type: boolean
 *               description: 是否是第一页
 *             isLastPage:
 *               type: boolean
 *               description: 是否是最后一页
 *             lastPage:
 *               type: integer
 *               description: 最后一页页码
 *             list:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *               description: 当前页数据列表
 *             navigateFirstPage:
 *               type: integer
 *               description: 页码导航的第一个页码
 *             navigateLastPage:
 *               type: integer
 *               description: 页码导航的最后一个页码
 *             navigatePages:
 *               type: integer
 *               description: 页码导航长度，比如5表示显示5个连续页码
 *             navigatePageNums:
 *               type: array
 *               items:
 *                 type: integer
 *               description: 页码导航数组，例如 [1,2,3,4,5]
 *             nextPage:
 *               type: integer
 *               description: 下一页页码
 *             pageNum:
 *               type: integer
 *               description: 当前页码
 *             pageSize:
 *               type: integer
 *               description: 每页条数
 *             pages:
 *               type: integer
 *               description: 总页数
 *             prePage:
 *               type: integer
 *               description: 上一页页码
 *             size:
 *               type: integer
 *               description: 当前页实际条数
 *             startRow:
 *               type: integer
 *               description: 当前页第一条数据的索引（从1开始）
 *             total:
 *               type: integer
 *               description: 总数据条数
 */
router.post('/menuList', validatePagination, MenuController.menuList)

export default router
