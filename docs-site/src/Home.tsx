import { Button } from '../../src/components/Button'
import { Card } from '../../src/components/Card'

export interface HomeProps {
  onGetStarted: () => void
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
  {
    title: 'Baseado em Radix UI',
    description: 'Primitivas acessíveis e testadas por baixo dos panos de cada componente interativo.',
    icon: <RadixIcon />,
  },
  {
    title: 'Acessível (WCAG 2.1 AA)',
    description: 'Cada componente é testado com vitest-axe para garantir conformidade de acessibilidade.',
    icon: <A11yIcon />,
  },
  {
    title: 'Tailwind CSS v4',
    description: 'Estilização via tokens do design system, com suporte nativo a tema claro e escuro.',
    icon: <TailwindIcon />,
  },
  {
    title: 'TypeScript strict',
    description: 'Todo componente com props totalmente tipadas, sem uso de any.',
    icon: <TypeScriptIcon />,
  },
] as const

export function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-[24px] py-[64px]">
      <img src="./brand/starbem-logo.svg" alt="Starbem" className="mb-[32px] h-[56px] w-auto" />

      <h1 className="mb-[12px] text-center text-[32px] font-semibold text-[#101828]">Star System</h1>
      <p className="mb-[32px] max-w-[480px] text-center text-[16px] text-[#667085]">
        Design system oficial da Starbem: componentes React acessíveis, tipados e prontos pra produção.
      </p>

      <Button size="lg" onClick={onGetStarted}>
        Getting Started
      </Button>

      <div className="mt-[64px] grid w-full max-w-[960px] grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.title} variant="elevated">
            <Card.Body>
              <div className="mb-[8px] text-[#FF5100]">{item.icon}</div>
              <strong className="mb-[4px] block text-[14px] text-[#101828]">{item.title}</strong>
              <p className="text-[13px] text-[#667085]">{item.description}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
