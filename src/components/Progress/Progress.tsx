import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ProgressTone = 'primary' | 'success' | 'warning' | 'error'

const TONE_FILL: Record<ProgressTone, string> = {
  primary: 'bg-primary-base',
  success: 'bg-success-base',
  warning: 'bg-warning-base',
  error: 'bg-error-base',
}

const TONE_STROKE: Record<ProgressTone, string> = {
  primary: 'stroke-primary-base',
  success: 'stroke-success-base',
  warning: 'stroke-warning-base',
  error: 'stroke-error-base',
}

const SIZE_TRACK: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-[4px]',
  md: 'h-[8px]',
  lg: 'h-[12px]',
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
  tone?: ProgressTone
  size?: 'sm' | 'md' | 'lg'
  indeterminate?: boolean
}

export function Progress({
  value = 0,
  max = 100,
  label,
  showValue = false,
  tone = 'primary',
  size = 'md',
  indeterminate = false,
  className,
  ...rest
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn('w-full', className)} {...rest}>
      <div
        className={cn('w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700', SIZE_TRACK[size])}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemax={max}
        aria-valuemin={0}
        {...(label && { 'aria-label': label })}
      >
        <div
          data-progress-fill
          className={cn('h-full rounded-full transition-[width]', TONE_FILL[tone])}
          style={
            indeterminate
              ? { width: '40%', animation: 'progress-indeterminate 1.4s ease-in-out infinite' }
              : { width: `${pct}%` }
          }
        />
      </div>
      {(label || showValue) && (
        <div className="mt-[6px] flex items-center justify-between text-[14px] leading-[20px] text-ink-600">
          <span>{label}</span>
          {showValue && !indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
    </div>
  )
}

export interface ProgressCircleProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number
  max?: number
  size?: number
  thickness?: number
  tone?: ProgressTone
  showValue?: boolean
  indeterminate?: boolean
  label?: string
  children?: ReactNode
}

export function ProgressCircle({
  value = 0,
  max = 100,
  size = 56,
  thickness = 6,
  tone = 'primary',
  showValue = true,
  indeterminate = false,
  label,
  className,
  children,
  ...rest
}: ProgressCircleProps) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const offset = indeterminate ? circ * 0.7 : circ * (1 - pct / 100)
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', indeterminate && 'animate-spin', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-valuemax={max}
      aria-valuemin={0}
      {...(label && { 'aria-label': label })}
      {...rest}
    >
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-ink-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={TONE_STROKE[tone]}
        />
      </svg>
      {(showValue || children) && !indeterminate && (
        <span
          className="absolute inline-flex items-center justify-center font-medium text-ink-900"
          style={{ fontSize: Math.max(11, size * 0.26) }}
        >
          {children ?? `${Math.round(pct)}%`}
        </span>
      )}
    </span>
  )
}
