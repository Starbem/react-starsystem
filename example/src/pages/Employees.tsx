import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  FormField,
  Input,
  Modal,
  Select,
  Table,
  toast,
  type TableColumn,
} from '@starbemtech/react-starsystem'
import { departmentOptions, employees as initialEmployees, type Employee } from '../mocks/employees'

const PAGE_SIZE = 5

export function Employees() {
  const [rows, setRows] = useState<Employee[]>(initialEmployees)
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState<Employee | null>(null)
  const [nameError, setNameError] = useState<string | undefined>(undefined)

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows = useMemo(
    () => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [rows, page],
  )

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const columns: TableColumn<Employee>[] = [
    {
      id: 'name',
      header: 'Nome',
      accessor: (row) => row.name,
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={row.name} size="sm" />
          <span>{row.name}</span>
        </div>
      ),
    },
    { id: 'department', header: 'Departamento', accessor: (row) => row.department, sortable: true, render: (row) => row.department },
    { id: 'role', header: 'Cargo', accessor: (row) => row.role, render: (row) => row.role },
    {
      id: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Ativo' ? 'success' : row.status === 'Férias' ? 'warning' : 'default'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={() => { setEditing(row); setNameError(undefined) }}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleting(row)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  function saveEdit() {
    if (!editing) return
    if (!editing.name.trim()) {
      setNameError('Nome é obrigatório')
      return
    }
    setRows((current) => current.map((row) => (row.id === editing.id ? editing : row)))
    setEditing(null)
    toast.success({ title: 'Colaborador atualizado', description: `${editing.name} foi salvo com sucesso.` })
  }

  function confirmDelete() {
    if (!deleting) return
    setRows((current) => current.filter((row) => row.id !== deleting.id))
    toast.info({ title: 'Colaborador removido', description: `${deleting.name} foi removido da lista.` })
    setDeleting(null)
  }

  return (
    <div>
      <h1>Colaboradores</h1>
      <Table
        columns={columns}
        data={pageRows}
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
      />

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar colaborador"
        position="right"
        size="md"
      >
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Nome" required errorMessage={nameError}>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </FormField>
            <FormField label="E-mail">
              <Input
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </FormField>
            <FormField label="Departamento">
              <Select
                options={departmentOptions}
                value={editing.department}
                onChange={(value) => setEditing({ ...editing, department: value as Employee['department'] })}
              />
            </FormField>
            <Button onClick={saveEdit}>Salvar</Button>
          </div>
        )}
      </Drawer>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Remover colaborador"
        description={deleting ? `Tem certeza que deseja remover ${deleting.name}? Esta ação não pode ser desfeita.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>Remover</Button>
          </>
        }
      />
    </div>
  )
}
