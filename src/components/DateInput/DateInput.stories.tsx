import type { Meta, StoryObj } from '../../docs-types'
import { DateInput } from './DateInput'

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
}
export default meta
type Story = StoryObj<typeof DateInput>

export const Default: Story = {
  render: () => <DateInput label="Data da consulta" hint="Formato dd/mm/aaaa" />,
}

export const WithDefaultValue: Story = {
  render: () => <DateInput label="Data da consulta" defaultValue={new Date(2026, 6, 15)} />,
}

export const WithError: Story = {
  render: () => <DateInput label="Data da consulta" error="Escolha uma data futura" />,
}

export const Filled: Story = {
  render: () => <DateInput label="Data da consulta" variant="filled" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[16px] max-w-[280px]">
      <DateInput label="Pequeno" size="sm" />
      <DateInput label="Médio" size="md" />
      <DateInput label="Grande" size="lg" />
    </div>
  ),
}
