import { signToken } from './../utils/jwt'
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType } from '~/constants/enums'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload, //Đây là cú pháp destructuring,  tất cả các thuộc tính của đối tượng payload sẽ được sao chép vào đối tượng mới được tạo ra trong new User
        date_of_birth: new Date(payload.date_of_birth), //phải chuyển sang kiểu Date để phù hợp với date_of_birth trong user.schema
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    // const [access_token, refresh_token] = await Promise.all([
    //   this.signAccessToken(user_id),
    //   this.signRefreshToken(user_id)
    // ])
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    return { access_token, refresh_token }
  }
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    return { access_token, refresh_token }
  }
}
const userService = new UsersService()
export default userService
