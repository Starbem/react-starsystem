# Select — Tasks (ID-3171)

**Spec:** `.specs/features/p5-select/spec.md`  
**Branch:** `feat/ID-3171-select`  
**Reference:** `src/components/Input/Input.tsx` (pattern), `src/components/Textarea/Textarea.tsx` (pattern)

---

## Task 1 — Branch + Jira setup

- [ ] Create branch: `git checkout -b feat/ID-3171-select`
- [ ] Transition Jira ID-3171 → In Progress (transition id `"3"`)

---

## Task 2 — Component implementation

**Files:**
- Create: `src/components/Select/Select.tsx`

**What to build (exact spec):**

```tsx
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  hint,
  error,
  disabled,
  id,
  name,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = id ? `${id}-listbox` : undefined
  const labelId = id && label ? `${id}-label` : undefined
  const hintId = (error || hint) && id ? `${id}-hint` : undefined

  const isError = Boolean(error)
  const hintText = error ?? hint
  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return
    const enabledOptions = options.filter((o) => !o.disabled)
    const selectedIdx = enabledOptions.findIndex((o) => o.value === value)
    setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0)
  }, [isOpen, options, value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) setIsOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) setIsOpen(true)
    }
  }

  function handleListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const enabledOptions = options.filter((o) => !o.disabled)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) => (i + 1) % enabledOptions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) => (i - 1 + enabledOptions.length) % enabledOptions.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = enabledOptions[focusedIndex]
      if (opt) selectOption(opt.value)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  function selectOption(val: string) {
    onChange?.(val)
    setIsOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('flex flex-col gap-[6px] items-start w-full relative', className)}>
      {label && id && (
        <label
          id={labelId}
          htmlFor={id}
          className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] select-none"
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <div className="relative w-full">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'flex gap-[8px] items-center w-full h-[56px] px-[16px] py-[8px] rounded-[16px] border text-left',
            'outline-none transition-colors',
            disabled
              ? 'bg-[#EFEFEF] border-[#B6B6B6] cursor-not-allowed'
              : isError
                ? 'bg-[#F7F7F7] border-[#FF4242] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]'
                : isOpen
                  ? 'bg-[#F7F7F7] border-[#D1B4F6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]'
                  : 'bg-[#F7F7F7] border-[#B6B6B6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
          )}
        >
          <span className="flex flex-col flex-1 min-w-0 justify-center">
            {label && !id && (
              <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] shrink-0 select-none">
                {label}
              </span>
            )}
            <span
              className={cn(
                "font-['Funnel_Display'] text-[16px] leading-[24px] truncate",
                disabled
                  ? 'text-[#B6B6B6]'
                  : selectedOption
                    ? 'text-[#393939] font-medium'
                    : 'text-[#9C9C9C]',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span className={cn('shrink-0 text-[#808080]', disabled && 'text-[#B6B6B6]')}>
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            id={listboxId}
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="absolute top-full left-0 w-full mt-[8px] bg-[#F7F7F7] border border-[#E2E2E2] rounded-[16px] shadow-[0px_4px_16px_2px_rgba(70,31,174,0.10)] py-[4px] max-h-[320px] overflow-y-auto z-50 outline-none"
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value
              const isDisabled = Boolean(option.disabled)
              const isFocused = options.filter((o) => !o.disabled).indexOf(option) === focusedIndex
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || undefined}
                  data-index={idx}
                  onMouseEnter={() => {
                    if (!isDisabled) {
                      const enabledIdx = options.filter((o) => !o.disabled).indexOf(option)
                      setFocusedIndex(enabledIdx)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    if (!isDisabled) selectOption(option.value)
                  }}
                  className={cn(
                    "flex items-center gap-[8px] px-[16px] py-[8px] font-['Funnel_Display'] text-[16px] font-medium leading-[24px]",
                    isDisabled
                      ? 'text-[#B6B6B6] cursor-not-allowed'
                      : isSelected || isFocused
                        ? 'bg-[#EFEFEF] text-[#393939] cursor-pointer'
                        : 'text-[#393939] cursor-pointer hover:bg-[#EFEFEF]',
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <span className="shrink-0 text-[#393939]">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-[#FF4242]' : 'text-[#808080]',
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  )
}
```

**Notes:**
- Open state → purple border `#D1B4F6` (not orange focus ring — key DS difference)
- Icon size 20px (not 24px like Input icons)
- Item text: Medium (500) weight (not Regular)
- Menu shadow: purple brand `rgba(70,31,174,0.10)` (Elevation/Secondary)
- Keyboard nav works on the `<ul>` element (onKeyDown on list)
- `onMouseDown` on items (not `onClick`) so blur doesn't close menu before selection
- `label` without `id`: renders label inline inside trigger (no external `<label>`)
- `label` with `id`: renders external `<label htmlFor={id}>` for proper WCAG association

- [ ] Create `src/components/Select/Select.tsx` with code above
- [ ] Run `pnpm typecheck` — must pass

---

## Task 3 — Barrel export + library export

**Files:**
- Create: `src/components/Select/index.ts`
- Modify: `src/index.ts`

- [ ] Create `src/components/Select/index.ts`:
  ```ts
  export { Select } from './Select'
  export type { SelectProps, SelectOption } from './Select'
  ```
- [ ] Add to `src/index.ts` after Textarea exports:
  ```ts
  export { Select } from './components/Select'
  export type { SelectProps, SelectOption } from './components/Select'
  ```
- [ ] Run `pnpm build` — must produce dist/ without errors

---

## Task 4 — Unit tests

**File:** `src/components/Select/Select.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe('Select', () => {
  it('renders trigger button with placeholder when no value')
  // getByRole('combobox') → has text "Select..."

  it('renders selected option label when value provided')
  // value="a" → trigger shows "Option A"

  it('opens menu on trigger click')
  // click trigger → getByRole('listbox') is visible

  it('closes menu on second trigger click')
  // click trigger twice → listbox absent

  it('closes menu on Escape key')
  // open → press Escape → listbox absent

  it('renders all options in menu when open')
  // open → getAllByRole('option') has length 3

  it('calls onChange with option value on option click')
  // open → click 'Option B' → onChange called with 'b'

  it('marks selected option with aria-selected')
  // value="a" → option A has aria-selected="true"

  it('closes menu after option selected')
  // open → click option → listbox absent

  it('renders hint text when provided')
  // hint="Choose one" → getByText('Choose one')

  it('renders error text when provided')
  // error="Required" → getByText('Required')

  it('error overrides hint')
  // error="E" hint="H" → "E" visible, "H" absent

  it('sets aria-invalid on trigger when error provided')
  // combobox has aria-invalid="true"

  it('does not open when disabled')
  // disabled=true → click trigger → listbox absent

  it('does not call onChange for disabled option')
  // open → click disabled option C → onChange not called

  it('navigates options with ArrowDown/ArrowUp')
  // open → ArrowDown → second option focused

  it('selects focused option with Enter key')
  // open → ArrowDown → Enter → onChange called with 'b'
})
```

- [ ] Create `src/components/Select/Select.test.tsx` with all 17 tests
- [ ] Run `pnpm test` — all tests must pass

---

## Task 5 — Storybook stories

**File:** `src/components/Select/Select.stories.tsx`

Stories:
- `Default` — placeholder, no value, no label
- `WithValue` — value pre-selected (option A)
- `WithLabel` — floating label + placeholder
- `WithHint` — label + hint text
- `WithError` — label + error message
- `Disabled` — disabled trigger
- `ManyOptions` — 10+ options (tests scroll)
- `AllStates` — Default / WithValue / WithLabel / WithError / Disabled in flex col

```tsx
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

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: OPTIONS, placeholder: 'Select team member' },
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
  args: { id: 'member', label: 'Team member' },
}

export const WithHint: Story = {
  args: { id: 'member', label: 'Team member', hint: 'Select one team member.' },
}

export const WithError: Story = {
  args: { id: 'member', label: 'Team member', error: 'This field is required.' },
}

export const Disabled: Story = {
  args: { label: 'Team member', disabled: true },
}
```

- [ ] Create `src/components/Select/Select.stories.tsx`
- [ ] Run `pnpm storybook` and verify stories render + dropdown opens correctly (visual check)

---

## Task 6 — Commit + finish branch

- [ ] `git add src/components/Select/ src/index.ts .specs/features/p5-select/`
- [ ] `git commit -m "feat(select): Select component with accessible combobox, label, hint, error, disabled states"`
- [ ] Run `pnpm test` + `pnpm build` final gate — all pass
- [ ] Use `finishing-a-development-branch` skill → open PR
