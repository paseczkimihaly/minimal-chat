import { toWebRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const auth = await getAuth()
  return auth.handler(toWebRequest(event))
})
