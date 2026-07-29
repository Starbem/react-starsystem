import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'solid' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
  icon?: ReactNode
  dot?: boolean
  className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-[#F2F4F7] text-[#344054] dark:bg-[#374151] dark:text-[#D1D5DB]',
  primary: 'bg-[#F3E9FC] text-[#461FAE]',
  accent: 'bg-[#FFF1E0] text-[#A31B00]',
  success: 'bg-[#D4F4DD] text-[#166534]',
  warning: 'bg-[#FEF3C7] text-[#92400E]',
  error: 'bg-[#FFE1E1] text-[#B42318]',
  solid: 'bg-[#7F56D9] text-white',
  info: 'bg-[#DBEAFE] text-[#1E40AF]',
}

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-[8px] py-[2px] text-[12px] leading-[16px] gap-[4px]',
  md: 'px-[10px] py-[4px] text-[14px] leading-[20px] gap-[6px]',
}

const REMOVE_ICON_SIZE: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'size-[12px]',
  md: 'size-[14px]',
}

const DOT_SIZE: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'size-[5px]',
  md: 'size-[6px]',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  dot = false,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {dot && <span data-badge-dot className={cn('shrink-0 rounded-full bg-current', DOT_SIZE[size])} aria-hidden="true" />}
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${typeof children === 'string' ? children : 'tag'}`}
          className={cn(
            'shrink-0 inline-flex items-center justify-center rounded-full outline-none',
            'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
            REMOVE_ICON_SIZE[size],
          )}
        >
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
