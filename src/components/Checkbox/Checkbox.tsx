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
  sm: 'size-[16px] rounded-[4px]',
  md: 'size-[24px] rounded-[6px]',
  lg: 'size-[32px] rounded-[8px]',
}

const ICON_INSET = {
  sm: 'inset-[12.5%]',
  md: 'inset-[15%]',
  lg: 'inset-[15%]',
}

const TONE_BORDER: Record<CheckboxTone, string> = {
  primary: 'border-[#FF5100]',
  success: 'border-[#1FBA5D]',
  accent: 'border-[#ED2E98]',
}

const ERROR_BORDER = 'border-[#FF4242]'

const TONE_ICON_COLOR: Record<CheckboxTone, string> = {
  primary: 'text-[#FF5100]',
  success: 'text-[#1FBA5D]',
  accent: 'text-[#ED2E98]',
}

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
  const activeIconColor = error ? 'text-[#FF4242]' : TONE_ICON_COLOR[tone]

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
          'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
          BOX_SIZE[size],
          disabled
            ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed dark:bg-[#374151] dark:border-[#2A3441]'
            : isActive
              ? cn('bg-[#F7F7F7] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]', activeBorder)
              : error
                ? 'bg-[#F7F7F7] border-[#FF4242] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937] dark:border-[#374151]',
        )}
      >
        {isActive && (
          <span className={cn('absolute', ICON_INSET[size], disabled ? 'text-[#CFCFCF] dark:text-[#4B5563]' : activeIconColor)}>
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
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none dark:text-[#F2F4F7]",
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
            error ? 'text-[#FF4242]' : 'text-[#808080] dark:text-[#9CA3AF]',
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
          'flex items-start gap-[12px] rounded-[12px] border p-[16px] transition-colors',
          isActive ? cn('bg-[#F7F7F7] dark:bg-[#1F2937]', activeBorder) : 'border-[#E2E2E2] dark:border-[#374151]',
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
