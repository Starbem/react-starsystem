import { useState } from 'react'
import { Accordion, Card, Icon, Popover, Tabs, Tooltip } from '@starbemtech/react-starsystem'
import { benefitFaqs, benefits, type Benefit } from '../mocks/benefits'

const CATEGORIES = ['Saúde', 'Bem-estar', 'Financeiro'] as const

function BenefitGrid({ items }: { items: Benefit[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
      {items.map((benefit) => (
        <Card key={benefit.id} variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{benefit.name}</h3>
            <Tooltip content={benefit.description}>
              <span aria-label="Detalhes" style={{ cursor: 'help', color: '#667085' }}>
                <Icon name="info" size={18} />
              </span>
            </Tooltip>
          </div>
          <p style={{ color: '#667085' }}>{benefit.description}</p>
          <Popover
            content={<span>Adesão de {benefit.adherence}% dos colaboradores.</span>}
            trigger={
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  color: '#FF5100',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Icon name="compare_arrows" size={16} />
                Comparar planos
              </button>
            }
          />
        </Card>
      ))}
    </div>
  )
}

export function Benefits() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Saúde')

  const faqItems = benefitFaqs.map((faq, index) => ({
    value: `faq-${index}`,
    trigger: faq.question,
    content: faq.answer,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1>Benefícios</h1>
      <Tabs
        items={CATEGORIES.map((cat) => ({ value: cat, label: cat, content: <BenefitGrid items={benefits.filter((b) => b.category === cat)} /> }))}
        value={category}
        onChange={(value) => setCategory(value as (typeof CATEGORIES)[number])}
      />
      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Perguntas frequentes</h2>
        <Accordion items={faqItems} type="single" />
      </Card>
    </div>
  )
}
