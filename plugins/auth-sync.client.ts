export default defineNuxtPlugin(() => {
  const { setFromAuth, setColor } = useUsername()
  const { session } = useAuth()

  watch(
    session,
    (val) => {
      if (val?.data?.user) {
        const user = val.data.user as any
        const displayName = user.displayUsername || user.username || user.name
        setFromAuth(displayName)

        const storedColor = sessionStorage.getItem('chat-color')
        if (storedColor) setColor(storedColor)
      }
    },
    { immediate: true },
  )
})
