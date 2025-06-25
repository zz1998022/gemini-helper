import { Request, Response, NextFunction } from 'express'
import { paginationSchema } from './schemas'
import ResponseModel from '@utils/response'

export default function validatePaginationBody(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = paginationSchema.safeParse(req.body)

  if (!result.success) {
    res
      .status(400)
      .json(
        ResponseModel.error(
          101,
          result.error.issues.map((e) => e.message).join(', '),
        ),
      )
    return
  }

  // 替换 req.body 为解析并验证后的类型安全对象
  req.body = result.data as any
  next()
}
