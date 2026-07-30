import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { ListItem } from './ListItem'

describe('ListItem', () => {
  it('renders as a button by default', () => {
    render(<ListItem title="Dra. Ana Lima" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders title and subtitle', () => {
    render(<ListItem title="Dra. Ana Lima" subtitle="Dermatologia · Hoje 14:30" />)
    expect(screen.getByText('Dra. Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Dermatologia · Hoje 14:30')).toBeInTheDocument()
  })

  it('renders the leading node', () => {
    render(<ListItem leading={<span data-testid="leading" />} title="Dra. Ana Lima" />)
    expect(screen.getByTestId('leading')).toBeInTheDocument()
  })

  it('renders trailing content and trailing icon', () => {
    render(<ListItem title="Dra. Ana Lima" trailing={<span>Confirmada</span>} trailingIcon="chevron_right" />)
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
  })

  it('renders as an anchor when as="a"', () => {
    render(
      <ListItem as="a" href="/patients/1" title="Dra. Ana Lima" />,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/patients/1')
  })

  it('applies the active class', () => {
    render(<ListItem title="Dra. Ana Lima" active />)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-lightest')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<ListItem title="Dra. Ana Lima" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ListItem title="Dra. Ana Lima" subtitle="Dermatologia" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
