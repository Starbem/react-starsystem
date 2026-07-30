import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react'
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

export type TextareaVariant = FieldVariant
export type TextareaSize = FieldSize

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: TextareaVariant
  size?: TextareaSize
  showCount?: boolean
}

export function Textarea({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  showCount = false,
  className,
  disabled,
  id,
  value,
  defaultValue,
  maxLength,
  onChange,
  ...props
}: TextareaProps) {
  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    typeof defaultValue === 'string' ? defaultValue.length : 0,
  )

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) {
      setUncontrolledLength(e.target.value.length)
    }
    onChange?.(e)
  }

  const length = isControlled ? String(value).length : uncontrolledLength
  const showCounter = showCount && maxLength != null

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
          'flex flex-col w-full overflow-hidden',
          !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
          !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
          FIELD_SIZE_PADDING_Y_CLASSES[size],
        )}
      >
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "bg-transparent outline-none font-['Funnel_Display'] w-full resize-y min-h-[96px]",
            FIELD_SIZE_TEXT_CLASSES[size],
            disabled
              ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
              : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
          )}
          {...props}
        />
      </div>
      {(hintText || showCounter) && (
        <div className="flex items-center justify-between gap-[8px] w-full">
          {hintText && (
            <p
              id={hintId}
              className={cn(
                "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] flex items-center gap-[4px]",
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
          {showCounter && (
            <span className="font-['Funnel_Display'] text-[12px] text-neutral-400 dark:text-ink-500 tabular-nums shrink-0 ml-auto">
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
