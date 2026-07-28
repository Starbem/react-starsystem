import { useState } from 'react'
import { Home } from './Home'
import { DocsLayout } from './DocsLayout'

export function App() {
  const [view, setView] = useState<'home' | 'docs'>('home')

  if (view === 'home') {
    return <Home onGetStarted={() => setView('docs')} />
  }

  return <DocsLayout onBackToHome={() => setView('home')} />
}
