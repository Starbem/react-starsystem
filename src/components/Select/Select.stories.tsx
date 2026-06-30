import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select } from './Select'

const OPTIONS = [
  { value: 'phoenix', label: 'Phoenix Baker' },
  { value: 'olivia', label: 'Olivia Rhye' },
  { value: 'lana', label: 'Lana Steiner' },
  { value: 'demi', label: 'Demi Wilkinson', disabled: true },
  { value: 'candice', label: 'Candice Wu' },
]

const MANY_OPTIONS = [
  { value: 'option-1', label: 'Option 1' },
  { value: 'option-2', label: 'Option 2' },
  { value: 'option-3', label: 'Option 3' },
  { value: 'option-4', label: 'Option 4' },
  { value: 'option-5', label: 'Option 5' },
  { value: 'option-6', label: 'Option 6' },
  { value: 'option-7', label: 'Option 7' },
  { value: 'option-8', label: 'Option 8' },
  { value: 'option-9', label: 'Option 9' },
  { value: 'option-10', label: 'Option 10' },
  { value: 'option-11', label: 'Option 11' },
  { value: 'option-12', label: 'Option 12' },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: OPTIONS,
    placeholder: 'Select team member',
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('olivia')
    return <Select {...args} value={value} onChange={setValue} />
  },
}

export const WithLabel: Story = {
  args: {
    id: 'member',
    label: 'Team member',
  },
}

export const WithHint: Story = {
  args: {
    id: 'member',
    label: 'Team member',
    hint: 'Select one team member.',
  },
}

export const WithError: Story = {
  args: {
    id: 'member',
    label: 'Team member',
    error: 'This field is required.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Team member',
    disabled: true,
  },
}

export const ManyOptions: Story = {
  args: {
    options: MANY_OPTIONS,
    id: 'many-select',
    label: 'Choose an option',
    placeholder: 'Select from list...',
  },
}

export const AllStates: Story = {
  render: (args) => {
    const [value2, setValue2] = useState('olivia')

    return (
      <div className="flex flex-col gap-6 p-4 max-w-sm">
        <div>
          <h3 className="text-sm font-semibold mb-2">Default</h3>
          <Select {...args} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Value</h3>
          <Select {...args} value={value2} onChange={setValue2} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Label</h3>
          <Select {...args} id="all-label" label="Team member" />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Hint</h3>
          <Select {...args} id="all-hint" label="Team member" hint="Select one team member." />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Error</h3>
          <Select {...args} id="all-error" label="Team member" error="This field is required." />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Disabled</h3>
          <Select {...args} label="Team member" disabled />
        </div>
      </div>
    )
  },
}
