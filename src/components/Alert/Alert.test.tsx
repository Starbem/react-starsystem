import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Aviso" description="Algo aconteceu." />)
    expect(screen.getByText('Aviso')).toBeInTheDocument()
    expect(screen.getByText('Algo aconteceu.')).toBeInTheDocument()
  })

  it('has role alert and aria-live', () => {
    render(<Alert title="Aviso" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('does not render a close button by default', () => {
    render(<Alert title="Aviso" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a close button when onClose is provided', () => {
    render(<Alert title="Aviso" onClose={() => {}} />)
    expect(screen.getByRole('button', { name: 'Fechar alerta' })).toBeInTheDocument()
  })

  it('calls onClose after the exit transition ends', () => {
    const handleClose = vi.fn()
    render(<Alert title="Aviso" onClose={handleClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Fechar alerta' }))
    expect(handleClose).not.toHaveBeenCalled()
    fireEvent.transitionEnd(screen.getByRole('alert'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('unmounts after the exit transition ends', () => {
    render(<Alert title="Aviso" onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Fechar alerta' }))
    fireEvent.transitionEnd(screen.getByRole('alert'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders an optional action', () => {
    render(<Alert title="Aviso" action={<button type="button">Ver mais</button>} />)
    expect(screen.getByRole('button', { name: 'Ver mais' })).toBeInTheDocument()
  })

  it('renders an optional icon', async () => {
    render(<Alert title="Aviso" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Alert title="Aviso" description="Algo aconteceu." />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations when dismissible', async () => {
    const { container } = render(<Alert title="Aviso" onClose={() => {}} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('supports clicking the close button via userEvent', async () => {
    const handleClose = vi.fn()
    render(<Alert title="Aviso" onClose={handleClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Fechar alerta' }))
    fireEvent.transitionEnd(screen.getByRole('alert'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
