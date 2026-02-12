<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm mx-4">
      <h1 class="text-2xl font-bold text-center dark:text-gray-100 mb-6">Log In</h1>

      <form @submit.prevent="handleLogin">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
        <input
          v-model="usernameInput"
          type="text"
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 mb-4"
          placeholder="Enter your username"
          autofocus
        />

        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 mb-4"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          :disabled="!usernameInput.trim() || !password.trim() || loading"
        >
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>

      <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
          Register
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
definePageMeta({
  middleware: ['guest-only'],
})

const { signIn } = useAuth()

const usernameInput = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!usernameInput.value.trim() || !password.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    await signIn(usernameInput.value.trim(), password.value)
    navigateTo('/')
  } catch (e: any) {
    error.value = e?.message || 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>
