import { Request, Response } from 'express'

import MenuService from '@svcs/gemini/MenuService'
import logger from '@utils/logger'
import ResponseModel from '@utils/response'
import { PaginationQuery } from '@src/middlewares/schemas'

class MenuController {
  public async menuList(
    req: Request<any, any, PaginationQuery>,
    res: Response,
  ): Promise<void> {
    try {
      const { pageNum, pageSize } = req.body

      const menuList = await MenuService.getMenuList(pageNum, pageSize)
      res.status(200).json(ResponseModel.success(menuList))
    } catch (error) {
      logger.error('Error in menu', error)
      res.status(500).json(ResponseModel.serverError())
    }
  }
}

export default new MenuController()
