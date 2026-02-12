import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (db) return db

  const config = useRuntimeConfig()
  client = new MongoClient(config.mongodbUri)
  await client.connect()
  db = client.db()

  await db.collection('messages').createIndex({ roomId: 1, createdAt: 1 })

  return db
}
