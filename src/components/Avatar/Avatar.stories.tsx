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
    <AvatarGroup max={4}>
      <Avatar name="Julio Sousa" />
      <Avatar name="Bárbara Koch" />
      <Avatar name="José Tenório" />
      <Avatar name="João Dias" />
      <Avatar name="Felipe Camargo" />
    </AvatarGroup>
  ),
}

export const GroupNoOverflow: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar name="Julio Sousa" />
      <Avatar name="Bárbara Koch" />
      <Avatar name="José Tenório" />
    </AvatarGroup>
  ),
}

export const ExtraLarge2xl: Story = {
  args: { name: 'Jane Doe', size: '2xl' },
}

export const BooleanStatus: Story = {
  args: { name: 'Jane Doe', status: true },
}

export const ShapeSquare: Story = {
  args: { name: 'Jane Doe', shape: 'square' },
}

export const ShapeRounded: Story = {
  args: { name: 'Jane Doe', shape: 'rounded' },
}

export const CustomFallbackIcon: Story = {
  args: { icon: <span>👤</span> },
}

export const WithRing: Story = {
  args: { name: 'Jane Doe', ring: true },
}
