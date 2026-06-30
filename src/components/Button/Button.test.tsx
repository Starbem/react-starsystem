import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to type=button', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it.each(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const)(
    'renders variant=%s without error',
    (variant) => {
      render(<Button variant={variant}>Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md', 'lg'] as const)('renders size=%s without error', (size) => {
    render(<Button size={size}>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn()
    render(
      <Button disabled onClick={handler}>
        Test
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('does not fire onClick when loading', async () => {
    const handler = vi.fn()
    render(
      <Button loading onClick={handler}>
        Test
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders iconLeft', () => {
    render(<Button iconLeft={<span data-testid="icon-left" />}>Test</Button>)
    expect(screen.getByTestId('icon-left')).toBeInTheDocument()
  })

  it('renders iconRight', () => {
    render(<Button iconRight={<span data-testid="icon-right" />}>Test</Button>)
    expect(screen.getByTestId('icon-right')).toBeInTheDocument()
  })

  it('fires onClick when enabled', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Test</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })
})
