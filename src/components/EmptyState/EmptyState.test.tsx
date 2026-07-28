import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="Nenhum resultado encontrado" />)
    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<EmptyState title="Título" description="Descrição detalhada" />)
    expect(screen.getByText('Descrição detalhada')).toBeInTheDocument()
  })

  it('does not render a description paragraph when omitted', () => {
    render(<EmptyState title="Título" />)
    expect(screen.queryByText('Descrição detalhada')).not.toBeInTheDocument()
  })

  it('renders the icon wrapper when icon is provided', () => {
    const { container } = render(<EmptyState title="Título" icon={<svg data-testid="icon" />} />)
    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument()
  })

  it('renders illustration instead of icon wrapper when both provided', () => {
    render(
      <EmptyState
        title="Título"
        icon={<svg data-testid="icon" />}
        illustration={<img alt="" data-testid="illustration" />}
      />,
    )
    expect(screen.getByTestId('illustration')).toBeInTheDocument()
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('renders the action when provided', () => {
    render(<EmptyState title="Título" action={<button type="button">Tentar novamente</button>} />)
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('applies md size classes by default', () => {
    const { container } = render(<EmptyState title="Título" />)
    expect(container.firstChild).toHaveClass('py-10')
  })

  it('applies sm size classes', () => {
    const { container } = render(<EmptyState title="Título" size="sm" />)
    expect(container.firstChild).toHaveClass('py-6')
  })

  it('applies lg size classes', () => {
    const { container } = render(<EmptyState title="Título" size="lg" />)
    expect(container.firstChild).toHaveClass('py-16')
  })

  it('forwards className', () => {
    const { container } = render(<EmptyState title="Título" className="my-empty-state" />)
    expect(container.firstChild).toHaveClass('my-empty-state')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <EmptyState
        title="Nenhum item"
        description="Adicione um item para começar"
        action={<button type="button">Adicionar</button>}
      />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
