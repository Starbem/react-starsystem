import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>React</Badge>)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('does not render a remove button by default', () => {
    render(<Badge>React</Badge>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a remove button when removable=true', () => {
    render(
      <Badge removable onRemove={() => {}}>
        React
      </Badge>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(
      <Badge removable onRemove={handleRemove}>
        React
      </Badge>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('gives the remove button a descriptive aria-label', () => {
    render(
      <Badge removable onRemove={() => {}}>
        React
      </Badge>,
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remover React')
  })

  it('renders an optional prefix icon', () => {
    render(<Badge icon={<svg data-testid="icon" />}>React</Badge>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Badge>React</Badge>)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations when removable', async () => {
    const { container } = render(
      <Badge removable onRemove={() => {}}>
        React
      </Badge>,
    )
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('renders the neutral variant (replaces the old default variant)', () => {
    render(<Badge variant="neutral">Neutral</Badge>)
    expect(screen.getByText('Neutral')).toHaveClass('bg-[#F2F4F7]')
  })

  it('renders the primary variant (purple)', () => {
    render(<Badge variant="primary">Primary</Badge>)
    expect(screen.getByText('Primary')).toHaveClass('bg-[#F3E9FC]')
  })

  it('renders the accent variant (orange)', () => {
    render(<Badge variant="accent">Accent</Badge>)
    expect(screen.getByText('Accent')).toHaveClass('bg-[#FFF1E0]')
  })

  it('renders the solid variant', () => {
    render(<Badge variant="solid">Solid</Badge>)
    expect(screen.getByText('Solid')).toHaveClass('bg-[#7F56D9]')
  })

  it('renders a status dot when dot is true', () => {
    const { container } = render(<Badge dot>With dot</Badge>)
    expect(container.querySelector('[data-badge-dot]')).toBeInTheDocument()
  })

  it('spreads extra HTML attributes onto the root element', () => {
    render(
      <Badge data-testid="custom-badge" onClick={() => {}}>
        Clickable
      </Badge>,
    )
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
  })
})
