import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type DropdownMenuAlign = 'start' | 'center' | 'end'

export interface DropdownMenuItemConfig {
  type?: 'item'
  value?: string
  label: string
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
  onSelect?: () => void
}

export interface DropdownMenuSeparatorConfig {
  type: 'separator'
}

export interface DropdownMenuLabelConfig {
  type: 'label'
  label: string
}

export interface DropdownMenuCheckboxItemConfig {
  type: 'checkbox-item'
  value?: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  icon?: ReactNode
  disabled?: boolean
}

export interface DropdownMenuSubMenuConfig {
  type: 'sub-menu'
  label: string
  icon?: ReactNode
  items: DropdownMenuEntry[]
}

export type DropdownMenuEntry =
  | DropdownMenuItemConfig
  | DropdownMenuSeparatorConfig
  | DropdownMenuLabelConfig
  | DropdownMenuCheckboxItemConfig
  | DropdownMenuSubMenuConfig

export interface DropdownMenuProps {
  trigger: ReactElement
  items: DropdownMenuEntry[]
  align?: DropdownMenuAlign
  onSelect?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const ITEM_CLASSES = cn(
  'flex items-center gap-[8px] rounded-sm px-[8px] py-[6px] text-[14px] leading-[20px] outline-none cursor-pointer',
  'text-ink-900 dark:text-white',
  'data-[highlighted]:bg-ink-100 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'dark:data-[highlighted]:bg-neutral-900',
)

function renderEntries(
  entries: DropdownMenuEntry[],
  onSelect: ((value: string) => void) | undefined,
  keyPrefix: string,
) {
  return entries.map((entry, index) => {
    const key = `${keyPrefix}-${index}`

    if (entry.type === 'separator') {
      return (
        <RadixDropdownMenu.Separator
          key={key}
          className="my-[4px] h-px bg-ink-200 dark:bg-neutral-900"
        />
      )
    }

    if (entry.type === 'label') {
      return (
        <RadixDropdownMenu.Label
          key={key}
          className="px-[8px] py-[4px] text-[12px] font-medium text-ink-500 dark:text-neutral-400"
        >
          {entry.label}
        </RadixDropdownMenu.Label>
      )
    }

    if (entry.type === 'checkbox-item') {
      return (
        <RadixDropdownMenu.CheckboxItem
          key={key}
          checked={entry.checked}
          onCheckedChange={entry.onCheckedChange}
          disabled={entry.disabled}
          className={ITEM_CLASSES}
        >
          <RadixDropdownMenu.ItemIndicator className="inline-flex size-[14px] items-center justify-center">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-[12px]"
            >
              <path
                d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RadixDropdownMenu.ItemIndicator>
          {entry.icon}
          <span className="flex-1">{entry.label}</span>
        </RadixDropdownMenu.CheckboxItem>
      )
    }

    if (entry.type === 'sub-menu') {
      return (
        <RadixDropdownMenu.Sub key={key}>
          <RadixDropdownMenu.SubTrigger className={cn(ITEM_CLASSES, 'justify-between')}>
            <span className="flex items-center gap-[8px]">
              {entry.icon}
              {entry.label}
            </span>
            <svg
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-[12px]"
            >
              <path
                d="M5.25 3.5L9.91667 7L5.25 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RadixDropdownMenu.SubTrigger>
          <RadixDropdownMenu.Portal>
            <RadixDropdownMenu.SubContent
              sideOffset={4}
              className="z-[100] min-w-[180px] rounded-md bg-white p-[6px] shadow-elevation-05 outline-none dark:bg-ink-900"
            >
              {renderEntries(entry.items, onSelect, key)}
            </RadixDropdownMenu.SubContent>
          </RadixDropdownMenu.Portal>
        </RadixDropdownMenu.Sub>
      )
    }

    return (
      <RadixDropdownMenu.Item
        key={key}
        disabled={entry.disabled}
        onSelect={() => {
          entry.onSelect?.()
          onSelect?.(entry.value ?? entry.label)
        }}
        className={ITEM_CLASSES}
      >
        {entry.icon}
        <span className="flex-1">{entry.label}</span>
        {entry.badge}
      </RadixDropdownMenu.Item>
    )
  })
}

export function DropdownMenu({
  trigger,
  items,
  align = 'start',
  onSelect,
  open,
  onOpenChange,
  className,
}: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          sideOffset={6}
          className={cn(
            'z-[100] min-w-[180px] rounded-md bg-white p-[6px] shadow-elevation-05 outline-none dark:bg-ink-900',
            'data-[state=closed]:opacity-0',
            className,
          )}
        >
          {renderEntries(items, onSelect, 'item')}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  )
}
