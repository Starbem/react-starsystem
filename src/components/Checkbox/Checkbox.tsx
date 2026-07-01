import { useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  value?: string
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px] rounded-[4px]',
  md: 'size-[24px] rounded-[6px]',
}

const ICON_INSET = {
  sm: 'inset-[12.5%]',
  md: 'inset-[15%]',
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
  id,
  name,
  value,
  className,
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const labelId = label ? `${checkboxId}-label` : undefined
  const descId = supportingText ? `${checkboxId}-desc` : undefined
  const isActive = checked || indeterminate

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

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      <span className="flex items-center justify-center pt-[2px] shrink-0">
        <span
          id={checkboxId}
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-disabled={disabled || undefined}
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
              ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed'
              : isActive
                ? 'bg-[#F7F7F7] border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer',
          )}
        >
          {isActive && (
            <span className={cn('absolute', ICON_INSET[size], disabled ? 'text-[#CFCFCF]' : 'text-[#FF5100]')}>
              {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
            </span>
          )}
        </span>
        {name && <input type="checkbox" name={name} value={value} checked={checked} readOnly className="hidden" />}
      </span>
      {(label || supportingText) && (
        <span className="flex flex-col gap-[2px] flex-1 min-w-0">
          {label && (
            <span
              id={labelId}
              onClick={toggle}
              className={cn(
                "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none",
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
              className="font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] text-[#808080]"
            >
              {supportingText}
            </p>
          )}
        </span>
      )}
    </div>
  )
}
