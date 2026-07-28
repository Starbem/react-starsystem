import type { Meta, StoryObj } from '../../docs-types'
import { Button } from '../Button'
import { Input } from '../Input'
import { Popover } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover
      trigger={<Button>Abrir popover</Button>}
      content={
        <div className="flex flex-col gap-[4px]">
          <strong className="text-[14px]">Título</strong>
          <p className="text-[14px] text-[#667085] dark:text-[#98A2B3]">Conteúdo simples do popover.</p>
        </div>
      }
    />
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover
      trigger={<Button variant="outline">Editar nome</Button>}
      content={
        <form className="flex flex-col gap-[12px] w-[240px]">
          <Input label="Nome" placeholder="Digite o nome" />
          <Button type="submit" size="sm">
            Salvar
          </Button>
        </form>
      }
    />
  ),
}

export const WithList: Story = {
  render: () => (
    <Popover
      trigger={<Button variant="outline">Ações</Button>}
      content={
        <ul className="flex flex-col gap-[4px] text-[14px]">
          <li>
            <button type="button" className="w-full text-left px-[8px] py-[4px] rounded-[6px] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]">
              Editar
            </button>
          </li>
          <li>
            <button type="button" className="w-full text-left px-[8px] py-[4px] rounded-[6px] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]">
              Duplicar
            </button>
          </li>
          <li>
            <button type="button" className="w-full text-left px-[8px] py-[4px] rounded-[6px] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]">
              Excluir
            </button>
          </li>
        </ul>
      }
    />
  ),
}

export const SideRight: Story = {
  render: () => (
    <Popover
      trigger={<Button>Abrir à direita</Button>}
      side="right"
      content={<p className="text-[14px]">Popover posicionado à direita.</p>}
    />
  ),
}

export const AlignStart: Story = {
  render: () => (
    <Popover
      trigger={<Button>Alinhado ao início</Button>}
      align="start"
      content={<p className="text-[14px]">Alinhamento start.</p>}
    />
  ),
}
