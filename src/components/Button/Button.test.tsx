import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with danger variant', () => {
    render(<Button variant="danger">Danger</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with medium size', () => {
    render(<Button size="md">Medium</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('renders as loading state when loading prop is true', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with left icon when iconLeft prop is provided', () => {
    render(
      <Button iconLeft={<span>📍</span>}>With Icon</Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByText('📍')).toBeInTheDocument()
  })

  it('renders with right icon when iconRight prop is provided', () => {
    render(
      <Button iconRight={<span>📍</span>}>With Icon</Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByText('📍')).toBeInTheDocument()
  })

  it('renders icon only when iconOnly prop is true', () => {
    render(
      <Button iconOnly={true}>
        <span>🔔</span>
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders new DS-aligned variants', () => {
    const { rerender } = render(<Button variant="tertiary">Tertiary</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-[#D03700]')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4')

    rerender(<Button variant="glass">Glass</Button>)
    expect(screen.getByRole('button')).toHaveClass('backdrop-blur-[12px]')

    rerender(<Button variant="glass-dark">Glass dark</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-white')

    rerender(<Button variant="glass-brand">Glass brand</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-white')
  })

  it('renders size xl', () => {
    render(<Button size="xl">XL</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-[16px]')
  })

  it('applies pill radius when pill is true', () => {
    render(<Button pill>Pill</Button>)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('stretches full width when block is true', () => {
    render(<Button block>Block</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('renders as an anchor when as="a" is passed, with href and no disabled attribute', () => {
    render(
      <Button as="a" href="/somewhere">
        Link button
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Link button' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/somewhere')
    expect(link).not.toHaveAttribute('disabled')
  })

  it('applies aria-disabled instead of disabled when as="a" and loading is true', () => {
    render(
      <Button as="a" href="/x" loading>
        Loading link
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Loading link' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveClass('pointer-events-none')
    expect(link).toHaveClass('opacity-50')
  })
})
