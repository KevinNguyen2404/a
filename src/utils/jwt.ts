import jwt from 'jsonwebtoken'
export const signToken = ({
  payload,
  privateKey = process.env.JWR_SECRET as string,
  options = { algorithm: 'RS256' }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        //throw reject(error)
        reject(error)
      }
      resolve(token as string)
    })
  })
}
