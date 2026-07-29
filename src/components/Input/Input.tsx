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
          'flex gap-[8px] items-center overflow-hidden px-[16px] py-[8px] rounded-lg w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-base focus-within:ring-offset-2',
          disabled
            ? 'bg-neutral-50 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-ink-700'
            : isError
              ? 'bg-neutral-25 border-error-base shadow-elevation-01 dark:bg-neutral-900'
              : 'bg-neutral-25 border-neutral-300 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700',
        )}
      >
        {leadingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            {leadingIcon}
          </span>
        )}
        <div className="flex flex-col flex-1 min-w-0 h-[40px] justify-center">
          {label && (
            <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-neutral-400 shrink-0 select-none dark:text-ink-500">
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
                ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
                : label
                  ? 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400'
                  : 'text-neutral-800 placeholder:text-neutral-400 dark:text-ink-100 dark:placeholder:text-ink-500',
            )}
            {...props}
          />
        </div>
        {trailingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            {trailingIcon}
          </span>
        )}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-error-base' : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  )
}
