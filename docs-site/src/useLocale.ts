import { useEffect, useState } from 'react'
import { translations } from './i18n'
import type { Locale, TranslationKey } from './i18n'

const STORAGE_KEY = 'star-system-docs-locale'

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'pt') return stored
  return 'en'
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  function toggleLocale() {
    setLocale((current) => (current === 'en' ? 'pt' : 'en'))
  }

  function t(key: TranslationKey): string {
    return translations[locale][key]
  }

  return { locale, toggleLocale, t }
}
