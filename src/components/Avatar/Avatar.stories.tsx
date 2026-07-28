import type { Meta, StoryObj } from '../../docs-types'
import { Avatar, AvatarGroup } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
}
export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => <Avatar src="https://i.pravatar.cc/150?img=12" alt="Julio Sousa" name="Julio Sousa" />,
}

export const WithInitials: Story = {
  render: () => <Avatar name="Bárbara Koch" />,
}

export const FallbackIcon: Story = {
  render: () => <Avatar />,
}

export const BrokenImageFallsBackToInitials: Story = {
  render: () => <Avatar src="https://invalid.example/broken.jpg" alt="José Tenório" name="José Tenório" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-[12px]">
      <Avatar name="Julio Sousa" size="xs" />
      <Avatar name="Julio Sousa" size="sm" />
      <Avatar name="Julio Sousa" size="md" />
      <Avatar name="Julio Sousa" size="lg" />
      <Avatar name="Julio Sousa" size="xl" />
    </div>
  ),
}

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-[12px]">
      <Avatar name="Julio Sousa" status="online" />
      <Avatar name="Bárbara Koch" status="away" />
      <Avatar name="José Tenório" status="offline" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup
      avatars={[
        { name: 'Julio Sousa' },
        { name: 'Bárbara Koch' },
        { name: 'José Tenório' },
        { name: 'João Dias' },
        { name: 'Felipe Camargo' },
      ]}
      max={4}
    />
  ),
}

export const GroupNoOverflow: Story = {
  render: () => (
    <AvatarGroup avatars={[{ name: 'Julio Sousa' }, { name: 'Bárbara Koch' }, { name: 'José Tenório' }]} />
  ),
}
