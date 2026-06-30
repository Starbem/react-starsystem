import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('applies opacity-60 class when disabled', () => {
    const { container } = render(<Textarea disabled />)
    expect(container.firstChild).toHaveClass('opacity-60')
  })
})
