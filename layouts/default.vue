<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="fixed top-3 right-3 z-50 flex items-center gap-2">
      <template v-if="isLoggedIn">
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ authUsername }}</span>
        <button
          class="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 underline"
          @click="handleSignOut"
        >
          Log out
        </button>
      </template>
      <template v-else>
        <NuxtLink
          to="/login"
          class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          Log in
        </NuxtLink>
      </template>
      <DarkModeToggle />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn, authUsername, signOut } = useAuth()
const { clearUsername } = useUsername()

async function handleSignOut() {
  await signOut()
  clearUsername()
  navigateTo('/')
}
</script>
