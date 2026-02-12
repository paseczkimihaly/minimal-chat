import type { Room } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = await getDb()
  const room = await db.collection<Room>('rooms').findOne({ _id: id as any })

  if (!room) {
    throw createError({ statusCode: 404, statusMessage: 'Room not found' })
  }

  return room
})
