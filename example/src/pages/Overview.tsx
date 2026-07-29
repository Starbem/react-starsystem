import { useEffect, useState } from 'react'
import { Badge, Card, EmptyState, Icon, Skeleton, Table, type TableColumn } from '@starbemtech/react-starsystem'
import { employees, type Employee } from '../mocks/employees'

const METRICS = [
  { label: 'Colaboradores ativos', value: '128', trend: '+4 este mês', icon: 'group' },
  { label: 'Benefícios ativos', value: '6', trend: 'estável', icon: 'favorite' },
  { label: 'Solicitações pendentes', value: '0', trend: 'em dia', icon: 'task' },
]

const STATUS_VARIANT: Record<Employee['status'], 'success' | 'warning' | 'error'> = {
  Ativo: 'success',
  Férias: 'warning',
  Afastado: 'error',
}

const recentColumns: TableColumn<Employee>[] = [
  { id: 'name', header: 'Nome', accessor: (row) => row.name, render: (row) => row.name },
  { id: 'department', header: 'Departamento', accessor: (row) => row.department, render: (row) => row.department },
  {
    id: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]} size="sm">
        {row.status}
      </Badge>
    ),
  },
]

export function Overview() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {METRICS.map((metric) => (
          <Card key={metric.label} variant="outlined">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#667085' }}>
              <Icon name={metric.icon} size={18} />
              <p style={{ margin: 0, fontSize: 13 }}>{metric.label}</p>
            </div>
            <p style={{ margin: '4px 0', fontSize: 28, fontWeight: 600 }}>{metric.value}</p>
            <Badge variant="default" size="sm">
              {metric.trend}
            </Badge>
          </Card>
        ))}
      </div>

      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Atividade recente</h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        ) : (
          <Table columns={recentColumns} data={employees.slice(0, 5)} />
        )}
      </Card>

      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Solicitações pendentes</h2>
        <EmptyState
          icon={<Icon name="task_alt" size={32} />}
          title="Nenhuma solicitação pendente"
          description="Todas as solicitações de benefícios foram processadas."
        />
      </Card>
    </div>
  )
}
