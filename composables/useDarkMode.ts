import { useDark } from '@vueuse/core'

export function useDarkMode() {
  const isDark = useDark()
  const toggleDark = () => { isDark.value = !isDark.value }

  return { isDark, toggleDark }
}
