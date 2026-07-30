import type { Meta, StoryObj } from '../../docs-types'
import { Progress, ProgressCircle } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 64 },
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {}

export const WithLabelAndValue: Story = {
  args: { value: 64, label: 'Perfil completo', showValue: true },
}

export const Success: Story = {
  args: { value: 40, tone: 'success', label: 'Exame processado', showValue: true },
}

export const Warning: Story = {
  args: { value: 80, tone: 'warning' },
}

export const Error: Story = {
  args: { value: 20, tone: 'error' },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Enviando exame…' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[280px]">
      <Progress value={64} size="sm" />
      <Progress value={64} size="md" />
      <Progress value={64} size="lg" />
    </div>
  ),
}

export const Circle: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ProgressCircle value={72} />
      <ProgressCircle value={30} tone="warning" size={72} />
      <ProgressCircle indeterminate size={40} showValue={false} />
      <ProgressCircle value={66} size={72}>
        2/3
      </ProgressCircle>
    </div>
  ),
}
