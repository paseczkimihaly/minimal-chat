<template>
  <div class="min-h-screen flex flex-col">
    <UsernamePrompt v-if="!username" @set="onUsernameSet" />

    <template v-else>
      <RoomHeader
        :room="room"
        :participant-count="participantCount"
        :status="socketStatus"
      />

      <ChatMessageList
        :messages="allMessages"
        :current-user="username"
        class="flex-1"
      />

      <ChatInput @send="onSend" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message, WsServerPayload } from '~/types'

const route = useRoute()
const roomId = route.params.id as string

const { username, userColor, setUsername } = useUsername()

// Fetch room data (SSR-safe)
const { data: room, error: roomError } = await useFetch(`/api/rooms/${roomId}`)
if (roomError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Room not found' })
}

// Fetch message history (SSR-safe)
const { data: history } = await useFetch<Message[]>(`/api/messages/${roomId}`)

// WebSocket state — initialized client-side in onMounted
const liveMessages = ref<WsServerPayload[]>([])
const participantCount = ref(0)
const socketStatus = ref('CONNECTING')

let joinRoomFn: ((username: string, color: string) => void) | null = null
let sendMessageFn: ((username: string, color: string, content: string) => void) | null = null

onMounted(() => {
  const socket = useChatSocket(roomId)

  watch(socket.messages, (msgs) => { liveMessages.value = msgs }, { immediate: true })
  watch(socket.participantCount, (c) => { participantCount.value = c }, { immediate: true })
  watch(socket.status, (s) => { socketStatus.value = s }, { immediate: true })

  joinRoomFn = socket.joinRoom
  sendMessageFn = socket.sendMessage

  if (username.value) {
    joinRoomFn(username.value, userColor.value)
  }
})

// Merge history + live messages
const allMessages = computed<WsServerPayload[]>(() => {
  const hist: WsServerPayload[] = (history.value ?? []).map((m) => ({
    type: 'message' as const,
    username: m.username,
    color: m.color || '#e5e7eb',
    content: m.content,
    createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt).toISOString(),
  }))
  return [...hist, ...liveMessages.value]
})

function onUsernameSet(name: string, color: string) {
  setUsername(name, color)
  joinRoomFn?.(name, userColor.value)
}

function onSend(content: string) {
  if (username.value && content.trim()) {
    sendMessageFn?.(username.value, userColor.value, content.trim())
  }
}
</script>
