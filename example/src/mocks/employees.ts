export interface Employee {
  id: string
  name: string
  email: string
  department: 'Engenharia' | 'RH' | 'Vendas' | 'Financeiro' | 'Produto'
  role: string
  status: 'Ativo' | 'Férias' | 'Afastado'
}

export const departmentOptions = [
  { value: 'Engenharia', label: 'Engenharia' },
  { value: 'RH', label: 'RH' },
  { value: 'Vendas', label: 'Vendas' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Produto', label: 'Produto' },
]

export const employees: Employee[] = [
  { id: '1', name: 'Ana Souza', email: 'ana.souza@empresa.com', department: 'Engenharia', role: 'Engenheira de Software', status: 'Ativo' },
  { id: '2', name: 'Bruno Lima', email: 'bruno.lima@empresa.com', department: 'RH', role: 'Analista de RH', status: 'Ativo' },
  { id: '3', name: 'Carla Dias', email: 'carla.dias@empresa.com', department: 'Vendas', role: 'Executiva de Contas', status: 'Férias' },
  { id: '4', name: 'Daniel Alves', email: 'daniel.alves@empresa.com', department: 'Financeiro', role: 'Controller', status: 'Ativo' },
  { id: '5', name: 'Elisa Ramos', email: 'elisa.ramos@empresa.com', department: 'Produto', role: 'Product Manager', status: 'Ativo' },
  { id: '6', name: 'Fábio Nogueira', email: 'fabio.nogueira@empresa.com', department: 'Engenharia', role: 'Engenheiro de Dados', status: 'Afastado' },
  { id: '7', name: 'Gabriela Melo', email: 'gabriela.melo@empresa.com', department: 'RH', role: 'Coordenadora de RH', status: 'Ativo' },
  { id: '8', name: 'Hugo Prado', email: 'hugo.prado@empresa.com', department: 'Vendas', role: 'SDR', status: 'Ativo' },
  { id: '9', name: 'Isabela Rocha', email: 'isabela.rocha@empresa.com', department: 'Produto', role: 'UX Designer', status: 'Ativo' },
  { id: '10', name: 'João Pereira', email: 'joao.pereira@empresa.com', department: 'Financeiro', role: 'Analista Financeiro', status: 'Férias' },
]
