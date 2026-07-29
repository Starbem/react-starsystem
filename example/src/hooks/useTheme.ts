import { useEffect } from 'react'
import { useLocalStorageState } from './useLocalStorageState'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<Theme>('starsystem-example-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
