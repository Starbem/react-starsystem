import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { TopBar } from './TopBar'

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
}
export default meta
type Story = StoryObj<typeof TopBar>

function Logo() {
  return <span className="text-[18px] font-semibold text-[#FF5100]">Starbem</span>
}

function Avatar() {
  return (
    <div className="size-[32px] rounded-full bg-[#FFD4BF] flex items-center justify-center text-[12px] font-medium text-[#101828]">
      JS
    </div>
  )
}

export const WithTitleAndActions: Story = {
  render: () => (
    <TopBar
      bordered
      start={<Logo />}
      center="Painel do colaborador"
      end={
        <>
          <Button size="sm" variant="outline">
            Ajuda
          </Button>
          <Avatar />
        </>
      }
    />
  ),
}

export const LogoOnly: Story = {
  render: () => <TopBar bordered start={<Logo />} />,
}

export const WithBackButton: Story = {
  render: () => (
    <TopBar
      bordered
      start={
        <Button size="sm" variant="ghost">
          ← Voltar
        </Button>
      }
      center="Detalhes do agendamento"
    />
  ),
}

export const Sticky: Story = {
  render: () => (
    <div className="h-[240px] overflow-y-auto border border-[#EAECF0] rounded-[8px] dark:border-[#1F2937]">
      <TopBar sticky bordered start={<Logo />} center="Role a página" end={<Avatar />} />
      <div className="p-[16px] flex flex-col gap-[12px] text-[14px]">
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>Linha de conteúdo {index + 1} para demonstrar o scroll shadow do TopBar sticky.</p>
        ))}
      </div>
    </div>
  ),
}

export const NoBorder: Story = {
  render: () => <TopBar start={<Logo />} center="Sem borda" end={<Avatar />} />,
}
