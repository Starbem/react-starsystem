import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { FilterBar, FilterChip } from './FilterBar'

const OPTIONS = [
  { id: 'online', label: 'Online', count: 12 },
  { id: 'hoje', label: 'Hoje', count: 4 },
  { id: 'derma', label: 'Dermatologia' },
]

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="Online" />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('reflects selected via aria-pressed', () => {
    render(<FilterChip label="Online" selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the count badge', () => {
    render(<FilterChip label="Online" count={12} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('renders two sibling buttons when removable, not nested', () => {
    const { container } = render(<FilterChip label="Dermatologia" removable onRemove={() => {}} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.contains(buttons[1]!)).toBe(false)
    expect(buttons[1]!.contains(buttons[0]!)).toBe(false)
  })

  it('calls onRemove when the remove button is clicked, without toggling selection', async () => {
    const handleRemove = vi.fn()
    const handleClick = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('calls onRemove when the remove button is activated via keyboard (native button semantics)', async () => {
    const handleRemove = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} />)
    const removeButton = screen.getByRole('button', { name: 'Remover filtro' })
    removeButton.focus()
    await userEvent.keyboard('{Enter}')
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('disables the remove button when the chip is disabled', () => {
    render(<FilterChip label="Dermatologia" removable disabled onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remover filtro' })).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FilterChip label="Online" selected />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('FilterBar', () => {
  it('renders a chip per option', () => {
    render(<FilterBar options={OPTIONS} />)
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('Dermatologia')).toBeInTheDocument()
  })

  it('toggles multi-select values on click (uncontrolled)', async () => {
    const handleChange = vi.fn()
    render(<FilterBar options={OPTIONS} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith(['online'])
    await userEvent.click(screen.getByText('Hoje'))
    expect(handleChange).toHaveBeenCalledWith(['online', 'hoje'])
  })

  it('respects a controlled value', () => {
    render(<FilterBar options={OPTIONS} value={['online']} onChange={() => {}} />)
    expect(screen.getByText('Online').closest('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Hoje').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('behaves as single-select radio-like in segmented variant', async () => {
    const handleChange = vi.fn()
    render(<FilterBar variant="segmented" options={OPTIONS} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith('online')
    await userEvent.click(screen.getByText('Hoje'))
    expect(handleChange).toHaveBeenCalledWith('hoje')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FilterBar options={OPTIONS} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders segmented chips as a visually connected group', () => {
    const { container } = render(<FilterBar variant="segmented" options={OPTIONS} />)
    const group = container.querySelector('[role="group"]')
    expect(group).not.toBeNull()
    expect(group?.className).not.toMatch(/(^|\s)gap-/)
    expect(group?.className).toMatch(/divide-x/)
    expect(group?.children.length).toBe(OPTIONS.length)
  })

  it('disables a chip when its option is marked disabled', () => {
    render(<FilterBar options={[{ id: 'a', label: 'A', disabled: true }, ...OPTIONS]} />)
    expect(screen.getByRole('button', { name: 'A' })).toBeDisabled()
  })

  it('deselects the active chip when re-clicked in segmented mode', async () => {
    const handleChange = vi.fn()
    render(<FilterBar variant="segmented" options={OPTIONS} defaultValue="online" onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith(null)
  })
})
