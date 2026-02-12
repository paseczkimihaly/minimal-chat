import { USER_COLORS } from '~/types'

export function useUsername() {
  const username = useState<string | null>('username', () => null)
  const userColor = useState<string>('userColor', () => USER_COLORS[0])
  const isGuest = useState<boolean>('isGuest', () => true)

  if (import.meta.client) {
    const stored = sessionStorage.getItem('chat-username')
    if (stored) username.value = stored

    const storedColor = sessionStorage.getItem('chat-color')
    if (storedColor) {
      userColor.value = storedColor
    }
  }

  function setUsername(name: string, color?: string) {
    username.value = name
    if (import.meta.client) {
      sessionStorage.setItem('chat-username', name)
    }
    const c = color ?? USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    setColor(c)
  }

  function setColor(color: string) {
    userColor.value = color
    if (import.meta.client) {
      sessionStorage.setItem('chat-color', color)
    }
  }

  function clearUsername() {
    username.value = null
    isGuest.value = true
    if (import.meta.client) {
      sessionStorage.removeItem('chat-username')
      sessionStorage.removeItem('chat-color')
    }
  }

  function setFromAuth(name: string) {
    username.value = name
    isGuest.value = false
    if (import.meta.client) {
      sessionStorage.setItem('chat-username', name)
    }
  }

  return { username, userColor, isGuest, setUsername, setColor, clearUsername, setFromAuth }
}
