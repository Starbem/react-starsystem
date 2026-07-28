import type { Meta, StoryObj } from '../../docs-types'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
}
export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  render: () => (
    <div className="w-[320px]">
      <p className="text-[14px] mb-[12px]">Conteúdo acima</p>
      <Divider />
      <p className="text-[14px] mt-[12px]">Conteúdo abaixo</p>
    </div>
  ),
}

export const Dashed: Story = {
  render: () => (
    <div className="w-[320px]">
      <p className="text-[14px] mb-[12px]">Conteúdo acima</p>
      <Divider variant="dashed" />
      <p className="text-[14px] mt-[12px]">Conteúdo abaixo</p>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[320px]">
      <p className="text-[14px]">Entrar com email</p>
      <div className="my-[16px]">
        <Divider label="ou" />
      </div>
      <p className="text-[14px]">Entrar com Google</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[40px] items-center gap-[12px]">
      <span className="text-[14px]">Item 1</span>
      <Divider orientation="vertical" />
      <span className="text-[14px]">Item 2</span>
      <Divider orientation="vertical" />
      <span className="text-[14px]">Item 3</span>
    </div>
  ),
}
