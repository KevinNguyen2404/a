import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()
/**
 * Express sẽ kiểm tra route phù hợp trong usersRouter
 * middleware toàn cục chuyển body JSON thành Object mình sử dụng cho req.body để thực
 */

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. Register a new user
 * Path: /register
 * Method:Post
 * Body:{name: string,email:string,password:string, password:string, confirm_password:string,date_of_birth:ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
export default usersRouter
