import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Skeleton } from '../Skeleton'

export type CardVariant = 'default' | 'outlined' | 'elevated'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  onClick?: () => void
  loading?: boolean
  children?: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-white border border-ink-200 dark:bg-ink-900 dark:border-neutral-900',
  outlined: 'bg-white border-2 border-ink-300 dark:bg-ink-900 dark:border-ink-700',
  elevated:
    'bg-white border border-ink-200 shadow-elevation-04 dark:bg-ink-900 dark:border-neutral-900',
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-[12px]',
  md: 'p-[20px]',
  lg: 'p-[28px]',
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-[12px]">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="70%" />
    </div>
  )
}

export function Card({
  variant = 'default',
  padding = 'md',
  onClick,
  loading = false,
  children,
  className,
}: CardProps) {
  const clickable = Boolean(onClick)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!clickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-md outline-none',
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        clickable &&
          'cursor-pointer transition-shadow hover:shadow-elevation-04 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
        className,
      )}
    >
      {loading ? <CardSkeleton /> : children}
    </div>
  )
}

export interface CardSlotProps {
  children?: ReactNode
  className?: string
}

function CardHeader({ children, className }: CardSlotProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-[12px] pb-[16px] border-b border-ink-200 mb-[16px] dark:border-neutral-900',
        className,
      )}
    >
      {children}
    </div>
  )
}

function CardBody({ children, className }: CardSlotProps) {
  return <div className={cn('flex flex-col gap-[8px]', className)}>{children}</div>
}

function CardFooter({ children, className }: CardSlotProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-[8px] pt-[16px] border-t border-ink-200 mt-[16px] dark:border-neutral-900',
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
