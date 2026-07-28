import * as RadixAccordion from '@radix-ui/react-accordion'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type AccordionType = 'single' | 'multiple'

export interface AccordionItemConfig {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItemConfig[]
  type?: AccordionType
  defaultValue?: string | string[]
  collapsible?: boolean
  className?: string
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-[14px] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
    >
      <path
        d="M3.5 5.25 7 8.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AccordionItems({ items }: { items: AccordionItemConfig[] }) {
  return (
    <>
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="border-b border-[#EAECF0] last:border-0 dark:border-[#1F2937]"
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger
              className={cn(
                'group flex w-full items-center justify-between gap-[12px] py-[16px] text-left text-[14px] font-medium outline-none',
                'text-[#101828] hover:text-[#FF5100] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1 rounded-[4px]',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-[#101828]',
                'dark:text-white dark:disabled:hover:text-white',
              )}
            >
              {item.trigger}
              <ChevronIcon />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content
            className={cn(
              'overflow-hidden text-[14px] text-[#475467] dark:text-[#98A2B3]',
              'data-[state=open]:animate-[accordion-expand_200ms_ease-out]',
              'data-[state=closed]:animate-[accordion-collapse_200ms_ease-out]',
            )}
          >
            <div className="pb-[16px]">{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </>
  )
}

export function Accordion({ items, type = 'single', defaultValue, collapsible = true, className }: AccordionProps) {
  if (type === 'multiple') {
    return (
      <RadixAccordion.Root
        type="multiple"
        defaultValue={(defaultValue as string[]) ?? []}
        className={cn('w-full', className)}
      >
        <AccordionItems items={items} />
      </RadixAccordion.Root>
    )
  }

  return (
    <RadixAccordion.Root
      type="single"
      collapsible={collapsible}
      defaultValue={defaultValue as string | undefined}
      className={cn('w-full', className)}
    >
      <AccordionItems items={items} />
    </RadixAccordion.Root>
  )
}
