import type { Meta, StoryObj } from '../../docs-types'
import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
}
export default meta
type Story = StoryObj<typeof Breadcrumb>

const ITEMS = [
  { label: 'Início', href: '#' },
  { label: 'Colaboradores', href: '#' },
  { label: 'Departamentos', href: '#' },
  { label: 'Engenharia', href: '#' },
  { label: 'Julio Sousa' },
]

export const Default: Story = {
  render: () => <Breadcrumb items={ITEMS.slice(0, 3)} />,
}

export const Truncated: Story = {
  render: () => <Breadcrumb items={ITEMS} maxItems={3} />,
}

export const CustomSeparator: Story = {
  render: () => <Breadcrumb items={ITEMS.slice(0, 3)} separator="/" />,
}

export const SingleItem: Story = {
  render: () => <Breadcrumb items={[{ label: 'Início' }]} />,
}
