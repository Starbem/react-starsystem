# Input Field P3 — Implementation Tasks

> **For agentic workers:** use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Implement `Input` component per spec (ID-3169) — floating label, hint/error text, leading/trailing icon slots, disabled state, a11y, stories, tests.

**Architecture:** Single `Input.tsx`. Wraps a native `<input>` element. Uses `cn()` + Tailwind CSS v4 hardcoded hex tokens from Figma. No new dependencies.

**Tech Stack:** React 18, TypeScript strict, Tailwind CSS v4, Vite lib mode, vitest + @testing-library/react, Storybook 8.

## Global Constraints

- Tailwind v4: no `tailwind.config.js` — tokens in `src/styles/globals.css` `@theme {}`. Use direct hex when needed.
- `cn()` at `src/utils/cn.ts`. Always use for class merging.
- ESM only.
- Export `Input` and `InputProps` from `src/components/Input/index.ts` AND `src/index.ts`.
- Run `pnpm typecheck && pnpm test` after each task to gate.
- Branch: `feat/ID-3169-input-field`

---

### Task 1: Implement Input component

**Files:**
- Create: `src/components/Input/Input.tsx`

**Interfaces:**
- Consumes: `src/utils/cn.ts` → `cn()`
- Produces: `Input`, `InputProps` (used by Tasks 2, 3, 4)

- [ ] **Step 1: Write the component**

```tsx
import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const hintText = error ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      <div
        className={cn(
          'flex gap-[8px] items-center overflow-hidden px-[16px] py-[8px] rounded-[16px] w-full border',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-[#FF5100] focus-within:ring-offset-2',
          disabled
            ? 'bg-[#EFEFEF] border-[#B6B6B6] cursor-not-allowed'
            : isError
              ? 'bg-[#F7F7F7] border-[#FF4242] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]'
              : 'bg-[#F7F7F7] border-[#B6B6B6] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
        )}
      >
        {leadingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-[#808080]">
            {leadingIcon}
          </span>
        )}
        <div className="flex flex-col flex-1 min-w-0 h-[40px] justify-center">
          {label && (
            <span className="font-['Funnel_Display'] text-[12px] leading-[16px] text-[#9C9C9C] shrink-0 select-none">
              {label}
            </span>
          )}
          <input
            id={id}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={hintId}
            className={cn(
              "bg-transparent outline-none font-['Funnel_Display'] text-[16px] leading-[24px] w-full",
              disabled
                ? 'text-[#B6B6B6] cursor-not-allowed placeholder:text-[#B6B6B6]'
                : label
                  ? 'text-[#393939] placeholder:text-[#808080]'
                  : 'text-[#393939] placeholder:text-[#9C9C9C]',
            )}
            {...props}
          />
        </div>
        {trailingIcon && (
          <span className="shrink-0 size-[24px] flex items-center justify-center text-[#808080]">
            {trailingIcon}
          </span>
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

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/Input.tsx
git commit -m "feat(input): implement Input component with Figma-verified tokens"
```

---

### Task 2: Create index.ts and update barrel export

**Files:**
- Create: `src/components/Input/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Create component index**

`src/components/Input/index.ts`:
```ts
export { Input } from './Input'
export type { InputProps } from './Input'
```

- [ ] **Step 2: Add to library barrel**

In `src/index.ts`, add after Button exports:
```ts
export { Input } from './components/Input'
export type { InputProps } from './components/Input'
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Input/index.ts src/index.ts
git commit -m "feat(input): update barrel exports"
```

---

### Task 3: Write Input tests

**Files:**
- Create: `src/components/Input/Input.test.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Write tests**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder', () => {
    render(<Input placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders hint text when provided', () => {
    render(<Input hint="This is a hint" />)
    expect(screen.getByText('This is a hint')).toBeInTheDocument()
  })

  it('renders error text when provided', () => {
    render(<Input id="email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('error overrides hint', () => {
    render(<Input hint="Hint text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
  })

  it('sets aria-invalid when error is provided', () => {
    render(<Input id="email" error="Invalid email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links aria-describedby to hint element when id provided', () => {
    render(<Input id="email" hint="Hint text" />)
    const input = screen.getByRole('textbox')
    const hint = screen.getByText('Hint text')
    expect(input).toHaveAttribute('aria-describedby', 'email-hint')
    expect(hint).toHaveAttribute('id', 'email-hint')
  })

  it('is disabled when disabled prop set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('does not fire onChange when disabled', async () => {
    const handler = vi.fn()
    render(<Input disabled onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('fires onChange when enabled', async () => {
    const handler = vi.fn()
    render(<Input onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(handler).toHaveBeenCalled()
  })

  it('renders leadingIcon', () => {
    render(<Input leadingIcon={<span data-testid="leading-icon" />} />)
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument()
  })

  it('renders trailingIcon', () => {
    render(<Input trailingIcon={<span data-testid="trailing-icon" />} />)
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument()
  })

  it('forwards id to input element', () => {
    render(<Input id="my-input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input')
  })
})
```

- [ ] **Step 2: Run tests**

Run: `pnpm test -- src/components/Input/Input.test.tsx`
Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/Input.test.tsx
git commit -m "test(input): comprehensive Input tests (states, a11y, icons)"
```

---

### Task 4: Write Storybook stories

**Files:**
- Create: `src/components/Input/Input.stories.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Write stories**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/Input.stories.tsx
git commit -m "docs(input): Storybook stories — all states, icons, label/hint/error"
```

---

### Task 5: Build verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: all tests pass (Button + Input)

- [ ] **Step 2: Build library**

Run: `pnpm build`
Expected: `dist/index.js` and `dist/style.css` with no errors

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 4: Git status check**

```bash
git status
```
