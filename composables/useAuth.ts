import { authClient } from '~/lib/auth-client'

export function useAuth() {
  const session = authClient.useSession()

  const isLoggedIn = computed(() => !!session.value?.data?.user)
  const authUser = computed(() => session.value?.data?.user ?? null)
  const authUsername = computed(() => {
    const user = authUser.value
    if (!user) return null
    return (user as any).displayUsername || (user as any).username || user.name
  })

  async function signUp(usernameVal: string, password: string, color: string) {
    const placeholderEmail = `${usernameVal.toLowerCase().replace(/[^a-z0-9]/g, '')}@chat.local`
    const { data, error } = await authClient.signUp.email({
      email: placeholderEmail,
      name: usernameVal,
      password,
      username: usernameVal.toLowerCase(),
      displayUsername: usernameVal,
    })
    if (error) throw error
    if (import.meta.client) {
      sessionStorage.setItem('chat-color', color)
    }
    return data
  }

  async function signIn(usernameVal: string, password: string) {
    const { data, error } = await authClient.signIn.username({
      username: usernameVal,
      password,
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    await authClient.signOut()
  }

  return {
    session,
    isLoggedIn,
    authUser,
    authUsername,
    signUp,
    signIn,
    signOut,
  }
}
