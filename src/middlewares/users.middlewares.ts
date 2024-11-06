import { checkSchema } from 'express-validator'
import { registerController } from './../controllers/users.controllers'
import { Request, Response, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import userService from '~/services/users.services'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
export const loginValidator = validate(
  checkSchema({
    email: {
      // notEmpty: {
      //   errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      // },
      isEmail: {
        //isEmail nó đã check notEmpty nên không cần
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        //{ req } destructuring
        options: async (value, { req }) => {
          if (/[\u00C0-\u017F]/.test(value)) {
            // Kiểm tra dấu
            throw new Error(USERS_MESSAGES.EMAIL_IS_INVALID)
          }
          const user = await databaseService.users.findOne({ email: value })
          if (user === null) {
            throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value) => {
          // Kiểm tra không được có khoảng trắng và không được có dấu trong mật khẩu
          if (/[\s\u00C0-\u017F]/.test(value)) {
            // Kiểm tra xem có ký tự khoảng trắng hay không
            throw new Error(USERS_MESSAGES.PASSWORD_NO_SPACE_MARK)
          }
          return true
        }
      }
    }
  })
)
// (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body
//   if (!email || !password) {
//     return res.status(400).json({
//       error: 'Missing email or password'
//     })
//   }
//   next()
// }
export const registerValidator = validate(
  checkSchema({
    name: {
      // notEmpty: true,
      // isString: true,
      // isLength: { options: { min: 1, max: 100 } },
      // trim: true

      trim: true, //nó sẽ check từ trên xuống nên để trim trên
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },

      isLength: {
        options: {
          min: 1,
          max: 100
        },

        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      }
    },
    email: {
      // notEmpty: {
      //   errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      // },
      isEmail: {
        //isEmail nó đã check notEmpty nên không cần
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          if (/[\u00C0-\u017F]/.test(value)) {
            // Kiểm tra dấu
            throw new Error(USERS_MESSAGES.EMAIL_IS_INVALID)
          }
          const isExistEmail = await userService.checkEmailExists(value)
          if (isExistEmail) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      trim: true,
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value) => {
          // Kiểm tra không được có khoảng trắng và không được có dấu trong mật khẩu
          if (/[\s\u00C0-\u017F]/.test(value)) {
            // Kiểm tra xem có ký tự khoảng trắng hay không
            throw new Error(USERS_MESSAGES.PASSWORD_NO_SPACE_MARK)
          }
          return true
        }
      }
    },
    confirm_password: {
      trim: true,
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      },
      errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
    }
  })
)
