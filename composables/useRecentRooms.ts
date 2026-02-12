export interface RecentRoom {
  id: string
  name: string
  visitedAt: string
}

const STORAGE_KEY = 'chat-recent-rooms'
const MAX_RECENT = 5

export function useRecentRooms() {
  const rooms = ref<RecentRoom[]>([])

  if (import.meta.client) {
    try {
      rooms.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      rooms.value = []
    }
  }

  function addRoom(id: string, name: string) {
    if (!import.meta.client) return
    const filtered = rooms.value.filter((r: RecentRoom) => r.id !== id)
    rooms.value = [{ id, name, visitedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms.value))
  }

  function removeRoom(id: string) {
    if (!import.meta.client) return
    rooms.value = rooms.value.filter((r: RecentRoom) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms.value))
  }

  return { recentRooms: rooms, addRoom, removeRoom }
}
