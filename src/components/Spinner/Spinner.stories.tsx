import type { Meta, StoryObj } from '../../docs-types'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
}
export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  render: () => <Spinner label="Carregando" />,
}

export const Small: Story = {
  render: () => <Spinner label="Carregando" size="sm" />,
}

export const Medium: Story = {
  render: () => <Spinner label="Carregando" size="md" />,
}

export const Large: Story = {
  render: () => <Spinner label="Carregando" size="lg" />,
}

export const Brand: Story = {
  render: () => <Spinner label="Carregando" color="brand" />,
}

export const White: Story = {
  render: () => (
    <div className="bg-[#252525] p-4 rounded-[8px] inline-block">
      <Spinner label="Carregando" color="white" />
    </div>
  ),
}

export const Muted: Story = {
  render: () => <Spinner label="Carregando" color="muted" />,
}

export const InButton: Story = {
  render: () => (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-2 rounded-[16px] bg-[#FF5100] px-4 py-2 text-white opacity-70"
    >
      <Spinner label="Enviando" size="sm" color="white" />
      Enviando...
    </button>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner label="Carregando" size="sm" />
      <Spinner label="Carregando" size="md" />
      <Spinner label="Carregando" size="lg" />
    </div>
  ),
}
