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
  { value: 'overview', label: 'Visão geral', content: <p className="text-[14px]">Conteúdo de visão geral.</p> },
  { value: 'activity', label: 'Atividade', content: <p className="text-[14px]">Conteúdo de atividade.</p> },
  { value: 'settings', label: 'Configurações', content: <p className="text-[14px]">Conteúdo de configurações.</p> },
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
