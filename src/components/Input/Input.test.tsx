import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
})
