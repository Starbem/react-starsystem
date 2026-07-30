import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder', () => {
    render(<Textarea placeholder="Type something…" />)
    expect(screen.getByPlaceholderText('Type something…')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders the label above the field, not inside the bordered box', () => {
    render(<Textarea label="Description" id="desc-label-pos" />)
    const label = screen.getByText('Description')
    const fieldBox = screen.getByRole('textbox').closest('div')
    expect(fieldBox?.contains(label)).toBe(false)
  })

  it('applies outline variant classes by default', () => {
    render(<Textarea placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('border-neutral-300')
  })

  it('applies filled variant classes', () => {
    render(<Textarea variant="filled" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('bg-ink-100')
  })

  it('applies underline variant classes', () => {
    render(<Textarea variant="underline" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('border-b')
  })

  it('applies sm size classes', () => {
    render(<Textarea size="sm" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[14px]')
  })

  it('applies lg size classes', () => {
    render(<Textarea size="lg" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[17px]')
  })

  it('defaults to md size with the corrected padding/radius', () => {
    render(<Textarea placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('rounded-md')
  })

  it('renders hint text when provided', () => {
    render(<Textarea hint="Maximum 500 characters" />)
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument()
  })

  it('renders error text when provided', () => {
    render(<Textarea id="desc" error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('error overrides hint', () => {
    render(<Textarea hint="Hint text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
  })

  it('renders success text when provided', () => {
    render(<Textarea id="desc-ok" success="Looks good" />)
    expect(screen.getByText('Looks good')).toBeInTheDocument()
  })

  it('error overrides success when both are provided', () => {
    render(<Textarea success="Success text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Success text')).not.toBeInTheDocument()
  })

  it('renders a success icon in the hint row', () => {
    render(<Textarea id="desc-ok" success="Looks good" />)
    const hint = screen.getByText('Looks good').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('check_circle')
  })

  it('renders an error icon in the hint row', () => {
    render(<Textarea id="desc-bad" error="Invalid value" />)
    const hint = screen.getByText('Invalid value').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('error')
  })

  it('sets aria-invalid when error provided', () => {
    render(<Textarea id="desc" error="Invalid value" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links aria-describedby to hint element when id provided', () => {
    render(<Textarea id="desc" hint="Hint text" />)
    const textarea = screen.getByRole('textbox')
    const hint = screen.getByText('Hint text')
    expect(textarea).toHaveAttribute('aria-describedby', 'desc-hint')
    expect(hint).toHaveAttribute('id', 'desc-hint')
  })

  it('is disabled when disabled prop set', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disabled renders the flat neutral box regardless of variant', () => {
    render(<Textarea variant="underline" disabled placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('bg-neutral-50')
  })

  it('does not fire onChange when disabled', async () => {
    const handler = vi.fn()
    render(<Textarea disabled onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('fires onChange when enabled', async () => {
    const handler = vi.fn()
    render(<Textarea onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(handler).toHaveBeenCalled()
  })

  it('forwards id to textarea element', () => {
    render(<Textarea id="my-textarea" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Textarea label="Description" placeholder="Enter a description..." />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations with success state', async () => {
    const { container } = render(
      <Textarea id="desc-a11y-success" label="Description" success="Looks good" />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
