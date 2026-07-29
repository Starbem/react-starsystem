import { cn } from '../../utils/cn'

export type RadioTone = 'primary' | 'success' | 'accent'

export interface RadioProps {
  value: string
  checked?: boolean
  disabled?: boolean
  label?: string
  supportingText?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: RadioTone
  variant?: 'default' | 'card'
  error?: boolean
  id?: string
  name?: string
  tabIndex?: number
  onSelect?: (value: string) => void
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px]',
  md: 'size-[24px]',
  lg: 'size-[32px]',
}

const DOT_SIZE = {
  sm: 'size-[8px]',
  md: 'size-[12px]',
  lg: 'size-[16px]',
}

const TONE_BORDER: Record<RadioTone, string> = {
  primary: 'border-[#FF5100]',
  success: 'border-[#1FBA5D]',
  accent: 'border-[#ED2E98]',
}

const TONE_DOT: Record<RadioTone, string> = {
  primary: 'bg-[#FF5100]',
  success: 'bg-[#1FBA5D]',
  accent: 'bg-[#ED2E98]',
}

export function Radio({
  value,
  checked = false,
  disabled,
  label,
  supportingText,
  size = 'md',
  tone = 'primary',
  variant = 'default',
  error = false,
  id,
  name,
  tabIndex = 0,
  onSelect,
  className,
}: RadioProps) {
  const labelId = label ? `${id}-label` : undefined
  const descId = supportingText ? `${id}-desc` : undefined
  const activeBorder = error ? 'border-[#FF4242]' : TONE_BORDER[tone]
  const activeDot = error ? 'bg-[#FF4242]' : TONE_DOT[tone]

  function select() {
    if (disabled) return
    onSelect?.(value)
  }

  const circle = (
    <span className="flex items-center justify-center pt-[2px] shrink-0">
      <span
        id={id}
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={select}
        data-value={value}
        data-radio-name={name}
        className={cn(
          'relative flex items-center justify-center rounded-full border outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
          BOX_SIZE[size],
          disabled
            ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed dark:bg-[#374151] dark:border-[#2A3441]'
            : checked
              ? cn('bg-[#F7F7F7] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]', activeBorder)
              : error
                ? 'bg-[#F7F7F7] border-[#FF4242] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937] dark:border-[#374151]',
        )}
      >
        {checked && (
          <span className={cn('rounded-full', DOT_SIZE[size], disabled ? 'bg-[#CFCFCF] dark:bg-[#4B5563]' : activeDot)} />
        )}
      </span>
    </span>
  )

  const textBlock = (label || supportingText) && (
    <span className="flex flex-col gap-[2px] flex-1 min-w-0">
      {label && (
        <span
          id={labelId}
          onClick={select}
          className={cn(
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none dark:text-[#F2F4F7]",
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            checked ? 'font-medium' : 'font-normal',
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
        data-radio-card
        className={cn(
          'flex items-start gap-[12px] rounded-[12px] border p-[16px] transition-colors',
          checked ? cn('bg-[#F7F7F7] dark:bg-[#1F2937]', activeBorder) : 'border-[#E2E2E2] dark:border-[#374151]',
          className,
        )}
      >
        {circle}
        {textBlock}
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      {circle}
      {textBlock}
    </div>
  )
}
