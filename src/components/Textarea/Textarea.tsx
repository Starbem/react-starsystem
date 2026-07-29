import { type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({
  label, hint, error,
  className, disabled, id,
  ...props
}: TextareaProps) {
  const isError = Boolean(error)
  const hintText = error ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', disabled && 'opacity-60', className)}>
      <div
        className={cn(
          'flex flex-col gap-[4px] overflow-hidden px-[14px] py-[10px] rounded-lg w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-base focus-within:ring-offset-2',
          disabled
            ? 'bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:border-ink-700'
            : isError
              ? 'bg-neutral-25 border-error-light dark:bg-neutral-900'
              : 'bg-neutral-25 border-neutral-300 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700',
        )}
      >
        {label && (
          <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-neutral-400 shrink-0 select-none dark:text-ink-500">
            {label}
          </span>
        )}
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          className={cn(
            "bg-transparent outline-none font-['Funnel_Display'] text-[16px] leading-[24px] w-full resize-y",
            disabled
              ? 'text-neutral-500 cursor-not-allowed placeholder:text-neutral-500 dark:text-ink-500 dark:placeholder:text-ink-500'
              : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
          )}
          {...props}
        />
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
