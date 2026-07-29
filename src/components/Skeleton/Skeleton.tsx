import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const VARIANT_CLASSES: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'rounded-xs w-full h-[1em]',
  circular: 'rounded-full size-[40px]',
  rectangular: 'rounded-sm w-full h-[120px]',
  card: 'rounded-lg w-full h-[200px]',
}

function toDimension(value: string | number | undefined) {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: toDimension(width),
        height: toDimension(height),
        ...style,
      }}
      className={cn(
        'relative overflow-hidden bg-ink-200 motion-reduce:!animate-none dark:bg-ink-700',
        VARIANT_CLASSES[variant],
        animation === 'pulse' && 'animate-pulse',
        className,
      )}
      {...props}
    >
      {animation === 'wave' && (
        <span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-reduce:hidden"
          style={{ animation: 'skeleton-wave 1.6s ease-in-out infinite' }}
        />
      )}
    </div>
  )
}
