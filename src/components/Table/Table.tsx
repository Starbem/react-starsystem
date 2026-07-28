import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Checkbox } from '../Checkbox'
import { EmptyState } from '../EmptyState'
import { Pagination, type PaginationProps } from '../Pagination'
import { Skeleton } from '../Skeleton'

export interface TableColumn<T> {
  id: string
  header: ReactNode
  accessor?: (row: T) => unknown
  render?: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

export type SortDirection = 'asc' | 'desc'

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyState?: ReactNode
  selectable?: boolean
  getRowId?: (row: T) => string | number
  selectedRowIds?: Array<string | number>
  onSelectionChange?: (ids: Array<string | number>) => void
  pagination?: Omit<PaginationProps, 'className'>
  className?: string
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return String(a).localeCompare(String(b))
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-[12px] transition-transform', direction === 'desc' && 'rotate-180')}
    >
      <path
        d={direction ? 'M3.5 5.25 7 8.75l3.5-3.5' : 'M3.5 5.25 7 2l3.5 3.25M3.5 8.75 7 12l3.5-3.25'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyState,
  selectable = false,
  getRowId = (_row: T, index?: number) => (index ?? 0) as unknown as string | number,
  selectedRowIds,
  onSelectionChange,
  pagination,
  className,
}: TableProps<T> & { getRowId?: (row: T, index: number) => string | number }) {
  const [internalSelected, setInternalSelected] = useState<Array<string | number>>([])
  const [sort, setSort] = useState<{ columnId: string; direction: SortDirection } | null>(null)

  const selected = selectedRowIds ?? internalSelected
  const rowIds = useMemo(() => data.map((row, index) => getRowId(row, index)), [data, getRowId])

  const sortedData = useMemo(() => {
    if (!sort) return data
    const column = columns.find((col) => col.id === sort.columnId)
    if (!column?.accessor) return data
    const sorted = [...data].sort((a, b) => compareValues(column.accessor?.(a), column.accessor?.(b)))
    return sort.direction === 'desc' ? sorted.reverse() : sorted
  }, [data, sort, columns])

  function toggleSort(columnId: string) {
    setSort((current) => {
      if (current?.columnId !== columnId) return { columnId, direction: 'asc' }
      if (current.direction === 'asc') return { columnId, direction: 'desc' }
      return null
    })
  }

  function updateSelection(next: Array<string | number>) {
    if (!selectedRowIds) setInternalSelected(next)
    onSelectionChange?.(next)
  }

  function toggleRow(id: string | number, checked: boolean) {
    updateSelection(checked ? [...selected, id] : selected.filter((existing) => existing !== id))
  }

  function toggleAll(checked: boolean) {
    updateSelection(checked ? rowIds : [])
  }

  const allSelected = rowIds.length > 0 && rowIds.every((id) => selected.includes(id))
  const someSelected = rowIds.some((id) => selected.includes(id)) && !allSelected

  return (
    <div className={cn('flex flex-col gap-[16px]', className)}>
      <div className="w-full overflow-x-auto rounded-[12px] border border-[#EAECF0]">
        <table role="table" className="w-full min-w-[600px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-[#EAECF0] bg-[#F9FAFB]">
              {selectable && (
                <th className="w-[40px] px-[16px] py-[10px]">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label="Selecionar todas as linhas"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn('px-[16px] py-[10px] text-left font-medium text-[#344054]', column.className)}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className="inline-flex items-center gap-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1 rounded-[4px]"
                    >
                      {column.header}
                      <SortIcon direction={sort?.columnId === column.id ? sort.direction : null} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }, (_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-[#EAECF0] last:border-0">
                  {selectable && (
                    <td className="px-[16px] py-[12px]">
                      <Skeleton variant="rectangular" width={16} height={16} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className="px-[16px] py-[12px]">
                      <Skeleton variant="text" width="80%" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              sortedData.map((row, index) => {
                const id = rowIds[index]
                const isSelected = selected.includes(id)

                return (
                  <tr
                    key={id}
                    className={cn('border-b border-[#EAECF0] last:border-0 hover:bg-[#F9FAFB]', isSelected && 'bg-[#FFF1EB]')}
                  >
                    {selectable && (
                      <td className="px-[16px] py-[12px]">
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked) => toggleRow(id, checked)}
                          aria-label={`Selecionar linha ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.id} className={cn('px-[16px] py-[12px] text-[#344054]', column.className)}>
                        {column.render ? column.render(row) : String(column.accessor?.(row) ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (emptyState ?? <EmptyState title="Nenhum registro encontrado" />)}

      {pagination && !loading && data.length > 0 && <Pagination {...pagination} />}
    </div>
  )
}
