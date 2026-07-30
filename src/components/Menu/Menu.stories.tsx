import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Menu } from './Menu'

const ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', section: 'Principal' },
  { id: 'agenda', label: 'Consultas', icon: 'calendar_today', badge: 3, section: 'Principal' },
  { id: 'chat', label: 'Mensagens', icon: 'chat_bubble', section: 'Principal' },
  { id: 'perfil', label: 'Perfil', icon: 'person', section: 'Conta' },
]

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
}
export default meta
type Story = StoryObj<typeof Menu>

export const Sidebar: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu
          present="sidebar"
          items={ITEMS}
          value={tab}
          onChange={setTab}
          user={{ name: 'Ana Carolina', sub: 'Premium' }}
          footerItems={[{ id: 'sair', label: 'Sair', icon: 'logout' }]}
        />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}

export const Rail: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu present="rail" items={ITEMS} value={tab} onChange={setTab} />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}

export const Bottom: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ position: 'relative', height: 480 }}>
        <main style={{ padding: 24 }}>Conteúdo</main>
        <Menu present="bottom" items={ITEMS} value={tab} onChange={setTab} />
      </div>
    )
  },
}

export const Drawer: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ height: 480 }}>
        <Menu present="drawer" items={ITEMS} value={tab} onChange={setTab} title="Meu App" />
      </div>
    )
  },
}

export const Auto: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div
        style={{
          display: 'flex',
          height: 480,
          resize: 'horizontal',
          overflow: 'auto',
          border: '1px dashed #ccc',
        }}
      >
        <Menu items={ITEMS} value={tab} onChange={setTab} />
        <main style={{ flex: 1, padding: 24 }}>
          Redimensione a caixa (resize horizontal) para ver a troca sidebar↔bottom
        </main>
      </div>
    )
  },
}

export const CustomBrand: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu
          present="sidebar"
          items={ITEMS}
          value={tab}
          onChange={setTab}
          brand={<strong style={{ padding: '8px 12px', display: 'block' }}>Minha Clínica</strong>}
        />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}
