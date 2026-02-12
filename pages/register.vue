<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm mx-4">
      <h1 class="text-2xl font-bold text-center dark:text-gray-100 mb-6">Register</h1>

      <form @submit.prevent="handleRegister">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
        <input
          v-model="usernameInput"
          type="text"
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 mb-4"
          placeholder="Choose a username (min 3 characters)"
          maxlength="30"
          autofocus
        />

        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 mb-2"
          placeholder="At least 8 characters"
        />

        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 mb-3"
          placeholder="Repeat password"
        />

        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-2">Pick your color</label>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="c in USER_COLORS"
            :key="c"
            type="button"
            class="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            :class="selectedColor === c ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'"
            :style="{ backgroundColor: c }"
            @click="selectedColor = c"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          :disabled="!canSubmit || loading"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>

      <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
          Log in
        </NuxtLink>
      </div>

      <div class="mt-3 text-center">
        <NuxtLink to="/" class="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline">
          Continue as guest
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_COLORS } from '~/types'

definePageMeta({
  middleware: ['guest-only'],
})

const { signUp } = useAuth()

const usernameInput = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedColor = ref(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)])
const loading = ref(false)
const error = ref('')

const canSubmit = computed(() =>
  usernameInput.value.trim().length >= 3
  && password.value.length >= 8
  && password.value === confirmPassword.value
)

async function handleRegister() {
  if (!canSubmit.value) return
  loading.value = true
  error.value = ''

  try {
    await signUp(usernameInput.value.trim(), password.value, selectedColor.value)
    navigateTo('/')
  } catch (e: any) {
    error.value = e?.message || 'Registration failed. Username may already be taken.'
  } finally {
    loading.value = false
  }
}
</script>
