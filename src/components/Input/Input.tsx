import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type InputVariant = 'outline' | 'filled' | 'underline'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  variant?: InputVariant
  size?: InputSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const SIZE_TEXT_CLASSES: Record<InputSize, string> = {
  sm: 'text-[14px] leading-[20px]',
  md: 'text-[16px] leading-[24px]',
  lg: 'text-[17px] leading-[26px]',
}

const SIZE_PADDING_Y_CLASSES: Record<InputSize, string> = {
  sm: 'py-[7px]',
  md: 'py-[10px]',
  lg: 'py-[13px]',
}

const SIZE_PADDING_X_CLASSES: Record<InputSize, string> = {
  sm: 'px-[12px]',
  md: 'px-[14px]',
  lg: 'px-[16px]',
}

const SIZE_RADIUS_CLASSES: Record<InputSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
}

function getFieldColorClasses(
  variant: InputVariant,
  disabled: boolean,
  state: 'error' | null,
) {
  if (disabled) {
    return 'border bg-neutral-50 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-ink-700'
  }

  if (variant === 'underline') {
    return cn(
      'border-0 border-b bg-transparent',
      'border-b-neutral-300 hover:border-b-neutral-400 dark:border-b-ink-700 dark:hover:border-b-ink-600',
      'focus-within:border-b-primary-base',
      state === 'error' && 'border-b-error-base focus-within:border-b-error-base',
    )
  }

  if (variant === 'filled') {
    return cn(
      'border border-transparent bg-ink-100 hover:bg-ink-50 dark:bg-ink-700 dark:hover:bg-ink-600',
      'focus-within:bg-neutral-25 focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)] dark:focus-within:bg-neutral-900',
      state === 'error' &&
        'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
    )
  }

  return cn(
    'border bg-neutral-25 border-neutral-300 hover:border-neutral-400 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700 dark:hover:border-ink-600',
    'focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)]',
    state === 'error' &&
      'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
  )
}

export function Input({
  label,
  hint,
  error,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const state: 'error' | null = isError ? 'error' : null
  const hintText = error ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-stretch w-full overflow-hidden',
          !isUnderlineShape && SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
        )}
      >
        <div
          className={cn(
            'flex flex-1 min-w-0 items-center gap-[8px]',
            SIZE_PADDING_Y_CLASSES[size],
            !isUnderlineShape && SIZE_PADDING_X_CLASSES[size],
          )}
        >
          {leadingIcon && (
            <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              {leadingIcon}
            </span>
          )}
          <input
            id={id}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={hintId}
            className={cn(
              "bg-transparent outline-none font-['Funnel_Display'] w-full",
              SIZE_TEXT_CLASSES[size],
              disabled
                ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
                : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              {trailingIcon}
            </span>
          )}
        </div>
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
