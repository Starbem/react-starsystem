import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Spinner, Dots } from './Spinner'

describe('Spinner', () => {
  it('renders with role status', () => {
    const { container } = render(<Spinner label="Carregando" />)
    expect(container.firstChild).toHaveAttribute('role', 'status')
  })

  it('requires and forwards aria-label', () => {
    const { container } = render(<Spinner label="Carregando dados" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Carregando dados')
  })

  it('applies md size classes by default', () => {
    const { container } = render(<Spinner label="Carregando" />)
    expect(container.firstChild).toHaveClass('size-[24px]')
  })

  it('applies sm size classes', () => {
    const { container } = render(<Spinner label="Carregando" size="sm" />)
    expect(container.firstChild).toHaveClass('size-[16px]')
  })

  it('applies lg size classes', () => {
    const { container } = render(<Spinner label="Carregando" size="lg" />)
    expect(container.firstChild).toHaveClass('size-[32px]')
  })

  it('applies brand color classes by default', () => {
    const { container } = render(<Spinner label="Carregando" />)
    expect(container.firstChild).toHaveClass('border-t-primary-base')
  })

  it('applies white color classes', () => {
    const { container } = render(<Spinner label="Carregando" color="white" />)
    expect(container.firstChild).toHaveClass('border-t-white')
  })

  it('applies muted color classes', () => {
    const { container } = render(<Spinner label="Carregando" color="muted" />)
    expect(container.firstChild).toHaveClass('border-t-neutral-400')
  })

  it('applies animate-spin', () => {
    const { container } = render(<Spinner label="Carregando" />)
    expect(container.firstChild).toHaveClass('animate-spin')
  })

  it('forwards className', () => {
    const { container } = render(<Spinner label="Carregando" className="my-spinner" />)
    expect(container.firstChild).toHaveClass('my-spinner')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Spinner label="Carregando" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders without a label prop using the default', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando')
  })

  it('accepts a numeric size in pixels', () => {
    render(<Spinner size={40} label="Loading" />)
    const el = screen.getByRole('status')
    expect(el).toHaveStyle({ width: '40px', height: '40px' })
  })

  it('accepts a thickness override', () => {
    render(<Spinner thickness={6} label="Loading" />)
    expect(screen.getByRole('status')).toHaveStyle({ borderWidth: '6px' })
  })
})

describe('Dots', () => {
  it('renders three dots with staggered animation delays', () => {
    const { container } = render(<Dots />)
    const dots = container.querySelectorAll('[data-dot]')
    expect(dots).toHaveLength(3)
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' })
    expect(dots[1]).toHaveStyle({ animationDelay: '150ms' })
    expect(dots[2]).toHaveStyle({ animationDelay: '300ms' })
  })

  it('has an accessible status role and label', () => {
    render(<Dots />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando')
  })
})
