import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { label: 'Notifications' },
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Toggle {...args} checked={checked} onChange={setChecked} />
  },
}

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    return <Toggle {...args} checked={checked} onChange={setChecked} />
  },
}

export const WithSupportingText: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Toggle {...args} checked={checked} onChange={setChecked} supportingText="Get notified about updates." />
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Toggle label="Off" />
      <Toggle label="On" checked />
      <Toggle label="Disabled" disabled />
      <Toggle label="Disabled on" checked disabled />
      <Toggle label="Small off" size="sm" />
      <Toggle label="Small on" size="sm" checked />
    </div>
  ),
}
