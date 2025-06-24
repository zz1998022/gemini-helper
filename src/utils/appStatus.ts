// 自定义应用级状态码，用于区分业务逻辑中的各种错误情况
interface AppStatus {
  code: number
  msg: string
}

const appStatus = {
  SUCCESS: { code: 0, msg: 'success' },
  UNAUTHORIZED: { code: 401, msg: '没有权限' },
  NOT_LOGIN: { code: 403, msg: '未登录' },
  SERVER_ERROR: { code: 500, msg: '服务器内部错误' },
  PARAM_ERROR: { code: 400, msg: '参数错误' },
}

export type { AppStatus }
export default appStatus
