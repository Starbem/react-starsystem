import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface CalendarProps {
  initialMonth?: number
  initialYear?: number
  selected?: Date
  markedDays?: Date[]
  onSelect?: (date: Date) => void
  className?: string
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const WEEKDAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function firstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function Calendar({ initialMonth, initialYear, selected, markedDays = [], onSelect, className }: CalendarProps) {
  const now = new Date()
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days')
  // Falls back to `selected`'s month/year (not just "today") so a popover
  // opened on an already-selected date shows the right month immediately.
  const [viewMonth, setViewMonth] = useState(initialMonth ?? selected?.getMonth() ?? now.getMonth())
  const [viewYear, setViewYear] = useState(initialYear ?? selected?.getFullYear() ?? now.getFullYear())

  function goToMonth(delta: number) {
    let month = viewMonth + delta
    let year = viewYear
    if (month < 0) {
      month = 11
      year -= 1
    } else if (month > 11) {
      month = 0
      year += 1
    }
    setViewMonth(month)
    setViewYear(year)
  }

  function goToYearBlock(delta: number) {
    setViewYear(viewYear + delta * 12)
  }

  const total = daysInMonth(viewYear, viewMonth)
  const leadingBlanks = firstWeekday(viewYear, viewMonth)
  const days = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className={cn('inline-flex flex-col gap-[12px] p-[16px] rounded-lg bg-white border border-ink-200 dark:bg-ink-900 dark:border-neutral-900', className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={mode === 'days' ? 'Mês anterior' : mode === 'months' ? 'Ano anterior' : 'Década anterior'}
          onClick={() => (mode === 'days' ? goToMonth(-1) : mode === 'months' ? setViewYear(viewYear - 1) : goToYearBlock(-1))}
          className="inline-flex items-center justify-center size-[32px] rounded-full text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-neutral-900"
        >
          <Icon name="chevron_left" size={20} />
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'days' ? 'months' : mode === 'months' ? 'years' : 'days')}
          className="inline-flex items-center gap-[4px] font-medium text-[14px] text-ink-900 dark:text-white"
        >
          {mode === 'days' && `${MONTHS_PT[viewMonth]} ${viewYear}`}
          {mode === 'months' && `${viewYear}`}
          {mode === 'years' && `${viewYear - 5}–${viewYear + 6}`}
          <Icon name={mode === 'days' ? 'arrow_drop_down' : 'arrow_drop_up'} size={18} />
        </button>
        <button
          type="button"
          aria-label={mode === 'days' ? 'Próximo mês' : mode === 'months' ? 'Próximo ano' : 'Próxima década'}
          onClick={() => (mode === 'days' ? goToMonth(1) : mode === 'months' ? setViewYear(viewYear + 1) : goToYearBlock(1))}
          className="inline-flex items-center justify-center size-[32px] rounded-full text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-neutral-900"
        >
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      {mode === 'days' && (
        <>
          <div className="grid grid-cols-7 gap-[4px] text-center text-[12px] text-ink-500 dark:text-neutral-400">
            {WEEKDAYS_PT.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[4px]">
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {days.map((day) => {
              const date = new Date(viewYear, viewMonth, day)
              const isToday = isSameDay(date, now)
              const isSelected = selected ? isSameDay(date, selected) : false
              const isMarked = markedDays.some((d) => isSameDay(d, date))
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onSelect?.(date)}
                  className={cn(
                    'relative inline-flex items-center justify-center size-[32px] rounded-full text-[14px] text-ink-900 hover:bg-ink-100 dark:text-white dark:hover:bg-neutral-900',
                    isToday && !isSelected && 'ring-1 ring-primary-base',
                    isSelected && 'bg-primary-base text-white hover:bg-primary-base',
                  )}
                >
                  {day}
                  {isMarked && (
                    <span
                      data-marked="true"
                      className={cn('absolute bottom-[2px] size-[4px] rounded-full', isSelected ? 'bg-white' : 'bg-primary-base')}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}

      {mode === 'months' && (
        <div className="grid grid-cols-3 gap-[8px]">
          {MONTHS_PT.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setViewMonth(i)
                setMode('days')
              }}
              className={cn(
                'rounded-sm py-[8px] text-[14px] text-ink-900 hover:bg-ink-100 dark:text-white dark:hover:bg-neutral-900',
                i === viewMonth && 'bg-primary-base text-white hover:bg-primary-base',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {mode === 'years' && (
        <div className="grid grid-cols-3 gap-[8px]">
          {Array.from({ length: 12 }, (_, i) => viewYear - 5 + i).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => {
                setViewYear(y)
                setMode('months')
              }}
              className={cn(
                'rounded-sm py-[8px] text-[14px] text-ink-900 hover:bg-ink-100 dark:text-white dark:hover:bg-neutral-900',
                y === viewYear && 'bg-primary-base text-white hover:bg-primary-base',
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
