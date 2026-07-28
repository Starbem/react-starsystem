import { useState } from 'react'
import { Home } from './Home'
import { DocsLayout } from './DocsLayout'
import { useTheme } from './useTheme'

export function App() {
  const [view, setView] = useState<'home' | 'docs'>('home')
  const { theme, toggleTheme } = useTheme()

  if (view === 'home') {
    return <Home onGetStarted={() => setView('docs')} theme={theme} onToggleTheme={toggleTheme} />
  }

  return <DocsLayout onBackToHome={() => setView('home')} theme={theme} onToggleTheme={toggleTheme} />
}
