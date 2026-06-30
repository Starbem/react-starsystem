# Button P2 — Implementation Tasks

> **For agentic workers:** use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Implement full Button component per spec (ID-3168) — 5 variants, 3 sizes, loading, disabled, icon slots, a11y, stories, tests.

**Architecture:** Single `Button.tsx` rewriting P0 scaffold. Uses `cn()` utility + Tailwind CSS v4 classes referencing `@theme` tokens already in `globals.css`. No new dependencies.

**Tech Stack:** React 18, TypeScript strict, Tailwind CSS v4, Vite lib mode, vitest + @testing-library/react, Storybook 8.

## Global Constraints

- Tailwind v4: no `tailwind.config.js` — all theme tokens in `src/styles/globals.css` `@theme {}` block. Use CSS vars via `var()` or direct hex when needed.
- `cn()` utility at `src/utils/cn.ts` (clsx + tailwind-merge). Always use for class merging.
- No CJS output — ESM only.
- `export type { ButtonProps }` in `src/components/Button/index.ts` AND in `src/index.ts` barrel.
- Run `pnpm typecheck && pnpm test` after each task to gate.
- Branch: `feat/ID-3168-button-component`

---

### Task 1: Implement Button component

**Files:**
- Modify: `src/components/Button/Button.tsx`

**Interfaces:**
- Consumes: `src/utils/cn.ts` → `cn()`
- Produces: `Button`, `ButtonProps` (used by Task 2, 3, 4)

- [ ] **Step 1: Write the component**

```tsx
import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#FF5100] border border-[#FF5100] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  secondary:
    'bg-transparent border border-[#FF5100] text-[#FF5100]',
  outline:
    'bg-[#F7F7F7] border border-[#B6B6B6] text-[#393939] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  ghost:
    'bg-[#E2E2E2] border-0 text-[#808080]',
  danger:
    'bg-[#FF4242] border border-[#FF4242] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-[14px] py-[8px] text-[14px] leading-[20px]',
  md: 'px-[16px] py-[10px] text-[14px] leading-[20px]',
  lg: 'px-[18px] py-[10px] text-[16px] leading-[24px]',
}

const iconOnlySizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'p-[8px] text-[14px] leading-[20px]',
  md: 'p-[10px] text-[14px] leading-[20px]',
  lg: 'p-[10px] text-[16px] leading-[24px]',
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  iconOnly = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition-colors',
        'font-[\'Funnel_Display\']',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {!iconOnly && children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Button/Button.tsx
git commit -m "feat(button): implement Button component with Figma-verified tokens"
```

---

### Task 2: Update index.ts exports

**Files:**
- Modify: `src/components/Button/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Update component index**

`src/components/Button/index.ts`:
```ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

- [ ] **Step 2: Verify barrel export**

Check `src/index.ts` already exports Button (from P0 scaffold). If not, add:
```ts
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`

- [ ] **Step 4: Commit**

```bash
git add src/components/Button/index.ts src/index.ts
git commit -m "feat(button): update barrel exports"
```

---

### Task 3: Write Button tests

**Files:**
- Modify: `src/components/Button/Button.test.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Write failing tests first, then verify they fail**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to type=button', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it.each(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const)(
    'renders variant=%s without error',
    (variant) => {
      render(<Button variant={variant}>Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md', 'lg'] as const)('renders size=%s without error', (size) => {
    render(<Button size={size}>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Test</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('does not fire onClick when loading', async () => {
    const handler = vi.fn()
    render(<Button loading onClick={handler}>Test</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders iconLeft', () => {
    render(<Button iconLeft={<span data-testid="icon-left" />}>Test</Button>)
    expect(screen.getByTestId('icon-left')).toBeInTheDocument()
  })

  it('renders iconRight', () => {
    render(<Button iconRight={<span data-testid="icon-right" />}>Test</Button>)
    expect(screen.getByTestId('icon-right')).toBeInTheDocument()
  })

  it('fires onClick when enabled', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Test</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests**

Run: `pnpm test -- src/components/Button/Button.test.tsx`
Expected: all pass

- [ ] **Step 3: Commit**

```bash
git add src/components/Button/Button.test.tsx
git commit -m "test(button): comprehensive Button tests (variants, states, icons)"
```

---

### Task 4: Write Storybook stories

**Files:**
- Modify: `src/components/Button/Button.stories.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Write stories**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button CTA',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }

export const SizeSm: Story = { args: { size: 'sm' } }
export const SizeMd: Story = { args: { size: 'md' } }
export const SizeLg: Story = { args: { size: 'lg' } }

export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }

export const WithIconLeft: Story = {
  args: {
    iconLeft: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
}

export const WithIconRight: Story = {
  args: {
    iconRight: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Button/Button.stories.tsx
git commit -m "docs(button): Storybook stories — all variants, sizes, states"
```

---

### Task 5: Build verification

**Files:** none (verification only)

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: all tests pass (≥14 tests for Button)

- [ ] **Step 2: Build library**

Run: `pnpm build`
Expected: `dist/index.js` and `dist/style.css` generated with no errors

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: no errors

- [ ] **Step 4: Commit build verification result** (no files to commit if clean)

```bash
git status
```
