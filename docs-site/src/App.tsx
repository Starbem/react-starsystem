import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Home } from './Home'
import { DocsLayout } from './DocsLayout'
import { useTheme } from './useTheme'
import { useLocale } from './useLocale'

function HomeRoute() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { locale, toggleLocale, t } = useLocale()

  return (
    <Home
      onGetStarted={() => navigate('/components')}
      theme={theme}
      onToggleTheme={toggleTheme}
      locale={locale}
      onToggleLocale={toggleLocale}
      t={t}
    />
  )
}

function ComponentsRoute() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { locale, toggleLocale, t } = useLocale()

  return (
    <DocsLayout
      onBackToHome={() => navigate('/')}
      theme={theme}
      onToggleTheme={toggleTheme}
      locale={locale}
      onToggleLocale={toggleLocale}
      t={t}
    />
  )
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/components" element={<ComponentsRoute />} />
      </Routes>
    </HashRouter>
  )
}
