import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxGroupProps {
  children: ReactNode
  orientation?: 'vertical' | 'horizontal'
  label?: string
  className?: string
}

export function CheckboxGroup({ children, orientation = 'vertical', label, className }: CheckboxGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex', orientation === 'vertical' ? 'flex-col gap-[12px]' : 'flex-row gap-[24px]', className)}
    >
      {children}
    </div>
  )
}
