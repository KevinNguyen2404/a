import User from './models/schemas/User.schema'

declare module 'express'
declare module 'express' {
  //mở rộng kiểu dữ liệu user của Request
  interface Request {
    user?: User
  }
}
