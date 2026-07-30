import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>Dermatologia</Tag>)
    expect(screen.getByText('Dermatologia')).toBeInTheDocument()
  })

  it('does not render a remove button by default', () => {
    render(<Tag>Somente online</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a remove button when onRemove is passed', () => {
    render(<Tag onRemove={() => {}}>Dermatologia</Tag>)
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<Tag onRemove={handleRemove}>Dermatologia</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('spreads extra HTML attributes onto the root element', () => {
    render(<Tag data-testid="custom-tag">Filtro</Tag>)
    expect(screen.getByTestId('custom-tag')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Tag>Dermatologia</Tag>)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations when removable', async () => {
    const { container } = render(<Tag onRemove={() => {}}>Dermatologia</Tag>)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
