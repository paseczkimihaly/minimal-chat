<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pl-4 pr-12 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <NuxtLink to="/" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ room?.name ?? 'Chat Room' }}</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          {{ participantCount }} online
          <span v-if="status !== 'OPEN'" class="ml-1 text-yellow-500">(reconnecting...)</span>
        </p>
      </div>
    </div>
    <button
      class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
      @click="copyLink"
    >
      {{ copied ? 'Copied!' : 'Copy link' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '~/types'

defineProps<{
  room: Room | null
  participantCount: number
  status?: string
}>()

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback: select text from a temporary input
  }
}
</script>
