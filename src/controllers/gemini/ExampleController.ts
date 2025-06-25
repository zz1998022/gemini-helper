import { Request, Response } from 'express'

import exampleService from '@svcs/gemini/ExampleService'

import appStatus from '../../utils/appStatus'
import ResponseModel from '../../utils/response'

class ExampleController {
  // 示例接口：返回欢迎消息
  public getHelloWorld(req: Request, res: Response): void {
    const message = 'Hello from gemini service!'

    // 调用 ResponseModel.success 返回统一格式的成功响应
    res.json(ResponseModel.success({ message }))
  }

  // 示例接口：两个数字相加
  public addNumbers(req: Request, res: Response): void {
    const { a, b } = req.body

    // 参数校验
    if (typeof a !== 'number' || typeof b !== 'number') {
      // 如果参数不合法，返回参数错误的状态码和提示信息
      res.json(
        ResponseModel.error(
          appStatus.PARAM_ERROR.code,
          appStatus.PARAM_ERROR.msg,
        ),
      )
      return
    }

    // 调用 Service 层处理业务逻辑
    const result = exampleService.addNumbers(a, b)

    // 返回成功结果
    res.json(ResponseModel.success({ result }))
  }
}

export default new ExampleController()
