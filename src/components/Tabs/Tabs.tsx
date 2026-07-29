import * as RadixTabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TabsVariant = 'line' | 'filled' | 'enclosed'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsSize = 'sm' | 'md' | 'lg'

export interface TabItem {
  value: string
  label: ReactNode
  content?: ReactNode
  icon?: ReactNode
  count?: number
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  variant?: TabsVariant
  size?: TabsSize
  orientation?: TabsOrientation
  block?: boolean
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const LIST_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: 'gap-[24px] border-b border-[#EAECF0] dark:border-[#1F2937]',
  filled: 'gap-[4px] rounded-[10px] bg-[#F2F4F7] p-[4px] dark:bg-[#1F2937]',
  enclosed: 'gap-[8px]',
}

const TRIGGER_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: cn(
    'px-[4px] py-[10px] font-medium text-[#667085] border-b-2 border-transparent -mb-px',
    'data-[state=active]:text-[#FF5100] data-[state=active]:border-[#FF5100]',
    'dark:text-[#98A2B3]',
  ),
  filled: cn(
    'rounded-[8px] px-[12px] py-[6px] font-medium text-[#667085]',
    'data-[state=active]:bg-white data-[state=active]:text-[#101828] data-[state=active]:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]',
    'dark:text-[#98A2B3] dark:data-[state=active]:bg-[#151B2C] dark:data-[state=active]:text-white',
  ),
  enclosed: cn(
    'rounded-full px-[16px] py-[8px] font-medium text-[#667085] border border-[#D0D5DD] bg-white',
    'hover:bg-[#F9FAFB]',
    'data-[state=active]:bg-[#FF5100] data-[state=active]:border-[#FF5100] data-[state=active]:text-white',
    'dark:bg-[#151B2C] dark:text-[#98A2B3] dark:border-[#374151]',
  ),
}

const SIZE_CLASSES: Record<TabsSize, string> = {
  sm: 'text-[13px]',
  md: 'text-[14px]',
  lg: 'text-[16px]',
}

const COUNT_BADGE_CLASSES =
  'inline-flex items-center justify-center rounded-full bg-[#F2F4F7] px-[7px] text-[11px] font-bold text-[#667085] dark:bg-[#374151] dark:text-[#98A2B3]'

export function Tabs({
  items,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  block = false,
  defaultValue,
  value,
  onChange,
  className,
}: TabsProps) {
  const hasAnyContent = items.some((item) => item.content !== undefined)

  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onChange}
      orientation={orientation}
      className={cn('flex', orientation === 'vertical' ? 'flex-row gap-[24px]' : 'flex-col', className)}
    >
      <RadixTabs.List
        className={cn(
          'flex outline-none',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          block && orientation === 'horizontal' && 'w-full',
          LIST_VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              'inline-flex items-center gap-[6px]',
              'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
              TRIGGER_VARIANT_CLASSES[variant],
              SIZE_CLASSES[size],
              block && orientation === 'horizontal' && 'flex-1 justify-center',
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
            {item.count !== undefined && <span className={COUNT_BADGE_CLASSES}>{item.count}</span>}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {hasAnyContent &&
        items
          .filter((item) => item.content !== undefined)
          .map((item) => (
            <RadixTabs.Content
              key={item.value}
              value={item.value}
              className={cn('outline-none flex-1', orientation === 'horizontal' && 'mt-[16px]')}
            >
              {item.content}
            </RadixTabs.Content>
          ))}
    </RadixTabs.Root>
  )
}
