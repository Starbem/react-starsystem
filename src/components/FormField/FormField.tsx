import { cloneElement, isValidElement, useId, type ReactElement } from 'react'
import { cn } from '../../utils/cn'

export interface FormFieldProps {
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
  htmlFor?: string
  children: ReactElement
  className?: string
}

export function FormField({
  label,
  helperText,
  errorMessage,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId
  const isError = Boolean(errorMessage)
  const messageText = errorMessage ?? helperText
  const messageId = messageText ? `${fieldId}-message` : undefined

  const child = isValidElement(children)
    ? cloneElement(children, {
        id: fieldId,
        'aria-describedby': messageId,
        'aria-required': required || undefined,
      } as Record<string, unknown>)
    : children

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-error-base ml-[2px]">
              *
            </span>
          )}
        </label>
      )}
      {child}
      {messageText && (
        <p
          id={messageId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-error-base' : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {messageText}
        </p>
      )}
    </div>
  )
}
