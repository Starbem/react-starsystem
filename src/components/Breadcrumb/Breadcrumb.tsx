import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  maxItems?: number
  className?: string
}

const DEFAULT_SEPARATOR = (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[12px]">
    <path
      d="M5.25 3.5L9.91667 7L5.25 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function collapseItems(items: BreadcrumbItem[], maxItems?: number): Array<BreadcrumbItem | 'ellipsis'> {
  if (!maxItems || maxItems <= 0 || items.length <= maxItems) return items

  const visibleAtEnd = Math.max(maxItems - 1, 1)
  const tail = items.slice(items.length - visibleAtEnd)
  return [items[0], 'ellipsis', ...tail]
}

export function Breadcrumb({ items, separator = DEFAULT_SEPARATOR, maxItems, className }: BreadcrumbProps) {
  const collapsed = collapseItems(items, maxItems)
  const lastIndex = items.length - 1

  return (
    <nav aria-label="breadcrumb" className={cn('flex', className)}>
      <ol className="flex flex-wrap items-center gap-[6px] text-[14px]">
        {collapsed.map((entry, index) => {
          if (entry === 'ellipsis') {
            return (
              <li key="ellipsis" className="flex items-center gap-[6px]">
                <span aria-hidden="true" className="text-[#667085] px-[2px]">
                  …
                </span>
                <span className="text-[#98A2B3]">{separator}</span>
              </li>
            )
          }

          const originalIndex = items.indexOf(entry)
          const isLast = originalIndex === lastIndex

          return (
            <li key={`${entry.label}-${index}`} className="flex items-center gap-[6px]">
              {entry.href && !isLast ? (
                <a
                  href={entry.href}
                  className="text-[#667085] hover:text-[#344054] hover:underline truncate max-w-[200px]"
                >
                  {entry.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn('truncate max-w-[200px]', isLast ? 'text-[#101828] font-medium' : 'text-[#667085]')}
                >
                  {entry.label}
                </span>
              )}
              {!isLast && <span className="text-[#98A2B3]">{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
