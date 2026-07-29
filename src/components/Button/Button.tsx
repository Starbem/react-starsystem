import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'tertiary'
  | 'link'
  | 'glass'
  | 'glass-dark'
  | 'glass-brand'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonSharedProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
  pill?: boolean
  block?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAsButton = { as?: 'button' } & ButtonSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

type ButtonAsAnchor = { as: 'a' } & ButtonSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF5100] border border-[#FF5100] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  secondary: 'bg-transparent border border-[#FF5100] text-[#FF5100]',
  outline:
    'bg-[#F7F7F7] border border-[#B6B6B6] text-[#393939] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)] dark:bg-[#1F2937] dark:border-[#374151] dark:text-[#F2F4F7]',
  ghost: 'bg-[#E2E2E2] border-0 text-[#808080] dark:bg-[#374151] dark:text-[#9CA3AF]',
  danger:
    'bg-[#FF4242] border border-[#FF4242] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  tertiary: 'bg-transparent border-0 text-[#D03700] hover:bg-[#FFF1E0] disabled:text-[#9C9C9C]',
  link: 'bg-transparent border-0 text-[#FF5100] underline-offset-4 hover:underline hover:text-[#A31B00] p-0! rounded-none',
  glass:
    'bg-gradient-to-br from-white/55 to-white/25 text-[#A31B00] border border-white/60 backdrop-blur-[12px] shadow-[0_4px_18px_-6px_rgba(16,24,40,0.28)] hover:from-white/70 hover:to-white/40',
  'glass-dark':
    'bg-gradient-to-br from-[rgba(28,27,31,0.55)] to-[rgba(28,27,31,0.32)] text-white border border-white/20 backdrop-blur-[12px] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] hover:from-[rgba(28,27,31,0.66)] hover:to-[rgba(28,27,31,0.46)]',
  'glass-brand':
    'bg-gradient-to-br from-[rgba(255,81,0,0.66)] to-[rgba(255,81,0,0.4)] text-white border border-white/35 backdrop-blur-[12px] shadow-[0_6px_20px_-8px_rgba(208,55,0,0.5)] hover:from-[rgba(255,81,0,0.8)] hover:to-[rgba(255,81,0,0.55)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-[14px] py-[8px] text-[14px] leading-[20px]',
  md: 'px-[16px] py-[10px] text-[14px] leading-[20px]',
  lg: 'px-[18px] py-[10px] text-[16px] leading-[24px]',
  xl: 'px-[24px] py-[14px] text-[16px] leading-[24px]',
}

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'p-[8px] text-[14px] leading-[20px]',
  md: 'p-[10px] text-[14px] leading-[20px]',
  lg: 'p-[10px] text-[16px] leading-[24px]',
  xl: 'p-[14px] text-[16px] leading-[24px]',
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

export function Button(props: ButtonProps) {
  const {
    as = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    iconOnly = false,
    pill = false,
    block = false,
    className,
    children,
    ...rest
  } = props

  const sharedClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
    pill && 'rounded-full',
    block && 'w-full',
    className,
  )

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {!iconOnly && children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  )

  if (as === 'a') {
    const anchorRest = rest as Omit<ButtonAsAnchor, keyof ButtonSharedProps | 'as'>
    return (
      <a
        className={cn(sharedClassName, loading && 'pointer-events-none opacity-50')}
        aria-disabled={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const { disabled, ...buttonRest } = rest as Omit<ButtonAsButton, keyof ButtonSharedProps | 'as'>
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={sharedClassName}
      {...buttonRest}
    >
      {content}
    </button>
  )
}
