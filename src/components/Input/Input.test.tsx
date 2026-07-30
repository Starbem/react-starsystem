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

  it('has no a11y violations with success state', async () => {
    const { container } = render(<Input id="email-a11y-success" label="Email" success="Email available" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations with prefix and error', async () => {
    const { container } = render(<Input id="value-a11y-error" label="Value" prefix="R$" error="Invalid value" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders success text when provided', () => {
    render(<Input id="email-ok" success="Email available" />)
    expect(screen.getByText('Email available')).toBeInTheDocument()
  })

  it('error overrides success when both are provided', () => {
    render(<Input success="Success text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Success text')).not.toBeInTheDocument()
  })

  it('renders a success icon in the hint row', () => {
    render(<Input id="email-ok" success="Email available" />)
    const hint = screen.getByText('Email available').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('check_circle')
  })

  it('renders an error icon in the hint row', () => {
    render(<Input id="email-bad" error="Invalid email" />)
    const hint = screen.getByText('Invalid email').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('error')
  })

  it('applies success border classes to the field box', () => {
    render(<Input success="ok" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-success-base')
  })

  it('renders prefix', () => {
    render(<Input prefix="R$" placeholder="0,00" />)
    expect(screen.getByText('R$')).toBeInTheDocument()
  })

  it('renders suffix', () => {
    render(<Input suffix="BRL" placeholder="0,00" />)
    expect(screen.getByText('BRL')).toBeInTheDocument()
  })

  it('renders both prefix and suffix alongside the input', () => {
    render(<Input prefix="R$" suffix="BRL" placeholder="0,00" />)
    expect(screen.getByText('R$')).toBeInTheDocument()
    expect(screen.getByText('BRL')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument()
  })

  it('prefix affix has border-r divider', () => {
    render(<Input prefix="R$" placeholder="0,00" />)
    const prefixElement = screen.getByText('R$')
    expect(prefixElement).toHaveClass('border-r')
  })

  it('suffix affix has border-l divider', () => {
    render(<Input suffix="BRL" placeholder="0,00" />)
    const suffixElement = screen.getByText('BRL')
    expect(suffixElement).toHaveClass('border-l')
  })
})
