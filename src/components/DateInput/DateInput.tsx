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
  const messageId = useId()
  const isControlled = value !== undefined
  const [internalDate, setInternalDate] = useState<Date | null>(defaultValue ?? null)
  const currentDate = isControlled ? value : internalDate
  const [text, setText] = useState(currentDate ? formatDate(currentDate, format) : '')
  const [lastFormattedText, setLastFormattedText] = useState(currentDate ? formatDate(currentDate, format) : '')
  const [invalid, setInvalid] = useState(false)
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Sync text with currentDate/format on render without useEffect
  const expectedText = currentDate ? formatDate(currentDate, format) : ''
  if (expectedText !== lastFormattedText) {
    setText(expectedText)
    setLastFormattedText(expectedText)
  }

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
          aria-invalid={showError}
          aria-describedby={showError || (!success && hint) ? messageId : undefined}
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
          aria-expanded={open}
          aria-haspopup="dialog"
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
      {showError && <span id={messageId} className="text-[12px] text-[#FF4242]">{errorMessage}</span>}
      {!showError && success && <span className="text-[12px] text-[#1FBA5D]">{success}</span>}
      {!showError && !success && hint && <span id={messageId} className="text-[12px] text-[#667085] dark:text-[#98A2B3]">{hint}</span>}
    </div>
  )
}
