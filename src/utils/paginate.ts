import { Prisma } from '../generated/prisma'

/**
 * 分页返回结构体，仿照 MyBatis PageHelper 风格
 */
export interface PaginationResult<T> {
  endRow: number // 当前页最后一条数据的索引（从 1 开始）
  firstPage: number // 第一页页码（通常为 1）
  hasNextPage: boolean // 是否有下一页
  hasPreviousPage: boolean // 是否有上一页
  isFirstPage: boolean // 是否是第一页
  isLastPage: boolean // 是否是最后一页
  lastPage: number // 最后一页页码
  list: T[] // 当前页数据列表
  navigateFirstPage: number // 页码导航的第一个页码
  navigateLastPage: number // 页码导航的最后一个页码
  navigatePages: number // 页码导航长度，比如 5 表示显示 5 个连续页码
  navigatePageNums: number[] // 页码导航数组，比如 [1,2,3,4,5]
  nextPage: number // 下一页页码
  pageNum: number // 当前页码
  pageSize: number // 每页条数
  pages: number // 总页数
  prePage: number // 上一页页码
  size: number // 当前页实际条数
  startRow: number // 当前页第一条数据的索引（从 1 开始）
  total: number // 总数据条数
}

/**
 * 分页参数结构
 */
interface PageOptions {
  pageNum: number // 当前页码（从 1 开始）
  pageSize: number // 每页条数
}

/**
 * 通用分页函数
 * @param model - Prisma 的模型，例如 prisma.user
 * @param args - 查询参数，包含 where、orderBy 等
 * @param options - 分页参数（页码、每页数量）
 */
export async function paginate<T>(
  model: {
    findMany: (args: any) => Promise<T[]> // 获取数据列表
    count: (args: any) => Promise<number> // 获取总数量
  },
  args: Prisma.Enumerable<any>, // 查询参数
  options: PageOptions, // 分页参数
): Promise<PaginationResult<T>> {
  const { pageNum = 1, pageSize = 10 } = options
  const skip = (pageNum - 1) * pageSize // 跳过前 N 条数据
  const take = pageSize // 取 N 条数据

  // 同时获取当前页数据和总数量
  const [list, total] = await Promise.all([
    model.findMany({ ...args, skip, take }),
    model.count({ where: args.where }),
  ])

  const pages = Math.ceil(total / pageSize) // 总页数
  const isFirstPage = pageNum === 1
  const isLastPage = pageNum === pages

  const navigatePages = 5 // 设置导航长度为 5 页
  const half = Math.floor(navigatePages / 2)

  // 计算页码导航的起始页码
  let startNum = Math.max(1, pageNum - half)
  let endNum = Math.min(pages, pageNum + half)

  // 补齐导航页码长度不足的情况
  if (endNum - startNum < navigatePages - 1) {
    if (startNum === 1) {
      endNum = Math.min(startNum + navigatePages - 1, pages)
    } else if (endNum === pages) {
      startNum = Math.max(pages - navigatePages + 1, 1)
    }
  }

  // 构建页码数组
  const navigatePageNums = Array.from(
    { length: endNum - startNum + 1 },
    (_, i) => startNum + i,
  )

  return {
    endRow: skip + list.length,
    firstPage: 1,
    hasNextPage: pageNum < pages,
    hasPreviousPage: pageNum > 1,
    isFirstPage,
    isLastPage,
    lastPage: pages,
    list,
    navigateFirstPage: 1,
    navigateLastPage: pages,
    navigatePages,
    navigatePageNums,
    nextPage: pageNum < pages ? pageNum + 1 : pages,
    pageNum,
    pageSize,
    pages,
    prePage: pageNum > 1 ? pageNum - 1 : 1,
    size: list.length,
    startRow: skip + 1,
    total,
  }
}
