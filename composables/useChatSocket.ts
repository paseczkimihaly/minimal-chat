import { useWebSocket } from '@vueuse/core'
import type { WsServerPayload, WsClientPayload } from '~/types'

export function useChatSocket(roomId: string) {
  const messages = ref<WsServerPayload[]>([])
  const participantCount = ref(0)

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/ws/${roomId}`

  const { status, send, close } = useWebSocket(wsUrl, {
    autoReconnect: {
      retries: 5,
      delay: 2000,
      onFailed() {
        console.error('WebSocket reconnection failed after 5 retries')
      },
    },
    heartbeat: {
      message: 'ping',
      interval: 30000,
      pongTimeout: 5000,
    },
    onMessage(_ws, event) {
      try {
        const payload: WsServerPayload = JSON.parse(event.data)
        if (payload.type === 'participants') {
          participantCount.value = payload.count
        } else {
          messages.value.push(payload)
        }
      } catch {
        // Ignore non-JSON messages (pong frames, etc.)
      }
    },
  })

  function joinRoom(username: string, color: string) {
    const payload: WsClientPayload = { type: 'join', username, color }
    send(JSON.stringify(payload))
  }

  function sendMessage(username: string, color: string, content: string) {
    const payload: WsClientPayload = { type: 'message', username, color, content }
    send(JSON.stringify(payload))
  }

  return {
    messages,
    participantCount,
    status,
    joinRoom,
    sendMessage,
    close,
  }
}
