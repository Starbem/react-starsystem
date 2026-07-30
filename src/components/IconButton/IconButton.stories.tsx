import type { Meta, StoryObj } from '../../docs-types'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: 'close', label: 'Fechar' },
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

export const Solid: Story = {
  args: { icon: 'videocam', variant: 'solid', label: 'Iniciar vídeo' },
}

export const Outline: Story = {
  args: { icon: 'more_vert', variant: 'outline', label: 'Mais opções' },
}

export const Pill: Story = {
  args: { icon: 'close', pill: true, label: 'Fechar' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <IconButton icon="close" size="sm" label="Fechar" />
      <IconButton icon="close" size="md" label="Fechar" />
      <IconButton icon="close" size="lg" label="Fechar" />
    </div>
  ),
}
