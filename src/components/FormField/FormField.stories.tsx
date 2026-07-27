import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { FormField } from './FormField'
import { Input } from '../Input'
import { Textarea } from '../Textarea'
import { Select } from '../Select'
import { Checkbox } from '../Checkbox'
import { Radio } from '../Radio'
import { Toggle } from '../Toggle'

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
}

export default meta
type Story = StoryObj<typeof FormField>

export const WithInput: Story = {
  render: () => (
    <FormField label="Email" helperText="We will never share your email.">
      <Input placeholder="olivia@untitledui.com" />
    </FormField>
  ),
}

export const Required: Story = {
  render: () => (
    <FormField label="Email" required helperText="We will never share your email.">
      <Input placeholder="olivia@untitledui.com" />
    </FormField>
  ),
}

export const WithErrorMessage: Story = {
  render: () => (
    <FormField label="Email" required errorMessage="Email is required.">
      <Input placeholder="olivia@untitledui.com" />
    </FormField>
  ),
}

export const WithTextarea: Story = {
  render: () => (
    <FormField label="Bio" helperText="Tell us a little about yourself.">
      <Textarea placeholder="I'm a software engineer..." />
    </FormField>
  ),
}

export const WithSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <FormField label="Country" helperText="Select your country of residence.">
        <Select
          options={[
            { value: 'br', label: 'Brasil' },
            { value: 'us', label: 'Estados Unidos' },
            { value: 'pt', label: 'Portugal' },
          ]}
          value={value}
          onChange={setValue}
          placeholder="Select..."
        />
      </FormField>
    )
  },
}

export const WithCheckbox: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <FormField label="Terms" required helperText="You must accept to continue.">
        <Checkbox label="I agree to the terms and conditions" checked={checked} onChange={setChecked} />
      </FormField>
    )
  },
}

export const WithRadio: Story = {
  render: () => {
    const [value, setValue] = useState('monthly')
    return (
      <FormField label="Billing cycle">
        <div className="flex flex-col gap-3">
          <Radio value="monthly" label="Monthly" checked={value === 'monthly'} onSelect={setValue} />
        </div>
      </FormField>
    )
  },
}

export const WithToggle: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <FormField label="Notifications" helperText="Receive email updates about your account.">
        <Toggle label="Enable notifications" checked={checked} onChange={setChecked} />
      </FormField>
    )
  },
}

export const AllCompositions: Story = {
  render: () => {
    const [selectValue, setSelectValue] = useState<string | undefined>(undefined)
    const [checked, setChecked] = useState(false)
    const [radioValue, setRadioValue] = useState('monthly')
    const [toggleChecked, setToggleChecked] = useState(false)

    return (
      <div className="flex flex-col gap-6 p-4 max-w-sm">
        <FormField label="Email" required helperText="We will never share your email.">
          <Input placeholder="olivia@untitledui.com" />
        </FormField>
        <FormField label="Bio" helperText="Tell us a little about yourself.">
          <Textarea placeholder="I'm a software engineer..." />
        </FormField>
        <FormField label="Country">
          <Select
            options={[
              { value: 'br', label: 'Brasil' },
              { value: 'us', label: 'Estados Unidos' },
            ]}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Select..."
          />
        </FormField>
        <FormField label="Terms" required>
          <Checkbox label="I agree to the terms and conditions" checked={checked} onChange={setChecked} />
        </FormField>
        <FormField label="Billing cycle">
          <Radio value="monthly" label="Monthly" checked={radioValue === 'monthly'} onSelect={setRadioValue} />
        </FormField>
        <FormField label="Notifications">
          <Toggle label="Enable notifications" checked={toggleChecked} onChange={setToggleChecked} />
        </FormField>
      </div>
    )
  },
}
