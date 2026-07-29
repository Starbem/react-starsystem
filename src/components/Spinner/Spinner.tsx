import { type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../utils/cn'

export type SpinnerColor = 'brand' | 'white' | 'muted'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | 'sm' | 'md' | 'lg'
  color?: SpinnerColor
  thickness?: number
  label?: string
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-[16px] border-2',
  md: 'size-[24px] border-2',
  lg: 'size-[32px] border-[3px]',
}

const COLOR_CLASSES: Record<SpinnerColor, string> = {
  brand: 'border-primary-base/25 border-t-primary-base',
  white: 'border-white/30 border-t-white',
  muted: 'border-neutral-400/25 border-t-neutral-400 dark:border-ink-500/25 dark:border-t-neutral-400',
}

const COLOR_FILL_CLASSES: Record<SpinnerColor, string> = {
  brand: 'bg-primary-base',
  white: 'bg-white',
  muted: 'bg-neutral-400 dark:bg-neutral-400',
}

export function Spinner({
  size = 'md',
  color = 'brand',
  thickness,
  label = 'Carregando',
  className,
  style,
  ...props
}: SpinnerProps) {
  const isNumeric = typeof size === 'number'
  const inlineStyle: CSSProperties = {
    ...style,
    ...(isNumeric ? { width: size, height: size } : {}),
    ...(thickness !== undefined ? { borderWidth: thickness } : {}),
  }

  return (
    <span
      role="status"
      aria-label={label}
      style={inlineStyle}
      className={cn(
        'inline-block rounded-full animate-spin motion-reduce:!animate-none',
        isNumeric ? 'border-2' : SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        className,
      )}
      {...props}
    />
  )
}

export interface DotsProps {
  color?: SpinnerColor
  className?: string
}

const DOT_DELAYS = [0, 150, 300]

export function Dots({ color = 'brand', className }: DotsProps) {
  return (
    <span role="status" aria-label="Carregando" className={cn('inline-flex items-center gap-[4px]', className)}>
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          data-dot
          aria-hidden="true"
          style={{ animationDelay: `${delay}ms` }}
          className={cn('size-[6px] rounded-full animate-bounce motion-reduce:!animate-none', COLOR_FILL_CLASSES[color])}
        />
      ))}
    </span>
  )
}
