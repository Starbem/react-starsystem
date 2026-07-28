import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  side?: TooltipSide
  delay?: number
  disabled?: boolean
  className?: string
}

export function Tooltip({ content, children, side = 'top', delay = 200, disabled = false, className }: TooltipProps) {
  if (disabled) return children

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-[100] max-w-[280px] rounded-[8px] bg-[#101828] px-[12px] py-[8px] text-[12px] leading-[16px] text-white shadow-[0px_4px_12px_0px_rgba(16,24,40,0.16)]',
              'transition-opacity duration-150 data-[state=delayed-open]:opacity-100 data-[state=closed]:opacity-0',
              className,
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[#101828]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
