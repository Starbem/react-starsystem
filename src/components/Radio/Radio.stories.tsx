import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('basic')
    return (
      <RadioGroup label="Plan" value={value} onChange={setValue}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>
    )
  },
}

export const WithSupportingText: Story = {
  render: () => {
    const [value, setValue] = useState('email')
    return (
      <RadioGroup label="Contact method" value={value} onChange={setValue}>
        <Radio value="email" label="Email" supportingText="We'll send updates to your inbox." />
        <Radio value="sms" label="SMS" supportingText="Standard messaging rates may apply." />
      </RadioGroup>
    )
  },
}

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('sm')
    return (
      <RadioGroup label="Size" value={value} onChange={setValue} orientation="horizontal">
        <Radio value="sm" label="Small" />
        <Radio value="md" label="Medium" />
        <Radio value="lg" label="Large" />
      </RadioGroup>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Plan" value="basic" disabled>
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  ),
}

export const DisabledOption: Story = {
  render: () => {
    const [value, setValue] = useState('basic')
    return (
      <RadioGroup label="Plan" value={value} onChange={setValue}>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
        <Radio value="enterprise" label="Enterprise (unavailable)" disabled />
      </RadioGroup>
    )
  },
}

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState('basic')
    return (
      <RadioGroup label="Plan" value={value} onChange={setValue}>
        <Radio value="basic" label="Basic" size="sm" />
        <Radio value="pro" label="Pro" size="sm" />
      </RadioGroup>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Radio value="unchecked" label="Unchecked" />
      <Radio value="checked" label="Checked" checked />
      <Radio value="disabled" label="Disabled" disabled />
      <Radio value="disabled-checked" label="Disabled checked" checked disabled />
    </div>
  ),
}
