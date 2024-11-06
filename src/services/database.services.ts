import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.vodku3z.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
    //Truy cập vào cơ sở dữ liệu có tên là DB_NAME.
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      //Gửi một lệnh ping đến cơ sở dữ liệu. Lệnh ping là một cách đơn giản để kiểm tra xem cơ sở dữ liệu có sẵn sàng và phản hồi không
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error: ', error)
      throw error
    }
    // finally {

    //   await this.client.close() nó sẽ ngắt kết nối vs data
    // }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
}
const databaseService = new DatabaseService()
export default databaseService
