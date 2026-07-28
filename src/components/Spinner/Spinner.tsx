import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'white' | 'muted'
  label: string
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-[16px] border-2',
  md: 'size-[24px] border-2',
  lg: 'size-[32px] border-[3px]',
}

const COLOR_CLASSES: Record<NonNullable<SpinnerProps['color']>, string> = {
  brand: 'border-[#FF5100]/25 border-t-[#FF5100]',
  white: 'border-white/30 border-t-white',
  muted: 'border-[#9C9C9C]/25 border-t-[#9C9C9C]',
}

export function Spinner({
  size = 'md',
  color = 'brand',
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full animate-spin motion-reduce:!animate-none',
        SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        className,
      )}
      {...props}
    />
  )
}
