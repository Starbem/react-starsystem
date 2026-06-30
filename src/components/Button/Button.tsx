import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#FF5100] border border-[#FF5100] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  secondary: 'bg-transparent border border-[#FF5100] text-[#FF5100]',
  outline:
    'bg-[#F7F7F7] border border-[#B6B6B6] text-[#393939] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  ghost: 'bg-[#E2E2E2] border-0 text-[#808080]',
  danger:
    'bg-[#FF4242] border border-[#FF4242] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-[14px] py-[8px] text-[14px] leading-[20px]',
  md: 'px-[16px] py-[10px] text-[14px] leading-[20px]',
  lg: 'px-[18px] py-[10px] text-[16px] leading-[24px]',
}

const iconOnlySizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'p-[8px] text-[14px] leading-[20px]',
  md: 'p-[10px] text-[14px] leading-[20px]',
  lg: 'p-[10px] text-[16px] leading-[24px]',
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  iconOnly = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {!iconOnly && children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
