import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { ToastProvider, toast, __clearToastsForTests } from './Toast'

afterEach(() => {
  act(() => {
    __clearToastsForTests()
  })
})

describe('Toast', () => {
  it('renders nothing when there are no toasts', () => {
    render(<ToastProvider />)
    expect(screen.queryByText(/./)).not.toBeInTheDocument()
  })

  it('renders a toast triggered via toast.success', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.success({ title: 'Sucesso', description: 'Feito.' })
    })
    expect(await screen.findByText('Sucesso')).toBeInTheDocument()
    expect(screen.getByText('Feito.')).toBeInTheDocument()
  })

  it('accepts a plain string message', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.info('Mensagem simples')
    })
    expect(await screen.findByText('Mensagem simples')).toBeInTheDocument()
  })

  it('stacks multiple toasts', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.info('Primeiro')
      toast.error('Segundo')
    })
    expect(await screen.findByText('Primeiro')).toBeInTheDocument()
    expect(await screen.findByText('Segundo')).toBeInTheDocument()
  })

  it('dismisses a toast when its close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ToastProvider />)
    act(() => {
      toast.info('Fechável')
    })
    await screen.findByText('Fechável')
    await user.click(screen.getByRole('button', { name: 'Fechar notificação' }))
    await waitFor(() => expect(screen.queryByText('Fechável')).not.toBeInTheDocument())
  })

  it('renders a progress bar when showProgress is true', async () => {
    const { container } = render(<ToastProvider />)
    act(() => {
      toast.info({ description: 'Com progresso', showProgress: true, duration: 10000 })
    })
    await screen.findByText('Com progresso')
    expect(container.querySelector('[style*="animation"]')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ToastProvider />)
    act(() => {
      toast.success('Acessível')
    })
    await screen.findByText('Acessível')
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
