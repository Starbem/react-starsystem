import * as RadixTabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TabsVariant = 'line' | 'filled'
export type TabsOrientation = 'horizontal' | 'vertical'

export interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  variant?: TabsVariant
  orientation?: TabsOrientation
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const LIST_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: 'gap-[24px] border-b border-[#EAECF0]',
  filled: 'gap-[4px] rounded-[10px] bg-[#F2F4F7] p-[4px]',
}

const TRIGGER_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: cn(
    'px-[4px] py-[10px] text-[14px] font-medium text-[#667085] border-b-2 border-transparent -mb-px',
    'data-[state=active]:text-[#FF5100] data-[state=active]:border-[#FF5100]',
  ),
  filled: cn(
    'rounded-[8px] px-[12px] py-[6px] text-[14px] font-medium text-[#667085]',
    'data-[state=active]:bg-white data-[state=active]:text-[#101828] data-[state=active]:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]',
  ),
}

export function Tabs({
  items,
  variant = 'line',
  orientation = 'horizontal',
  defaultValue,
  value,
  onChange,
  className,
}: TabsProps) {
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
          LIST_VARIANT_CLASSES[variant],
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
              TRIGGER_VARIANT_CLASSES[variant],
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
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
