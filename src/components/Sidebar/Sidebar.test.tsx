import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Sidebar } from './Sidebar'

const ITEMS = [
  { label: 'Início', href: '#', active: true },
  {
    label: 'Colaboradores',
    children: [
      { label: 'Todos', href: '#' },
      { label: 'Convites', href: '#' },
    ],
  },
  { label: 'Configurações', href: '#' },
]

describe('Sidebar', () => {
  it('renders a navigation landmark with all top-level items', () => {
    render(<Sidebar items={ITEMS} />)
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Colaboradores' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Configurações' })).toBeInTheDocument()
  })

  it('marks the active item with aria-current=page', () => {
    render(<Sidebar items={ITEMS} />)
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
  })

  it('does not render sub-items collapsed by default', () => {
    render(<Sidebar items={ITEMS} />)
    expect(screen.queryByRole('link', { name: 'Todos' })).not.toBeInTheDocument()
  })

  it('expands a sub-menu when its parent is clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar items={ITEMS} />)
    await user.click(screen.getByRole('button', { name: 'Colaboradores' }))
    expect(screen.getByRole('link', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Convites' })).toBeInTheDocument()
  })

  it('renders header and footer when provided', () => {
    render(<Sidebar items={ITEMS} header={<span>Logo</span>} footer={<span>Rodapé</span>} />)
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.getByText('Rodapé')).toBeInTheDocument()
  })

  it('hides labels and shows only icons when collapsed', () => {
    render(<Sidebar items={[{ icon: <svg data-testid="icon" />, label: 'Início', href: '#' }]} collapsed />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.queryByText('Início')).not.toBeInTheDocument()
  })

  it('shows the label via tooltip on hover when collapsed', async () => {
    const user = userEvent.setup()
    render(<Sidebar items={[{ label: 'Início', href: '#' }]} collapsed />)
    await user.hover(screen.getByRole('link'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Início')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Sidebar items={ITEMS} header={<span>Logo</span>} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
