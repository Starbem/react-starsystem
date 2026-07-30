import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
}
export default meta
type Story = StoryObj<typeof Tabs>

const ITEMS = [
  {
    value: 'overview',
    label: 'Visão geral',
    content: <p className="text-[14px]">Conteúdo de visão geral.</p>,
  },
  {
    value: 'activity',
    label: 'Atividade',
    content: <p className="text-[14px]">Conteúdo de atividade.</p>,
  },
  {
    value: 'settings',
    label: 'Configurações',
    content: <p className="text-[14px]">Conteúdo de configurações.</p>,
  },
]

export const Line: Story = {
  render: () => <Tabs variant="line" items={ITEMS} />,
}

export const Filled: Story = {
  render: () => <Tabs variant="filled" items={ITEMS} />,
}

export const VerticalLine: Story = {
  render: () => <Tabs variant="line" orientation="vertical" items={ITEMS} />,
}

export const VerticalFilled: Story = {
  render: () => <Tabs variant="filled" orientation="vertical" items={ITEMS} />,
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs
      variant="line"
      items={[
        ...ITEMS.slice(0, 2),
        { value: 'billing', label: 'Faturamento', content: <p>Faturamento</p>, disabled: true },
      ]}
    />
  ),
}

function ControlledDemo() {
  const [value, setValue] = useState('overview')

  return (
    <div className="flex flex-col gap-[8px]">
      <Tabs variant="filled" items={ITEMS} value={value} onChange={setValue} />
      <p className="text-[12px] text-[#667085] dark:text-[#98A2B3]">Tab ativa: {value}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const TabBarOnly: Story = {
  args: {
    items: [
      { value: 'a', label: 'Overview' },
      { value: 'b', label: 'Details' },
      { value: 'c', label: 'History' },
    ],
  },
}

export const WithIconsAndCounts: Story = {
  args: {
    items: [
      { value: 'inbox', label: 'Inbox', icon: <span>📥</span>, count: 4, content: 'Inbox content' },
      { value: 'sent', label: 'Sent', icon: <span>📤</span>, content: 'Sent content' },
    ],
  },
}

export const Enclosed: Story = {
  args: {
    variant: 'enclosed',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Block: Story = {
  args: {
    block: true,
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}
