import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder', () => {
    render(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders the label above the field, not inside the bordered box', () => {
    render(<Input label="Email" id="email-label-pos" />)
    const label = screen.getByText('Email')
    const fieldBox = screen.getByRole('textbox').closest('div')
    // The label must be a sibling of the field box, not a descendant of it.
    expect(fieldBox?.contains(label)).toBe(false)
  })

  it('applies outline variant classes by default', () => {
    render(<Input placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-neutral-300')
  })

  it('applies filled variant classes', () => {
    render(<Input variant="filled" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('bg-ink-100')
  })

  it('applies underline variant classes', () => {
    render(<Input variant="underline" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-b')
  })

  it('applies sm size classes', () => {
    render(<Input size="sm" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[14px]')
  })

  it('applies lg size classes', () => {
    render(<Input size="lg" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[17px]')
  })

  it('defaults to md size with the corrected padding/radius', () => {
    render(<Input placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('rounded-md')
  })

  it('disabled renders the flat box shape even with underline variant', () => {
    render(<Input variant="underline" disabled placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).not.toHaveClass('rounded-none')
    expect(box).toHaveClass('bg-neutral-50')
  })

  it('renders hint text when provided', () => {
    render(<Input hint="This is a hint" />)
    expect(screen.getByText('This is a hint')).toBeInTheDocument()
  })

  it('renders error text when provided', () => {
    render(<Input id="email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('error overrides hint', () => {
    render(<Input hint="Hint text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Input id="email" error="Invalid email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links aria-describedby to hint element when id provided', () => {
    render(<Input id="email" hint="Hint text" />)
    const input = screen.getByRole('textbox')
    const hint = screen.getByText('Hint text')
    expect(input).toHaveAttribute('aria-describedby', 'email-hint')
    expect(hint).toHaveAttribute('id', 'email-hint')
  })

  it('is disabled when disabled prop set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('does not fire onChange when disabled', async () => {
    const handler = vi.fn()
    render(<Input disabled onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('fires onChange when enabled', async () => {
    const handler = vi.fn()
    render(<Input onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(handler).toHaveBeenCalled()
  })

  it('renders leadingIcon', () => {
    render(<Input leadingIcon={<span data-testid="leading-icon" />} />)
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
  })

  it('renders trailingIcon', () => {
    render(<Input trailingIcon={<span data-testid="trailing-icon" />} />)
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('forwards id to input element', () => {
    render(<Input id="my-input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Input label="Email" placeholder="olivia@untitledui.com" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
