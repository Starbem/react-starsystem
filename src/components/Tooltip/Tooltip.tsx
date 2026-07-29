import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'
export type TooltipTone = 'dark' | 'light' | 'brand'

export interface TooltipProps {
  content: ReactNode
  title?: ReactNode
  children: ReactElement
  side?: TooltipSide
  tone?: TooltipTone
  delay?: number
  disabled?: boolean
  className?: string
}

const TONE_CLASSES: Record<TooltipTone, string> = {
  dark: 'bg-ink-900 text-white',
  light:
    'bg-white text-ink-900 border border-ink-200 shadow-elevation-04 dark:bg-ink-900 dark:text-white dark:border-neutral-900',
  brand: 'bg-primary-base text-white',
}

const ARROW_FILL_CLASSES: Record<TooltipTone, string> = {
  dark: 'fill-ink-900',
  light: 'fill-white dark:fill-ink-900',
  brand: 'fill-primary-base',
}

export function Tooltip({
  content,
  title,
  children,
  side = 'top',
  tone = 'dark',
  delay = 200,
  disabled = false,
  className,
}: TooltipProps) {
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
              'z-[100] max-w-[280px] rounded-sm px-[12px] py-[8px] text-[12px] leading-[16px] shadow-elevation-04',
              'transition-opacity duration-150 data-[state=delayed-open]:opacity-100 data-[state=closed]:opacity-0',
              TONE_CLASSES[tone],
              className,
            )}
          >
            {title ? (
              <>
                <p className="font-semibold text-[13px] mb-[2px]">{title}</p>
                <p className="opacity-85">{content}</p>
              </>
            ) : (
              content
            )}
            <RadixTooltip.Arrow className={ARROW_FILL_CLASSES[tone]} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
