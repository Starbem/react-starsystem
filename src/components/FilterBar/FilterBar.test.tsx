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

  it('calls onRemove without toggling selection when removable', async () => {
    const handleRemove = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
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
})
