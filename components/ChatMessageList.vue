<template>
  <div ref="container" class="flex-1 overflow-y-auto px-4 py-3">
    <div v-if="messages.length === 0" class="h-full flex items-center justify-center">
      <p class="text-gray-400 text-sm">No messages yet. Say hello!</p>
    </div>
    <ChatMessage
      v-for="(msg, i) in messages"
      :key="i"
      :message="msg"
      :current-user="currentUser"
    />
  </div>
</template>

<script setup lang="ts">
import type { WsServerPayload } from '~/types'

const props = defineProps<{
  messages: WsServerPayload[]
  currentUser: string
}>()

const container = ref<HTMLElement>()

function scrollToBottom() {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, scrollToBottom)
onMounted(scrollToBottom)
</script>
