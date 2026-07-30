import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { FilterBar, FilterChip } from './FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Components/FilterBar',
  component: FilterBar,
  args: {
    options: [
      { id: 'online', label: 'Online', icon: 'videocam', count: 12 },
      { id: 'hoje', label: 'Hoje', count: 4 },
      { id: 'derma', label: 'Dermatologia' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {}

export const Segmented: Story = {
  args: {
    variant: 'segmented',
    defaultValue: 'hoje',
    options: [
      { id: 'hoje', label: 'Hoje' },
      { id: 'semana', label: 'Semana' },
      { id: 'mes', label: 'Mês' },
    ],
  },
}

export const Controlled: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>(['online'])
    return (
      <FilterBar
        value={sel}
        onChange={(v) => setSel(v as string[])}
        options={[
          { id: 'online', label: 'Online', icon: 'videocam', count: 12 },
          { id: 'hoje', label: 'Hoje', count: 4 },
          { id: 'derma', label: 'Dermatologia' },
        ]}
      />
    )
  },
}

export const StandaloneChips: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <FilterChip label="Especialidade" dropdown />
      <FilterChip label="Online" icon="videocam" selected />
      <FilterChip label="Dermatologia" removable onRemove={() => {}} />
    </div>
  ),
}
