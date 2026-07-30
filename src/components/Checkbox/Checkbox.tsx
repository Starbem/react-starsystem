import { useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export type CheckboxTone = 'primary' | 'success' | 'accent'

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: CheckboxTone
  variant?: 'default' | 'card'
  error?: boolean
  id?: string
  name?: string
  value?: string
  className?: string
  'aria-label'?: string
}

const BOX_SIZE = {
  sm: 'size-[16px] rounded-xs',
  md: 'size-[24px] rounded-sm',
  lg: 'size-[32px] rounded-sm',
}

const ICON_INSET = {
  sm: 'inset-[12.5%]',
  md: 'inset-[15%]',
  lg: 'inset-[15%]',
}

const TONE_BORDER: Record<CheckboxTone, string> = {
  primary: 'border-primary-base',
  success: 'border-success-base',
  accent: 'border-terciary-base',
}

const ERROR_BORDER = 'border-error-base'

const TONE_ICON_COLOR: Record<CheckboxTone, string> = {
  primary: 'text-primary-base',
  success: 'text-success-base',
  accent: 'text-terciary-base',
}

const TONE_HOVER_SHADOW: Record<CheckboxTone, string> = {
  primary: 'hover:shadow-[0px_0px_12px_0px_rgba(255,81,0,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(255,81,0,0.5)]',
  success: 'hover:shadow-[0px_0px_12px_0px_rgba(31,186,93,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(31,186,93,0.5)]',
  accent: 'hover:shadow-[0px_0px_12px_0px_rgba(237,46,152,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(237,46,152,0.5)]',
}

const ERROR_HOVER_SHADOW =
  'hover:shadow-[0px_0px_12px_0px_rgba(255,66,66,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(255,66,66,0.5)]'

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}

function IndeterminateIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M5 11h14v2H5z" />
    </svg>
  )
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled,
  onChange,
  label,
  supportingText,
  size = 'md',
  tone = 'primary',
  variant = 'default',
  error = false,
  id,
  name,
  value,
  className,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const labelId = label ? `${checkboxId}-label` : undefined
  const descId = supportingText ? `${checkboxId}-desc` : undefined
  const isActive = checked || indeterminate
  const activeBorder = error ? ERROR_BORDER : TONE_BORDER[tone]
  const activeIconColor = error ? 'text-error-base' : TONE_ICON_COLOR[tone]

  function toggle() {
    if (disabled) return
    onChange?.(!checked)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      toggle()
    }
  }

  const box = (
    <span className="flex items-center justify-center pt-[2px] shrink-0">
      <span
        id={checkboxId}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled || undefined}
        aria-label={labelId ? undefined : ariaLabel}
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex items-center justify-center border outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
          BOX_SIZE[size],
          disabled
            ? 'bg-neutral-100 border-neutral-200 cursor-not-allowed dark:bg-ink-700 dark:border-neutral-800'
            : isActive
              ? cn('bg-neutral-25 cursor-pointer dark:bg-neutral-900', activeBorder, error ? ERROR_HOVER_SHADOW : TONE_HOVER_SHADOW[tone])
              : error
                ? cn('bg-neutral-25 border-error-base cursor-pointer dark:bg-neutral-900', ERROR_HOVER_SHADOW)
                : cn(
                    'bg-neutral-25 border-neutral-300 hover:border-primary-base cursor-pointer dark:bg-neutral-900 dark:border-ink-700',
                    TONE_HOVER_SHADOW.primary,
                  ),
        )}
      >
        {isActive && (
          <span className={cn('absolute', ICON_INSET[size], disabled ? 'text-neutral-200 dark:text-ink-600' : activeIconColor)}>
            {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {name && <input type="checkbox" name={name} value={value} checked={checked} readOnly className="hidden" />}
    </span>
  )

  const textBlock = (label || supportingText) && (
    <span className="flex flex-col gap-[2px] flex-1 min-w-0">
      {label && (
        <span
          id={labelId}
          onClick={toggle}
          className={cn(
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-neutral-800 select-none dark:text-ink-100",
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            isActive ? 'font-medium' : 'font-normal',
          )}
        >
          {label}
        </span>
      )}
      {supportingText && (
        <p
          id={descId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px]",
            error ? 'text-error-base' : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {supportingText}
        </p>
      )}
    </span>
  )

  if (variant === 'card') {
    return (
      <div
        data-checkbox-card
        className={cn(
          'flex items-start gap-[12px] rounded-md border p-[16px] transition-colors',
          isActive
            ? cn('bg-neutral-25 dark:bg-neutral-900', activeBorder)
            : error
              ? 'border-error-base'
              : 'border-neutral-100 dark:border-ink-700',
          className,
        )}
      >
        {box}
        {textBlock}
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      {box}
      {textBlock}
    </div>
  )
}
