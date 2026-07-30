import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
}
export default meta
type Story = StoryObj<typeof Modal>

function ModalDemo({ size }: { size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        title="Confirmar ação"
        description="Essa ação não pode ser desfeita."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Confirmar</Button>
          </>
        }
      >
        <p className="text-[14px] leading-[20px]">Conteúdo do modal vai aqui.</p>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const Small: Story = {
  render: () => <ModalDemo size="sm" />,
}

export const Large: Story = {
  render: () => <ModalDemo size="lg" />,
}

export const ExtraLarge: Story = {
  render: () => <ModalDemo size="xl" />,
}

export const FullScreen: Story = {
  render: () => <ModalDemo size="full" />,
}

function LongContentDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir modal com scroll</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Termos de uso"
        footer={<Button onClick={() => setOpen(false)}>Aceitar</Button>}
      >
        <div className="flex flex-col gap-[12px] text-[14px] leading-[20px]">
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index}>
              Parágrafo {index + 1} de conteúdo longo para testar o scroll interno do modal.
            </p>
          ))}
        </div>
      </Modal>
    </>
  )
}

export const ScrollableContent: Story = {
  render: () => <LongContentDemo />,
}

function NoOverlayCloseDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir modal sem fechar no overlay</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeOnOverlayClick={false}
        title="Ação obrigatória"
        description="Clicar fora não fecha este modal."
        footer={<Button onClick={() => setOpen(false)}>Entendi</Button>}
      >
        <p className="text-[14px] leading-[20px]">Use o botão ou o X para fechar.</p>
      </Modal>
    </>
  )
}

export const DisableOverlayClose: Story = {
  render: () => <NoOverlayCloseDemo />,
}

export const SheetPresent: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onClose={() => setOpen(false)} present="sheet" title="Sheet modal">
        Always renders as a bottom sheet, regardless of viewport width.
      </Modal>
    )
  },
}

export const CenterPresent: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onClose={() => setOpen(false)} present="center" title="Centered modal">
        Always renders centered, regardless of viewport width.
      </Modal>
    )
  },
}

export const WithTone: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        tone="success"
        icon={<span>✓</span>}
        title="Payment confirmed"
        align="center"
      >
        Your payment was processed successfully.
      </Modal>
    )
  },
}
