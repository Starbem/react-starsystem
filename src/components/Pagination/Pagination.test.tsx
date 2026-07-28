import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders a nav with aria-label=pagination', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
  })

  it('renders all page numbers when totalPages fits without ellipsis', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    ;['1', '2', '3', '4', '5'].forEach((page) => expect(full.getByRole('button', { name: page })).toBeInTheDocument())
    expect(full.queryByText('…')).not.toBeInTheDocument()
  })

  it('marks the current page with aria-current=page', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    expect(full.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current')
  })

  it('shows ellipsis when there are many pages', () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getAllByText('…').length).toBeGreaterThan(0)
    expect(full.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(full.getByRole('button', { name: '20' })).toBeInTheDocument()
  })

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    const full = within(screen.getByTestId('pagination-full'))
    await user.click(full.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables the previous button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(full.getByRole('button', { name: 'Próxima página' })).not.toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('renders first/last buttons only when showFirstLast is true', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={() => {}} showFirstLast />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Primeira página' })).toBeInTheDocument()
    expect(full.getByRole('button', { name: 'Última página' })).toBeInTheDocument()
  })

  it('shows a compact prev/next indicator for mobile', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)
    const compact = within(screen.getByTestId('pagination-compact'))
    expect(compact.getByText('Página 2 de 5')).toBeInTheDocument()
    await user.click(compact.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={20} onPageChange={() => {}} showFirstLast />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
