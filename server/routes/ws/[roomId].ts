import type { WsClientPayload, WsServerPayload, Message } from '~/types'

const roomParticipants = new Map<string, Set<string>>()

export default defineWebSocketHandler({
  async open(peer) {
    const url = peer.request?.url || ''
    const roomId = url.split('/').filter(Boolean).pop()

    if (!roomId) {
      peer.close(4000, 'Missing room ID')
      return
    }

    ;(peer as any)._roomId = roomId
    peer.subscribe(roomId)
  },

  async message(peer, rawMessage) {
    const roomId = (peer as any)._roomId as string
    if (!roomId) return

    let payload: WsClientPayload
    try {
      payload = JSON.parse(rawMessage.text())
    } catch {
      return
    }

    if (payload.type === 'join') {
      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Set())
      }
      roomParticipants.get(roomId)!.add(peer.id)
      ;(peer as any)._username = payload.username
      ;(peer as any)._color = payload.color

      const systemMsg: WsServerPayload = {
        type: 'system',
        content: `${payload.username} joined the room`,
        createdAt: new Date().toISOString(),
      }
      peer.publish(roomId, JSON.stringify(systemMsg))
      peer.send(JSON.stringify(systemMsg))

      const countMsg: WsServerPayload = {
        type: 'participants',
        count: roomParticipants.get(roomId)!.size,
      }
      peer.publish(roomId, JSON.stringify(countMsg))
      peer.send(JSON.stringify(countMsg))
    }

    if (payload.type === 'message') {
      const db = await getDb()
      const now = new Date()
      const message: Message = {
        roomId,
        username: payload.username,
        color: payload.color,
        content: payload.content,
        createdAt: now,
      }
      await db.collection<Message>('messages').insertOne(message)

      const outgoing: WsServerPayload = {
        type: 'message',
        username: payload.username,
        color: payload.color,
        content: payload.content,
        createdAt: now.toISOString(),
      }
      peer.publish(roomId, JSON.stringify(outgoing))
      peer.send(JSON.stringify(outgoing))
    }
  },

  close(peer) {
    const roomId = (peer as any)._roomId as string
    const username = (peer as any)._username as string
    if (!roomId) return

    roomParticipants.get(roomId)?.delete(peer.id)
    const count = roomParticipants.get(roomId)?.size ?? 0

    if (count === 0) {
      roomParticipants.delete(roomId)
    }

    if (username) {
      const systemMsg: WsServerPayload = {
        type: 'system',
        content: `${username} left the room`,
        createdAt: new Date().toISOString(),
      }
      peer.publish(roomId, JSON.stringify(systemMsg))

      const countMsg: WsServerPayload = { type: 'participants', count }
      peer.publish(roomId, JSON.stringify(countMsg))
    }
  },
})
