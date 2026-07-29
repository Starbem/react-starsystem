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
  brand: 'border-[#FF5100]/25 border-t-[#FF5100]',
  white: 'border-white/30 border-t-white',
  muted: 'border-[#9C9C9C]/25 border-t-[#9C9C9C] dark:border-[#6B7280]/25 dark:border-t-[#9CA3AF]',
}

const COLOR_FILL_CLASSES: Record<SpinnerColor, string> = {
  brand: 'bg-[#FF5100]',
  white: 'bg-white',
  muted: 'bg-[#9C9C9C] dark:bg-[#9CA3AF]',
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
