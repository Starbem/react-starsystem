import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Remember me' },
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all' },
}

export const WithSupportingText: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={setChecked}
        supportingText="Save my login details for next time."
      />
    )
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

export const Group: Story = {
  render: () => {
    const [values, setValues] = useState({ email: true, sms: false, push: false })
    return (
      <CheckboxGroup label="Notification preferences">
        <Checkbox label="Email" checked={values.email} onChange={(c) => setValues((v) => ({ ...v, email: c }))} />
        <Checkbox label="SMS" checked={values.sms} onChange={(c) => setValues((v) => ({ ...v, sms: c }))} />
        <Checkbox label="Push" checked={values.push} onChange={(c) => setValues((v) => ({ ...v, push: c }))} />
      </CheckboxGroup>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled checked />
      <Checkbox label="Small" size="sm" />
    </div>
  ),
}
