import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface ScheduleEvent {
  id: string
  date?: string
  start: string
  end: string
  title: string
  subtitle?: string
  color?: string
  bg?: string
  meet?: boolean
}

export interface ScheduleProps {
  view?: 'day' | 'week' | 'month'
  date?: string
  events?: ScheduleEvent[]
  startHour?: number
  endHour?: number
  hourHeight?: number
  weekStartsOn?: 0 | 1
  nowAt?: string
  title?: string
  onEventClick?: (event: ScheduleEvent) => void
  onViewChange?: (view: 'day' | 'week' | 'month') => void
  onDateChange?: (date: string) => void
  className?: string
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DOW_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h! * 60 + m!
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function Schedule({
  view = 'day',
  date,
  events = [],
  startHour = 8,
  endHour = 19,
  hourHeight = 60,
  weekStartsOn = 0,
  nowAt: _nowAt,
  title,
  onEventClick,
  onViewChange,
  onDateChange,
  className,
}: ScheduleProps) {
  const activeDate = date ? parseISODate(date) : new Date()
  const activeISO = date ?? toISODate(activeDate)

  function navigate(delta: number) {
    const next = new Date(activeDate)
    if (view === 'day') next.setDate(next.getDate() + delta)
    else if (view === 'week') next.setDate(next.getDate() + delta * 7)
    else next.setMonth(next.getMonth() + delta)
    onDateChange?.(toISODate(next))
  }

  function headerTitle(): string {
    if (title) return title
    if (view === 'month') return `${MONTHS_PT[activeDate.getMonth()]} ${activeDate.getFullYear()}`
    if (view === 'week') return `Semana de ${activeDate.getDate()} de ${MONTHS_PT[activeDate.getMonth()].toLowerCase()}`
    return `${activeDate.getDate()} de ${MONTHS_PT[activeDate.getMonth()].toLowerCase()} de ${activeDate.getFullYear()}`
  }

  const navLabels =
    view === 'day' ? { prev: 'Dia anterior', next: 'Próximo dia' } : view === 'week' ? { prev: 'Semana anterior', next: 'Próxima semana' } : { prev: 'Mês anterior', next: 'Próximo mês' }

  function renderEvent(event: ScheduleEvent) {
    const top = (toMinutes(event.start) - startHour * 60) * (hourHeight / 60)
    const height = (toMinutes(event.end) - toMinutes(event.start)) * (hourHeight / 60)
    return (
      <button
        key={event.id}
        type="button"
        onClick={() => onEventClick?.(event)}
        style={{ top, height, backgroundColor: event.bg ?? '#FFF1E0', borderColor: event.color ?? '#FF5100' }}
        className="absolute left-[4px] right-[4px] rounded-sm border-l-4 px-[8px] py-[4px] text-left overflow-hidden"
      >
        <p className="text-[12px] font-medium text-ink-900 truncate">{event.title}</p>
        {event.subtitle && <p className="text-[11px] text-ink-500 truncate">{event.subtitle}</p>}
        {event.meet && (
          <span className="inline-flex items-center gap-[4px] text-[11px] text-primary-base mt-[2px]">
            <Icon name="videocam" size={14} />
            Entrar com vídeo
          </span>
        )}
      </button>
    )
  }

  function renderHourGrid(dayISO: string) {
    const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)
    const dayEvents = events.filter((e) => {
      if ((e.date ?? activeISO) !== dayISO) return false
      const eventStart = toMinutes(e.start)
      const eventEnd = toMinutes(e.end)
      const visibleStart = startHour * 60
      const visibleEnd = endHour * 60
      return eventStart < visibleEnd && eventEnd > visibleStart
    })
    return (
      <div className="relative" style={{ height: hours.length * hourHeight }}>
        {hours.map((h) => (
          <div key={h} className="absolute left-0 right-0 border-t border-ink-200 dark:border-neutral-900 text-[11px] text-neutral-400 pl-[4px]" style={{ top: (h - startHour) * hourHeight }}>
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
        {dayEvents.map(renderEvent)}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-[12px] rounded-lg bg-white border border-ink-200 p-[16px] dark:bg-ink-900 dark:border-neutral-900', className)}>
      <div className="flex items-center justify-between">
        <button type="button" aria-label={navLabels.prev} onClick={() => navigate(-1)} className="inline-flex items-center justify-center size-[32px] rounded-full hover:bg-ink-100 dark:hover:bg-neutral-900">
          <Icon name="chevron_left" size={20} />
        </button>
        <span className="inline-flex items-center gap-[6px] font-medium text-[14px] text-ink-900 dark:text-white">
          <Icon name="schedule" size={18} />
          {headerTitle()}
        </span>
        <button type="button" aria-label={navLabels.next} onClick={() => navigate(1)} className="inline-flex items-center justify-center size-[32px] rounded-full hover:bg-ink-100 dark:hover:bg-neutral-900">
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      <div className="flex gap-[8px] text-[12px]">
        {(['day', 'week', 'month'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange?.(v)}
            className={cn('px-[10px] py-[4px] rounded-sm', view === v ? 'bg-primary-base text-white' : 'text-ink-500 hover:bg-ink-100 dark:text-neutral-400 dark:hover:bg-neutral-900')}
          >
            {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
          </button>
        ))}
      </div>

      {view === 'day' && renderHourGrid(activeISO)}

      {view === 'week' &&
        (() => {
          const start = new Date(activeDate)
          const dow = start.getDay()
          const diff = (dow - weekStartsOn + 7) % 7
          start.setDate(start.getDate() - diff)
          const weekDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start)
            d.setDate(d.getDate() + i)
            return d
          })
          return (
            <div className="flex gap-[8px] overflow-x-auto">
              {weekDays.map((d) => (
                <div key={d.toISOString()} className="flex-1 min-w-[120px]">
                  <p className="text-[11px] text-center text-ink-500 dark:text-neutral-400 mb-[4px]">
                    {DOW_PT[d.getDay()]} {d.getDate()}
                  </p>
                  {renderHourGrid(toISODate(d))}
                </div>
              ))}
            </div>
          )
        })()}

      {view === 'month' &&
        (() => {
          const year = activeDate.getFullYear()
          const month = activeDate.getMonth()
          const total = daysInMonth(year, month)
          const leading = new Date(year, month, 1).getDay()
          const cells = [
            ...Array.from({ length: leading }, () => null),
            ...Array.from({ length: total }, (_, i) => i + 1),
          ]
          return (
            <div className="grid grid-cols-7 gap-[4px]">
              {DOW_PT.map((d) => (
                <span key={d} className="text-center text-[11px] text-ink-500 dark:text-neutral-400">
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <span key={`b-${i}`} />
                const iso = toISODate(new Date(year, month, day))
                const dayEvents = events.filter((e) => e.date === iso)
                return (
                  <div key={day} className="min-h-[64px] rounded-sm border border-ink-200 dark:border-neutral-900 p-[4px] text-[11px]">
                    <span className="text-ink-900 dark:text-white">{day}</span>
                    {dayEvents.slice(0, 2).map((e) => (
                      <p key={e.id} className="truncate text-primary-base">
                        • {e.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && <p className="text-neutral-400">+{dayEvents.length - 2}</p>}
                  </div>
                )
              })}
            </div>
          )
        })()}
    </div>
  )
}
