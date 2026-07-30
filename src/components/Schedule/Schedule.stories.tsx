import type { Meta, StoryObj } from '../../docs-types'
import { Schedule, type ScheduleEvent } from './Schedule'

const meta: Meta<typeof Schedule> = {
  title: 'Components/Schedule',
  component: Schedule,
}
export default meta
type Story = StoryObj<typeof Schedule>

const EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    date: '2026-07-29',
    start: '09:00',
    end: '09:30',
    title: 'Dra. Ana Costa',
    subtitle: 'Dermatologia',
    meet: true,
  },
  {
    id: '2',
    date: '2026-07-29',
    start: '11:00',
    end: '11:45',
    title: 'Nutricionista',
    subtitle: 'Retorno',
  },
  { id: '3', date: '2026-07-30', start: '14:00', end: '14:30', title: 'Psicólogo', meet: true },
]

export const Day: Story = {
  render: () => <Schedule view="day" date="2026-07-29" events={EVENTS} />,
}

export const Week: Story = {
  render: () => <Schedule view="week" date="2026-07-29" events={EVENTS} />,
}

export const Month: Story = {
  render: () => <Schedule view="month" date="2026-07-29" events={EVENTS} />,
}
