import type { Meta, StoryObj } from '../../docs-types'
import { Badge } from '../Badge'
import { Sidebar } from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
}
export default meta
type Story = StoryObj<typeof Sidebar>

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.25 7.5 9 2.25l6.75 5.25v7.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3 15c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9 2v2m0 10v2m7-7h-2M4 9H2m11.5-4.5-1.4 1.4M5.9 12.1l-1.4 1.4m9-1.4 1.4 1.4M5.9 5.9 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const ITEMS = [
  { icon: <HomeIcon />, label: 'Início', active: true, href: '#' },
  {
    icon: <UsersIcon />,
    label: 'Colaboradores',
    href: '#',
    children: [
      { label: 'Todos', href: '#' },
      { label: 'Convites pendentes', href: '#', badge: <Badge size="sm">3</Badge> },
    ],
  },
  { icon: <SettingsIcon />, label: 'Configurações', href: '#' },
]

function Logo() {
  return <span className="text-[16px] font-semibold text-[#FF5100] px-[4px]">Starbem</span>
}

function UserFooter({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-[8px] px-[4px] py-[8px]">
      <div className="size-[28px] shrink-0 rounded-full bg-[#FFD4BF] flex items-center justify-center text-[11px] font-medium text-[#101828]">
        JS
      </div>
      {!collapsed && <span className="text-[13px] font-medium truncate">Julio Sousa</span>}
    </div>
  )
}

export const Expanded: Story = {
  render: () => <Sidebar items={ITEMS} header={<Logo />} footer={<UserFooter />} />,
}

export const Collapsed: Story = {
  render: () => (
    <Sidebar collapsed items={ITEMS} header={<Logo />} footer={<UserFooter collapsed />} />
  ),
}

export const WithSubMenuOpenByDefault: Story = {
  render: () => (
    <Sidebar
      items={[
        {
          icon: <UsersIcon />,
          label: 'Colaboradores',
          active: true,
          children: [
            { label: 'Todos', href: '#', active: true },
            { label: 'Convites pendentes', href: '#' },
          ],
        },
      ]}
    />
  ),
}

export const NoHeaderOrFooter: Story = {
  render: () => <Sidebar items={ITEMS} />,
}
