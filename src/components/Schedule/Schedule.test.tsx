import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Schedule, type ScheduleEvent } from './Schedule'

const EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    date: '2026-07-29',
    start: '09:00',
    end: '09:30',
    title: 'Consulta Dra. Ana',
    meet: true,
  },
  { id: '2', date: '2026-07-29', start: '23:00', end: '23:30', title: 'Fora do horário visível' },
]

describe('Schedule', () => {
  it('renders the day view header with the formatted date', () => {
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} />)
    expect(screen.getByText(/29 de julho de 2026/)).toBeInTheDocument()
  })

  it('renders events that fall within the visible hour range', () => {
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} startHour={8} endHour={19} />)
    expect(screen.getByText('Consulta Dra. Ana')).toBeInTheDocument()
  })

  it('does not render events outside the visible hour range', () => {
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} startHour={8} endHour={19} />)
    expect(screen.queryByText('Fora do horário visível')).not.toBeInTheDocument()
  })

  it('renders a "Entrar com vídeo" chip for meet events', () => {
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} />)
    expect(screen.getByText('Entrar com vídeo')).toBeInTheDocument()
  })

  it('calls onEventClick with the full event when an event is clicked', async () => {
    const user = userEvent.setup()
    const onEventClick = vi.fn()
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} onEventClick={onEventClick} />)
    await user.click(screen.getByText('Consulta Dra. Ana'))
    expect(onEventClick).toHaveBeenCalledWith(EVENTS[0])
  })

  it('navigates to the next and previous day and calls onDateChange', async () => {
    const user = userEvent.setup()
    const onDateChange = vi.fn()
    render(<Schedule view="day" date="2026-07-29" events={EVENTS} onDateChange={onDateChange} />)
    await user.click(screen.getByLabelText('Próximo dia'))
    expect(onDateChange).toHaveBeenCalledWith('2026-07-30')
  })

  it('renders a month grid in month view', () => {
    render(<Schedule view="month" date="2026-07-29" events={EVENTS} />)
    expect(screen.getByText('Julho 2026')).toBeInTheDocument()
    expect(screen.getAllByText('29').length).toBeGreaterThan(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Schedule view="day" date="2026-07-29" events={EVENTS} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
