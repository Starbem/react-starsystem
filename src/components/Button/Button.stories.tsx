import { Meta, StoryObj } from '../../docs-types'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button CTA',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }

export const SizeSm: Story = { args: { size: 'sm' } }
export const SizeMd: Story = { args: { size: 'md' } }
export const SizeLg: Story = { args: { size: 'lg' } }

export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }

export const WithIconLeft: Story = {
  args: {
    iconLeft: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
}

export const WithIconRight: Story = {
  args: {
    iconRight: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Tertiary' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

export const Glass: Story = {
  args: { variant: 'glass', children: 'Glass' },
}

export const GlassDark: Story = {
  args: { variant: 'glass-dark', children: 'Glass dark' },
}

export const GlassBrand: Story = {
  args: { variant: 'glass-brand', children: 'Glass brand' },
}

export const ExtraLarge: Story = {
  args: { size: 'xl', children: 'Extra large' },
}

export const Pill: Story = {
  args: { pill: true, children: 'Pill button' },
}

export const Block: Story = {
  args: { block: true, children: 'Block button' },
}

export const AsLink: Story = {
  args: { as: 'a', href: '#', children: 'As anchor' },
}
