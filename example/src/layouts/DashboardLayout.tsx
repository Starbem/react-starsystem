import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DropdownMenu,
  Icon,
  Sidebar,
  TopBar,
  ToastProvider,
  type DropdownMenuEntry,
  type NavItemConfig,
} from '@starbemtech/react-starsystem'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { useTheme } from '../hooks/useTheme'

const ROUTES: Array<{ label: string; href: string; icon: string }> = [
  { label: 'Visão geral', href: '/', icon: 'dashboard' },
  { label: 'Colaboradores', href: '/employees', icon: 'group' },
  { label: 'Benefícios', href: '/benefits', icon: 'favorite' },
  { label: 'Configurações', href: '/settings', icon: 'settings' },
]

function useNavItems(): NavItemConfig[] {
  const location = useLocation()
  const navigate = useNavigate()
  return ROUTES.map((route) => ({
    label: route.label,
    active: location.pathname === route.href,
    onClick: () => navigate(route.href),
    icon: <Icon name={route.icon} size={20} />,
  }))
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Alternar tema">
      <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
    </Button>
  )
}

function ProfileMenu() {
  const items: DropdownMenuEntry[] = [
    { type: 'label', label: 'Julia Fernandes' },
    { type: 'separator' },
    { type: 'item', label: 'Meu perfil', value: 'profile', icon: <Icon name="person" size={18} /> },
    { type: 'item', label: 'Sair', value: 'logout', icon: <Icon name="logout" size={18} /> },
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
    <>
      <ToastProvider />
      <div className="shell">
        <div className="shell__sidebar">
          <Sidebar
            items={navItems}
            collapsed={collapsed}
            header={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="star" fill size={20} />
                {!collapsed && <strong>Star System</strong>}
              </span>
            }
            footer={
              <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}>
                <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} size={18} />
                {!collapsed && 'Recolher'}
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
                  <Icon name="menu" />
                </button>
                <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="dashboard" size={18} />
                  Dashboard RH
                </NavLink>
              </>
            }
            end={
              <>
                <Badge variant="info" size="sm" icon={<Icon name="notifications" size={14} />}>
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
    </>
  )
}
