import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import httpStatus from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  //Trong Object Error có hai thuộc tính (key) là message và stack
  //Object.getOwnPropertyNames(err) là để lấy ra 2 key đó
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
    //Object.defineProperty dùng để set thuộc tính của key là  enumerable: true để cho các thuộc tính của object error được mở, để xuất ra được thông tin của object err
  })

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })

  //kHÔNG nên dùng res.json(err) thì nó luôn xuất http là 200 mặc định
  // res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  //dung omit để không hiển thị status
}
