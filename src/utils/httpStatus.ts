// 定义常见的 HTTP 状态码常量，方便在中间件或控制器中使用
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,
}

export default HttpStatus
