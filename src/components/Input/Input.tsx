import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const hintText = error ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      <div
        className={cn(
          'flex gap-[8px] items-center overflow-hidden px-[16px] py-[8px] rounded-[16px] w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-[#FF5100] focus-within:ring-offset-2',
          disabled
            ? 'bg-[#EFEFEF] border-[#B6B6B6] cursor-not-allowed'
            : isError
              ? 'bg-[#F7F7F7] border-[#FF4242] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]'
              : 'bg-[#F7F7F7] border-[#B6B6B6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
        )}
      >
        {leadingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-[#808080]">
            {leadingIcon}
          </span>
        )}
        <div className="flex flex-col flex-1 min-w-0 h-[40px] justify-center">
          {label && (
            <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] shrink-0 select-none">
              {label}
            </span>
          )}
          <input
            id={id}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={hintId}
            className={cn(
              "bg-transparent outline-none font-['Funnel_Display'] text-[16px] leading-[24px] w-full",
              disabled
                ? 'text-[#B6B6B6] cursor-not-allowed placeholder:text-[#B6B6B6]'
                : label
                  ? 'text-[#393939] placeholder:text-[#808080]'
                  : 'text-[#393939] placeholder:text-[#9C9C9C]',
            )}
            {...props}
          />
        </div>
        {trailingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-[#808080]">
            {trailingIcon}
          </span>
        )}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-[#FF4242]' : 'text-[#808080]',
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  )
}
