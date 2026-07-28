import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Spinner } from './Spinner'

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
    expect(container.firstChild).toHaveClass('border-t-[#FF5100]')
  })

  it('applies white color classes', () => {
    const { container } = render(<Spinner label="Carregando" color="white" />)
    expect(container.firstChild).toHaveClass('border-t-white')
  })

  it('applies muted color classes', () => {
    const { container } = render(<Spinner label="Carregando" color="muted" />)
    expect(container.firstChild).toHaveClass('border-t-[#9C9C9C]')
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
})
