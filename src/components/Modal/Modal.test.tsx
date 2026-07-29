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
      <Modal open onClose={() => {}} present="center" size="lg" title="Título">
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

  it('renders sheet layout classes when present="sheet"', () => {
    render(
      <Modal open onClose={() => {}} present="sheet" title="Sheet">
        Body
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('rounded-b-none')
  })

  it('renders centered layout classes when present="center"', () => {
    render(
      <Modal open onClose={() => {}} present="center" title="Centered">
        Body
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('top-1/2')
    expect(dialog).not.toHaveClass('rounded-b-none')
  })

  it('renders a tone badge with the icon when tone is set', () => {
    render(
      <Modal open onClose={() => {}} tone="success" icon={<span data-testid="tone-icon" />} title="Success">
        Body
      </Modal>,
    )
    expect(screen.getByTestId('tone-icon')).toBeInTheDocument()
  })

  it('accepts ReactNode as title', () => {
    render(
      <Modal open onClose={() => {}} title={<span data-testid="rich-title">Rich</span>}>
        Body
      </Modal>,
    )
    expect(screen.getByTestId('rich-title')).toBeInTheDocument()
  })

  it('center-aligns title and body when align="center"', () => {
    render(
      <Modal open onClose={() => {}} align="center" title="Centered align">
        Body
      </Modal>,
    )
    expect(screen.getByText('Centered align')).toHaveClass('text-center')
  })

  it('defaults align to "start" and keeps the pre-existing left-aligned title layout', () => {
    render(
      <Modal open onClose={() => {}} title="Default align">
        Body
      </Modal>,
    )
    const title = screen.getByText('Default align')
    expect(title).toHaveClass('pr-[32px]')
    expect(title).not.toHaveClass('text-center')
    expect(title).not.toHaveClass('flex-none')
  })

  it('does not cap width below the sm breakpoint when present="auto" (default)', () => {
    render(
      <Modal open onClose={() => {}} size="md" title="Auto size">
        Body
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).not.toHaveClass('max-w-[560px]')
    expect(dialog).toHaveClass('sm:max-w-[560px]')
  })
})
