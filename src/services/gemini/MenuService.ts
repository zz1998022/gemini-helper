import { PrismaClient } from '../../generated/prisma'
import type { sys_menu } from '../../generated/prisma'
import { paginate } from '@utils/paginate'

class MenuService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  /**
   * 获取用户分页列表
   * @param pageNum 当前页码
   * @param pageSize 每页数量
   */
  public async getMenuList(pageNum: number, pageSize: number) {
    return paginate<sys_menu>(
      this.prisma.sys_menu, // 模型
      {
        orderBy: { id: 'desc' },
      },
      { pageNum, pageSize },
    )
  }

  /**
   * 获取菜单列表
   */
  // public getMenuList(): Promise<sys_menu[]> {
  //   return this.prisma.sys_menu.findMany({
  //     where: {
  //       id: 1,
  //     },
  //   })
  // }
}

export default new MenuService()
