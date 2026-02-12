import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { username } from 'better-auth/plugins'

let authInstance: ReturnType<typeof betterAuth> | null = null

export async function getAuth() {
  if (authInstance) return authInstance

  const client = await getMongoClient()
  const db = client.db()

  authInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    trustedOrigins: ['http://localhost:*'],
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 30,
      }),
    ],
  })

  return authInstance
}
