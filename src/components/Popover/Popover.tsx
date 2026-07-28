import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  trigger: ReactElement
  content: ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Popover({
  trigger,
  content,
  side = 'bottom',
  align = 'center',
  open,
  onOpenChange,
  className,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={8}
          className={cn(
            'z-[100] w-max max-w-[320px] rounded-[12px] bg-white p-[16px] shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)] outline-none',
            'data-[state=closed]:opacity-0',
            className,
          )}
        >
          {content}
          <RadixPopover.Arrow className="fill-white" />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
