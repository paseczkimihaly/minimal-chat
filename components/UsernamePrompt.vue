<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
      <h2 class="text-lg font-semibold mb-4">Choose a username</h2>
      <form @submit.prevent="submit">
        <input
          v-model="name"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name..."
          maxlength="30"
          autofocus
        />

        <label class="block text-sm font-medium text-gray-700 mt-4 mb-2">Pick your color</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in USER_COLORS"
            :key="c"
            type="button"
            class="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            :class="selectedColor === c ? 'border-gray-800 scale-110' : 'border-transparent'"
            :style="{ backgroundColor: c }"
            @click="selectedColor = c"
          />
        </div>

        <button
          type="submit"
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="!name.trim()"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_COLORS } from '~/types'

const emit = defineEmits<{
  set: [username: string, color: string]
}>()

const name = ref('')
const selectedColor = ref(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)])

function submit() {
  if (name.value.trim()) {
    emit('set', name.value.trim(), selectedColor.value)
  }
}
</script>
