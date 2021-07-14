import { MongoClient,Db } from 'mongodb';

const uri = 'mongodb://localhost:27017'
const dbName = 'myProject'


let cachedClient:MongoClient
let cachedDb:Db 

export async function DbConnection() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
