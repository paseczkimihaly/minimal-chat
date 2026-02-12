import { nanoid } from 'nanoid'
import type { Room } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; createdBy: string }>(event)

  if (!body.name?.trim() || !body.createdBy?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Room name and username are required' })
  }

  const db = await getDb()
  const room: Room = {
    _id: nanoid(12),
    name: body.name.trim(),
    createdBy: body.createdBy.trim(),
    createdAt: new Date(),
  }

  await db.collection<Room>('rooms').insertOne(room as any)
  return room
})
