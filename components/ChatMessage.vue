<template>
  <div v-if="message.type === 'system'" class="text-center py-1">
    <span class="text-xs text-gray-400 dark:text-gray-500 italic">{{ message.content }}</span>
  </div>

  <div
    v-else-if="message.type === 'message'"
    class="flex mb-2 items-end gap-2"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div
      v-if="!isOwn"
      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black/50"
      :style="{ backgroundColor: message.color || '#9ca3af' }"
    >
      {{ initials }}
    </div>
    <div
      class="max-w-[75%] rounded-xl px-3 py-2"
      :class="isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'"
    >
      <p
        v-if="!isOwn"
        class="text-xs font-semibold mb-0.5"
        :style="{ color: darkenColor(message.color, 40) }"
      >
        {{ message.username }}
      </p>
      <p class="text-sm break-words">{{ message.content }}</p>
      <p class="text-[10px] mt-0.5 text-right" :class="isOwn ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'">
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

const initials = computed(() => {
  if (props.message.type !== 'message') return ''
  return props.message.username.slice(0, 2).toUpperCase()
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
