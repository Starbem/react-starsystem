import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders with role=separator by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders horizontal orientation by default (no aria-orientation, implicit default per ARIA spec)', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-orientation')
  })

  it('renders vertical orientation', () => {
    render(<Divider orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('applies dashed variant classes', () => {
    render(<Divider variant="dashed" />)
    expect(screen.getByRole('separator')).toHaveClass('border-dashed')
  })

  it('applies solid variant classes by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toHaveClass('border-solid')
  })

  it('renders a centered label with role=separator', () => {
    render(<Divider label="ou" />)
    const separator = screen.getByRole('separator')
    expect(separator).toHaveTextContent('ou')
  })

  it('does not use the labeled layout for vertical orientation', () => {
    render(<Divider orientation="vertical" label="ou" />)
    expect(screen.queryByText('ou')).not.toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Divider label="ou" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
