import httpStatus from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
/**
 * Dùng extends Error hãy hơn nhưng nó chỉ lấy message không lấy được status
 */
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}
// export class ErrorWithStatus extends Error {
//   status: number
//   constructor({ message, status }: { message: string; status: number }) {
//     super(message)
//     this.status = status
//   }
// }
type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
> // {[key:string]: string}
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
