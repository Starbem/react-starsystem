import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a div hidden from assistive tech', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies text variant classes by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('rounded-[4px]')
  })

  it('applies circular variant classes', () => {
    const { container } = render(<Skeleton variant="circular" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies rectangular variant classes', () => {
    const { container } = render(<Skeleton variant="rectangular" />)
    expect(container.firstChild).toHaveClass('rounded-[8px]')
  })

  it('applies card variant classes', () => {
    const { container } = render(<Skeleton variant="card" />)
    expect(container.firstChild).toHaveClass('rounded-[16px]')
  })

  it('applies numeric width/height as pixel dimensions', () => {
    const { container } = render(<Skeleton width={120} height={20} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('120px')
    expect(el.style.height).toBe('20px')
  })

  it('applies string width/height verbatim', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('2rem')
  })

  it('applies animate-pulse class by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('does not apply animate-pulse when animation is none', () => {
    const { container } = render(<Skeleton animation="none" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  it('renders a wave shimmer element when animation is wave', () => {
    const { container } = render(<Skeleton animation="wave" />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('does not render a wave shimmer element for pulse/none', () => {
    const { container } = render(<Skeleton animation="pulse" />)
    expect(container.querySelector('span')).not.toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Skeleton className="my-skeleton" />)
    expect(container.firstChild).toHaveClass('my-skeleton')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Skeleton />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
