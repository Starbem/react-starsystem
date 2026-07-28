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
    expect(screen.getByRole('tablist')).toHaveClass('bg-[#F2F4F7]')
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
})
