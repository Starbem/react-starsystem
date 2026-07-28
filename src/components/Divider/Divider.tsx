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
        <span aria-hidden="true" className={cn('flex-1 border-t border-[#EAECF0] dark:border-[#1F2937]', BORDER_STYLE[variant])} />
        <span className="text-[13px] text-[#667085] shrink-0 dark:text-[#98A2B3]">{label}</span>
        <span aria-hidden="true" className={cn('flex-1 border-t border-[#EAECF0] dark:border-[#1F2937]', BORDER_STYLE[variant])} />
      </div>
    )
  }

  return (
    <RadixSeparator.Root
      orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? cn('w-full border-t', BORDER_STYLE[variant]) : cn('h-full border-l', BORDER_STYLE[variant]),
        'border-[#EAECF0] dark:border-[#1F2937]',
        className,
      )}
    />
  )
}
