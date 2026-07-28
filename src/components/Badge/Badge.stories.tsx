import type { Meta, StoryObj } from '../../docs-types'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Label' },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Success: Story = {
  args: { variant: 'success', children: 'Ativo' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pendente' },
}

export const Error: Story = {
  args: { variant: 'error', children: 'Erro' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Novo' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Removable: Story = {
  args: { children: 'React', removable: true, onRemove: () => alert('removed') },
}

export const WithIcon: Story = {
  args: {
    children: 'Verificado',
    variant: 'success',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
        <path
          d="M13.5 4L6 11.5L2.5 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2 items-center">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex gap-2 items-center">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
      </div>
      <div className="flex gap-2 items-center">
        <Badge removable onRemove={() => {}}>
          React
        </Badge>
        <Badge removable onRemove={() => {}} variant="error">
          TypeScript
        </Badge>
      </div>
    </div>
  ),
}
