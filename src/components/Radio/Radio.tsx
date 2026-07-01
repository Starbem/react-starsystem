import { cn } from '../../utils/cn'

export interface RadioProps {
  value: string
  checked?: boolean
  disabled?: boolean
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  tabIndex?: number
  onSelect?: (value: string) => void
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px]',
  md: 'size-[24px]',
}

const DOT_SIZE = {
  sm: 'size-[8px]',
  md: 'size-[12px]',
}

export function Radio({
  value,
  checked = false,
  disabled,
  label,
  supportingText,
  size = 'md',
  id,
  name,
  tabIndex = 0,
  onSelect,
  className,
}: RadioProps) {
  const labelId = label ? `${id}-label` : undefined
  const descId = supportingText ? `${id}-desc` : undefined

  function select() {
    if (disabled) return
    onSelect?.(value)
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
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
              ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed'
              : checked
                ? 'bg-[#F7F7F7] border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer',
          )}
        >
          {checked && (
            <span className={cn('rounded-full', DOT_SIZE[size], disabled ? 'bg-[#CFCFCF]' : 'bg-[#FF5100]')} />
          )}
        </span>
      </span>
      {(label || supportingText) && (
        <span className="flex flex-col gap-[2px] flex-1 min-w-0">
          {label && (
            <span
              id={labelId}
              onClick={select}
              className={cn(
                "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none",
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
