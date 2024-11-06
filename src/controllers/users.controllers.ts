import { Request, Response, NextFunction } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  // const { user }: any = req
  const user = req.user as User

  const user_id = user._id as ObjectId

  // throw new Error('Not implemented')
  console.log(user_id)
  const result = await userService.login(user_id.toString())
  return res.status(200).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
// export const registerController = async (req: Request, res: Response) => {
//   const { email, password } = req.body
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  // throw new Error('Lỗi rồi')

  // const result = await userService.register({ email, password })
  const result = await userService.register(req.body)

  return res.status(200).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })

  // return res.status(400).json({
  //   error: 'Register failed'
  // })
}
