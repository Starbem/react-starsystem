import type { ReactElement } from 'react'
import { Button } from '../../src/components/Button'
import { Card } from '../../src/components/Card'
import { ThemeToggle } from './ThemeToggle'
import { LocaleToggle } from './LocaleToggle'
import type { Theme } from './useTheme'
import type { Locale, TranslationKey } from './i18n'

export interface HomeProps {
  onGetStarted: () => void
  theme: Theme
  onToggleTheme: () => void
  locale: Locale
  onToggleLocale: () => void
  t: (key: TranslationKey) => string
}

function RadixIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3.5v17M3.5 12h17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function A11yIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <path
        d="M4 9.5 12 11l8-1.5M12 11v10M8.5 21 12 15l3.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TailwindIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 10c.8-3 2.4-4.5 5-4.5s4.2 1.5 5 4.5c-.8-1.5-2-2-3.5-1.5-1 .3-1.7 1.2-2.5 2C9 11.7 8 12.2 6 11.5c1 1.5 2.4 2 4 1.5M6 15.5c.8-3 2.4-4.5 5-4.5s4.2 1.5 5 4.5c-.8-1.5-2-2-3.5-1.5-1 .3-1.7 1.2-2.5 2-1 .7-2 1.2-4 .5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypeScriptIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12h4M10 12v5.5M14.5 16c0 1 .8 1.5 1.8 1.5s1.7-.5 1.7-1.3c0-2-3.3-1.3-3.3-3.4 0-.9.8-1.5 1.8-1.5s1.7.5 1.8 1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const HIGHLIGHTS = [
  { titleKey: 'highlightRadixTitle', descriptionKey: 'highlightRadixDescription', icon: <RadixIcon /> },
  { titleKey: 'highlightA11yTitle', descriptionKey: 'highlightA11yDescription', icon: <A11yIcon /> },
  { titleKey: 'highlightTailwindTitle', descriptionKey: 'highlightTailwindDescription', icon: <TailwindIcon /> },
  { titleKey: 'highlightTypeScriptTitle', descriptionKey: 'highlightTypeScriptDescription', icon: <TypeScriptIcon /> },
] as const satisfies readonly { titleKey: TranslationKey; descriptionKey: TranslationKey; icon: ReactElement }[]

function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-[10%] -top-[15%] size-[420px] rounded-full bg-[#FF5100] opacity-30 blur-[120px]" />
      <div className="absolute -right-[10%] top-[5%] size-[380px] rounded-full bg-[#E81F76] opacity-25 blur-[120px]" />
      <div className="absolute bottom-[-15%] left-[25%] size-[460px] rounded-full bg-[#FFA947] opacity-30 blur-[120px]" />
    </div>
  )
}

const INSTALL_STEPS = [
  {
    titleKey: 'step1Title',
    descriptionKey: 'step1Description',
    code: `pnpm add @starbemtech/react-starsystem
pnpm add react react-dom`,
  },
  {
    titleKey: 'step2Title',
    descriptionKey: 'step2Description',
    code: `// main.tsx / _app.tsx / layout.tsx
import '@starbemtech/react-starsystem/style.css'`,
  },
  {
    titleKey: 'step3Title',
    descriptionKey: 'step3Description',
    code: `<link
  href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
  rel="stylesheet"
/>`,
  },
  {
    titleKey: 'step4Title',
    descriptionKey: 'step4Description',
    code: `import { Button, Input } from '@starbemtech/react-starsystem'

<Input id="email" label="Email" placeholder="olivia@starbem.app" />
<Button variant="primary" size="md">Get started</Button>`,
  },
] as const satisfies readonly { titleKey: TranslationKey; descriptionKey: TranslationKey; code: string }[]

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-[8px] bg-[#101828] px-[16px] py-[12px] text-[12px] leading-[1.6] text-[#E5E7EB] dark:bg-[#0B0F19]">
      <code>{code}</code>
    </pre>
  )
}

export function Home({ onGetStarted, theme, onToggleTheme, locale, onToggleLocale, t }: HomeProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-[24px] py-[64px] dark:bg-[#0B0F19]">
      <AuroraBackground />

      <div className="absolute right-[24px] top-[24px] z-20 flex items-center gap-[4px]">
        <LocaleToggle
          locale={locale}
          onToggle={onToggleLocale}
          toPtLabel={t('localeToggleToPt')}
          toEnLabel={t('localeToggleToEn')}
        />
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
          toLightLabel={t('themeToggleToLight')}
          toDarkLabel={t('themeToggleToDark')}
        />
      </div>

      <img src="./brand/starbem-logo.png" alt="Starbem" className="relative z-10 mb-[32px] h-[56px] w-auto" />

      <h1 className="relative z-10 mb-[12px] text-center text-[32px] font-semibold text-[#101828] dark:text-white">
        React Star System
      </h1>
      <p className="relative z-10 mb-[32px] max-w-[480px] text-center text-[16px] text-[#667085] dark:text-[#98A2B3]">
        {t('subtitle')}
      </p>

      <div className="relative z-10 flex gap-[12px]">
        <Button
          size="lg"
          variant="secondary"
          onClick={() =>
            document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        >
          {t('installButton')}
        </Button>
        <Button size="lg" onClick={onGetStarted}>
          {t('componentsButton')}
        </Button>
      </div>

      <div className="relative z-10 mt-[64px] grid w-full max-w-[960px] grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.titleKey} variant="elevated" className="dark:border-[#1F2937] dark:bg-[#151B2C]">
            <Card.Body>
              <div className="mb-[8px] text-[#FF5100]">{item.icon}</div>
              <strong className="mb-[4px] block text-[14px] text-[#101828] dark:text-white">
                {t(item.titleKey)}
              </strong>
              <p className="text-[13px] text-[#667085] dark:text-[#98A2B3]">{t(item.descriptionKey)}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div id="getting-started" className="relative z-10 mt-[96px] w-full max-w-[720px] scroll-mt-[24px]">
        <h2 className="mb-[8px] text-center text-[24px] font-semibold text-[#101828] dark:text-white">
          {t('gettingStartedTitle')}
        </h2>
        <p className="mb-[32px] text-center text-[14px] text-[#667085] dark:text-[#98A2B3]">
          {t('gettingStartedSubtitle')}
        </p>

        <div className="flex flex-col gap-[16px]">
          {INSTALL_STEPS.map((step) => (
            <Card key={step.titleKey} variant="elevated" className="dark:border-[#1F2937] dark:bg-[#151B2C]">
              <Card.Body>
                <strong className="mb-[2px] block text-[14px] text-[#101828] dark:text-white">
                  {t(step.titleKey)}
                </strong>
                <p className="mb-[12px] text-[13px] text-[#667085] dark:text-[#98A2B3]">{t(step.descriptionKey)}</p>
                <CodeBlock code={step.code} />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
