import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('renders the label and placeholder', () => {
    render(<DateInput label="Data da consulta" />)
    expect(screen.getByText('Data da consulta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('dd/mm/aaaa')).toBeInTheDocument()
  })

  it('parses a typed valid date on blur and calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" onChange={onChange} />)
    const input = screen.getByLabelText('Data')
    await user.type(input, '15/07/2026')
    await user.tab()
    const picked: Date = onChange.mock.calls[0][0]
    expect(picked.getFullYear()).toBe(2026)
    expect(picked.getMonth()).toBe(6)
    expect(picked.getDate()).toBe(15)
  })

  it('shows "Data inválida" for an unparseable value and does not call onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" onChange={onChange} />)
    const input = screen.getByLabelText('Data')
    await user.type(input, 'não é uma data')
    await user.tab()
    expect(screen.getByText('Data inválida')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opens the calendar popover via the icon button, picks a day, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" defaultValue={new Date(2026, 6, 1)} onChange={onChange} />)
    await user.click(screen.getByLabelText('Abrir calendário'))
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '15' }))
    expect(onChange).toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: '15' })).not.toBeInTheDocument()
  })

  it('closes the popover on Escape', async () => {
    const user = userEvent.setup()
    render(<DateInput label="Data" defaultValue={new Date(2026, 6, 1)} />)
    await user.click(screen.getByLabelText('Abrir calendário'))
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: '15' })).not.toBeInTheDocument()
  })

  it('renders the error message when error prop is set', () => {
    render(<DateInput label="Data" error="Campo obrigatório" />)
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<DateInput label="Data da consulta" hint="Formato dd/mm/aaaa" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
