import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Calendar } from './Calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
}
export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => <Calendar initialMonth={6} initialYear={2026} />,
}

export const WithSelection: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 6, 15))
      return <Calendar initialMonth={6} initialYear={2026} selected={selected} onSelect={setSelected} />
    }
    return <Demo />
  },
}

export const WithMarkedDays: Story = {
  render: () => (
    <Calendar
      initialMonth={6}
      initialYear={2026}
      markedDays={[new Date(2026, 6, 10), new Date(2026, 6, 20), new Date(2026, 6, 28)]}
    />
  ),
}
