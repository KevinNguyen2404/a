import { EntityError } from './../models/Errors'
import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import httpStatus from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    //thu thập các lỗi xác thực (nếu có) và lưu chúng trong biến errors.
    const errors = await validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()

    const entityError = new EntityError( {errors: {}} )
    for (const key in errorsObject) {
      console.log('==================')
      console.log(errorsObject[key])
      const { msg } = errorsObject[key]

      //Trả về lỗi không phải là lỗi do validate(422)
      console.log(msg + 'hello')
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        //xuất ra các lỗi khác 422
        return next(msg)
      }
      //entityError.errors[key] = msg
      entityError.errors[key] = errorsObject[key]
      //[key] ở đây cũng sử dụng biến key để truy cập hoặc tạo một thuộc tính mới trong errors.
    }

    //tất cả lỗi không để trong validation nữa, bầy giờ chuyển sang middelware
    //trả về lỗi validate
    next(entityError)
    //res.status(422).json({ errors: errors.mapped() }) //dùng mapped nó sẽ gọp lại thành object dễ nhìn
  }
}
