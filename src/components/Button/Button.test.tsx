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
})
