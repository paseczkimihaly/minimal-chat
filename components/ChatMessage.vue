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
      :class="isOwn ? 'text-white' : 'text-gray-900'"
      :style="bubbleStyle"
    >
      <p
        v-if="!isOwn"
        class="text-xs font-semibold mb-0.5"
        :style="{ color: darkenColor(message.color, 40) }"
      >
        {{ message.username }}
      </p>
      <p class="text-sm break-words">{{ message.content }}</p>
      <p class="text-[10px] mt-0.5 text-right" :class="isOwn ? 'text-blue-200' : 'opacity-50'">
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

const bubbleStyle = computed(() => {
  if (props.message.type !== 'message') return {}
  if (isOwn.value) {
    return { backgroundColor: '#2563eb' } // blue-600
  }
  return { backgroundColor: props.message.color || '#e5e7eb' }
})

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent))
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent))
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

const formattedTime = computed(() => {
  if (props.message.type !== 'message') return ''
  const date = new Date(props.message.createdAt)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>
