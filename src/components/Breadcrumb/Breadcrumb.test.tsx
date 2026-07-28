import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Breadcrumb } from './Breadcrumb'

const ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Colaboradores', href: '/colaboradores' },
  { label: 'Departamentos', href: '/departamentos' },
  { label: 'Engenharia', href: '/engenharia' },
  { label: 'Julio Sousa' },
]

describe('Breadcrumb', () => {
  it('renders a nav with aria-label=breadcrumb', () => {
    render(<Breadcrumb items={ITEMS} />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })

  it('renders all items as links except the last', () => {
    render(<Breadcrumb items={ITEMS} />)
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Engenharia' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Julio Sousa' })).not.toBeInTheDocument()
  })

  it('marks the last item with aria-current=page', () => {
    render(<Breadcrumb items={ITEMS} />)
    expect(screen.getByText('Julio Sousa')).toHaveAttribute('aria-current', 'page')
  })

  it('does not truncate when items fit within maxItems', () => {
    render(<Breadcrumb items={ITEMS.slice(0, 2)} maxItems={5} />)
    expect(screen.queryByText('…')).not.toBeInTheDocument()
  })

  it('truncates with an ellipsis when items exceed maxItems', () => {
    render(<Breadcrumb items={ITEMS} maxItems={3} />)
    expect(screen.getByText('…')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByText('Julio Sousa')).toBeInTheDocument()
    expect(screen.queryByText('Colaboradores')).not.toBeInTheDocument()
  })

  it('supports a custom separator', () => {
    render(<Breadcrumb items={ITEMS.slice(0, 2)} separator="/" />)
    expect(screen.getAllByText('/').length).toBeGreaterThan(0)
  })

  it('renders a single item without a separator', () => {
    const { container } = render(<Breadcrumb items={[{ label: 'Início' }]} />)
    expect(screen.getByText('Início')).toHaveAttribute('aria-current', 'page')
    expect(container.querySelectorAll('li')).toHaveLength(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Breadcrumb items={ITEMS} maxItems={3} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
