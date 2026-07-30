import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export type InputVariant = FieldVariant
export type InputSize = FieldSize

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: InputVariant
  size?: InputSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

function InputAffix({ children, side }: { children: ReactNode; side: 'prefix' | 'suffix' }) {
  return (
    <span
      className={cn(
        'shrink-0 flex items-center px-[12px] bg-neutral-50 text-neutral-600 text-[14px] font-medium border-neutral-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700 select-none',
        side === 'prefix' ? 'border-r' : 'border-l',
      )}
    >
      {children}
    </span>
  )
}

export function Input({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
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
          !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
        )}
      >
        {prefix && <InputAffix side="prefix">{prefix}</InputAffix>}
        <div
          className={cn(
            'flex flex-1 min-w-0 items-center gap-[8px]',
            FIELD_SIZE_PADDING_Y_CLASSES[size],
            !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
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
              FIELD_SIZE_TEXT_CLASSES[size],
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
        {suffix && <InputAffix side="suffix">{suffix}</InputAffix>}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full flex items-center gap-[4px]",
            isError
              ? 'text-error-base'
              : isSuccess
                ? 'text-success-dark dark:text-success-light'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {isError && <Icon name="error" size={15} />}
          {isSuccess && <Icon name="check_circle" size={15} />}
          {hintText}
        </p>
      )}
    </div>
  )
}
