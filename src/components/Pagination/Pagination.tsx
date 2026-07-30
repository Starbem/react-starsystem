import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number
  total: number
  onChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  pill?: boolean
  className?: string
}

const ELLIPSIS = 'ellipsis' as const

type PageEntry = number | typeof ELLIPSIS

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let page = start; page <= end; page++) result.push(page)
  return result
}

function buildPageEntries(page: number, total: number, siblingCount: number): PageEntry[] {
  const totalSlots = siblingCount * 2 + 5

  if (total <= totalSlots) return range(1, total)

  const leftSiblingIndex = Math.max(page - siblingCount, 1)
  const rightSiblingIndex = Math.min(page + siblingCount, total)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, siblingCount * 2 + 3)
    return [...leftRange, ELLIPSIS, total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(total - (siblingCount * 2 + 2), total)
    return [1, ELLIPSIS, ...rightRange]
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, total]
}

function PageButton({
  page,
  active,
  pill,
  onClick,
}: {
  page: number
  active: boolean
  pill: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-[36px] items-center justify-center text-[14px] font-medium outline-none',
        pill ? 'rounded-full' : 'rounded-sm',
        'text-ink-900 hover:bg-ink-100 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        'dark:text-white dark:hover:bg-neutral-900',
        active && 'bg-primary-base text-white hover:bg-primary-base dark:hover:bg-primary-base',
      )}
    >
      {page}
    </button>
  )
}

function NavButton({
  label,
  disabled,
  pill,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  pill: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-[36px] items-center justify-center outline-none',
        pill ? 'rounded-full' : 'rounded-sm',
        'text-ink-900 hover:bg-ink-100 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        'dark:text-white dark:hover:bg-neutral-900',
      )}
    >
      {children}
    </button>
  )
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
      <path
        d="M8.75 10.5 5.25 7l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
      <path
        d="M5.25 3.5 8.75 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Pagination({
  page,
  total,
  onChange,
  siblingCount = 1,
  showFirstLast = false,
  pill = false,
  className,
  ...rest
}: PaginationProps) {
  const entries = buildPageEntries(page, total, siblingCount)
  const canGoPrev = page > 1
  const canGoNext = page < total

  return (
    <nav aria-label="pagination" className={cn('flex items-center', className)} {...rest}>
      <div data-testid="pagination-compact" className="flex items-center gap-[4px] sm:hidden">
        <NavButton
          label="Página anterior"
          disabled={!canGoPrev}
          pill={pill}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft />
        </NavButton>
        <span className="px-[8px] text-[14px] text-ink-700 dark:text-ink-300">
          Página {page} de {total}
        </span>
        <NavButton
          label="Próxima página"
          disabled={!canGoNext}
          pill={pill}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight />
        </NavButton>
      </div>

      <div data-testid="pagination-full" className="hidden items-center gap-[4px] sm:flex">
        {showFirstLast && (
          <NavButton
            label="Primeira página"
            disabled={!canGoPrev}
            pill={pill}
            onClick={() => onChange(1)}
          >
            «
          </NavButton>
        )}
        <NavButton
          label="Página anterior"
          disabled={!canGoPrev}
          pill={pill}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft />
        </NavButton>
        {entries.map((entry, index) =>
          entry === ELLIPSIS ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex size-[36px] items-center justify-center text-neutral-400 dark:text-ink-500"
            >
              …
            </span>
          ) : (
            <PageButton
              key={entry}
              page={entry}
              active={entry === page}
              pill={pill}
              onClick={() => onChange(entry)}
            />
          ),
        )}
        <NavButton
          label="Próxima página"
          disabled={!canGoNext}
          pill={pill}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight />
        </NavButton>
        {showFirstLast && (
          <NavButton
            label="Última página"
            disabled={!canGoNext}
            pill={pill}
            onClick={() => onChange(total)}
          >
            »
          </NavButton>
        )}
      </div>
    </nav>
  )
}
