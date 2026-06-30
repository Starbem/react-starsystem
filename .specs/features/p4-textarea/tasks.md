# Textarea — Tasks (ID-3170)

**Spec:** `.specs/features/p4-textarea/spec.md`  
**Branch:** `feat/ID-3170-textarea`  
**Reference:** `src/components/Input/` (parallel pattern)

---

## Task 1 — Branch + Jira setup

- [ ] Create branch: `git checkout -b feat/ID-3170-textarea`
- [ ] Transition Jira ID-3170 → In Progress (transition id `"3"`)

---

## Task 2 — Component implementation

**Files:**
- Create: `src/components/Textarea/Textarea.tsx`

**What to build (exact spec):**

```tsx
import { type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({
  label, hint, error,
  className, disabled, id,
  ...props
}: TextareaProps) {
  const isError = Boolean(error)
  const hintText = error ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', disabled && 'opacity-60', className)}>
      <div
        className={cn(
          'flex flex-col gap-[4px] overflow-hidden px-[14px] py-[10px] rounded-[16px] w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-[#FF5100] focus-within:ring-offset-2',
          disabled
            ? 'bg-[#EFEFEF] border-[#B6B6B6]'
            : isError
              ? 'bg-[#F7F7F7] border-[#FF867E]'
              : 'bg-[#F7F7F7] border-[#B6B6B6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
        )}
      >
        {label && (
          <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] shrink-0 select-none">
            {label}
          </span>
        )}
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          className={cn(
            "bg-transparent outline-none font-['Funnel_Display'] text-[16px] leading-[24px] w-full resize-y",
            disabled
              ? 'text-[#808080] cursor-not-allowed'
              : 'text-[#393939] placeholder:text-[#808080]',
          )}
          {...props}
        />
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
- `disabled` → `opacity-60` on outer wrapper (not color swap like Input)
- Error border: `#FF867E` (Support/Error/Light), NOT `#FF4242`
- No icon slots
- `resize-y` default; consumers override via `className`
- Disabled textarea text: `#808080` (Figma keeps neutral/500 since opacity handles the dimming)

- [ ] Create `src/components/Textarea/Textarea.tsx` with code above
- [ ] Run `pnpm typecheck` — must pass

---

## Task 3 — Barrel export + library export

**Files:**
- Create: `src/components/Textarea/index.ts`
- Modify: `src/index.ts`

- [ ] Create `src/components/Textarea/index.ts`:
  ```ts
  export { Textarea } from './Textarea'
  export type { TextareaProps } from './Textarea'
  ```
- [ ] Add to `src/index.ts` after Input exports:
  ```ts
  export { Textarea } from './components/Textarea'
  export type { TextareaProps } from './components/Textarea'
  ```
- [ ] Run `pnpm build` — must produce dist/ without errors

---

## Task 4 — Unit tests

**File:** `src/components/Textarea/Textarea.test.tsx`

Tests to cover (parallel to Input):

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea element')           // getByRole('textbox')
  it('forwards placeholder')                 // getByPlaceholderText
  it('renders label when provided')          // getByText(label)
  it('renders hint text when provided')      // getByText(hint)
  it('renders error text when provided')     // getByText(error)
  it('error overrides hint')                 // error shown, hint absent
  it('sets aria-invalid when error provided') // toHaveAttribute('aria-invalid', 'true')
  it('links aria-describedby to hint element when id provided')
  it('is disabled when disabled prop set')   // toBeDisabled()
  it('does not fire onChange when disabled') // userEvent.type → handler not called
  it('fires onChange when enabled')          // userEvent.type → handler called
  it('forwards id to textarea element')      // toHaveAttribute('id', ...)
  it('applies opacity-60 class when disabled') // container has opacity-60
})
```

- [ ] Create `src/components/Textarea/Textarea.test.tsx` with all 13 tests
- [ ] Run `pnpm test` — all tests must pass

---

## Task 5 — Storybook stories

**File:** `src/components/Textarea/Textarea.stories.tsx`

Stories:
- `Default` — no label, placeholder only
- `WithLabel` — label + placeholder
- `WithHint` — label + hint text
- `WithError` — label + error message
- `Disabled` — disabled state
- `LongContent` — rows={6}, placeholder showing taller area
- `NoLabel` — no label, just placeholder
- `AllStates` — render Default/WithLabel/WithHint/WithError/Disabled in a flex col

```tsx
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
```

- [ ] Create `src/components/Textarea/Textarea.stories.tsx`
- [ ] Run `pnpm storybook` and verify stories render correctly (visual check)

---

## Task 6 — Commit + finish branch

- [ ] `git add src/components/Textarea/ src/index.ts`
- [ ] `git commit -m "feat(textarea): Textarea component with label, hint, error, disabled states"`
- [ ] Run `pnpm test` + `pnpm build` final gate — all pass
- [ ] Use `finishing-a-development-branch` skill → open PR
