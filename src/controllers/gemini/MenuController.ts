import { Request, Response } from 'express'

import MenuService from '@svcs/gemini/MenuService'
import logger from '@utils/logger'
import ResponseModel from '@utils/response'

class MenuController {
  public async menuList(req: Request, res: Response): Promise<void> {
    try {
      const menuList = await MenuService.getMenuList()
      res.status(200).json(ResponseModel.success(menuList))
    } catch (error) {
      logger.error('Error in menu', error)
      res.status(500).json(ResponseModel.serverError())
    }
  }
}

export default new MenuController()
