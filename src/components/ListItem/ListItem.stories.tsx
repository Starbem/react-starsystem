import type { Meta, StoryObj } from '../../docs-types'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { ListItem } from './ListItem'

const meta: Meta<typeof ListItem> = {
  title: 'Components/ListItem',
  component: ListItem,
  args: { title: 'Dra. Ana Lima', subtitle: 'Dermatologia · Hoje 14:30' },
}
export default meta
type Story = StoryObj<typeof ListItem>

export const Default: Story = {}

export const WithAvatarAndBadge: Story = {
  args: {
    leading: <Avatar name="Dra. Ana Lima" />,
    trailing: (
      <Badge variant="success" dot>
        Confirmada
      </Badge>
    ),
    trailingIcon: 'chevron_right',
  },
}

export const Active: Story = {
  args: { active: true },
}

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-1 w-[360px]">
      <ListItem
        leading={<Avatar name="Dra. Ana Lima" />}
        title="Dra. Ana Lima"
        subtitle="Dermatologia · Hoje 14:30"
        trailingIcon="chevron_right"
      />
      <ListItem
        leading={<Avatar name="Dr. João Souza" />}
        title="Dr. João Souza"
        subtitle="Cardiologia · Amanhã 09:00"
        active
        trailingIcon="chevron_right"
      />
    </div>
  ),
}
