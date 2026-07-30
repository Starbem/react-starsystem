import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Tabs } from './Tabs'

const ITEMS = [
  { value: 'a', label: 'Aba A', content: <p>Conteúdo A</p> },
  { value: 'b', label: 'Aba B', content: <p>Conteúdo B</p> },
  { value: 'c', label: 'Aba C', content: <p>Conteúdo C</p> },
]

describe('Tabs', () => {
  it('renders the first tab content by default', () => {
    render(<Tabs items={ITEMS} />)
    expect(screen.getByText('Conteúdo A')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo B')).not.toBeInTheDocument()
  })

  it('respects defaultValue', () => {
    render(<Tabs items={ITEMS} defaultValue="b" />)
    expect(screen.getByText('Conteúdo B')).toBeInTheDocument()
  })

  it('switches tab content when a trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)
    await user.click(screen.getByRole('tab', { name: 'Aba B' }))
    expect(screen.getByText('Conteúdo B')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo A')).not.toBeInTheDocument()
  })

  it('marks the active tab with aria-selected', async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)
    expect(screen.getByRole('tab', { name: 'Aba A' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: 'Aba B' }))
    expect(screen.getByRole('tab', { name: 'Aba B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Aba A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('navigates between tabs with arrow keys', async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)
    screen.getByRole('tab', { name: 'Aba A' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Aba B' })).toHaveFocus()
  })

  it('supports controlled value + onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={ITEMS} value="a" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Aba C' }))
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('does not switch to a disabled tab', async () => {
    const user = userEvent.setup()
    render(<Tabs items={[...ITEMS.slice(0, 2), { value: 'd', label: 'Aba D', content: <p>D</p>, disabled: true }]} />)
    await user.click(screen.getByRole('tab', { name: 'Aba D' }))
    expect(screen.queryByText('D')).not.toBeInTheDocument()
  })

  it('renders the filled variant', () => {
    render(<Tabs items={ITEMS} variant="filled" />)
    expect(screen.getByRole('tablist')).toHaveClass('bg-ink-100')
  })

  it('supports vertical orientation', () => {
    render(<Tabs items={ITEMS} orientation="vertical" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Tabs items={ITEMS} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders without a content panel when every item omits content', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    )
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
  })

  it('still renders a content panel for items that provide content', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'A', content: 'Panel A' },
          { value: 'b', label: 'B', content: 'Panel B' },
        ]}
      />,
    )
    expect(screen.getByText('Panel A')).toBeInTheDocument()
  })

  it('renders item icon and count', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'Inbox', icon: <span data-testid="tab-icon" />, count: 3, content: 'x' },
        ]}
      />,
    )
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders a heterogeneous mix of plain, icon+label, and icon+label+count tabs together', () => {
    render(
      <Tabs
        items={[
          { value: 'plain', label: 'Plain' },
          { value: 'iconlabel', label: 'Icon+Label', icon: <span data-testid="icon-1" /> },
          { value: 'full', label: 'Full', icon: <span data-testid="icon-2" />, count: 5 },
        ]}
      />,
    )
    expect(screen.getByText('Plain')).toBeInTheDocument()
    expect(screen.getByText('Icon+Label')).toBeInTheDocument()
    expect(screen.getByTestId('icon-1')).toBeInTheDocument()
    expect(screen.getByText('Full')).toBeInTheDocument()
    expect(screen.getByTestId('icon-2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders enclosed variant', () => {
    render(
      <Tabs variant="enclosed" items={[{ value: 'a', label: 'A', content: 'x' }]} />,
    )
    expect(screen.getByRole('tab')).toHaveClass('rounded-full')
  })

  it('renders size lg', () => {
    render(<Tabs size="lg" items={[{ value: 'a', label: 'A', content: 'x' }]} />)
    expect(screen.getByRole('tab')).toHaveClass('text-[16px]')
  })

  it('renders block layout with equal-width triggers', () => {
    render(<Tabs block items={[{ value: 'a', label: 'A', content: 'x' }]} />)
    expect(screen.getByRole('tab')).toHaveClass('flex-1')
  })
})
