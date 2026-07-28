import type { Meta, StoryObj } from '../../docs-types'
import { ToastProvider, toast } from './Toast'

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
}
export default meta
type Story = StoryObj<typeof ToastProvider>

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 max-w-xs">
      <button
        type="button"
        className="rounded-[8px] bg-[#DBEAFE] text-[#1E40AF] px-3 py-2 text-sm font-medium"
        onClick={() => toast.info({ title: 'Info', description: 'Essa é uma notificação informativa.' })}
      >
        Disparar info
      </button>
      <button
        type="button"
        className="rounded-[8px] bg-[#D4F4DD] text-[#166534] px-3 py-2 text-sm font-medium"
        onClick={() => toast.success('Operação concluída com sucesso.')}
      >
        Disparar success
      </button>
      <button
        type="button"
        className="rounded-[8px] bg-[#FEF3C7] text-[#92400E] px-3 py-2 text-sm font-medium"
        onClick={() => toast.warning({ title: 'Atenção', description: 'Verifique os dados informados.' })}
      >
        Disparar warning
      </button>
      <button
        type="button"
        className="rounded-[8px] bg-[#FFE1E1] text-[#B42318] px-3 py-2 text-sm font-medium"
        onClick={() => toast.error({ title: 'Erro', description: 'Algo deu errado.', showProgress: true })}
      >
        Disparar error com progresso
      </button>
      <ToastProvider />
    </div>
  ),
}

export const BottomLeftPosition: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 max-w-xs">
      <button
        type="button"
        className="rounded-[8px] bg-[#E8E8E8] text-[#393939] px-3 py-2 text-sm font-medium"
        onClick={() => toast.info('Toast no canto inferior esquerdo.')}
      >
        Disparar toast
      </button>
      <ToastProvider position="bottom-left" />
    </div>
  ),
}

export const WithProgressBar: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 max-w-xs">
      <button
        type="button"
        className="rounded-[8px] bg-[#E8E8E8] text-[#393939] px-3 py-2 text-sm font-medium"
        onClick={() => toast.success({ title: 'Salvo', description: 'Alterações salvas.', showProgress: true, duration: 4000 })}
      >
        Disparar toast com progresso
      </button>
      <ToastProvider />
    </div>
  ),
}
