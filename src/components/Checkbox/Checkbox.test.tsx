import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders checked when checked=true', () => {
    render(<Checkbox label="Accept terms" checked />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('renders aria-checked=mixed when indeterminate', () => {
    render(<Checkbox label="Select all" indeterminate />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })

  it('calls onChange with toggled value on click', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('uses a tone-matched hover shadow for the success tone', () => {
    const { container } = render(<Checkbox checked tone="success" />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(31,186,93/)
  })

  it('uses a tone-matched hover shadow for the accent tone', () => {
    const { container } = render(<Checkbox checked tone="accent" />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(237,46,152/)
  })

  it('uses the primary-orange hover shadow by default', () => {
    const { container } = render(<Checkbox checked />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(255,81,0/)
  })

  it('calls onChange when clicking the label text', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Accept terms'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Space key', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    screen.getByRole('checkbox').focus()
    await userEvent.keyboard(' ')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Enter key', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    screen.getByRole('checkbox').focus()
    await userEvent.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" disabled onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Checkbox label="Accept terms" disabled />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true')
  })

  it('is not focusable when disabled', () => {
    render(<Checkbox label="Accept terms" disabled />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabIndex', '-1')
  })

  it('renders supporting text when provided', () => {
    render(<Checkbox label="Remember me" supportingText="Save my login details for next time." />)
    expect(screen.getByText('Save my login details for next time.')).toBeInTheDocument()
  })

  it('renders hidden native input when name is provided', () => {
    const { container } = render(<Checkbox label="Accept" name="terms" value="yes" checked />)
    const hiddenInput = container.querySelector('input[type="checkbox"][name="terms"]')
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('value', 'yes')
  })

  it('associates label via aria-labelledby', () => {
    render(<Checkbox label="Accept terms" />)
    const checkbox = screen.getByRole('checkbox')
    const labelId = checkbox.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Accept terms')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox label="Remember me" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders size lg', () => {
    render(<Checkbox size="lg" label="Large" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('size-[32px]')
  })

  it('applies success tone border color when checked', () => {
    render(<Checkbox tone="success" checked label="Success" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-success-base')
  })

  it('applies accent tone border color when checked', () => {
    render(<Checkbox tone="accent" checked label="Accent" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-terciary-base')
  })

  it('renders card variant with a bordered wrapper', () => {
    render(<Checkbox variant="card" label="Card" onChange={() => {}} />)
    expect(screen.getByText('Card').closest('[data-checkbox-card]')).toBeInTheDocument()
  })

  it('renders error state in error color regardless of tone', () => {
    render(<Checkbox error label="Errored" supportingText="Required" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-error-base')
  })

  it('renders card variant wrapper in error color when unchecked and errored', () => {
    render(<Checkbox variant="card" error label="Errored card" onChange={() => {}} />)
    expect(screen.getByText('Errored card').closest('[data-checkbox-card]')).toHaveClass(
      'border-error-base',
    )
  })
})

describe('CheckboxGroup', () => {
  it('renders children with role=group', () => {
    render(
      <CheckboxGroup label="Preferences">
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
      </CheckboxGroup>,
    )
    const group = screen.getByRole('group', { name: 'Preferences' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })
})
