import { PrismaClient } from '../../generated/prisma'
import type { sys_menu } from '../../generated/prisma'

class MenuService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  /**
   * 获取菜单列表
   */
  public getMenuList(): Promise<sys_menu[]> {
    return this.prisma.sys_menu.findMany({
      where: {
        id: 1,
      },
    })
  }
}

export default new MenuService()
