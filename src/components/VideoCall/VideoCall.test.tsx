import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { VideoCall } from './VideoCall'

describe('VideoCall', () => {
  it('renders the control bar and connection info when status is live', () => {
    render(<VideoCall status="live" connection="Conexão estável" timer="05:21" />)
    expect(screen.getByText('Conexão estável')).toBeInTheDocument()
    expect(screen.getByText('05:21')).toBeInTheDocument()
    expect(screen.getByLabelText('Encerrar chamada')).toBeInTheDocument()
  })

  it('renders a connecting state with a spinner and no control bar', () => {
    render(<VideoCall status="connecting" name="Dra. Ana" specialty="Dermatologia" />)
    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByLabelText('Encerrar chamada')).not.toBeInTheDocument()
  })

  it('renders an ended state with no control bar', () => {
    render(<VideoCall status="ended" />)
    expect(screen.getByText('Consulta encerrada')).toBeInTheDocument()
    expect(screen.queryByLabelText('Encerrar chamada')).not.toBeInTheDocument()
  })

  it('toggles mic uncontrolled and calls onToggleMic', async () => {
    const user = userEvent.setup()
    const onToggleMic = vi.fn()
    render(<VideoCall status="live" onToggleMic={onToggleMic} />)
    const micButton = screen.getByLabelText('Desativar microfone')
    await user.click(micButton)
    expect(onToggleMic).toHaveBeenCalledWith(false)
    expect(screen.getByLabelText('Ativar microfone')).toBeInTheDocument()
  })

  it('reflects the controlled mic prop instead of toggling internally', () => {
    render(<VideoCall status="live" mic={false} />)
    expect(screen.getByLabelText('Ativar microfone')).toBeInTheDocument()
  })

  it('renders chat and more buttons only when their callbacks are passed', () => {
    const { rerender } = render(<VideoCall status="live" />)
    expect(screen.queryByLabelText('Chat')).not.toBeInTheDocument()
    rerender(<VideoCall status="live" onChat={() => {}} onMore={() => {}} />)
    expect(screen.getByLabelText('Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Mais opções')).toBeInTheDocument()
  })

  it('calls onEnd when the hang-up button is clicked', async () => {
    const user = userEvent.setup()
    const onEnd = vi.fn()
    render(<VideoCall status="live" onEnd={onEnd} />)
    await user.click(screen.getByLabelText('Encerrar chamada'))
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations in the live state', async () => {
    const { container } = render(<VideoCall status="live" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
