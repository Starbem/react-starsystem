# Telehealth Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new components to `@starbemtech/react-starsystem` — `Calendar`, `DateInput`, `Schedule`, `Message` (+ `TypingMessage`/`MessageDay`/`SystemMessage`/`MessageList`), `VideoCall` — following the approved design spec at `docs/superpowers/specs/2026-07-29-telehealth-components-design.md`.

**Architecture:** One folder per component under `src/components/<Name>/`, each with `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts` — exactly the existing pattern (see `src/components/Card/`). Reuses `Icon`, `Avatar`, `Spinner` already in the lib. No new dependency. Native `Date` for date math; `Schedule`'s `date`/`ScheduleEvent.date` stay `"YYYY-MM-DD"` strings per spec.

**Tech Stack:** React 18+, TypeScript strict, Tailwind v4 (`cn()` from `src/utils/cn.ts`), vitest + `@testing-library/react` + `vitest-axe`, stories via `src/docs-types.ts` (`Meta`/`StoryObj`, no Storybook).

## Global Constraints

- Icon props on new components are `ReactNode` (consumer passes `<Icon name="..."/>`), matching every existing component (Badge, Alert, DropdownMenu). Internal fixed icons (chevrons, mic/camera glyphs, ticks) render `<Icon>` directly in the component's own JSX — not exposed as configurable string props.
- Dates are native `Date` objects everywhere except `Schedule`'s `date` prop and `ScheduleEvent.date`, which are `"YYYY-MM-DD"` strings.
- No WebRTC/chat transport logic — `VideoCall`/`Message` are presentational only.
- TypeScript strict, no `any`, export `<Name>Props` (and any other public type) from each component's `.tsx`, re-exported from `index.ts`.
- Every component gets a `vitest-axe` `axe(container)` / `toHaveNoViolations()` test, following the exact pattern in `src/components/Card/Card.test.tsx:67-76` (note the `// @ts-expect-error vitest-axe matcher types not compatible with this vitest version` comment immediately above the assertion — copy it verbatim, the existing suite needs it to typecheck clean).
- `pnpm lint && pnpm typecheck && pnpm build` and `pnpm test` must stay green after every task.
- Existing repo convention: colors/spacing use Tailwind arbitrary values (`bg-[#FF5100]`, `rounded-[16px]`), NOT the `@theme` CSS variables or `src/tokens/*.ts` exports — match this exactly, don't introduce token-variable usage that the rest of the lib doesn't use yet (that migration is tracked separately).
- Dark mode: every component needs a `dark:` variant for background/border/text colors, following `Card.tsx`'s pattern (`dark:bg-[#151B2C] dark:border-[#1F2937]` etc).

---

### Task 1: Calendar

**Files:**
- Create: `src/components/Calendar/Calendar.tsx`
- Create: `src/components/Calendar/Calendar.test.tsx`
- Create: `src/components/Calendar/Calendar.stories.tsx`
- Create: `src/components/Calendar/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../Icon` (`import { Icon } from '../Icon'`), `cn` from `../../utils/cn`.
- Produces: `Calendar({ initialMonth?, initialYear?, selected?, markedDays?, onSelect?, className? }: CalendarProps)`. `CalendarProps` exported. No other component depends on `Calendar`'s internals — `DateInput` (Task 2) renders `<Calendar selected={...} markedDays={...} onSelect={...}/>` as a black box.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/Calendar/Calendar.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('renders the month/year title and weekday header', () => {
    render(<Calendar initialMonth={6} initialYear={2026} />)
    expect(screen.getByText('Julho 2026')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('renders all days of the given month as buttons', () => {
    render(<Calendar initialMonth={6} initialYear={2026} />)
    // July 2026 has 31 days
    expect(screen.getByRole('button', { name: '31' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '32' })).not.toBeInTheDocument()
  })

  it('navigates to the next and previous month', async () => {
    const user = userEvent.setup()
    render(<Calendar initialMonth={6} initialYear={2026} />)
    await user.click(screen.getByLabelText('Próximo mês'))
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Mês anterior'))
    await user.click(screen.getByLabelText('Mês anterior'))
    expect(screen.getByText('Junho 2026')).toBeInTheDocument()
  })

  it('calls onSelect with the picked date', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Calendar initialMonth={6} initialYear={2026} onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: '15' }))
    const picked: Date = onSelect.mock.calls[0][0]
    expect(picked.getFullYear()).toBe(2026)
    expect(picked.getMonth()).toBe(6)
    expect(picked.getDate()).toBe(15)
  })

  it('marks the selected day', () => {
    render(<Calendar initialMonth={6} initialYear={2026} selected={new Date(2026, 6, 15)} />)
    expect(screen.getByRole('button', { name: '15' })).toHaveClass('bg-[#FF5100]')
  })

  it('renders a dot indicator for marked days', () => {
    render(<Calendar initialMonth={6} initialYear={2026} markedDays={[new Date(2026, 6, 20)]} />)
    const day20 = screen.getByRole('button', { name: '20' })
    expect(day20.querySelector('[data-marked="true"]')).toBeInTheDocument()
  })

  it('switches to month picker and back when clicking the title', async () => {
    const user = userEvent.setup()
    render(<Calendar initialMonth={6} initialYear={2026} />)
    await user.click(screen.getByRole('button', { name: 'Julho 2026' }))
    await user.click(screen.getByRole('button', { name: 'Setembro' }))
    expect(screen.getByText('Setembro 2026')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Calendar initialMonth={6} initialYear={2026} />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- Calendar`
Expected: FAIL — `Cannot find module './Calendar'` (file doesn't exist yet).

- [ ] **Step 3: Implement Calendar**

```tsx
// src/components/Calendar/Calendar.tsx
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
    <div className={cn('inline-flex flex-col gap-[12px] p-[16px] rounded-[16px] bg-white border border-[#EAECF0] dark:bg-[#151B2C] dark:border-[#1F2937]', className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={mode === 'days' ? 'Mês anterior' : mode === 'months' ? 'Ano anterior' : 'Década anterior'}
          onClick={() => (mode === 'days' ? goToMonth(-1) : mode === 'months' ? setViewYear(viewYear - 1) : goToYearBlock(-1))}
          className="inline-flex items-center justify-center size-[32px] rounded-full text-[#344054] hover:bg-[#F2F4F7] dark:text-[#D0D5DD] dark:hover:bg-[#1F2937]"
        >
          <Icon name="chevron_left" size={20} />
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'days' ? 'months' : mode === 'months' ? 'years' : 'days')}
          className="inline-flex items-center gap-[4px] font-medium text-[14px] text-[#101828] dark:text-white"
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
          className="inline-flex items-center justify-center size-[32px] rounded-full text-[#344054] hover:bg-[#F2F4F7] dark:text-[#D0D5DD] dark:hover:bg-[#1F2937]"
        >
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      {mode === 'days' && (
        <>
          <div className="grid grid-cols-7 gap-[4px] text-center text-[12px] text-[#667085] dark:text-[#98A2B3]">
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
                    'relative inline-flex items-center justify-center size-[32px] rounded-full text-[14px] text-[#101828] hover:bg-[#F2F4F7] dark:text-white dark:hover:bg-[#1F2937]',
                    isToday && !isSelected && 'ring-1 ring-[#FF5100]',
                    isSelected && 'bg-[#FF5100] text-white hover:bg-[#FF5100]',
                  )}
                >
                  {day}
                  {isMarked && (
                    <span
                      data-marked="true"
                      className={cn('absolute bottom-[2px] size-[4px] rounded-full', isSelected ? 'bg-white' : 'bg-[#FF5100]')}
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
                'rounded-[8px] py-[8px] text-[14px] text-[#101828] hover:bg-[#F2F4F7] dark:text-white dark:hover:bg-[#1F2937]',
                i === viewMonth && 'bg-[#FF5100] text-white hover:bg-[#FF5100]',
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
                'rounded-[8px] py-[8px] text-[14px] text-[#101828] hover:bg-[#F2F4F7] dark:text-white dark:hover:bg-[#1F2937]',
                y === viewYear && 'bg-[#FF5100] text-white hover:bg-[#FF5100]',
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
```

```ts
// src/components/Calendar/index.ts
export { Calendar } from './Calendar'
export type { CalendarProps } from './Calendar'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- Calendar`
Expected: PASS (8 tests).

- [ ] **Step 5: Write stories**

```tsx
// src/components/Calendar/Calendar.stories.tsx
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
```

- [ ] **Step 6: Verify build and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Calendar
git commit -m "feat: add Calendar component"
```

---

### Task 2: DateInput

**Files:**
- Create: `src/components/DateInput/DateInput.tsx`
- Create: `src/components/DateInput/DateInput.test.tsx`
- Create: `src/components/DateInput/DateInput.stories.tsx`
- Create: `src/components/DateInput/index.ts`

**Interfaces:**
- Consumes: `Calendar` (`import { Calendar } from '../Calendar'`, exact props from Task 1: `selected?: Date`, `markedDays?: Date[]`, `onSelect?: (date: Date) => void`), `Icon` from `../Icon`, `cn` from `../../utils/cn`.
- Produces: `DateInput({ label?, required?, hint?, error?, success?, variant?, size?, format?, placeholder?, value?, defaultValue?, onChange?, markedDays?, disabled?, id? }: DateInputProps)`. `DateInputProps` exported. No later task depends on this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/DateInput/DateInput.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('renders the label and placeholder', () => {
    render(<DateInput label="Data da consulta" />)
    expect(screen.getByText('Data da consulta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('dd/mm/aaaa')).toBeInTheDocument()
  })

  it('parses a typed valid date on blur and calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" onChange={onChange} />)
    const input = screen.getByLabelText('Data')
    await user.type(input, '15/07/2026')
    await user.tab()
    const picked: Date = onChange.mock.calls[0][0]
    expect(picked.getFullYear()).toBe(2026)
    expect(picked.getMonth()).toBe(6)
    expect(picked.getDate()).toBe(15)
  })

  it('shows "Data inválida" for an unparseable value and does not call onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" onChange={onChange} />)
    const input = screen.getByLabelText('Data')
    await user.type(input, 'não é uma data')
    await user.tab()
    expect(screen.getByText('Data inválida')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opens the calendar popover via the icon button, picks a day, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput label="Data" defaultValue={new Date(2026, 6, 1)} onChange={onChange} />)
    await user.click(screen.getByLabelText('Abrir calendário'))
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '15' }))
    expect(onChange).toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: '15' })).not.toBeInTheDocument()
  })

  it('closes the popover on Escape', async () => {
    const user = userEvent.setup()
    render(<DateInput label="Data" defaultValue={new Date(2026, 6, 1)} />)
    await user.click(screen.getByLabelText('Abrir calendário'))
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: '15' })).not.toBeInTheDocument()
  })

  it('renders the error message when error prop is set', () => {
    render(<DateInput label="Data" error="Campo obrigatório" />)
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<DateInput label="Data da consulta" hint="Formato dd/mm/aaaa" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- DateInput`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement DateInput**

```tsx
// src/components/DateInput/DateInput.tsx
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Calendar } from '../Calendar'
import { Icon } from '../Icon'

export interface DateInputProps {
  label?: string
  required?: boolean
  hint?: string
  error?: string
  success?: string
  variant?: 'outline' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  format?: 'short' | 'long' | 'iso'
  placeholder?: string
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  markedDays?: Date[]
  disabled?: boolean
  id?: string
  className?: string
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const SIZE_CLASSES: Record<NonNullable<DateInputProps['size']>, string> = {
  sm: 'h-[40px] px-[12px] text-[14px]',
  md: 'h-[48px] px-[14px] text-[14px]',
  lg: 'h-[56px] px-[16px] text-[16px]',
}

const VARIANT_CLASSES: Record<NonNullable<DateInputProps['variant']>, string> = {
  outline: 'bg-white border border-[#D0D5DD] dark:bg-[#151B2C] dark:border-[#374151]',
  filled: 'bg-[#F7F7F7] border border-transparent dark:bg-[#1F2937]',
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function formatDate(date: Date, format: NonNullable<DateInputProps['format']>): string {
  const dd = pad2(date.getDate())
  const mm = pad2(date.getMonth() + 1)
  const yyyy = date.getFullYear()
  if (format === 'long') return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${yyyy}`
  if (format === 'iso') return `${yyyy}-${mm}-${dd}`
  return `${dd}/${mm}/${yyyy}`
}

function parseDate(text: string): Date | null {
  const trimmed = text.trim()
  let match = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(trimmed)
  if (match) {
    const [, d, m, y] = match
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    if (date.getMonth() === Number(m) - 1 && date.getDate() === Number(d)) return date
    return null
  }
  match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed)
  if (match) {
    const [, y, m, d] = match
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    if (date.getMonth() === Number(m) - 1 && date.getDate() === Number(d)) return date
    return null
  }
  return null
}

export function DateInput({
  label,
  required = false,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  format = 'short',
  placeholder = 'dd/mm/aaaa',
  value,
  defaultValue,
  onChange,
  markedDays = [],
  disabled = false,
  id,
  className,
}: DateInputProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const isControlled = value !== undefined
  const [internalDate, setInternalDate] = useState<Date | null>(defaultValue ?? null)
  const currentDate = isControlled ? value : internalDate
  const [text, setText] = useState(currentDate ? formatDate(currentDate, format) : '')
  const [invalid, setInvalid] = useState(false)
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setText(currentDate ? formatDate(currentDate, format) : '')
  }, [currentDate, format])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function commitDate(date: Date | null) {
    if (!isControlled) setInternalDate(date)
    onChange?.(date)
  }

  function handleBlur() {
    if (text.trim() === '') {
      setInvalid(false)
      commitDate(null)
      return
    }
    const parsed = parseDate(text)
    if (parsed) {
      setInvalid(false)
      commitDate(parsed)
    } else {
      setInvalid(true)
    }
  }

  function handleSelect(date: Date) {
    setInvalid(false)
    commitDate(date)
    setOpen(false)
  }

  const errorMessage = invalid ? 'Data inválida' : error
  const showError = Boolean(errorMessage)

  return (
    <div className={cn('flex flex-col gap-[4px]', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-[14px] font-medium text-[#344054] dark:text-[#D0D5DD]">
          {label}
          {required && <span className="text-[#FF4242]"> *</span>}
        </label>
      )}
      <div className="relative" ref={popoverRef}>
        <input
          id={fieldId}
          type="text"
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          className={cn(
            'w-full rounded-[12px] pr-[40px] outline-none text-[#101828] placeholder:text-[#98A2B3] dark:text-white',
            SIZE_CLASSES[size],
            VARIANT_CLASSES[variant],
            showError && 'border-[#FF4242]',
            success && !showError && 'border-[#1FBA5D]',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
        <button
          type="button"
          aria-label="Abrir calendário"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="absolute right-[8px] top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-[32px] rounded-full text-[#667085] hover:bg-[#F2F4F7] dark:text-[#98A2B3] dark:hover:bg-[#1F2937]"
        >
          <Icon name="calendar_today" size={18} />
        </button>
        {open && (
          <div className="absolute z-10 mt-[4px]">
            <Calendar selected={currentDate ?? undefined} markedDays={markedDays} onSelect={handleSelect} />
          </div>
        )}
      </div>
      {showError && <span className="text-[12px] text-[#FF4242]">{errorMessage}</span>}
      {!showError && success && <span className="text-[12px] text-[#1FBA5D]">{success}</span>}
      {!showError && !success && hint && <span className="text-[12px] text-[#667085] dark:text-[#98A2B3]">{hint}</span>}
    </div>
  )
}
```

```ts
// src/components/DateInput/index.ts
export { DateInput } from './DateInput'
export type { DateInputProps } from './DateInput'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- DateInput`
Expected: PASS (7 tests).

- [ ] **Step 5: Write stories**

```tsx
// src/components/DateInput/DateInput.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
}
export default meta
type Story = StoryObj<typeof DateInput>

export const Default: Story = {
  render: () => <DateInput label="Data da consulta" hint="Formato dd/mm/aaaa" />,
}

export const WithDefaultValue: Story = {
  render: () => <DateInput label="Data da consulta" defaultValue={new Date(2026, 6, 15)} />,
}

export const WithError: Story = {
  render: () => <DateInput label="Data da consulta" error="Escolha uma data futura" />,
}

export const Filled: Story = {
  render: () => <DateInput label="Data da consulta" variant="filled" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[16px] max-w-[280px]">
      <DateInput label="Pequeno" size="sm" />
      <DateInput label="Médio" size="md" />
      <DateInput label="Grande" size="lg" />
    </div>
  ),
}
```

- [ ] **Step 6: Verify build and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/DateInput
git commit -m "feat: add DateInput component"
```

---

### Task 3: Schedule

**Files:**
- Create: `src/components/Schedule/Schedule.tsx`
- Create: `src/components/Schedule/Schedule.test.tsx`
- Create: `src/components/Schedule/Schedule.stories.tsx`
- Create: `src/components/Schedule/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../Icon`, `cn` from `../../utils/cn`.
- Produces: `Schedule({ view?, date?, events?, startHour?, endHour?, hourHeight?, weekStartsOn?, nowAt?, title?, onEventClick?, onViewChange?, onDateChange? }: ScheduleProps)` and `ScheduleEvent` type, both exported. No later task depends on this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/Schedule/Schedule.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Schedule, type ScheduleEvent } from './Schedule'

const EVENTS: ScheduleEvent[] = [
  { id: '1', date: '2026-07-29', start: '09:00', end: '09:30', title: 'Consulta Dra. Ana', meet: true },
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- Schedule`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Schedule**

```tsx
// src/components/Schedule/Schedule.tsx
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
  nowAt,
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
    if (view === 'week') return `Semana de ${activeDate.getDate()} de ${MONTHS_PT[activeDate.getMonth()]}`
    return `${activeDate.getDate()} de ${MONTHS_PT[activeDate.getMonth()]} de ${activeDate.getFullYear()}`
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
        className="absolute left-[4px] right-[4px] rounded-[8px] border-l-4 px-[8px] py-[4px] text-left overflow-hidden"
      >
        <p className="text-[12px] font-medium text-[#101828] truncate">{event.title}</p>
        {event.subtitle && <p className="text-[11px] text-[#667085] truncate">{event.subtitle}</p>}
        {event.meet && (
          <span className="inline-flex items-center gap-[4px] text-[11px] text-[#FF5100] mt-[2px]">
            <Icon name="videocam" size={14} />
            Entrar com vídeo
          </span>
        )}
      </button>
    )
  }

  function renderHourGrid(dayISO: string) {
    const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)
    const dayEvents = events.filter((e) => (e.date ?? activeISO) === dayISO)
    return (
      <div className="relative" style={{ height: hours.length * hourHeight }}>
        {hours.map((h) => (
          <div key={h} className="absolute left-0 right-0 border-t border-[#EAECF0] dark:border-[#1F2937] text-[11px] text-[#98A2B3] pl-[4px]" style={{ top: (h - startHour) * hourHeight }}>
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
        {dayEvents.map(renderEvent)}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-[12px] rounded-[16px] bg-white border border-[#EAECF0] p-[16px] dark:bg-[#151B2C] dark:border-[#1F2937]', className)}>
      <div className="flex items-center justify-between">
        <button type="button" aria-label={navLabels.prev} onClick={() => navigate(-1)} className="inline-flex items-center justify-center size-[32px] rounded-full hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]">
          <Icon name="chevron_left" size={20} />
        </button>
        <span className="inline-flex items-center gap-[6px] font-medium text-[14px] text-[#101828] dark:text-white">
          <Icon name="schedule" size={18} />
          {headerTitle()}
        </span>
        <button type="button" aria-label={navLabels.next} onClick={() => navigate(1)} className="inline-flex items-center justify-center size-[32px] rounded-full hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]">
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      <div className="flex gap-[8px] text-[12px]">
        {(['day', 'week', 'month'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange?.(v)}
            className={cn('px-[10px] py-[4px] rounded-[8px]', view === v ? 'bg-[#FF5100] text-white' : 'text-[#667085] hover:bg-[#F2F4F7] dark:text-[#98A2B3] dark:hover:bg-[#1F2937]')}
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
                  <p className="text-[11px] text-center text-[#667085] dark:text-[#98A2B3] mb-[4px]">
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
                <span key={d} className="text-center text-[11px] text-[#667085] dark:text-[#98A2B3]">
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <span key={`b-${i}`} />
                const iso = toISODate(new Date(year, month, day))
                const dayEvents = events.filter((e) => e.date === iso)
                return (
                  <div key={day} className="min-h-[64px] rounded-[8px] border border-[#EAECF0] dark:border-[#1F2937] p-[4px] text-[11px]">
                    <span className="text-[#101828] dark:text-white">{day}</span>
                    {dayEvents.slice(0, 2).map((e) => (
                      <p key={e.id} className="truncate text-[#FF5100]">
                        • {e.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && <p className="text-[#98A2B3]">+{dayEvents.length - 2}</p>}
                  </div>
                )
              })}
            </div>
          )
        })()}
    </div>
  )
}
```

```ts
// src/components/Schedule/index.ts
export { Schedule } from './Schedule'
export type { ScheduleProps, ScheduleEvent } from './Schedule'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- Schedule`
Expected: PASS (8 tests).

- [ ] **Step 5: Write stories**

```tsx
// src/components/Schedule/Schedule.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { Schedule, type ScheduleEvent } from './Schedule'

const meta: Meta<typeof Schedule> = {
  title: 'Components/Schedule',
  component: Schedule,
}
export default meta
type Story = StoryObj<typeof Schedule>

const EVENTS: ScheduleEvent[] = [
  { id: '1', date: '2026-07-29', start: '09:00', end: '09:30', title: 'Dra. Ana Costa', subtitle: 'Dermatologia', meet: true },
  { id: '2', date: '2026-07-29', start: '11:00', end: '11:45', title: 'Nutricionista', subtitle: 'Retorno' },
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
```

- [ ] **Step 6: Verify build and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Schedule
git commit -m "feat: add Schedule component"
```

---

### Task 4: Message (+ TypingMessage, MessageDay, SystemMessage, MessageList)

**Files:**
- Create: `src/components/Message/Message.tsx`
- Create: `src/components/Message/Message.test.tsx`
- Create: `src/components/Message/Message.stories.tsx`
- Create: `src/components/Message/index.ts`

**Interfaces:**
- Consumes: `Avatar` from `../Avatar` (`name`/`src`/`alt` props, exact shape from `src/components/Avatar/Avatar.tsx`), `Icon` from `../Icon`, `cn` from `../../utils/cn`.
- Produces: `Message`, `TypingMessage`, `MessageDay`, `SystemMessage`, `MessageList` — all exported from `Message.tsx` and re-exported via `index.ts`. No later task depends on this.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/Message/Message.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Message, MessageDay, MessageList, SystemMessage, TypingMessage } from './Message'

describe('Message', () => {
  it('renders incoming and outgoing bubbles with different alignment', () => {
    const { container: inContainer } = render(<Message side="in">Oi, tudo bem?</Message>)
    const { container: outContainer } = render(<Message side="out">Tudo ótimo!</Message>)
    expect(inContainer.firstChild).toHaveClass('justify-start')
    expect(outContainer.firstChild).toHaveClass('justify-end')
  })

  it('renders delivery ticks only for outgoing messages', () => {
    render(<Message side="out" status="read" data-testid="msg">Lida</Message>)
    expect(screen.getByTestId('msg-tick')).toBeInTheDocument()
  })

  it('does not render ticks for incoming messages even with a status', () => {
    render(<Message side="in" status="read" data-testid="msg">Recebida</Message>)
    expect(screen.queryByTestId('msg-tick')).not.toBeInTheDocument()
  })

  it('renders an image attachment', () => {
    render(
      <Message side="in" attachment="image" imageSrc="https://example.com/x.png">
        Foto
      </Message>,
    )
    expect(screen.getByRole('img', { name: 'Anexo de imagem' })).toBeInTheDocument()
  })

  it('renders a file attachment with name and size', () => {
    render(
      <Message side="in" attachment="file" fileName="exame.pdf" fileSize="1.2 MB">
        Anexo
      </Message>,
    )
    expect(screen.getByText('exame.pdf')).toBeInTheDocument()
    expect(screen.getByText('1.2 MB')).toBeInTheDocument()
  })

  it('renders reactions with counts', () => {
    render(
      <Message side="in" reactions={[{ emoji: '👍', count: 3 }]}>
        Ok
      </Message>,
    )
    expect(screen.getByText('👍 3')).toBeInTheDocument()
  })

  it('renders TypingMessage, MessageDay and SystemMessage', () => {
    render(
      <>
        <TypingMessage avatarName="Ana" />
        <MessageDay>Hoje</MessageDay>
        <SystemMessage>Consulta agendada</SystemMessage>
      </>,
    )
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('Consulta agendada')).toBeInTheDocument()
  })

  it('has no a11y violations in a full MessageList', async () => {
    const { container } = render(
      <MessageList>
        <MessageDay>Hoje</MessageDay>
        <Message side="in" avatarName="Ana">
          Oi
        </Message>
        <Message side="out" status="read">
          Olá!
        </Message>
        <TypingMessage avatarName="Ana" />
      </MessageList>,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- Message`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Message**

```tsx
// src/components/Message/Message.tsx
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'

export interface MessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  side?: 'in' | 'out'
  children: ReactNode
  time?: string
  status?: 'sent' | 'delivered' | 'read'
  author?: string
  avatarSrc?: string
  avatarName?: string
  reactions?: { emoji: string; count?: number }[]
  attachment?: 'image' | 'file' | 'voice'
  imageSrc?: string
  fileName?: string
  fileSize?: string
  'data-testid'?: string
}

function Ticks({ status, testId }: { status: NonNullable<MessageProps['status']>; testId?: string }) {
  return (
    <span data-testid={testId ? `${testId}-tick` : undefined} className={cn('inline-flex', status === 'read' ? 'text-[#FF5100]' : 'text-[#98A2B3]')}>
      <Icon name={status === 'sent' ? 'check' : 'done_all'} size={14} />
    </span>
  )
}

export function Message({
  side = 'in',
  children,
  time,
  status,
  author,
  avatarSrc,
  avatarName,
  reactions,
  attachment,
  imageSrc,
  fileName,
  fileSize,
  className,
  'data-testid': testId,
  ...props
}: MessageProps) {
  const isOut = side === 'out'
  return (
    <div className={cn('flex items-end gap-[8px]', isOut ? 'justify-end' : 'justify-start', className)} {...props}>
      {!isOut && (avatarSrc || avatarName) && (avatarSrc ? <Avatar src={avatarSrc} alt={avatarName ?? ''} size="sm" /> : <Avatar name={avatarName} size="sm" />)}
      <div className="max-w-[320px] flex flex-col gap-[4px]">
        {author && <span className="text-[12px] font-medium text-[#667085] dark:text-[#98A2B3]">{author}</span>}
        <div
          className={cn(
            'rounded-[16px] px-[12px] py-[8px] text-[14px]',
            isOut ? 'bg-[#FF5100] text-white rounded-br-[4px]' : 'bg-[#F2F4F7] text-[#101828] rounded-bl-[4px] dark:bg-[#1F2937] dark:text-white',
          )}
        >
          {attachment === 'image' && imageSrc && (
            <img src={imageSrc} alt="Anexo de imagem" className="rounded-[8px] mb-[6px] max-w-[240px]" />
          )}
          {attachment === 'file' && (
            <div className="flex items-center gap-[8px] mb-[6px] rounded-[8px] bg-white/20 p-[8px]">
              <Icon name="description" size={20} />
              <div className="flex flex-col">
                <span className="text-[13px]">{fileName}</span>
                <span className="text-[11px] opacity-80">{fileSize}</span>
              </div>
              <Icon name="download" size={18} />
            </div>
          )}
          {attachment === 'voice' && (
            <div className="flex items-center gap-[8px] mb-[6px]">
              <Icon name="play_arrow" size={20} />
              <span className="flex gap-[2px]">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} className="w-[2px] bg-current opacity-60" style={{ height: 4 + ((i * 7) % 12) }} />
                ))}
              </span>
            </div>
          )}
          {children}
        </div>
        {reactions && reactions.length > 0 && (
          <div className="flex gap-[4px]">
            {reactions.map((r, i) => (
              <span key={i} className="rounded-full bg-[#F2F4F7] px-[6px] py-[2px] text-[12px] dark:bg-[#1F2937]">
                {r.emoji} {r.count ?? 1}
              </span>
            ))}
          </div>
        )}
        {(time || (isOut && status)) && (
          <div className={cn('flex items-center gap-[4px] text-[11px] text-[#98A2B3]', isOut ? 'justify-end' : 'justify-start')}>
            {time && <span>{time}</span>}
            {isOut && status && <Ticks status={status} testId={testId} />}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingMessage({ avatarSrc, avatarName, className }: { avatarSrc?: string; avatarName?: string; className?: string }) {
  return (
    <div className={cn('flex items-end gap-[8px] justify-start', className)}>
      {(avatarSrc || avatarName) && (avatarSrc ? <Avatar src={avatarSrc} alt={avatarName ?? ''} size="sm" /> : <Avatar name={avatarName} size="sm" />)}
      <div className="flex gap-[3px] rounded-[16px] rounded-bl-[4px] bg-[#F2F4F7] px-[14px] py-[10px] dark:bg-[#1F2937]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[6px] rounded-full bg-[#98A2B3] animate-bounce motion-reduce:!animate-none" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

export function MessageDay({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-[8px]">
      <span className="rounded-full bg-[#F2F4F7] px-[10px] py-[4px] text-[12px] text-[#667085] dark:bg-[#1F2937] dark:text-[#98A2B3]">{children}</span>
    </div>
  )
}

export function SystemMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-[4px]">
      <span className="text-[12px] text-[#98A2B3] text-center">{children}</span>
    </div>
  )
}

export function MessageList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-[8px] overflow-y-auto', className)}>{children}</div>
}
```

```ts
// src/components/Message/index.ts
export { Message, TypingMessage, MessageDay, SystemMessage, MessageList } from './Message'
export type { MessageProps } from './Message'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- Message`
Expected: PASS (8 tests).

- [ ] **Step 5: Write stories**

```tsx
// src/components/Message/Message.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { Message, MessageDay, MessageList, SystemMessage, TypingMessage } from './Message'

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
}
export default meta
type Story = StoryObj<typeof Message>

export const Conversation: Story = {
  render: () => (
    <MessageList className="max-w-[360px]">
      <MessageDay>Hoje</MessageDay>
      <Message side="in" avatarName="Dra. Ana Costa" time="09:12">
        Bom dia! Como está se sentindo?
      </Message>
      <Message side="out" status="read" time="09:13">
        Bom dia, doutora! Bem melhor, obrigado.
      </Message>
      <Message side="in" avatarName="Dra. Ana Costa" attachment="file" fileName="receita.pdf" fileSize="340 KB" time="09:14">
        Segue a receita atualizada.
      </Message>
      <SystemMessage>Consulta encerrada</SystemMessage>
      <TypingMessage avatarName="Dra. Ana Costa" />
    </MessageList>
  ),
}

export const Reactions: Story = {
  render: () => (
    <MessageList className="max-w-[360px]">
      <Message side="in" avatarName="Dra. Ana Costa" reactions={[{ emoji: '👍', count: 1 }]}>
        Combinado então!
      </Message>
    </MessageList>
  ),
}
```

- [ ] **Step 6: Verify build and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Message
git commit -m "feat: add Message component and chat helpers"
```

---

### Task 5: VideoCall

**Files:**
- Create: `src/components/VideoCall/VideoCall.tsx`
- Create: `src/components/VideoCall/VideoCall.test.tsx`
- Create: `src/components/VideoCall/VideoCall.stories.tsx`
- Create: `src/components/VideoCall/index.ts`

**Interfaces:**
- Consumes: `Avatar` from `../Avatar`, `Spinner` from `../Spinner` (`label` prop required, per `src/components/Spinner/Spinner.tsx:7`), `Icon` from `../Icon`, `cn` from `../../utils/cn`.
- Produces: `VideoCall({ name?, specialty?, remoteSrc?, selfSrc?, layout?, status?, timer?, connection?, caption?, mic?, camera?, onToggleMic?, onToggleCamera?, onEnd?, onChat?, onMore? }: VideoCallProps)`. `VideoCallProps` exported. No later task depends on this — last component in the plan.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/VideoCall/VideoCall.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { VideoCall } from './VideoCall'

describe('VideoCall', () => {
  it('renders the control bar and connection info when status is live', () => {
    render(<VideoCall status="live" connection="Conexão estável" timer="05:21" />)
    expect(screen.getByText('Conexão estável')).toBeInTheDocument()
    expect(screen.getByText('05:21')).toBeInTheDocument()
    expect(screen.getByLabelText('Encerrar chamada')).toBeInTheDocument()
  })

  it('renders a connecting state with a spinner and no control bar', () => {
    render(<VideoCall status="connecting" name="Dra. Ana" specialty="Dermatologia" />)
    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByLabelText('Encerrar chamada')).not.toBeInTheDocument()
  })

  it('renders an ended state with no control bar', () => {
    render(<VideoCall status="ended" />)
    expect(screen.getByText('Consulta encerrada')).toBeInTheDocument()
    expect(screen.queryByLabelText('Encerrar chamada')).not.toBeInTheDocument()
  })

  it('toggles mic uncontrolled and calls onToggleMic', async () => {
    const user = userEvent.setup()
    const onToggleMic = vi.fn()
    render(<VideoCall status="live" onToggleMic={onToggleMic} />)
    const micButton = screen.getByLabelText('Desativar microfone')
    await user.click(micButton)
    expect(onToggleMic).toHaveBeenCalledWith(false)
    expect(screen.getByLabelText('Ativar microfone')).toBeInTheDocument()
  })

  it('reflects the controlled mic prop instead of toggling internally', () => {
    render(<VideoCall status="live" mic={false} />)
    expect(screen.getByLabelText('Ativar microfone')).toBeInTheDocument()
  })

  it('renders chat and more buttons only when their callbacks are passed', () => {
    const { rerender } = render(<VideoCall status="live" />)
    expect(screen.queryByLabelText('Chat')).not.toBeInTheDocument()
    rerender(<VideoCall status="live" onChat={() => {}} onMore={() => {}} />)
    expect(screen.getByLabelText('Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Mais opções')).toBeInTheDocument()
  })

  it('calls onEnd when the hang-up button is clicked', async () => {
    const user = userEvent.setup()
    const onEnd = vi.fn()
    render(<VideoCall status="live" onEnd={onEnd} />)
    await user.click(screen.getByLabelText('Encerrar chamada'))
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations in the live state', async () => {
    const { container } = render(<VideoCall status="live" />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- VideoCall`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement VideoCall**

```tsx
// src/components/VideoCall/VideoCall.tsx
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'
import { Spinner } from '../Spinner'

export interface VideoCallProps {
  name?: string
  specialty?: string
  remoteSrc?: string
  selfSrc?: string
  layout?: 'spotlight' | 'grid'
  status?: 'live' | 'connecting' | 'ended'
  timer?: string
  connection?: string
  caption?: string
  mic?: boolean
  camera?: boolean
  onToggleMic?: (next: boolean) => void
  onToggleCamera?: (next: boolean) => void
  onEnd?: () => void
  onChat?: () => void
  onMore?: () => void
  className?: string
}

function Tile({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-[#1C1B1F] rounded-[16px]', className)}>
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : <div className="size-full flex items-center justify-center text-[#667085] text-[13px]">Sem vídeo</div>}
    </div>
  )
}

export function VideoCall({
  name = 'Dra. Luciana Martins',
  specialty = 'Dermatologia',
  remoteSrc,
  selfSrc,
  layout = 'spotlight',
  status = 'live',
  timer = '12:04',
  connection = 'Conexão estável',
  caption,
  mic,
  camera,
  onToggleMic,
  onToggleCamera,
  onEnd,
  onChat,
  onMore,
  className,
}: VideoCallProps) {
  const [internalMic, setInternalMic] = useState(true)
  const [internalCamera, setInternalCamera] = useState(true)
  const micOn = mic ?? internalMic
  const cameraOn = camera ?? internalCamera

  function toggleMic() {
    const next = !micOn
    if (mic === undefined) setInternalMic(next)
    onToggleMic?.(next)
  }

  function toggleCamera() {
    const next = !cameraOn
    if (camera === undefined) setInternalCamera(next)
    onToggleCamera?.(next)
  }

  if (status === 'connecting') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-[16px] rounded-[16px] bg-[#1C1B1F] p-[32px] text-white', className)}>
        <Avatar name={name} size="xl" />
        <div className="text-center">
          <p className="font-medium">{name}</p>
          <p className="text-[13px] text-[#98A2B3]">{specialty}</p>
        </div>
        <Spinner size="md" color="white" label="Conectando..." />
        <p className="text-[13px] text-[#98A2B3]">Conectando...</p>
        {onEnd && (
          <button type="button" aria-label="Cancelar chamada" onClick={onEnd} className="rounded-full bg-[#FF4242] px-[16px] py-[8px] text-[13px]">
            Cancelar
          </button>
        )}
      </div>
    )
  }

  if (status === 'ended') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-[12px] rounded-[16px] bg-[#1C1B1F] p-[32px] text-white', className)}>
        <Avatar name={name} size="xl" />
        <p className="font-medium">Consulta encerrada</p>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-[16px] bg-[#1C1B1F] p-[8px] text-white', className)}>
      {layout === 'spotlight' ? (
        <div className="relative">
          <Tile src={remoteSrc} alt={name} className="w-full aspect-video" />
          <Tile src={selfSrc} alt="Você" className="absolute bottom-[12px] right-[12px] w-[96px] aspect-video ring-2 ring-white/20" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[8px]">
          <Tile src={remoteSrc} alt={name} className="aspect-video" />
          <Tile src={selfSrc} alt="Você" className="aspect-video" />
        </div>
      )}

      {caption && (
        <p className="absolute bottom-[80px] left-1/2 -translate-x-1/2 rounded-[8px] bg-black/60 px-[12px] py-[4px] text-[13px]">{caption}</p>
      )}

      <div className="flex items-center justify-between mt-[8px] px-[4px]">
        <span className="inline-flex items-center gap-[6px] text-[12px] text-[#98A2B3]">
          <Icon name="signal_cellular_alt" size={16} />
          {connection}
        </span>
        <span className="text-[12px] text-[#98A2B3]">{timer}</span>
      </div>

      <div className="flex items-center justify-center gap-[12px] mt-[12px]">
        <button
          type="button"
          aria-label={micOn ? 'Desativar microfone' : 'Ativar microfone'}
          onClick={toggleMic}
          className={cn('inline-flex items-center justify-center size-[44px] rounded-full', micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white text-[#101828]')}
        >
          <Icon name={micOn ? 'mic' : 'mic_off'} size={20} />
        </button>
        <button
          type="button"
          aria-label={cameraOn ? 'Desativar câmera' : 'Ativar câmera'}
          onClick={toggleCamera}
          className={cn('inline-flex items-center justify-center size-[44px] rounded-full', cameraOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white text-[#101828]')}
        >
          <Icon name={cameraOn ? 'videocam' : 'videocam_off'} size={20} />
        </button>
        <button type="button" aria-label="Encerrar chamada" onClick={onEnd} className="inline-flex items-center justify-center size-[44px] rounded-full bg-[#FF4242]">
          <Icon name="call_end" size={20} />
        </button>
        {onChat && (
          <button type="button" aria-label="Chat" onClick={onChat} className="inline-flex items-center justify-center size-[44px] rounded-full bg-white/10 hover:bg-white/20">
            <Icon name="chat_bubble" size={20} />
          </button>
        )}
        {onMore && (
          <button type="button" aria-label="Mais opções" onClick={onMore} className="inline-flex items-center justify-center size-[44px] rounded-full bg-white/10 hover:bg-white/20">
            <Icon name="more_horiz" size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
```

```ts
// src/components/VideoCall/index.ts
export { VideoCall } from './VideoCall'
export type { VideoCallProps } from './VideoCall'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- VideoCall`
Expected: PASS (8 tests).

- [ ] **Step 5: Write stories**

```tsx
// src/components/VideoCall/VideoCall.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { VideoCall } from './VideoCall'

const meta: Meta<typeof VideoCall> = {
  title: 'Components/VideoCall',
  component: VideoCall,
}
export default meta
type Story = StoryObj<typeof VideoCall>

export const Live: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="live" name="Dra. Luciana Martins" specialty="Dermatologia" timer="05:21" onEnd={() => {}} onChat={() => {}} onMore={() => {}} />
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="live" layout="grid" onEnd={() => {}} />
    </div>
  ),
}

export const Connecting: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="connecting" name="Dra. Luciana Martins" specialty="Dermatologia" onEnd={() => {}} />
    </div>
  ),
}

export const Ended: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="ended" name="Dra. Luciana Martins" />
    </div>
  ),
}
```

- [ ] **Step 6: Verify build and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/VideoCall
git commit -m "feat: add VideoCall component"
```

---

### Task 6: Barrel exports and changeset

**Files:**
- Modify: `src/index.ts`
- Create: `.changeset/telehealth-components.md`

**Interfaces:**
- Consumes: all 5 components' exports from Tasks 1–5 (`Calendar`/`CalendarProps`, `DateInput`/`DateInputProps`, `Schedule`/`ScheduleProps`/`ScheduleEvent`, `Message`/`TypingMessage`/`MessageDay`/`SystemMessage`/`MessageList`/`MessageProps`, `VideoCall`/`VideoCallProps`).
- Produces: nothing consumed by later tasks — this is the last task.

- [ ] **Step 1: Add the 5 export blocks to `src/index.ts`**

Insert before the `// Design tokens` comment (keeping the existing pattern of one blank-line-separated block per component, alphabetically is not enforced elsewhere in this file so just append after the last component export, e.g. after the `EmptyState` block):

```ts
export { Calendar } from './components/Calendar'
export type { CalendarProps } from './components/Calendar'

export { DateInput } from './components/DateInput'
export type { DateInputProps } from './components/DateInput'

export { Schedule } from './components/Schedule'
export type { ScheduleProps, ScheduleEvent } from './components/Schedule'

export { Message, TypingMessage, MessageDay, SystemMessage, MessageList } from './components/Message'
export type { MessageProps } from './components/Message'

export { VideoCall } from './components/VideoCall'
export type { VideoCallProps } from './components/VideoCall'
```

- [ ] **Step 2: Verify the barrel compiles and every export resolves**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Run the full test suite and build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: all green — existing 329 tests plus the ~39 new tests from Tasks 1–5 (8+7+8+8+8), build emits `dist/index.js`/`dist/index.d.ts`/`dist/style.css` with no errors.

- [ ] **Step 4: Add the changeset**

```markdown
---
"@starbemtech/react-starsystem": minor
---

Add 5 new telehealth-domain components: `Calendar` (month date picker), `DateInput` (text field + calendar popover), `Schedule` (day/week/month agenda with video-consultation chips), `Message` (chat bubbles + `TypingMessage`/`MessageDay`/`SystemMessage`/`MessageList`), and `VideoCall` (video-consultation surface with spotlight/grid layout and live/connecting/ended states).
```

Write this to `.changeset/telehealth-components.md`.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts .changeset/telehealth-components.md
git commit -m "feat: export telehealth components and add changeset"
```

---

## Final verification (after all 6 tasks)

- [ ] Run `pnpm lint && pnpm typecheck && pnpm build && pnpm test` one more time from a clean state — all must be green.
- [ ] Manually sanity-check `pnpm docs:dev`, navigate to each of the 5 new component pages in the docs site sidebar (auto-discovered via the `.stories.tsx` glob per `CLAUDE.md`), confirm each story renders without a runtime error in the browser console.
