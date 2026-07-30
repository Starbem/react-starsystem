import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
}
export default meta
type Story = StoryObj<typeof EmptyState>

function InboxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const EmptyList: Story = {
  render: () => (
    <EmptyState
      icon={<InboxIcon />}
      title="Nenhum item na lista"
      description="Quando novos itens forem adicionados, eles aparecerão aqui."
      action={<Button size="sm">Adicionar item</Button>}
    />
  ),
}

export const EmptySearchResult: Story = {
  render: () => (
    <EmptyState
      icon={<SearchIcon />}
      title="Nenhum resultado encontrado"
      description="Tente ajustar os filtros ou buscar por outro termo."
    />
  ),
}

export const LoadingError: Story = {
  render: () => (
    <EmptyState
      icon={<ErrorIcon />}
      title="Erro ao carregar os dados"
      description="Não foi possível carregar as informações. Tente novamente."
      action={
        <Button size="sm" variant="outline">
          Tentar novamente
        </Button>
      }
    />
  ),
}

export const Small: Story = {
  render: () => <EmptyState size="sm" icon={<InboxIcon />} title="Sem registros" />,
}

export const Medium: Story = {
  render: () => (
    <EmptyState
      size="md"
      icon={<InboxIcon />}
      title="Nenhum item na lista"
      description="Quando novos itens forem adicionados, eles aparecerão aqui."
    />
  ),
}

export const Large: Story = {
  render: () => (
    <EmptyState
      size="lg"
      icon={<InboxIcon />}
      title="Sua caixa de entrada está vazia"
      description="Você está em dia com todas as suas notificações."
      action={<Button>Voltar ao início</Button>}
    />
  ),
}

export const CustomIllustration: Story = {
  render: () => (
    <EmptyState
      size="lg"
      illustration={
        <div className="flex size-[80px] items-center justify-center rounded-full bg-[#FFD4BF] text-[40px]">
          📭
        </div>
      }
      title="Nada por aqui ainda"
      description="Ilustração customizada em vez do ícone padrão do Design System."
    />
  ),
}
