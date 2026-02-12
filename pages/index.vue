<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-center dark:text-gray-100 mb-6">Chat Rooms</h1>

      <UsernamePrompt v-if="!username" @set="onSet" />

      <template v-else>
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <ColorPicker v-model="userColor" @update:model-value="setColor" />
          <span>Chatting as <strong>{{ username }}</strong></span>
          <button class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline text-xs" @click="clearUsername">
            change
          </button>
        </div>

        <!-- Create Room -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name</label>
          <input
            v-model="roomName"
            type="text"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
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
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span class="text-xs text-gray-400 dark:text-gray-500 uppercase">or join existing</span>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- Join Room -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room ID</label>
          <input
            v-model="joinId"
            type="text"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            placeholder="Paste room ID here"
            @keyup.enter="joinRoom"
          />
          <button
            class="mt-2 w-full bg-gray-800 dark:bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            :disabled="!joinId.trim()"
            @click="joinRoom"
          >
            Join Room
          </button>
        </div>

        <!-- Recent Rooms -->
        <div v-if="recentRooms.length" class="mt-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span class="text-xs text-gray-400 dark:text-gray-500 uppercase">recent rooms</span>
            <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <ul class="space-y-1">
            <li
              v-for="r in recentRooms"
              :key="r.id"
              class="flex items-center gap-1 group"
            >
              <NuxtLink
                :to="`/room/${r.id}`"
                class="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span class="font-medium text-gray-700 dark:text-gray-300 truncate">{{ r.name }}</span>
                <span class="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">{{ formatVisited(r.visitedAt) }}</span>
              </NuxtLink>
              <button
                class="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                title="Remove"
                @click="removeRoom(r.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { username, userColor, setUsername, setColor, clearUsername } = useUsername()
const { recentRooms, removeRoom } = useRecentRooms()

function onSet(name: string, color: string) {
  setUsername(name, color)
}

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

function formatVisited(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
</script>
