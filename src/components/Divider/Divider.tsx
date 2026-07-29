import * as RadixSeparator from '@radix-ui/react-separator'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed'

export interface DividerProps {
  orientation?: DividerOrientation
  label?: ReactNode
  variant?: DividerVariant
  className?: string
}

const BORDER_STYLE: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
}

export function Divider({ orientation = 'horizontal', label, variant = 'solid', className }: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div role="separator" aria-orientation="horizontal" className={cn('flex items-center gap-[12px]', className)}>
        <span aria-hidden="true" className={cn('flex-1 border-t border-ink-200 dark:border-neutral-900', BORDER_STYLE[variant])} />
        <span className="text-[13px] text-ink-500 shrink-0 dark:text-neutral-400">{label}</span>
        <span aria-hidden="true" className={cn('flex-1 border-t border-ink-200 dark:border-neutral-900', BORDER_STYLE[variant])} />
      </div>
    )
  }

  return (
    <RadixSeparator.Root
      orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? cn('w-full border-t', BORDER_STYLE[variant]) : cn('h-full border-l', BORDER_STYLE[variant]),
        'border-ink-200 dark:border-neutral-900',
        className,
      )}
    />
  )
}
