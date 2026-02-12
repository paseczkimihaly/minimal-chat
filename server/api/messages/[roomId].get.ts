import type { Message, Room } from '~/types'

export default defineEventHandler(async (event) => {
  const roomId = getRouterParam(event, 'roomId')
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 50, 200)

  const db = await getDb()

  const room = await db.collection<Room>('rooms').findOne({ _id: roomId as any })
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: 'Room not found' })
  }

  const messages = await db
    .collection<Message>('messages')
    .find({ roomId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return messages.reverse()
})
