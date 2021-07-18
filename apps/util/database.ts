import { MongoClient,Db } from 'mongodb';

const uri = process.env.DB_URI || 'mongodb://bigchaindb:27017'
const dbName = process.env.DB_NAME || 'myProject'


let cachedClient:MongoClient
let cachedDb:Db 

export async function DbConnection() :Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client:MongoClient = await MongoClient.connect(uri)

  const db:Db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
