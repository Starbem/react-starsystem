# Checkbox — Tasks (ID-3172)

**Spec:** `.specs/features/p6-checkbox/spec.md`
**Branch:** `feat/ID-3172-checkbox`
**Reference:** `src/components/Select/Select.tsx` (custom accessible control pattern, hidden-input-for-name pattern)

---

## Task 1 — Branch + Jira setup

- [x] Transition Jira ID-3172 → In Progress (transition id `"3"`)
- [ ] Create branch: `git checkout -b feat/ID-3172-checkbox`

---

## Task 2 — Component implementation

**Files:**
- Create: `src/components/Checkbox/Checkbox.tsx`
- Create: `src/components/Checkbox/CheckboxGroup.tsx`

**Checkbox.tsx:**

```tsx
import { useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  value?: string
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px] rounded-[4px]',
  md: 'size-[24px] rounded-[6px]',
}

const ICON_INSET = {
  sm: 'inset-[12.5%]',
  md: 'inset-[15%]',
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}

function IndeterminateIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M5 11h14v2H5z" />
    </svg>
  )
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled,
  onChange,
  label,
  supportingText,
  size = 'md',
  id,
  name,
  value,
  className,
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const labelId = label ? `${checkboxId}-label` : undefined
  const descId = supportingText ? `${checkboxId}-desc` : undefined
  const isActive = checked || indeterminate

  function toggle() {
    if (disabled) return
    onChange?.(!checked)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      <span className="flex items-center justify-center pt-[2px] shrink-0">
        <span
          id={checkboxId}
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-disabled={disabled || undefined}
          aria-labelledby={labelId}
          aria-describedby={descId}
          tabIndex={disabled ? -1 : 0}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative flex items-center justify-center border outline-none transition-colors',
            'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
            BOX_SIZE[size],
            disabled
              ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed'
              : isActive
                ? 'bg-[#F7F7F7] border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer',
          )}
        >
          {isActive && (
            <span className={cn('absolute', ICON_INSET[size], disabled ? 'text-[#CFCFCF]' : 'text-[#FF5100]')}>
              {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
            </span>
          )}
        </span>
        {name && (
          <input type="checkbox" name={name} value={value} checked={checked} readOnly className="hidden" />
        )}
      </span>
      {(label || supportingText) && (
        <span className="flex flex-col gap-[2px] flex-1 min-w-0">
          {label && (
            <span
              id={labelId}
              onClick={toggle}
              className={cn(
                "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none",
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                isActive ? 'font-medium' : 'font-normal',
              )}
            >
              {label}
            </span>
          )}
          {supportingText && (
            <p
              id={descId}
              className="font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] text-[#808080]"
            >
              {supportingText}
            </p>
          )}
        </span>
      )}
    </div>
  )
}
```

**CheckboxGroup.tsx:**

```tsx
import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxGroupProps {
  children: ReactNode
  orientation?: 'vertical' | 'horizontal'
  label?: string
  className?: string
}

export function CheckboxGroup({ children, orientation = 'vertical', label, className }: CheckboxGroupProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('flex', orientation === 'vertical' ? 'flex-col gap-[12px]' : 'flex-row gap-[24px]', className)}
    >
      {children}
    </div>
  )
}
```

**Notes:**
- `role="checkbox"` custom control (not native `<input>`) — needed for `aria-checked="mixed"` + full visual control, same reasoning as `Select`'s custom combobox vs native `<select>`
- Hidden native `<input type="checkbox">` only rendered when `name` is provided, for native form submission (mirrors `Select`'s hidden-input-for-`name` pattern)
- `label` uses a plain `<span onClick={toggle}>`, NOT `<label htmlFor>` — `htmlFor` only auto-triggers clicks on native form controls, and the checkbox root is a `<span role="checkbox">`, not a form control. Click-to-toggle is wired manually; `aria-labelledby` on the checkbox still gives the accessible name association for screen readers.
- `indeterminate` renders the dash icon regardless of `checked`, but `onChange` always toggles based on current `checked` (spec R-05)
- Focus ring uses the same orange WCAG ring as Button/Input (`focus-visible:ring-2 ring-[#FF5100] ring-offset-2`) — the Figma hover glow is Tailwind `hover:` only, not applied on keyboard focus
- Disabled icon color `#CFCFCF` is `[Provável]` per spec.md — flagged, not blocking

- [ ] Create `src/components/Checkbox/Checkbox.tsx` with code above
- [ ] Create `src/components/Checkbox/CheckboxGroup.tsx` with code above
- [ ] Run `pnpm typecheck` — must pass

---

## Task 3 — Barrel export + library export

**Files:**
- Create: `src/components/Checkbox/index.ts`
- Modify: `src/index.ts`

- [ ] Create `src/components/Checkbox/index.ts`:
  ```ts
  export { Checkbox } from './Checkbox'
  export type { CheckboxProps } from './Checkbox'
  export { CheckboxGroup } from './CheckboxGroup'
  export type { CheckboxGroupProps } from './CheckboxGroup'
  ```
- [ ] Add to `src/index.ts` after Select exports:
  ```ts
  export { Checkbox, CheckboxGroup } from './components/Checkbox'
  export type { CheckboxProps, CheckboxGroupProps } from './components/Checkbox'
  ```
- [ ] Run `pnpm build` — must produce dist/ without errors

---

## Task 4 — Unit tests

**File:** `src/components/Checkbox/Checkbox.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('renders checked when checked=true', () => {
    render(<Checkbox label="Accept terms" checked />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('renders aria-checked=mixed when indeterminate', () => {
    render(<Checkbox label="Select all" indeterminate />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })

  it('calls onChange with toggled value on click', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange when clicking the label text', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Accept terms'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Space key', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    screen.getByRole('checkbox').focus()
    await userEvent.keyboard(' ')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Enter key', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" checked={false} onChange={handleChange} />)
    screen.getByRole('checkbox').focus()
    await userEvent.keyboard('{Enter}')
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Accept terms" disabled onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Checkbox label="Accept terms" disabled />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true')
  })

  it('is not focusable when disabled', () => {
    render(<Checkbox label="Accept terms" disabled />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('tabIndex', '-1')
  })

  it('renders supporting text when provided', () => {
    render(<Checkbox label="Remember me" supportingText="Save my login details for next time." />)
    expect(screen.getByText('Save my login details for next time.')).toBeInTheDocument()
  })

  it('renders hidden native input when name is provided', () => {
    const { container } = render(<Checkbox label="Accept" name="terms" value="yes" checked />)
    const hiddenInput = container.querySelector('input[type="checkbox"][name="terms"]')
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('value', 'yes')
  })

  it('associates label via aria-labelledby', () => {
    render(<Checkbox label="Accept terms" />)
    const checkbox = screen.getByRole('checkbox')
    const labelId = checkbox.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)).toHaveTextContent('Accept terms')
  })
})

describe('CheckboxGroup', () => {
  it('renders children with role=group', () => {
    render(
      <CheckboxGroup label="Preferences">
        <Checkbox label="Email" />
        <Checkbox label="SMS" />
      </CheckboxGroup>,
    )
    const group = screen.getByRole('group', { name: 'Preferences' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })
})
```

- [ ] Create `src/components/Checkbox/Checkbox.test.tsx` with all 14 tests above
- [ ] Run `pnpm test` — all tests must pass

---

## Task 5 — Storybook stories

**File:** `src/components/Checkbox/Checkbox.stories.tsx`

Stories:
- `Default` — unchecked, label only
- `Checked` — checked, label only
- `Indeterminate` — indeterminate
- `WithSupportingText` — label + supporting text (Figma "Remember me" example)
- `Disabled` — disabled unchecked
- `DisabledChecked` — disabled + checked
- `Small` — `size="sm"`
- `Group` — `CheckboxGroup` with 3 items, individually controlled
- `AllStates` — grid of all states side-by-side

```tsx
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
        <Checkbox
          label="Email"
          checked={values.email}
          onChange={(c) => setValues((v) => ({ ...v, email: c }))}
        />
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
```

- [ ] Create `src/components/Checkbox/Checkbox.stories.tsx`
- [ ] Run `pnpm storybook` and verify all stories render + hover glow + checked/indeterminate icons look correct (visual check against Figma node `3228:15912`)

---

## Task 6 — Commit + finish branch

- [ ] `git add src/components/Checkbox/ src/index.ts .specs/features/p6-checkbox/`
- [ ] `git commit -m "feat(checkbox): Checkbox + CheckboxGroup with indeterminate, disabled, sizes, accessible role=checkbox"`
- [ ] Run `pnpm test` + `pnpm build` final gate — all pass
- [ ] Transition Jira ID-3172 → QA - Testing (per CLAUDE.md card lifecycle) with a summary comment (what changed, files, commit)
- [ ] Use `finishing-a-development-branch` skill → open PR
