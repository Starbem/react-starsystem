import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders a nav with aria-label=pagination', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
  })

  it('renders all page numbers when total fits without ellipsis', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    ;['1', '2', '3', '4', '5'].forEach((page) => expect(full.getByRole('button', { name: page })).toBeInTheDocument())
    expect(full.queryByText('…')).not.toBeInTheDocument()
  })

  it('marks the current page with aria-current=page', () => {
    render(<Pagination page={3} total={5} onChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    expect(full.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current')
  })

  it('shows ellipsis when there are many pages', () => {
    render(<Pagination page={10} total={20} onChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getAllByText('…').length).toBeGreaterThan(0)
    expect(full.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(full.getByRole('button', { name: '20' })).toBeInTheDocument()
  })

  it('calls onChange with the clicked page', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={1} total={5} onChange={onChange} />)
    const full = within(screen.getByTestId('pagination-full'))
    await user.click(full.getByRole('button', { name: '3' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('disables the previous button on the first page', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(full.getByRole('button', { name: 'Próxima página' })).not.toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    render(<Pagination page={5} total={5} onChange={() => {}} />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('renders first/last buttons only when showFirstLast is true', () => {
    render(<Pagination page={5} total={20} onChange={() => {}} showFirstLast />)
    const full = within(screen.getByTestId('pagination-full'))
    expect(full.getByRole('button', { name: 'Primeira página' })).toBeInTheDocument()
    expect(full.getByRole('button', { name: 'Última página' })).toBeInTheDocument()
  })

  it('shows a compact prev/next indicator for mobile', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={2} total={5} onChange={onChange} />)
    const compact = within(screen.getByTestId('pagination-compact'))
    expect(compact.getByText('Página 2 de 5')).toBeInTheDocument()
    await user.click(compact.getByRole('button', { name: 'Próxima página' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Pagination page={5} total={20} onChange={() => {}} showFirstLast />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('applies pill radius to page buttons when pill is true', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} pill />)
    expect(screen.getByText('1').closest('button')).toHaveClass('rounded-full')
  })

  it('spreads extra HTML attributes onto the root nav element', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} data-testid="custom-pagination" />)
    expect(screen.getByTestId('custom-pagination')).toBeInTheDocument()
  })
})
