import { type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export interface ToggleProps {
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  className?: string
}

const TRACK_SIZE = {
  sm: 'w-[36px] h-[20px]',
  md: 'w-[44px] h-[24px]',
}

const THUMB_SIZE = {
  sm: 'size-[16px]',
  md: 'size-[20px]',
}

const THUMB_TRAVEL = {
  sm: 'translate-x-[16px]',
  md: 'translate-x-[20px]',
}

const THUMB_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.10)]'

export function Toggle({
  checked = false,
  disabled,
  onChange,
  label,
  supportingText,
  size = 'md',
  id,
  name,
  className,
}: ToggleProps) {
  const labelId = label ? `${id}-label` : undefined
  const descId = supportingText ? `${id}-desc` : undefined

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
    <div className={cn('flex items-start gap-[12px]', disabled && 'opacity-50', className)}>
      <span
        id={id}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex items-center rounded-full p-[2px] outline-none transition-colors shrink-0',
          'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
          TRACK_SIZE[size],
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          checked ? 'bg-[#461FAE]' : 'bg-[#E2E2E2]',
        )}
      >
        <span
          className={cn(
            'rounded-full bg-[#F7F7F7] transition-transform',
            THUMB_SIZE[size],
            THUMB_SHADOW,
            checked && THUMB_TRAVEL[size],
          )}
        />
      </span>
      {name && <input type="checkbox" name={name} checked={checked} readOnly className="hidden" />}
      {(label || supportingText) && (
        <span className="flex flex-col gap-[2px] flex-1 min-w-0">
          {label && (
            <span
              id={labelId}
              onClick={toggle}
              className={cn(
                "font-['Funnel_Display'] font-medium text-[16px] leading-[24px] text-[#4D4D4D] select-none",
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
            >
              {label}
            </span>
          )}
          {supportingText && (
            <p id={descId} className="font-['Funnel_Display'] text-[16px] leading-[24px] text-[#808080]">
              {supportingText}
            </p>
          )}
        </span>
      )}
    </div>
  )
}
