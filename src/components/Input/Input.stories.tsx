import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter value',
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'olivia@untitledui.com',
    id: 'email-with-label',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Email',
    placeholder: 'olivia@untitledui.com',
    hint: 'This is a hint text to help user.',
    id: 'email-with-hint',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'olivia@untitledui.com',
    error: 'This email is already taken.',
    id: 'email-with-error',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'olivia@untitledui.com',
    disabled: true,
  },
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'olivia@untitledui.com',
    leadingIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
}

export const WithTrailingIcon: Story = {
  args: {
    placeholder: 'Search...',
    trailingIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
}

export const NoLabel: Story = {
  args: {
    placeholder: 'Email address',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Input placeholder="Placeholder (no label)" />
      <Input label="Email" placeholder="olivia@untitledui.com" />
      <Input label="Email" placeholder="olivia@untitledui.com" hint="This is a hint text." id="all-hint" />
      <Input label="Email" placeholder="olivia@untitledui.com" error="This email is already taken." id="all-error" />
      <Input label="Email" placeholder="olivia@untitledui.com" disabled />
    </div>
  ),
}
