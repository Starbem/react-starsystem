import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Table } from './Table'
import type { TableColumn } from './Table'

interface Row {
  id: number
  name: string
  age: number
}

const DATA: Row[] = [
  { id: 1, name: 'Carlos', age: 30 },
  { id: 2, name: 'Ana', age: 25 },
  { id: 3, name: 'Bruno', age: 40 },
]

const COLUMNS: TableColumn<Row>[] = [
  { id: 'name', header: 'Nome', accessor: (row) => row.name, sortable: true },
  { id: 'age', header: 'Idade', accessor: (row) => row.age, sortable: true },
]

describe('Table', () => {
  it('renders a table with header and rows', () => {
    render(<Table columns={COLUMNS} data={DATA} getRowId={(row) => row.id} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Nome/ })).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('renders custom cell content via render()', () => {
    const columns: TableColumn<Row>[] = [
      { id: 'name', header: 'Nome', render: (row) => <strong>{row.name.toUpperCase()}</strong> },
    ]
    render(<Table columns={columns} data={DATA} getRowId={(row) => row.id} />)
    expect(screen.getByText('CARLOS')).toBeInTheDocument()
  })

  it('sorts rows ascending then descending when a sortable header is clicked', async () => {
    const user = userEvent.setup()
    render(<Table columns={COLUMNS} data={DATA} getRowId={(row) => row.id} />)
    const getNames = () => screen.getAllByRole('row').slice(1).map((row) => row.textContent)

    await user.click(screen.getByRole('button', { name: /Nome/ }))
    expect(getNames()[0]).toContain('Ana')

    await user.click(screen.getByRole('button', { name: /Nome/ }))
    expect(getNames()[0]).toContain('Carlos')
  })

  it('shows skeleton rows when loading', () => {
    const { container } = render(<Table columns={COLUMNS} data={[]} loading getRowId={(row: Row) => row.id} />)
    expect(container.querySelectorAll('tbody tr')).toHaveLength(5)
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument()
  })

  it('shows the default empty state when data is empty', () => {
    render(<Table columns={COLUMNS} data={[]} getRowId={(row: Row) => row.id} />)
    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument()
  })

  it('shows a custom empty state when provided', () => {
    render(
      <Table columns={COLUMNS} data={[]} getRowId={(row: Row) => row.id} emptyState={<p>Sem dados por aqui</p>} />,
    )
    expect(screen.getByText('Sem dados por aqui')).toBeInTheDocument()
  })

  it('selects a row and calls onSelectionChange', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar linha 1' }))
    expect(onSelectionChange).toHaveBeenCalledWith([1])
  })

  it('selects all rows via the header checkbox', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar todas as linhas' }))
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3])
  })

  it('renders pagination when provided', () => {
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={(row) => row.id}
        pagination={{ currentPage: 1, totalPages: 3, onPageChange: () => {} }}
      />,
    )
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Table columns={COLUMNS} data={DATA} getRowId={(row) => row.id} selectable />)
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
