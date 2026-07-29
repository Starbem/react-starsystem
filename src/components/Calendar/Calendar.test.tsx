import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('renders the month/year title and weekday header', () => {
    render(<Calendar initialMonth={6} initialYear={2026} />)
    expect(screen.getByText('Julho 2026')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('renders all days of the given month as buttons', () => {
    render(<Calendar initialMonth={6} initialYear={2026} />)
    // July 2026 has 31 days
    expect(screen.getByRole('button', { name: '31' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '32' })).not.toBeInTheDocument()
  })

  it('navigates to the next and previous month', async () => {
    const user = userEvent.setup()
    render(<Calendar initialMonth={6} initialYear={2026} />)
    await user.click(screen.getByLabelText('Próximo mês'))
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Mês anterior'))
    await user.click(screen.getByLabelText('Mês anterior'))
    expect(screen.getByText('Junho 2026')).toBeInTheDocument()
  })

  it('calls onSelect with the picked date', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Calendar initialMonth={6} initialYear={2026} onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: '15' }))
    const picked: Date = onSelect.mock.calls[0][0]
    expect(picked.getFullYear()).toBe(2026)
    expect(picked.getMonth()).toBe(6)
    expect(picked.getDate()).toBe(15)
  })

  it('marks the selected day', () => {
    render(<Calendar initialMonth={6} initialYear={2026} selected={new Date(2026, 6, 15)} />)
    expect(screen.getByRole('button', { name: '15' })).toHaveClass('bg-[#FF5100]')
  })

  it('renders a dot indicator for marked days', () => {
    render(<Calendar initialMonth={6} initialYear={2026} markedDays={[new Date(2026, 6, 20)]} />)
    const day20 = screen.getByRole('button', { name: '20' })
    expect(day20.querySelector('[data-marked="true"]')).toBeInTheDocument()
  })

  it('switches to month picker and back when clicking the title', async () => {
    const user = userEvent.setup()
    render(<Calendar initialMonth={6} initialYear={2026} />)
    await user.click(screen.getByRole('button', { name: 'Julho 2026' }))
    await user.click(screen.getByRole('button', { name: 'Setembro' }))
    expect(screen.getByText('Setembro 2026')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Calendar initialMonth={6} initialYear={2026} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
