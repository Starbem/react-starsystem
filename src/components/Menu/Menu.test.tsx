import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Menu } from './Menu'

const ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', section: 'Principal' },
  { id: 'agenda', label: 'Consultas', icon: 'calendar_today', badge: 3, section: 'Principal' },
  { id: 'chat', label: 'Mensagens', icon: 'chat_bubble', section: 'Outros' },
]

describe('Menu — sidebar', () => {
  it('renders a nav with aria-label', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByRole('navigation', { name: 'Navegação' })).toBeInTheDocument()
  })

  it('renders section labels and item labels', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Outros')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Mensagens')).toBeInTheDocument()
  })

  it('marks the active item with aria-current', () => {
    render(<Menu present="sidebar" items={ITEMS} value="agenda" />)
    expect(screen.getByText('Consultas').closest('button')).toHaveAttribute('aria-current', 'page')
  })

  it('calls onChange when an item is clicked', async () => {
    const handleChange = vi.fn()
    render(<Menu present="sidebar" items={ITEMS} value="home" onChange={handleChange} />)
    await userEvent.click(screen.getByText('Consultas'))
    expect(handleChange).toHaveBeenCalledWith('agenda')
  })

  it('renders the badge', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders the brand wordmark by default', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('starbem')).toBeInTheDocument()
  })

  it('omits the brand when brand={false}', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" brand={false} />)
    expect(screen.queryByText('starbem')).not.toBeInTheDocument()
  })

  it('renders footerItems and the user row', () => {
    render(
      <Menu
        present="sidebar"
        items={ITEMS}
        value="home"
        footerItems={[{ id: 'logout', label: 'Sair', icon: 'logout' }]}
        user={{ name: 'Ana Carolina', sub: 'Premium' }}
      />,
    )
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.getByText('Ana Carolina')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Menu present="sidebar" items={ITEMS} value="home" user={{ name: 'Ana' }} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — rail', () => {
  it('omits labels and sections, keeps icons', () => {
    render(<Menu present="rail" items={ITEMS} value="home" />)
    expect(screen.queryByText('Início')).not.toBeInTheDocument()
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('omits the brand', () => {
    render(<Menu present="rail" items={ITEMS} value="home" />)
    expect(screen.queryByText('starbem')).not.toBeInTheDocument()
  })
})

describe('Menu — bottom', () => {
  it('renders one button per item with no sections', () => {
    render(<Menu present="bottom" items={ITEMS} value="home" />)
    expect(screen.getAllByRole('button')).toHaveLength(ITEMS.length)
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Menu present="bottom" items={ITEMS} value="home" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — drawer', () => {
  it('renders a closed nav by default (aria-hidden)', () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-hidden') === 'true')
    expect(drawerNav).toBeDefined()
  })

  it('shows the active item label (or title) in the top bar', () => {
    render(<Menu present="drawer" items={ITEMS} value="agenda" />)
    // Look specifically in the header for the active item label (the drawer nav also renders all items now)
    expect(screen.getByRole('banner').textContent).toContain('Consultas')
  })

  it('falls back to the title prop when nothing is active', () => {
    render(<Menu present="drawer" items={ITEMS} title="Meu App" />)
    expect(screen.getByText('Meu App')).toBeInTheDocument()
  })

  it('opens the panel when the hamburger is clicked', async () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'false')
  })

  it('closes the panel when an item is selected', async () => {
    const handleChange = vi.fn()
    render(<Menu present="drawer" items={ITEMS} value="home" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await userEvent.click(screen.getByText('Consultas'))
    expect(handleChange).toHaveBeenCalledWith('agenda')
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'true')
  })

  it('closes the panel when the close button is clicked', async () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }))
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the panel content in the DOM while closed (so the close animation has something to slide)', () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    // The close button is in the DOM but hidden (aria-hidden), so we must explicitly search for hidden elements
    expect(screen.getByRole('button', { name: 'Fechar menu', hidden: true })).toBeInTheDocument()
  })

  it('marks the closed panel inert so its content cannot receive focus', () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('inert')
  })

  it('removes inert once the panel is open', async () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).not.toHaveAttribute('inert')
  })

  it('has no a11y violations when open', async () => {
    const { container } = render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — auto', () => {
  // jsdom has no ResizeObserver, so `wide` stays at its default `true`,
  // making `auto` deterministically render the sidebar layout in tests.
  it('renders exactly one nav', () => {
    render(<Menu items={ITEMS} value="home" />)
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
  })

  it('shows the sidebar layout by default', () => {
    render(<Menu items={ITEMS} value="home" />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('starbem')).toBeInTheDocument()
  })
})

describe('Menu — section grouping', () => {
  it('keeps non-contiguous same-name sections as separate groups, in order', () => {
    const items = [
      { id: 'a', label: 'A', icon: 'home', section: 'Principal' },
      { id: 'b', label: 'B', icon: 'chat_bubble', section: 'Outros' },
      { id: 'c', label: 'C', icon: 'person', section: 'Principal' },
    ]
    render(<Menu present="sidebar" items={items} value="a" />)
    expect(screen.getAllByText('Principal')).toHaveLength(2)
  })
})
