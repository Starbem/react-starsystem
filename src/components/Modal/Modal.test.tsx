import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Modal } from './Modal'

describe('Modal', () => {
  it('does not render content when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders title, description and children when open', () => {
    render(
      <Modal open title="Título do modal" description="Descrição do modal" onClose={() => {}}>
        <p>Conteúdo</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Título do modal')).toBeInTheDocument()
    expect(screen.getByText('Descrição do modal')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <Modal open onClose={() => {}} footer={<button type="button">Confirmar</button>}>
        <p>Conteúdo</p>
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )
    await user.click(screen.getByRole('button', { name: 'Fechar modal' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when overlay is clicked and closeOnOverlayClick is false', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <Modal open onClose={onClose} closeOnOverlayClick={false} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )
    const overlay = container.ownerDocument.querySelector('[data-radix-popper-content-wrapper], .fixed.inset-0')
    if (overlay) await user.click(overlay as Element)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('applies size classes', () => {
    render(
      <Modal open onClose={() => {}} size="lg" title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[720px]')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Modal
        open
        onClose={() => {}}
        title="Confirmar ação"
        description="Essa ação não pode ser desfeita."
        footer={<button type="button">Confirmar</button>}
      >
        <p>Conteúdo</p>
      </Modal>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
