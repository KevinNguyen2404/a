import express, { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
databaseService.connect().catch(console.dir)
const app = express()
const port = 3000
app.use(express.json()) //middleware toàn cục chuyển body JSON thành Object mình sử dụng cho req.body
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
