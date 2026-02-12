export function useUsername() {
  const username = useState<string | null>('username', () => null)

  if (import.meta.client) {
    const stored = sessionStorage.getItem('chat-username')
    if (stored) username.value = stored
  }

  function setUsername(name: string) {
    username.value = name
    if (import.meta.client) {
      sessionStorage.setItem('chat-username', name)
    }
  }

  function clearUsername() {
    username.value = null
    if (import.meta.client) {
      sessionStorage.removeItem('chat-username')
    }
  }

  return { username, setUsername, clearUsername }
}
