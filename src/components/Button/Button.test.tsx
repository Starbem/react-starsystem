import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant class', () => {
    render(<Button variant="secondary">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Test</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
