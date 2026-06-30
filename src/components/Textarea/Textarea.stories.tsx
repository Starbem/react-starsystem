import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Enter a description...' },
}

export const WithLabel: Story = {
  args: { id: 'desc', label: 'Description', placeholder: 'Enter a description...' },
}

export const WithHint: Story = {
  args: { id: 'desc', label: 'Description', hint: 'Max 500 characters.' },
}

export const WithError: Story = {
  args: { id: 'desc', label: 'Description', error: 'This field is required.' },
}

export const Disabled: Story = {
  args: { label: 'Description', placeholder: 'Enter a description...', disabled: true },
}

export const LongContent: Story = {
  args: { label: 'Notes', placeholder: 'Write your notes here...', rows: 6 },
}

export const NoLabel: Story = {
  args: { placeholder: 'Enter a description...' },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Textarea placeholder="Placeholder (no label)" />
      <Textarea label="Description" placeholder="Enter a description..." />
      <Textarea label="Description" placeholder="Enter a description..." hint="Max 500 characters." id="all-hint" />
      <Textarea label="Description" placeholder="Enter a description..." error="This field is required." id="all-error" />
      <Textarea label="Description" placeholder="Enter a description..." disabled />
    </div>
  ),
}
