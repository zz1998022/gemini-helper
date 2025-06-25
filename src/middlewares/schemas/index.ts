import { z } from 'zod'

export const paginationSchema = z.object({
  pageNum: z.number({ message: '参数必须是数字' }).positive().default(1), // 如果没传，默认 1

  pageSize: z
    .number({ message: '参数必须是数字' })
    .positive()
    .max(100, '最大值为100')
    .default(10), // 默认 10
})

// 推导类型
export type PaginationQuery = z.infer<typeof paginationSchema>
