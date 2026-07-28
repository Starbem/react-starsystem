import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Card } from './Card'

describe('Card', () => {
  it('renders children by default', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders Header, Body and Footer slots', () => {
    render(
      <Card>
        <Card.Header>Título</Card.Header>
        <Card.Body>Corpo</Card.Body>
        <Card.Footer>Rodapé</Card.Footer>
      </Card>,
    )
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Corpo')).toBeInTheDocument()
    expect(screen.getByText('Rodapé')).toBeInTheDocument()
  })

  it('is not a button when onClick is not provided', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders as a clickable button when onClick is provided', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Conteúdo</Card>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('triggers onClick with the keyboard (Enter and Space)', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Conteúdo</Card>)
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('shows a skeleton instead of children when loading', () => {
    const { container } = render(<Card loading>Conteúdo real</Card>)
    expect(screen.queryByText('Conteúdo real')).not.toBeInTheDocument()
    expect(container.querySelectorAll('[class*="animate-"]').length).toBeGreaterThan(0)
  })

  it('applies variant classes', () => {
    const { container: outlined } = render(<Card variant="outlined">A</Card>)
    expect(outlined.firstChild).toHaveClass('border-2')
    const { container: elevated } = render(<Card variant="elevated">A</Card>)
    expect((elevated.firstElementChild as HTMLElement).className).toMatch(/shadow-/)
  })

  it('applies padding classes', () => {
    const { container } = render(<Card padding="none">A</Card>)
    expect(container.firstChild).toHaveClass('p-0')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card onClick={() => {}}>
        <Card.Header>Título</Card.Header>
        <Card.Body>Corpo</Card.Body>
      </Card>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
