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
  line: 'gap-[24px] border-b border-ink-200 dark:border-neutral-900',
  filled: 'gap-[4px] rounded-md bg-ink-100 p-[4px] dark:bg-neutral-900',
  enclosed: 'gap-[8px]',
}

const TRIGGER_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: cn(
    'px-[4px] py-[10px] font-medium text-ink-500 border-b-2 border-transparent -mb-px',
    'data-[state=active]:text-primary-base data-[state=active]:border-primary-base',
    'dark:text-neutral-400',
  ),
  filled: cn(
    'rounded-sm px-[12px] py-[6px] font-medium text-ink-500',
    'data-[state=active]:bg-white data-[state=active]:text-ink-900 data-[state=active]:shadow-elevation-01',
    'dark:text-neutral-400 dark:data-[state=active]:bg-ink-900 dark:data-[state=active]:text-white',
  ),
  enclosed: cn(
    'rounded-full px-[16px] py-[8px] font-medium text-ink-500 border border-ink-300 bg-white',
    'hover:bg-ink-50',
    'data-[state=active]:bg-primary-base data-[state=active]:border-primary-base data-[state=active]:text-white',
    'dark:bg-ink-900 dark:text-neutral-400 dark:border-ink-700',
  ),
}

const SIZE_CLASSES: Record<TabsSize, string> = {
  sm: 'text-[13px]',
  md: 'text-[14px]',
  lg: 'text-[16px]',
}

const COUNT_BADGE_CLASSES =
  'inline-flex items-center justify-center rounded-full bg-ink-100 px-[7px] text-[11px] font-bold text-ink-500 dark:bg-ink-700 dark:text-neutral-400'

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
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-row gap-[24px]' : 'flex-col',
        className,
      )}
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
              'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
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
