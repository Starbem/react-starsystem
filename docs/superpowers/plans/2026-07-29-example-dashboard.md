# Example Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Vite + React + TypeScript app in `/example` that consumes the published `@starbemtech/react-starsystem` npm package to demonstrate a real HR corporate dashboard — sidebar, top bar, dark mode, 4 routed pages — using all 29 exported components.

**Architecture:** Standalone app (own `package.json`, not a pnpm workspace member — root `pnpm-workspace.yaml` declares no `packages:` glob, so nothing auto-links `/example` to the local library source). It depends on `@starbemtech/react-starsystem` from the npm registry like any external consumer, plus `react-router-dom` for routing. Library component styling comes entirely from the package's precompiled `dist/style.css` import; the app's own shell layout (grid/flex/media queries) uses one small hand-written CSS file — no Tailwind config needed in the consumer app, which is the point being demonstrated.

**Tech Stack:** Vite, React 19, TypeScript, react-router-dom, @starbemtech/react-starsystem (npm), plain CSS for app-shell layout.

## Global Constraints

- Domain: HR corporate dashboard, mock data only, no backend, no real auth (from spec).
- Routes: `/`, `/employees`, `/benefits`, `/settings` (from spec).
- Dark mode + sidebar collapse state, both persisted to `localStorage` (from spec).
- Responsive: sidebar becomes a `Drawer` below `md` breakpoint (from spec).
- All 29 library components used at least once (from spec, see coverage list).
- No automated tests for `/example` — manual verification only (from spec).
- `/example` is not published to npm (from spec).

---

## File Structure

```
example/
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  index.html
  src/
    main.tsx
    App.tsx
    app-shell.css          # plain CSS for layout (grid, flex, media queries)
    hooks/
      useTheme.ts
      useLocalStorageState.ts
    layouts/
      DashboardLayout.tsx
    mocks/
      employees.ts
      benefits.ts
    pages/
      Overview.tsx
      Employees.tsx
      Benefits.tsx
      Settings.tsx
```

---

### Task 1: Scaffold the Vite app and wire the library dependency

**Files:**
- Create: `example/package.json`
- Create: `example/tsconfig.json`
- Create: `example/tsconfig.node.json`
- Create: `example/vite.config.ts`
- Create: `example/index.html`
- Create: `example/src/main.tsx`
- Create: `example/src/App.tsx`
- Create: `example/src/app-shell.css`

**Interfaces:**
- Produces: a running dev server at `http://localhost:5174` rendering a placeholder `<App/>`. Later tasks replace `App.tsx`'s content but keep the file and its default export `App`.

- [ ] **Step 1: Create `example/package.json`**

```json
{
  "name": "starsystem-example-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@starbemtech/react-starsystem": "^0.2.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "typescript": "^6.0.3",
    "vite": "^8.1.2"
  }
}
```

- [ ] **Step 2: Create `example/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `example/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `example/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
})
```

- [ ] **Step 5: Create `example/index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Star System — Dashboard Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `example/src/app-shell.css`**

```css
* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
}

body {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.shell {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
}

.shell__sidebar {
  display: block;
}

@media (max-width: 767px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .shell__sidebar {
    display: none;
  }
}

.shell__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
}

.shell__content {
  padding: 24px;
  flex: 1;
}

.shell__hamburger {
  display: none;
}

@media (max-width: 767px) {
  .shell__hamburger {
    display: inline-flex;
  }
}
```

- [ ] **Step 7: Create `example/src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@starbemtech/react-starsystem/style.css'
import './app-shell.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 8: Create placeholder `example/src/App.tsx`**

```tsx
export function App() {
  return <div>Loading dashboard…</div>
}
```

- [ ] **Step 9: Install dependencies and verify dev server boots**

Run: `cd example && pnpm install && pnpm dev`
Expected: Vite prints `Local: http://localhost:5174/`; opening it shows "Loading dashboard…" with no console errors.

Stop the dev server (Ctrl+C) before continuing.

- [ ] **Step 10: Commit**

```bash
git add example/package.json example/tsconfig.json example/tsconfig.node.json example/vite.config.ts example/index.html example/src/main.tsx example/src/App.tsx example/src/app-shell.css example/pnpm-lock.yaml
git commit -m "chore(example): scaffold Vite app consuming published react-starsystem"
```

---

### Task 2: Theme + collapse hooks and mock data

**Files:**
- Create: `example/src/hooks/useLocalStorageState.ts`
- Create: `example/src/hooks/useTheme.ts`
- Create: `example/src/mocks/employees.ts`
- Create: `example/src/mocks/benefits.ts`

**Interfaces:**
- Produces: `useLocalStorageState<T>(key: string, initial: T): [T, (value: T) => void]`
- Produces: `useTheme(): { theme: 'light' | 'dark', toggleTheme: () => void }`
- Produces: `Employee` type and `employees: Employee[]` (10 rows)
- Produces: `Benefit` type, `benefits: Benefit[]`, `benefitFaqs: { question: string; answer: string }[]`

- [ ] **Step 1: Create `example/src/hooks/useLocalStorageState.ts`**

```tsx
import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (stored === null) return initial
    try {
      return JSON.parse(stored) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

- [ ] **Step 2: Create `example/src/hooks/useTheme.ts`**

```tsx
import { useEffect } from 'react'
import { useLocalStorageState } from './useLocalStorageState'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<Theme>('starsystem-example-theme', 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
```

- [ ] **Step 3: Create `example/src/mocks/employees.ts`**

```tsx
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
```

- [ ] **Step 4: Create `example/src/mocks/benefits.ts`**

```tsx
export interface Benefit {
  id: string
  category: 'Saúde' | 'Bem-estar' | 'Financeiro'
  name: string
  description: string
  adherence: number
}

export const benefits: Benefit[] = [
  { id: 'b1', category: 'Saúde', name: 'Telemedicina 24h', description: 'Consultas médicas por vídeo, sem carência.', adherence: 92 },
  { id: 'b2', category: 'Saúde', name: 'Plano Odontológico', description: 'Cobertura nacional para colaboradores e dependentes.', adherence: 74 },
  { id: 'b3', category: 'Bem-estar', name: 'Terapia Online', description: 'Sessões com psicólogos credenciados.', adherence: 61 },
  { id: 'b4', category: 'Bem-estar', name: 'Nutricionista', description: 'Acompanhamento nutricional mensal.', adherence: 48 },
  { id: 'b5', category: 'Financeiro', name: 'Vale-refeição Flex', description: 'Saldo mensal em cartão flexível.', adherence: 99 },
  { id: 'b6', category: 'Financeiro', name: 'Previdência Privada', description: 'Contribuição complementar opcional.', adherence: 35 },
]

export const benefitFaqs = [
  { question: 'Como ativo um benefício?', answer: 'Acesse o app do colaborador e selecione o benefício desejado na aba Benefícios.' },
  { question: 'Dependentes podem usar a telemedicina?', answer: 'Sim, dependentes cadastrados têm acesso completo à telemedicina 24h.' },
  { question: 'Posso trocar de plano odontológico?', answer: 'A troca é permitida uma vez por ciclo anual, durante a janela de adesão.' },
]
```

- [ ] **Step 5: Typecheck**

Run: `cd example && npx tsc --noEmit`
Expected: no errors (App.tsx is still the placeholder; these new files are unused but must still typecheck cleanly since nothing imports them yet — that's fine, `noUnusedLocals` only fires on unused *locals inside a file*, not unused modules).

- [ ] **Step 6: Commit**

```bash
git add example/src/hooks example/src/mocks
git commit -m "feat(example): add theme/collapse hooks and HR mock data"
```

---

### Task 3: DashboardLayout (Sidebar, TopBar, dark mode, responsive Drawer)

**Files:**
- Create: `example/src/layouts/DashboardLayout.tsx`

**Interfaces:**
- Consumes: `useTheme()` and `useLocalStorageState` from Task 2.
- Consumes from `@starbemtech/react-starsystem`: `Sidebar` (`items: NavItemConfig[]`, `collapsed?: boolean`, `header?`, `footer?`), `TopBar` (`start?`, `center?`, `end?`, `sticky?`, `bordered?`), `Drawer` (`open`, `onClose`, `position`, `size`, `children`), `Avatar` (`name`, `size`, `status`), `Badge` (`variant`, `size`, `children`), `DropdownMenu` (`trigger`, `items: DropdownMenuEntry[]`, `onSelect`), `Button` (`variant`, `size`, `children`, `onClick`).
- Produces: `DashboardLayout` component rendering `<Outlet/>` for nested routes — used directly as the layout route element in Task 7's router config, no props.

- [ ] **Step 1: Create `example/src/layouts/DashboardLayout.tsx`**

```tsx
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DropdownMenu,
  Sidebar,
  TopBar,
  type DropdownMenuEntry,
  type NavItemConfig,
} from '@starbemtech/react-starsystem'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { useTheme } from '../hooks/useTheme'

const ROUTES: Array<{ label: string; href: string }> = [
  { label: 'Visão geral', href: '/' },
  { label: 'Colaboradores', href: '/employees' },
  { label: 'Benefícios', href: '/benefits' },
  { label: 'Configurações', href: '/settings' },
]

function useNavItems(): NavItemConfig[] {
  const location = useLocation()
  return ROUTES.map((route) => ({
    label: route.label,
    href: route.href,
    active: location.pathname === route.href,
  }))
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
    </Button>
  )
}

function ProfileMenu() {
  const items: DropdownMenuEntry[] = [
    { type: 'label', label: 'Julia Fernandes' },
    { type: 'separator' },
    { type: 'item', label: 'Meu perfil', value: 'profile' },
    { type: 'item', label: 'Sair', value: 'logout' },
  ]
  return (
    <DropdownMenu
      trigger={<Avatar name="Julia Fernandes" size="sm" status="online" />}
      items={items}
      align="end"
    />
  )
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useLocalStorageState('starsystem-example-sidebar-collapsed', false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navItems = useNavItems()

  return (
    <div className="shell">
      <div className="shell__sidebar">
        <Sidebar
          items={navItems}
          collapsed={collapsed}
          header={<strong>{collapsed ? 'SS' : 'Star System'}</strong>}
          footer={
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '»' : '« Recolher'}
            </Button>
          }
        />
      </div>

      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        position="left"
        size="sm"
        title="Menu"
      >
        <Sidebar items={navItems} />
      </Drawer>

      <div className="shell__main">
        <TopBar
          sticky
          bordered
          start={
            <>
              <button
                type="button"
                className="shell__hamburger"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Abrir menu"
              >
                ☰
              </button>
              <NavLink to="/">Dashboard RH</NavLink>
            </>
          }
          end={
            <>
              <Badge variant="info" size="sm">3 pendências</Badge>
              <ThemeToggleButton />
              <ProfileMenu />
            </>
          }
        />
        <div className="shell__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd example && npx tsc --noEmit`
Expected: errors only about `App.tsx`/routing not yet wired if any — none expected from this file itself. Fix any type mismatch against the actual installed package types before moving on (check `node_modules/@starbemtech/react-starsystem/dist/index.d.ts` if a prop name is rejected).

- [ ] **Step 3: Commit**

```bash
git add example/src/layouts
git commit -m "feat(example): add DashboardLayout with Sidebar, TopBar, dark mode, mobile Drawer"
```

---

### Task 4: Overview page

**Files:**
- Create: `example/src/pages/Overview.tsx`

**Interfaces:**
- Consumes: `employees` mock from Task 2.
- Consumes from `@starbemtech/react-starsystem`: `Card`, `Badge`, `Skeleton`, `Table` (`columns: TableColumn<T>[]`, `data`), `EmptyState` (`title`, `description`, `action?`).
- Produces: `Overview` component, default export used directly as a route element in Task 7.

- [ ] **Step 1: Create `example/src/pages/Overview.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Badge, Card, EmptyState, Skeleton, Table, type TableColumn } from '@starbemtech/react-starsystem'
import { employees, type Employee } from '../mocks/employees'

const METRICS = [
  { label: 'Colaboradores ativos', value: '128', trend: '+4 este mês' },
  { label: 'Benefícios ativos', value: '6', trend: 'estável' },
  { label: 'Solicitações pendentes', value: '0', trend: 'em dia' },
]

const recentColumns: TableColumn<Employee>[] = [
  { id: 'name', header: 'Nome', accessor: (row) => row.name, render: (row) => row.name },
  { id: 'department', header: 'Departamento', accessor: (row) => row.department, render: (row) => row.department },
  { id: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Ativo' ? 'success' : 'warning'} size="sm">{row.status}</Badge> },
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
            <p style={{ margin: 0, fontSize: 13, color: '#667085' }}>{metric.label}</p>
            <p style={{ margin: '4px 0', fontSize: 28, fontWeight: 600 }}>{metric.value}</p>
            <Badge variant="neutral" size="sm">{metric.trend}</Badge>
          </Card>
        ))}
      </div>

      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Atividade recente</h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ height: 20 }} />
            <Skeleton style={{ height: 20 }} />
            <Skeleton style={{ height: 20 }} />
          </div>
        ) : (
          <Table columns={recentColumns} data={employees.slice(0, 5)} />
        )}
      </Card>

      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Solicitações pendentes</h2>
        <EmptyState
          title="Nenhuma solicitação pendente"
          description="Todas as solicitações de benefícios foram processadas."
        />
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd example && npx tsc --noEmit`
Expected: no errors. If `Badge`/`Card`/`EmptyState` prop names differ from the installed package (e.g. variant enum values), open `node_modules/@starbemtech/react-starsystem/dist/index.d.ts` and align the values used here — the source `Badge.tsx`/`EmptyState.tsx` read during planning are the ground truth for valid variant strings, but the installed `.d.ts` is what the compiler actually checks.

- [ ] **Step 3: Commit**

```bash
git add example/src/pages/Overview.tsx
git commit -m "feat(example): add Overview page with metric cards, table, empty state"
```

---

### Task 5: Employees page (Table, Drawer edit form, Modal delete confirm, Toast)

**Files:**
- Create: `example/src/pages/Employees.tsx`

**Interfaces:**
- Consumes: `employees`, `departmentOptions`, `Employee` type from Task 2.
- Consumes from `@starbemtech/react-starsystem`: `Table` (with `pagination: Omit<PaginationProps,'className'>` — caller slices `data` itself), `Avatar`, `Badge`, `Button`, `Drawer`, `Modal`, `FormField`, `Input`, `Select`, `ToastProvider`, `toast`.
- Produces: `Employees` component, default export used as a route element in Task 7. Must render `<ToastProvider/>` once (mounted here, not in the layout, since it's the only page that fires toasts per spec).

- [ ] **Step 1: Create `example/src/pages/Employees.tsx`**

```tsx
import { useMemo, useState } from 'react'
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
  ToastProvider,
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
        <Badge variant={row.status === 'Ativo' ? 'success' : row.status === 'Férias' ? 'warning' : 'neutral'} size="sm">
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
      <ToastProvider />
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
```

- [ ] **Step 2: Typecheck**

Run: `cd example && npx tsc --noEmit`
Expected: no errors. Check the installed `.d.ts` for the exact `Button` variant union (e.g. whether it's `danger` or `destructive`) and `ToastProvider` props (it may require a `position` prop or accept none) — adjust to match if the compiler rejects them.

- [ ] **Step 3: Commit**

```bash
git add example/src/pages/Employees.tsx
git commit -m "feat(example): add Employees page with table, edit drawer, delete modal, toasts"
```

---

### Task 6: Benefits and Settings pages

**Files:**
- Create: `example/src/pages/Benefits.tsx`
- Create: `example/src/pages/Settings.tsx`

**Interfaces:**
- Consumes: `benefits`, `benefitFaqs` from Task 2 mocks.
- Consumes from `@starbemtech/react-starsystem`: `Card`, `Tooltip`, `Popover`, `Tabs` (`items: TabItem[]`, or however tabs render children — verify against installed `.d.ts`), `Accordion` (`items: AccordionItemConfig[]`), `Breadcrumb` (`items: BreadcrumbItem[]`), `Divider`, `FormField`, `Textarea`, `Toggle`, `Radio`, `Checkbox`, `Button`, `Alert`, `Spinner`.
- Produces: `Benefits` and `Settings` components, used as route elements in Task 7.

- [ ] **Step 1: Create `example/src/pages/Benefits.tsx`**

```tsx
import { useState } from 'react'
import { Accordion, Card, Popover, Tabs, Tooltip } from '@starbemtech/react-starsystem'
import { benefitFaqs, benefits, type Benefit } from '../mocks/benefits'

const CATEGORIES = ['Saúde', 'Bem-estar', 'Financeiro'] as const

function BenefitGrid({ items }: { items: Benefit[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
      {items.map((benefit) => (
        <Card key={benefit.id} variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{benefit.name}</h3>
            <Tooltip content={benefit.description}>
              <span aria-label="Detalhes" style={{ cursor: 'help' }}>ⓘ</span>
            </Tooltip>
          </div>
          <p style={{ color: '#667085' }}>{benefit.description}</p>
          <Popover content={<span>Adesão de {benefit.adherence}% dos colaboradores.</span>}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#FF5100', cursor: 'pointer', padding: 0 }}>
              Comparar planos
            </button>
          </Popover>
        </Card>
      ))}
    </div>
  )
}

export function Benefits() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Saúde')

  const faqItems = benefitFaqs.map((faq, index) => ({
    value: `faq-${index}`,
    trigger: faq.question,
    content: faq.answer,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1>Benefícios</h1>
      <Tabs
        items={CATEGORIES.map((cat) => ({ value: cat, label: cat, content: <BenefitGrid items={benefits.filter((b) => b.category === cat)} /> }))}
        value={category}
        onValueChange={(value) => setCategory(value as (typeof CATEGORIES)[number])}
      />
      <Card variant="default">
        <h2 style={{ marginTop: 0 }}>Perguntas frequentes</h2>
        <Accordion items={faqItems} type="single" />
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create `example/src/pages/Settings.tsx`**

```tsx
import { useState } from 'react'
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Divider,
  FormField,
  Radio,
  Spinner,
  Textarea,
  Toggle,
  toast,
} from '@starbemtech/react-starsystem'

export function Settings() {
  const [bio, setBio] = useState('Star System é o design system de saúde corporativa da Starbem.')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [frequency, setFrequency] = useState<'diario' | 'semanal' | 'mensal'>('semanal')
  const [betaFeatures, setBetaFeatures] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaving(true)
    setSaved(false)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      toast.success('Configurações salvas com sucesso.')
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Configurações' }]} />
      <h1>Configurações</h1>

      {saved && (
        <Alert
          variant="success"
          title="Salvo"
          description="Suas preferências foram atualizadas."
          onClose={() => setSaved(false)}
        />
      )}

      <FormField label="Bio da empresa" helperText="Exibida no portal do colaborador.">
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </FormField>

      <Divider label="Notificações" />

      <Toggle
        checked={emailNotifications}
        onChange={setEmailNotifications}
        label="Receber notificações por e-mail"
      />

      <FormField label="Frequência de notificações">
        <div style={{ display: 'flex', gap: 16 }}>
          <Radio name="frequency" checked={frequency === 'diario'} onChange={() => setFrequency('diario')} label="Diário" />
          <Radio name="frequency" checked={frequency === 'semanal'} onChange={() => setFrequency('semanal')} label="Semanal" />
          <Radio name="frequency" checked={frequency === 'mensal'} onChange={() => setFrequency('mensal')} label="Mensal" />
        </div>
      </FormField>

      <Divider label="Recursos" />

      <Checkbox checked={betaFeatures} onChange={setBetaFeatures} label="Participar do programa beta" />

      <div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Spinner size="sm" /> : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `cd example && npx tsc --noEmit`
Expected: no errors. `Tabs`, `Accordion`, `Popover`, `Toggle`, `Radio`, `Checkbox` prop shapes must match the installed `.d.ts` exactly — if `Tabs` expects `TabItem[]` with a different content field name, or `Radio`/`Checkbox`/`Toggle` use `onCheckedChange` instead of `onChange`, fix the calls here to match (source read during planning used `onChange`-style names per `ToggleProps`/`RadioProps`/`CheckboxProps`, but always trust the compiler over the plan).

- [ ] **Step 4: Commit**

```bash
git add example/src/pages/Benefits.tsx example/src/pages/Settings.tsx
git commit -m "feat(example): add Benefits and Settings pages"
```

---

### Task 7: Wire the router and final manual verification

**Files:**
- Modify: `example/src/App.tsx`

**Interfaces:**
- Consumes: `DashboardLayout` (Task 3), `Overview`, `Employees`, `Benefits`, `Settings` (Tasks 4-6) — all as route elements.

- [ ] **Step 1: Replace `example/src/App.tsx` with the real router**

```tsx
import { Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Overview } from './pages/Overview'
import { Employees } from './pages/Employees'
import { Benefits } from './pages/Benefits'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 2: Typecheck the whole app**

Run: `cd example && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification — start the dev server**

Run: `cd example && pnpm dev`
Expected: `Local: http://localhost:5174/`. Open it in a browser.

- [ ] **Step 4: Manual verification — click through every route**

Visit `/`, `/employees`, `/benefits`, `/settings` via the sidebar links. Expected: each page renders without console errors; sidebar highlights the active route.

- [ ] **Step 5: Manual verification — dark mode and sidebar collapse**

Click the theme toggle in the top bar: page switches to dark styling and the choice survives a page reload. Click the sidebar collapse button: sidebar narrows to icons-only and survives a reload.

- [ ] **Step 6: Manual verification — responsive layout**

Resize the browser (or devtools device toolbar) below 767px width. Expected: the desktop sidebar disappears, the hamburger button appears in the top bar, and clicking it opens the mobile nav Drawer with working links.

- [ ] **Step 7: Manual verification — Employees CRUD flow**

On `/employees`: sort by name column, paginate to page 2, click "Editar" on a row, clear the name field and try to save (expect a required-field error), fill the name back in and save (expect a success Toast and the row updates). Click "Excluir" on a row, confirm in the Modal (expect the row disappears and an info Toast fires).

- [ ] **Step 8: Manual verification — Benefits and Settings**

On `/benefits`: switch category tabs, hover a benefit's tooltip icon, open the "Comparar planos" popover, expand an FAQ accordion item. On `/settings`: toggle email notifications, change frequency radio, toggle beta checkbox, click "Salvar alterações" (expect a brief spinner then a success Toast and an Alert banner).

Stop the dev server (Ctrl+C) once verification is complete.

- [ ] **Step 9: Commit**

```bash
git add example/src/App.tsx
git commit -m "feat(example): wire router and complete dashboard example app"
```

---

## Self-Review Notes

- **Spec coverage:** all 4 routes (Task 7), Sidebar/TopBar/dark-mode/collapse/mobile-Drawer (Task 3), Overview's Cards/Skeleton/Table/EmptyState (Task 4), Employees' Table/Pagination/Drawer/FormField/Input/Select/Toast/Modal (Task 5), Benefits' Tabs/Accordion/Tooltip/Popover (Task 6), Settings' Breadcrumb/Divider/Toggle/Radio/Checkbox/Textarea/Alert/Spinner/Button (Task 6). `Badge` and `Avatar` used in layout + Overview + Employees. All 29 components from the spec's coverage list appear across Tasks 3-6.
- **Type-signature risk:** several component APIs (`Tabs`, `Toggle`, `Radio`, `Checkbox`, `ToastProvider`, `Button` variant names) were inferred from partial reads of the source during planning, not the full prop list. Each task that uses these components includes an explicit typecheck step whose expected outcome tells the implementer to reconcile against the installed package's `.d.ts` rather than trust the plan blindly — this is called out inline rather than left as a silent assumption.
- **No placeholders:** every step has literal, runnable code or an exact command with an expected result.
