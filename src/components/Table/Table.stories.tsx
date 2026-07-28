import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Badge } from '../Badge'
import { Table } from './Table'
import type { TableColumn } from './Table'

interface Employee {
  id: number
  name: string
  role: string
  status: 'active' | 'inactive'
}

const DATA: Employee[] = [
  { id: 1, name: 'Julio Sousa', role: 'Engenheiro de Software', status: 'active' },
  { id: 2, name: 'Bárbara Koch', role: 'Head de Engenharia', status: 'active' },
  { id: 3, name: 'José Tenório', role: 'Software Engineer', status: 'active' },
  { id: 4, name: 'João Dias', role: 'QA Lead', status: 'inactive' },
]

const COLUMNS: TableColumn<Employee>[] = [
  { id: 'name', header: 'Nome', accessor: (row) => row.name, sortable: true },
  { id: 'role', header: 'Cargo', accessor: (row) => row.role, sortable: true },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'default'} size="sm">
        {row.status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
]

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
}
export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => <Table columns={COLUMNS} data={DATA} getRowId={(row) => row.id} />,
}

export const Loading: Story = {
  render: () => <Table columns={COLUMNS} data={[]} loading getRowId={(row: Employee) => row.id} />,
}

export const Empty: Story = {
  render: () => <Table columns={COLUMNS} data={[]} getRowId={(row: Employee) => row.id} />,
}

function SelectableDemo() {
  const [selected, setSelected] = useState<Array<string | number>>([])

  return (
    <div className="flex flex-col gap-[8px]">
      <Table
        columns={COLUMNS}
        data={DATA}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={selected}
        onSelectionChange={setSelected}
      />
      <p className="text-[12px] text-[#667085] dark:text-[#98A2B3]">Selecionados: {selected.join(', ') || 'nenhum'}</p>
    </div>
  )
}

export const Selectable: Story = {
  render: () => <SelectableDemo />,
}

function WithPaginationDemo() {
  const [page, setPage] = useState(1)

  return (
    <Table
      columns={COLUMNS}
      data={DATA}
      getRowId={(row) => row.id}
      pagination={{ currentPage: page, totalPages: 4, onPageChange: setPage }}
    />
  )
}

export const WithPagination: Story = {
  render: () => <WithPaginationDemo />,
}
