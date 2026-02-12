<template>
  <div v-if="message.type === 'system'" class="text-center py-1">
    <span class="text-xs text-gray-400 italic">{{ message.content }}</span>
  </div>

  <div
    v-else-if="message.type === 'message'"
    class="flex mb-2"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[75%] rounded-xl px-3 py-2"
      :class="isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'"
    >
      <p v-if="!isOwn" class="text-xs font-semibold mb-0.5" :class="isOwn ? 'text-blue-100' : 'text-gray-500'">
        {{ message.username }}
      </p>
      <p class="text-sm break-words">{{ message.content }}</p>
      <p class="text-[10px] mt-0.5 text-right" :class="isOwn ? 'text-blue-200' : 'text-gray-400'">
        {{ formattedTime }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WsServerPayload } from '~/types'

const props = defineProps<{
  message: WsServerPayload
  currentUser: string
}>()

const isOwn = computed(() =>
  props.message.type === 'message' && props.message.username === props.currentUser
)

const formattedTime = computed(() => {
  if (props.message.type !== 'message') return ''
  const date = new Date(props.message.createdAt)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>
