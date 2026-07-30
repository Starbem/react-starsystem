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
  primary: 'border-primary-base',
  success: 'border-success-base',
  accent: 'border-terciary-base',
}

const TONE_DOT: Record<RadioTone, string> = {
  primary: 'bg-primary-base',
  success: 'bg-success-base',
  accent: 'bg-terciary-base',
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
  const activeBorder = error ? 'border-error-base' : TONE_BORDER[tone]
  const activeDot = error ? 'bg-error-base' : TONE_DOT[tone]

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
          'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
          BOX_SIZE[size],
          disabled
            ? 'bg-neutral-100 border-neutral-200 cursor-not-allowed dark:bg-ink-700 dark:border-neutral-800'
            : checked
              ? cn(
                  'bg-neutral-25 hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900',
                  activeBorder,
                )
              : error
                ? 'bg-neutral-25 border-error-base hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900'
                : 'bg-neutral-25 border-neutral-300 hover:border-primary-base hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900 dark:border-ink-700',
        )}
      >
        {checked && (
          <span
            className={cn(
              'rounded-full',
              DOT_SIZE[size],
              disabled ? 'bg-neutral-200 dark:bg-ink-600' : activeDot,
            )}
          />
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
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-neutral-800 select-none dark:text-ink-100",
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
        data-radio-card
        className={cn(
          'flex items-start gap-[12px] rounded-md border p-[16px] transition-colors',
          checked
            ? cn('bg-neutral-25 dark:bg-neutral-900', activeBorder)
            : error
              ? 'border-error-base'
              : 'border-neutral-100 dark:border-ink-700',
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
