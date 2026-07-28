import type { Meta, StoryObj } from '../../docs-types'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
  ),
}

export const Circular: Story = {
  render: () => <Skeleton variant="circular" />,
}

export const Rectangular: Story = {
  render: () => <Skeleton variant="rectangular" />,
}

export const CardVariant: Story = {
  render: () => <Skeleton variant="card" />,
}

export const AnimationPulse: Story = {
  render: () => <Skeleton variant="rectangular" animation="pulse" />,
}

export const AnimationWave: Story = {
  render: () => <Skeleton variant="rectangular" animation="wave" />,
}

export const AnimationNone: Story = {
  render: () => <Skeleton variant="rectangular" animation="none" />,
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4 max-w-xs rounded-[16px] border border-[#E8E8E8]">
      <Skeleton variant="rectangular" height={140} />
      <Skeleton variant="circular" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" />
    </div>
  ),
}

export const TableSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-md">
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="flex gap-4">
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="20%" />
        </div>
      ))}
    </div>
  ),
}

export const FormSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width="30%" height={12} />
        <Skeleton variant="rectangular" height={48} className="rounded-[16px]" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width="30%" height={12} />
        <Skeleton variant="rectangular" height={48} className="rounded-[16px]" />
      </div>
      <Skeleton variant="rectangular" height={40} width={120} className="rounded-[16px]" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 p-4 items-start">
      <Skeleton variant="text" width={160} />
      <Skeleton variant="circular" />
      <Skeleton variant="rectangular" width={160} height={80} />
      <Skeleton variant="card" width={160} height={100} />
    </div>
  ),
}
