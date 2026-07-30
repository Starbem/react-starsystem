import type { Meta, StoryObj } from '../../docs-types'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
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

export const WithSuccess: Story = {
  args: { id: 'desc-ok', label: 'Description', success: 'Looks good.' },
}

export const Disabled: Story = {
  args: { label: 'Description', placeholder: 'Enter a description...', disabled: true },
}

export const OutlineVariant: Story = {
  args: { label: 'Description', placeholder: 'Outline (default)', variant: 'outline' },
}

export const FilledVariant: Story = {
  args: { label: 'Description', placeholder: 'Filled', variant: 'filled' },
}

export const UnderlineVariant: Story = {
  args: { label: 'Description', placeholder: 'Underline', variant: 'underline' },
}

export const SmallSize: Story = {
  args: { label: 'Description', placeholder: 'Small', size: 'sm' },
}

export const LargeSize: Story = {
  args: { label: 'Description', placeholder: 'Large', size: 'lg' },
}

export const WithCounter: Story = {
  args: {
    id: 'desc-counter',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    showCount: true,
    maxLength: 160,
  },
}

export const WithCounterAndHint: Story = {
  args: {
    id: 'desc-counter-hint',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    hint: 'Keep it short and friendly.',
    showCount: true,
    maxLength: 160,
  },
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
      <Textarea
        label="Description"
        placeholder="Enter a description..."
        hint="Max 500 characters."
        id="all-hint"
      />
      <Textarea
        label="Description"
        placeholder="Enter a description..."
        error="This field is required."
        id="all-error"
      />
      <Textarea
        label="Description"
        placeholder="Enter a description..."
        success="Looks good."
        id="all-success"
      />
      <Textarea label="Description" placeholder="Enter a description..." disabled />
      <Textarea label="Filled" placeholder="Filled variant" variant="filled" id="all-filled" />
      <Textarea
        label="Underline"
        placeholder="Underline variant"
        variant="underline"
        id="all-underline"
      />
      <Textarea label="Bio" placeholder="With counter" showCount maxLength={80} id="all-counter" />
    </div>
  ),
}
