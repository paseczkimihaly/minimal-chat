<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-center mb-6">Chat Rooms</h1>

      <UsernamePrompt v-if="!username" @set="setUsername" />

      <template v-else>
        <p class="text-sm text-gray-500 mb-6">
          Chatting as <strong>{{ username }}</strong>
          <button class="text-blue-500 hover:text-blue-700 underline ml-2 text-xs" @click="clearUsername">
            change
          </button>
        </p>

        <!-- Create Room -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
          <input
            v-model="roomName"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My awesome room"
            maxlength="50"
            @keyup.enter="createRoom"
          />
          <button
            class="mt-2 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            :disabled="!roomName.trim() || creating"
            @click="createRoom"
          >
            {{ creating ? 'Creating...' : 'Create Room' }}
          </button>
        </div>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-200" />
          <span class="text-xs text-gray-400 uppercase">or join existing</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>

        <!-- Join Room -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
          <input
            v-model="joinId"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste room ID here"
            @keyup.enter="joinRoom"
          />
          <button
            class="mt-2 w-full bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            :disabled="!joinId.trim()"
            @click="joinRoom"
          >
            Join Room
          </button>
        </div>

        <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { username, setUsername, clearUsername } = useUsername()
const roomName = ref('')
const joinId = ref('')
const creating = ref(false)
const error = ref('')

async function createRoom() {
  if (!roomName.value.trim() || creating.value) return
  creating.value = true
  error.value = ''

  try {
    const room = await $fetch('/api/rooms', {
      method: 'POST',
      body: { name: roomName.value.trim(), createdBy: username.value },
    })
    navigateTo(`/room/${room._id}`)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Failed to create room'
  } finally {
    creating.value = false
  }
}

function joinRoom() {
  if (joinId.value.trim()) {
    navigateTo(`/room/${joinId.value.trim()}`)
  }
}
</script>
