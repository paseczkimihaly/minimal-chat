<template>
  <div class="border-t border-gray-200 bg-white px-4 py-3">
    <form class="flex gap-2" @submit.prevent="send">
      <input
        v-model="text"
        type="text"
        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        maxlength="2000"
        autofocus
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        :disabled="!text.trim()"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  send: [content: string]
}>()

const text = ref('')

function send() {
  if (text.value.trim()) {
    emit('send', text.value.trim())
    text.value = ''
  }
}
</script>
