import type { Meta, StoryObj } from '../../docs-types'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Dermatologia' },
}
export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {}

export const Removable: Story = {
  args: { children: 'Dermatologia', onRemove: () => alert('removed') },
}

export const Group: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Tag onRemove={() => {}}>Dermatologia</Tag>
      <Tag onRemove={() => {}}>Somente online</Tag>
      <Tag>Hoje</Tag>
    </div>
  ),
}
