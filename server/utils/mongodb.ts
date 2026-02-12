import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getMongoClient(): Promise<MongoClient> {
  if (client) return client
  const config = useRuntimeConfig()
  client = new MongoClient(config.mongodbUri)
  await client.connect()
  return client
}

export async function getDb(): Promise<Db> {
  if (db) return db

  const mongoClient = await getMongoClient()
  db = mongoClient.db()

  await db.collection('messages').createIndex({ roomId: 1, createdAt: 1 })

  return db
}
