import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  return ROUTES.map((route) => ({
    label: route.label,
    active: location.pathname === route.href,
    onClick: () => navigate(route.href),
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
              <Badge variant="info" size="sm">
                3 pendências
              </Badge>
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
