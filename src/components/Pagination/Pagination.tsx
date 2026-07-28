import { cn } from '../../utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  className?: string
}

const ELLIPSIS = 'ellipsis' as const

type PageEntry = number | typeof ELLIPSIS

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let page = start; page <= end; page++) result.push(page)
  return result
}

function buildPageEntries(currentPage: number, totalPages: number, siblingCount: number): PageEntry[] {
  const totalSlots = siblingCount * 2 + 5

  if (totalPages <= totalSlots) return range(1, totalPages)

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, siblingCount * 2 + 3)
    return [...leftRange, ELLIPSIS, totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(totalPages - (siblingCount * 2 + 2), totalPages)
    return [1, ELLIPSIS, ...rightRange]
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, totalPages]
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-[36px] items-center justify-center rounded-[8px] text-[14px] font-medium outline-none',
        'text-[#101828] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'dark:text-white dark:hover:bg-[#1F2937]',
        active && 'bg-[#FF5100] text-white hover:bg-[#FF5100] dark:hover:bg-[#FF5100]',
      )}
    >
      {page}
    </button>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
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
        'inline-flex size-[36px] items-center justify-center rounded-[8px] outline-none',
        'text-[#101828] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        'dark:text-white dark:hover:bg-[#1F2937]',
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
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  className,
}: PaginationProps) {
  const entries = buildPageEntries(currentPage, totalPages, siblingCount)
  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <nav aria-label="pagination" className={cn('flex items-center', className)}>
      <div data-testid="pagination-compact" className="flex items-center gap-[4px] sm:hidden">
        <NavButton label="Página anterior" disabled={!canGoPrev} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft />
        </NavButton>
        <span className="px-[8px] text-[14px] text-[#344054] dark:text-[#D0D5DD]">
          Página {currentPage} de {totalPages}
        </span>
        <NavButton label="Próxima página" disabled={!canGoNext} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight />
        </NavButton>
      </div>

      <div data-testid="pagination-full" className="hidden items-center gap-[4px] sm:flex">
        {showFirstLast && (
          <NavButton label="Primeira página" disabled={!canGoPrev} onClick={() => onPageChange(1)}>
            «
          </NavButton>
        )}
        <NavButton label="Página anterior" disabled={!canGoPrev} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft />
        </NavButton>
        {entries.map((entry, index) =>
          entry === ELLIPSIS ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className="inline-flex size-[36px] items-center justify-center text-[#98A2B3] dark:text-[#667085]">
              …
            </span>
          ) : (
            <PageButton key={entry} page={entry} active={entry === currentPage} onClick={() => onPageChange(entry)} />
          ),
        )}
        <NavButton label="Próxima página" disabled={!canGoNext} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight />
        </NavButton>
        {showFirstLast && (
          <NavButton label="Última página" disabled={!canGoNext} onClick={() => onPageChange(totalPages)}>
            »
          </NavButton>
        )}
      </div>
    </nav>
  )
}
