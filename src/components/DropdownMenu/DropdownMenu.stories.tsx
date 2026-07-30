import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { DropdownMenu } from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
}
export default meta
type Story = StoryObj<typeof DropdownMenu>

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M9.917 1.75a1.237 1.237 0 0 1 1.75 1.75L4.5 10.667 1.75 11.375l.708-2.75 7.459-6.875Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1.75 3.5h10.5M5.25 3.5V2.333A1.167 1.167 0 0 1 6.417 1.167h1.166A1.167 1.167 0 0 1 8.75 2.333V3.5m1.75 0-.467 8.75A1.167 1.167 0 0 1 8.867 13.417H5.133a1.167 1.167 0 0 1-1.166-1.167L3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const Default: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="outline">Ações</Button>}
      items={[
        { label: 'Editar', icon: <EditIcon /> },
        { label: 'Duplicar' },
        { type: 'separator' },
        { label: 'Excluir', icon: <TrashIcon /> },
      ]}
    />
  ),
}

export const WithLabelsAndBadges: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="outline">Notificações</Button>}
      items={[
        { type: 'label', label: 'Canais' },
        { label: 'Email', badge: <Badge size="sm">Ativo</Badge> },
        {
          label: 'WhatsApp',
          badge: (
            <Badge size="sm" variant="warning">
              Pendente
            </Badge>
          ),
        },
        {
          label: 'Push',
          badge: (
            <Badge size="sm" variant="error">
              Inativo
            </Badge>
          ),
        },
      ]}
    />
  ),
}

function CheckboxDemo() {
  const [showAvatars, setShowAvatars] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  return (
    <DropdownMenu
      trigger={<Button variant="outline">Exibição</Button>}
      items={[
        { type: 'label', label: 'Colunas' },
        {
          type: 'checkbox-item',
          label: 'Avatares',
          checked: showAvatars,
          onCheckedChange: setShowAvatars,
        },
        {
          type: 'checkbox-item',
          label: 'Status',
          checked: showStatus,
          onCheckedChange: setShowStatus,
        },
      ]}
    />
  )
}

export const CheckboxItems: Story = {
  render: () => <CheckboxDemo />,
}

export const WithSubMenu: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button variant="outline">Mais opções</Button>}
      items={[
        { label: 'Renomear' },
        {
          type: 'sub-menu',
          label: 'Compartilhar',
          items: [{ label: 'Copiar link' }, { label: 'Enviar por email' }],
        },
        { type: 'separator' },
        { label: 'Excluir', disabled: true },
      ]}
    />
  ),
}

export const WithOnSelect: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button>Selecionar plano</Button>}
      onSelect={(value) => alert(`Selecionado: ${value}`)}
      items={[
        { value: 'basic', label: 'Básico' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' },
      ]}
    />
  ),
}
