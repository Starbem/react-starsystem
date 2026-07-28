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
          'flex flex-col gap-[4px] overflow-hidden px-[14px] py-[10px] rounded-[16px] w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-[#FF5100] focus-within:ring-offset-2',
          disabled
            ? 'bg-[#EFEFEF] border-[#B6B6B6] dark:bg-[#1F2937] dark:border-[#374151]'
            : isError
              ? 'bg-[#F7F7F7] border-[#FF867E] dark:bg-[#1F2937]'
              : 'bg-[#F7F7F7] border-[#B6B6B6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)] dark:bg-[#1F2937] dark:border-[#374151]',
        )}
      >
        {label && (
          <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] shrink-0 select-none dark:text-[#6B7280]">
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
              ? 'text-[#808080] cursor-not-allowed placeholder:text-[#808080] dark:text-[#6B7280] dark:placeholder:text-[#6B7280]'
              : 'text-[#393939] placeholder:text-[#808080] dark:text-[#F2F4F7] dark:placeholder:text-[#9CA3AF]',
          )}
          {...props}
        />
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-[#FF4242]' : 'text-[#808080] dark:text-[#9CA3AF]',
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  )
}
