import { MongoClient,Db } from 'mongodb';

const uri = 'mongodb://localhost:27017'
const dbName = 'myProject'


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
