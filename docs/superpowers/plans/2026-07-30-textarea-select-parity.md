# Textarea & Select DS Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `Textarea` and `Select` to the same design-system parity as `Input` (variant/size/success, correct white background instead of the pre-existing gray bug), plus a character counter for `Textarea`, without touching `FormField` (audited, no gap).

**Architecture:** Extract the `variant`/`size` style logic already in `Input.tsx` into a shared module (`src/components/shared/fieldStyles.ts`), consumed by `Input`, `Textarea`, and `Select`. `Textarea` additionally gets its label moved above the field (matching `Input`'s prior redesign) and an opt-in character counter tied to `maxLength`. `Select` keeps its ARIA combobox interaction model unchanged — only its visual layer changes.

**Tech Stack:** React, TypeScript, Tailwind CSS v4, vitest + `@testing-library/react` + `vitest-axe`.

## Global Constraints

- No hardcoded hex/px colors in `.tsx` files — use the existing Tailwind token classes only (same tokens `Input.tsx` already uses).
- Valid `ink` scale: `900,800,700,600,500,300,200,100,50` — no `ink-400`.
- Every new interactive/colored state needs a `dark:` pair, following the exact pairings already used in `Input.tsx` (`ink-900↔ink-100`, `ink-600↔ink-300`, `ink-500↔ink-300`, `ink-200↔ink-700`, `ink-100↔ink-700` for backgrounds).
- Background bug fix: any field background driven by the shared helper must be `bg-white`/`dark:bg-ink-900` for the interactive `outline` variant, never `bg-neutral-25`/`dark:bg-neutral-900` (the pre-existing bug already fixed in `Input`).
- `disabled` always short-circuits variant-driven styling — every disabled field renders the same flat neutral box (`bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:border-ink-700`) regardless of `variant`.
- `error` and `success` are mutually exclusive — when both are set, `error` wins. This rule applies identically to `Textarea` and `Select`.
- No prefix/suffix, no leading/trailing icons, no `multiline` unification — out of scope per the approved spec.
- Every `.test.tsx` needs at least one `vitest-axe` a11y assertion using the established pattern: `// @ts-expect-error vitest-axe matcher types not compatible with this vitest version` immediately above `expect(await axe(container)).toHaveNoViolations()`.
- `Select` remains a custom ARIA combobox (`role="combobox"`/`role="listbox"`/`role="option"`) — no change to its interaction model, keyboard handling, or open/close logic.
- Full spec: `docs/superpowers/specs/2026-07-30-textarea-select-redesign-design.md`.

---

### Task 1: Extract shared field-style module, refactor Input to consume it

**Files:**
- Create: `src/components/shared/fieldStyles.ts`
- Create: `src/components/shared/fieldStyles.test.ts`
- Modify: `src/components/Input/Input.tsx` (full rewrite, same public behavior)

**Interfaces:**
- Produces: `FieldVariant = 'outline' | 'filled' | 'underline'`, `FieldSize = 'sm' | 'md' | 'lg'`, `FIELD_SIZE_TEXT_CLASSES`, `FIELD_SIZE_PADDING_Y_CLASSES`, `FIELD_SIZE_PADDING_X_CLASSES`, `FIELD_SIZE_RADIUS_CLASSES` (all `Record<FieldSize, string>`), `getFieldColorClasses(variant: FieldVariant, disabled: boolean, state: 'error' | 'success' | null): string` — all exported from `src/components/shared/fieldStyles.ts`. Tasks 2-4 consume these; nothing else in this task depends on later tasks.
- `Input.tsx` re-exports `InputVariant`/`InputSize` as aliases of `FieldVariant`/`FieldSize` so existing consumers importing those type names keep working.

- [ ] **Step 1: Write `fieldStyles.ts`**

```ts
import { cn } from '../../utils/cn'

export type FieldVariant = 'outline' | 'filled' | 'underline'
export type FieldSize = 'sm' | 'md' | 'lg'

export const FIELD_SIZE_TEXT_CLASSES: Record<FieldSize, string> = {
  sm: 'text-[14px] leading-[20px]',
  md: 'text-[16px] leading-[24px]',
  lg: 'text-[17px] leading-[26px]',
}

export const FIELD_SIZE_PADDING_Y_CLASSES: Record<FieldSize, string> = {
  sm: 'py-[7px]',
  md: 'py-[10px]',
  lg: 'py-[13px]',
}

export const FIELD_SIZE_PADDING_X_CLASSES: Record<FieldSize, string> = {
  sm: 'px-[12px]',
  md: 'px-[14px]',
  lg: 'px-[16px]',
}

export const FIELD_SIZE_RADIUS_CLASSES: Record<FieldSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
}

export function getFieldColorClasses(
  variant: FieldVariant,
  disabled: boolean,
  state: 'error' | 'success' | null,
) {
  if (disabled) {
    return 'border bg-neutral-50 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-ink-700'
  }

  if (variant === 'underline') {
    return cn(
      'border-0 border-b bg-transparent',
      'border-b-neutral-300 hover:border-b-neutral-400 dark:border-b-ink-700 dark:hover:border-b-ink-600',
      'focus-within:border-b-primary-base',
      state === 'error' && 'border-b-error-base focus-within:border-b-error-base',
      state === 'success' && 'border-b-success-base focus-within:border-b-success-base',
    )
  }

  if (variant === 'filled') {
    return cn(
      'border border-transparent bg-ink-100 hover:bg-ink-50 dark:bg-ink-700 dark:hover:bg-ink-600',
      'focus-within:bg-white focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)] dark:focus-within:bg-ink-900',
      state === 'error' &&
        'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
      state === 'success' &&
        'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
    )
  }

  return cn(
    'border bg-white border-neutral-300 hover:border-neutral-400 shadow-elevation-01 dark:bg-ink-900 dark:border-ink-700 dark:hover:border-ink-600',
    'focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)]',
    state === 'error' &&
      'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
    state === 'success' &&
      'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
  )
}
```

- [ ] **Step 2: Write `fieldStyles.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import {
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
  type FieldSize,
  type FieldVariant,
} from './fieldStyles'

const SIZES: FieldSize[] = ['sm', 'md', 'lg']
const VARIANTS: FieldVariant[] = ['outline', 'filled', 'underline']

describe('fieldStyles size maps', () => {
  it.each(SIZES)('%s has an entry in every size map', (size) => {
    expect(FIELD_SIZE_TEXT_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_PADDING_Y_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_PADDING_X_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_RADIUS_CLASSES[size]).toBeTruthy()
  })
})

describe('getFieldColorClasses', () => {
  it('disabled short-circuits regardless of variant', () => {
    for (const variant of VARIANTS) {
      const classes = getFieldColorClasses(variant, true, null)
      expect(classes).toContain('bg-neutral-50')
      expect(classes).toContain('dark:bg-neutral-900')
    }
  })

  it('outline default state uses white background, not the gray bug', () => {
    const classes = getFieldColorClasses('outline', false, null)
    expect(classes).toContain('bg-white')
    expect(classes).not.toContain('bg-neutral-25')
    expect(classes).toContain('dark:bg-ink-900')
  })

  it('outline error state adds error border classes', () => {
    const classes = getFieldColorClasses('outline', false, 'error')
    expect(classes).toContain('border-error-base')
  })

  it('outline success state adds success border classes', () => {
    const classes = getFieldColorClasses('outline', false, 'success')
    expect(classes).toContain('border-success-base')
  })

  it('filled default state uses ink-100 background', () => {
    const classes = getFieldColorClasses('filled', false, null)
    expect(classes).toContain('bg-ink-100')
  })

  it('filled focus-within uses white background, not the gray bug', () => {
    const classes = getFieldColorClasses('filled', false, null)
    expect(classes).toContain('focus-within:bg-white')
    expect(classes).toContain('dark:focus-within:bg-ink-900')
  })

  it('underline has no side borders', () => {
    const classes = getFieldColorClasses('underline', false, null)
    expect(classes).toContain('border-0')
    expect(classes).toContain('border-b')
  })

  it('underline error state adds error border-b classes', () => {
    const classes = getFieldColorClasses('underline', false, 'error')
    expect(classes).toContain('border-b-error-base')
  })

  it('underline success state adds success border-b classes', () => {
    const classes = getFieldColorClasses('underline', false, 'success')
    expect(classes).toContain('border-b-success-base')
  })

  it('null state adds no error/success classes for any variant', () => {
    for (const variant of VARIANTS) {
      const classes = getFieldColorClasses(variant, false, null)
      expect(classes).not.toContain('error-base')
      expect(classes).not.toContain('success-base')
    }
  })
})
```

- [ ] **Step 3: Run `pnpm test fieldStyles.test.ts` — expect PASS (this is a pure extraction of already-correct logic, not new behavior)**

- [ ] **Step 4: Rewrite `Input.tsx` to import from the shared module instead of defining its own copies**

```tsx
import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export type InputVariant = FieldVariant
export type InputSize = FieldSize

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: InputVariant
  size?: InputSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

function InputAffix({ children, side }: { children: ReactNode; side: 'prefix' | 'suffix' }) {
  return (
    <span
      className={cn(
        'shrink-0 flex items-center px-[12px] bg-neutral-50 text-neutral-600 text-[14px] font-medium border-neutral-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700 select-none',
        side === 'prefix' ? 'border-r' : 'border-l',
      )}
    >
      {children}
    </span>
  )
}

export function Input({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-stretch w-full overflow-hidden',
          !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
        )}
      >
        {prefix && <InputAffix side="prefix">{prefix}</InputAffix>}
        <div
          className={cn(
            'flex flex-1 min-w-0 items-center gap-[8px]',
            FIELD_SIZE_PADDING_Y_CLASSES[size],
            !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
          )}
        >
          {leadingIcon && (
            <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              {leadingIcon}
            </span>
          )}
          <input
            id={id}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={hintId}
            className={cn(
              "bg-transparent outline-none font-['Funnel_Display'] w-full",
              FIELD_SIZE_TEXT_CLASSES[size],
              disabled
                ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
                : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="shrink-0 size-[24px] flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              {trailingIcon}
            </span>
          )}
        </div>
        {suffix && <InputAffix side="suffix">{suffix}</InputAffix>}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full flex items-center gap-[4px]",
            isError
              ? 'text-error-base'
              : isSuccess
                ? 'text-success-dark dark:text-success-light'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {isError && <Icon name="error" size={15} />}
          {isSuccess && <Icon name="check_circle" size={15} />}
          {hintText}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run `pnpm test Input.test.tsx` — expect PASS with 0 changes needed (this is a pure refactor; every existing assertion targets the same output classes)**

- [ ] **Step 6: Run `pnpm typecheck && pnpm lint` — expect PASS**

- [ ] **Step 7: Commit**

```bash
git add src/components/shared/fieldStyles.ts src/components/shared/fieldStyles.test.ts src/components/Input/Input.tsx
git commit -m "refactor(Input): extract field variant/size styles into shared module"
```

---

### Task 2: Textarea — variant, size, success, label above field

**Files:**
- Modify: `src/components/Textarea/Textarea.tsx` (full rewrite)
- Modify: `src/components/Textarea/Textarea.test.tsx` (full rewrite)

**Interfaces:**
- Consumes: `FieldVariant`, `FieldSize`, `FIELD_SIZE_TEXT_CLASSES`, `FIELD_SIZE_PADDING_Y_CLASSES`, `FIELD_SIZE_PADDING_X_CLASSES`, `FIELD_SIZE_RADIUS_CLASSES`, `getFieldColorClasses` from `../shared/fieldStyles` (Task 1).
- Produces: `TextareaVariant = FieldVariant`, `TextareaSize = FieldSize`, `TextareaProps` with `variant`/`size`/`success`. Task 3 extends this same file with `showCount`.

- [ ] **Step 1: Rewrite `Textarea.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder', () => {
    render(<Textarea placeholder="Type something…" />)
    expect(screen.getByPlaceholderText('Type something…')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders the label above the field, not inside the bordered box', () => {
    render(<Textarea label="Description" id="desc-label-pos" />)
    const label = screen.getByText('Description')
    const fieldBox = screen.getByRole('textbox').closest('div')
    expect(fieldBox?.contains(label)).toBe(false)
  })

  it('applies outline variant classes by default', () => {
    render(<Textarea placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('border-neutral-300')
  })

  it('applies filled variant classes', () => {
    render(<Textarea variant="filled" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('bg-ink-100')
  })

  it('applies underline variant classes', () => {
    render(<Textarea variant="underline" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('border-b')
  })

  it('applies sm size classes', () => {
    render(<Textarea size="sm" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[14px]')
  })

  it('applies lg size classes', () => {
    render(<Textarea size="lg" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[17px]')
  })

  it('defaults to md size with the corrected padding/radius', () => {
    render(<Textarea placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('rounded-md')
  })

  it('renders hint text when provided', () => {
    render(<Textarea hint="Maximum 500 characters" />)
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument()
  })

  it('renders error text when provided', () => {
    render(<Textarea id="desc" error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('error overrides hint', () => {
    render(<Textarea hint="Hint text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
  })

  it('renders success text when provided', () => {
    render(<Textarea id="desc-ok" success="Looks good" />)
    expect(screen.getByText('Looks good')).toBeInTheDocument()
  })

  it('error overrides success when both are provided', () => {
    render(<Textarea success="Success text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Success text')).not.toBeInTheDocument()
  })

  it('renders a success icon in the hint row', () => {
    render(<Textarea id="desc-ok" success="Looks good" />)
    const hint = screen.getByText('Looks good').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('check_circle')
  })

  it('renders an error icon in the hint row', () => {
    render(<Textarea id="desc-bad" error="Invalid value" />)
    const hint = screen.getByText('Invalid value').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('error')
  })

  it('sets aria-invalid when error provided', () => {
    render(<Textarea id="desc" error="Invalid value" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('links aria-describedby to hint element when id provided', () => {
    render(<Textarea id="desc" hint="Hint text" />)
    const textarea = screen.getByRole('textbox')
    const hint = screen.getByText('Hint text')
    expect(textarea).toHaveAttribute('aria-describedby', 'desc-hint')
    expect(hint).toHaveAttribute('id', 'desc-hint')
  })

  it('is disabled when disabled prop set', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disabled renders the flat neutral box regardless of variant', () => {
    render(<Textarea variant="underline" disabled placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')
    expect(box).toHaveClass('bg-neutral-50')
  })

  it('does not fire onChange when disabled', async () => {
    const handler = vi.fn()
    render(<Textarea disabled onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('fires onChange when enabled', async () => {
    const handler = vi.fn()
    render(<Textarea onChange={handler} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(handler).toHaveBeenCalled()
  })

  it('forwards id to textarea element', () => {
    render(<Textarea id="my-textarea" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea')
  })

  it('has no a11y violations', async () => {
    const { container } = render(
      <Textarea label="Description" placeholder="Enter a description..." />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations with success state', async () => {
    const { container } = render(
      <Textarea id="desc-a11y-success" label="Description" success="Looks good" />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run `pnpm test Textarea.test.tsx` — expect FAIL (no `variant`/`size`/`success` props exist yet, label still renders inside the box, old `opacity-60`-based disabled test removed so no false pass)**

- [ ] **Step 3: Rewrite `Textarea.tsx`**

```tsx
import { type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export type TextareaVariant = FieldVariant
export type TextareaSize = FieldSize

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: TextareaVariant
  size?: TextareaSize
}

export function Textarea({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  className,
  disabled,
  id,
  ...props
}: TextareaProps) {
  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex flex-col w-full overflow-hidden',
          !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
          !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
          FIELD_SIZE_PADDING_Y_CLASSES[size],
        )}
      >
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          className={cn(
            "bg-transparent outline-none font-['Funnel_Display'] w-full resize-y min-h-[96px]",
            FIELD_SIZE_TEXT_CLASSES[size],
            disabled
              ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
              : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
          )}
          {...props}
        />
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full flex items-center gap-[4px]",
            isError
              ? 'text-error-base'
              : isSuccess
                ? 'text-success-dark dark:text-success-light'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {isError && <Icon name="error" size={15} />}
          {isSuccess && <Icon name="check_circle" size={15} />}
          {hintText}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run `pnpm test Textarea.test.tsx` — expect PASS**

- [ ] **Step 5: Run `pnpm typecheck && pnpm lint` — expect PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/Textarea/Textarea.tsx src/components/Textarea/Textarea.test.tsx
git commit -m "feat(Textarea): add variant/size/success, move label above field"
```

---

### Task 3: Textarea — character counter

**Files:**
- Modify: `src/components/Textarea/Textarea.tsx` (extend Task 2's version)
- Modify: `src/components/Textarea/Textarea.test.tsx` (append tests)

**Interfaces:**
- Consumes: `TextareaProps` as built in Task 2.
- Produces: `TextareaProps.showCount?: boolean`, no other public surface change.

- [ ] **Step 1: Append counter tests to `Textarea.test.tsx`** (add inside the existing `describe('Textarea', ...)` block, after the last test)

```tsx
  it('does not render counter without showCount', () => {
    render(<Textarea maxLength={10} placeholder="x" />)
    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument()
  })

  it('does not render counter without maxLength even if showCount is true', () => {
    render(<Textarea showCount placeholder="x" />)
    expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument()
  })

  it('renders counter in n/max format for an uncontrolled field with defaultValue', () => {
    render(<Textarea showCount maxLength={10} defaultValue="hi" placeholder="x" />)
    expect(screen.getByText('2/10')).toBeInTheDocument()
  })

  it('updates counter as the user types (uncontrolled)', async () => {
    render(<Textarea showCount maxLength={10} placeholder="x" />)
    expect(screen.getByText('0/10')).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('x'), 'hello')
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('updates counter from a controlled value on rerender', () => {
    const { rerender } = render(
      <Textarea showCount maxLength={10} value="ab" onChange={() => {}} placeholder="x" />,
    )
    expect(screen.getByText('2/10')).toBeInTheDocument()
    rerender(<Textarea showCount maxLength={10} value="abcd" onChange={() => {}} placeholder="x" />)
    expect(screen.getByText('4/10')).toBeInTheDocument()
  })

  it('renders counter alone (right-aligned) when there is no hint text', () => {
    render(<Textarea showCount maxLength={10} defaultValue="ab" placeholder="x" />)
    expect(screen.getByText('2/10')).toBeInTheDocument()
  })

  it('renders both hint and counter together', () => {
    render(<Textarea showCount maxLength={10} defaultValue="ab" hint="Keep it short" placeholder="x" />)
    expect(screen.getByText('Keep it short')).toBeInTheDocument()
    expect(screen.getByText('2/10')).toBeInTheDocument()
  })

  it('still calls the consumer onChange when a counter is shown (uncontrolled)', async () => {
    const handler = vi.fn()
    render(<Textarea showCount maxLength={10} onChange={handler} placeholder="x" />)
    await userEvent.type(screen.getByPlaceholderText('x'), 'a')
    expect(handler).toHaveBeenCalled()
  })
```

- [ ] **Step 2: Run `pnpm test Textarea.test.tsx` — expect the new counter tests FAIL (no `showCount` prop yet)**

- [ ] **Step 3: Extend `Textarea.tsx` with the counter**

```tsx
import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export type TextareaVariant = FieldVariant
export type TextareaSize = FieldSize

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: TextareaVariant
  size?: TextareaSize
  showCount?: boolean
}

export function Textarea({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  showCount = false,
  className,
  disabled,
  id,
  value,
  defaultValue,
  maxLength,
  onChange,
  ...props
}: TextareaProps) {
  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    typeof defaultValue === 'string' ? defaultValue.length : 0,
  )

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) {
      setUncontrolledLength(e.target.value.length)
    }
    onChange?.(e)
  }

  const length = isControlled ? String(value).length : uncontrolledLength
  const showCounter = showCount && maxLength != null

  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
  const hintId = hintText && id ? `${id}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled

  return (
    <div className={cn('flex flex-col gap-[6px] items-start w-full', className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex flex-col w-full overflow-hidden',
          !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
          !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
          FIELD_SIZE_PADDING_Y_CLASSES[size],
        )}
      >
        <textarea
          id={id}
          disabled={disabled}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          className={cn(
            "bg-transparent outline-none font-['Funnel_Display'] w-full resize-y min-h-[96px]",
            FIELD_SIZE_TEXT_CLASSES[size],
            disabled
              ? 'text-neutral-300 cursor-not-allowed placeholder:text-neutral-300 dark:text-ink-600 dark:placeholder:text-ink-600'
              : 'text-neutral-800 placeholder:text-neutral-500 dark:text-ink-100 dark:placeholder:text-neutral-400',
          )}
          {...props}
        />
      </div>
      {(hintText || showCounter) && (
        <div className="flex items-center justify-between gap-[8px] w-full">
          {hintText && (
            <p
              id={hintId}
              className={cn(
                "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] flex items-center gap-[4px]",
                isError
                  ? 'text-error-base'
                  : isSuccess
                    ? 'text-success-dark dark:text-success-light'
                    : 'text-neutral-500 dark:text-neutral-400',
              )}
            >
              {isError && <Icon name="error" size={15} />}
              {isSuccess && <Icon name="check_circle" size={15} />}
              {hintText}
            </p>
          )}
          {showCounter && (
            <span className="font-['Funnel_Display'] text-[12px] text-neutral-400 dark:text-ink-500 tabular-nums shrink-0 ml-auto">
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
```

`ml-auto` on the counter keeps it right-aligned whether or not `hintText` renders alongside it (the flex `justify-between` alone would only push it right when there are two children; `ml-auto` guarantees the same visual result with one child).

- [ ] **Step 4: Run `pnpm test Textarea.test.tsx` — expect PASS (all tests from Tasks 2 and 3)**

- [ ] **Step 5: Run `pnpm typecheck && pnpm lint` — expect PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/Textarea/Textarea.tsx src/components/Textarea/Textarea.test.tsx
git commit -m "feat(Textarea): add opt-in character counter tied to maxLength"
```

---

### Task 4: Select — variant, size, success, background fix

**Files:**
- Modify: `src/components/Select/Select.tsx` (full rewrite)
- Modify: `src/components/Select/Select.test.tsx` (append tests, keep all existing ones)

**Interfaces:**
- Consumes: `FieldVariant`, `FieldSize`, `FIELD_SIZE_TEXT_CLASSES`, `FIELD_SIZE_PADDING_Y_CLASSES`, `FIELD_SIZE_PADDING_X_CLASSES`, `FIELD_SIZE_RADIUS_CLASSES`, `getFieldColorClasses` from `../shared/fieldStyles` (Task 1).
- Produces: `SelectVariant = FieldVariant`, `SelectSize = FieldSize`, `SelectProps` with `variant`/`size`/`success` added. `SelectOption`, existing keyboard/ARIA behavior, and `onChange`/`value` contract are unchanged — no other task depends on new interfaces here.

- [ ] **Step 1: Append new tests to `Select.test.tsx`** (add inside the existing `describe('Select', ...)` block, after the last test; do not remove any existing test — this component's interaction model is unchanged)

```tsx
  it('applies outline variant classes by default', () => {
    render(<Select options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toHaveClass('border-neutral-300')
  })

  it('applies filled variant classes', () => {
    render(<Select options={OPTIONS} variant="filled" />)
    expect(screen.getByRole('combobox')).toHaveClass('bg-ink-100')
  })

  it('applies underline variant classes', () => {
    render(<Select options={OPTIONS} variant="underline" />)
    expect(screen.getByRole('combobox')).toHaveClass('border-b')
  })

  it('applies sm size classes to the selected/placeholder text', () => {
    render(<Select options={OPTIONS} size="sm" />)
    expect(screen.getByText('Select...')).toHaveClass('text-[14px]')
  })

  it('applies lg size classes to the selected/placeholder text', () => {
    render(<Select options={OPTIONS} size="lg" />)
    expect(screen.getByText('Select...')).toHaveClass('text-[17px]')
  })

  it('trigger no longer carries the old fixed h-[56px] height class', () => {
    render(<Select options={OPTIONS} />)
    expect(screen.getByRole('combobox')).not.toHaveClass('h-[56px]')
  })

  it('trigger background is white, not the old gray', () => {
    render(<Select options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toHaveClass('bg-white')
    expect(screen.getByRole('combobox')).not.toHaveClass('bg-neutral-25')
  })

  it('popover menu background is white, not the old gray', async () => {
    render(<Select options={OPTIONS} />)
    await userEvent.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveClass('bg-white')
    expect(listbox).not.toHaveClass('bg-neutral-25')
  })

  it('renders success text when provided', () => {
    render(<Select options={OPTIONS} id="sel-ok" success="Great choice" />)
    expect(screen.getByText('Great choice')).toBeInTheDocument()
  })

  it('error overrides success when both are provided', () => {
    render(<Select options={OPTIONS} success="Success text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Success text')).not.toBeInTheDocument()
  })

  it('applies success border classes to the trigger', () => {
    render(<Select options={OPTIONS} success="ok" />)
    expect(screen.getByRole('combobox')).toHaveClass('border-success-base')
  })

  it('renders a success icon in the hint row', () => {
    render(<Select options={OPTIONS} id="sel-ok-icon" success="Great choice" />)
    const hint = screen.getByText('Great choice').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('check_circle')
  })

  it('has no a11y violations with success state', async () => {
    const { container } = render(
      <Select id="sel-a11y-success" label="Team member" success="Great choice" options={OPTIONS} />,
    )
    // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
    expect(await axe(container)).toHaveNoViolations()
  })
```

- [ ] **Step 2: Run `pnpm test Select.test.tsx` — expect the new tests FAIL (no `variant`/`size`/`success` props yet, old gray background and fixed height still present)**

- [ ] **Step 3: Rewrite `Select.tsx`**

```tsx
import { useEffect, useRef, useState, useCallback, useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export type SelectVariant = FieldVariant
export type SelectSize = FieldSize

export interface SelectProps {
  options: SelectOption[]
  value?: string
  /**
   * Called with the newly selected option's value. This is a value
   * callback, not a native change event handler — Select is an ARIA
   * combobox widget, not a wrapped <select>, so there is no ChangeEvent
   * to forward.
   */
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: SelectVariant
  size?: SelectSize
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
  success,
  variant = 'outline',
  size = 'md',
  disabled,
  id,
  name,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const reactId = useId()
  const resolvedId = id ?? reactId
  const listboxId = `${resolvedId}-listbox`
  const labelId = label ? `${resolvedId}-label` : undefined

  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
  const hintId = hintText ? `${resolvedId}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled
  const selectedOption = options.find((o) => o.value === value)
  const enabledOptions = options.filter((o) => !o.disabled)

  const openMenu = useCallback(() => {
    const enabledOptions = options.filter((o) => !o.disabled)
    const selectedIdx = enabledOptions.findIndex((o) => o.value === value)
    setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0)
    setIsOpen(true)
    setTimeout(() => listboxRef.current?.focus(), 0)
  }, [options, value])

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
      if (isOpen) {
        setIsOpen(false)
      } else {
        openMenu()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) openMenu()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) openMenu()
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
    <div
      ref={rootRef}
      className={cn('flex flex-col gap-[6px] items-start w-full relative', className)}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={resolvedId}
          className="font-['Funnel_Display'] text-[12px] leading-[16px] text-neutral-400 select-none dark:text-ink-500"
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <div className="relative w-full">
        <button
          id={resolvedId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            if (isOpen) {
              setIsOpen(false)
            } else {
              openMenu()
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'flex gap-[8px] items-center w-full text-left',
            'outline-none transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
            !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
            FIELD_SIZE_PADDING_Y_CLASSES[size],
            getFieldColorClasses(variant, Boolean(disabled), state),
          )}
        >
          <span className="flex flex-col flex-1 min-w-0 justify-center">
            <span
              className={cn(
                "font-['Funnel_Display'] truncate",
                FIELD_SIZE_TEXT_CLASSES[size],
                disabled
                  ? 'text-neutral-300 dark:text-ink-600'
                  : selectedOption
                    ? 'text-neutral-800 font-medium dark:text-ink-100'
                    : 'text-neutral-400 dark:text-ink-500',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span
            className={cn(
              'shrink-0 text-neutral-500 dark:text-neutral-400',
              disabled && 'text-neutral-300 dark:text-ink-600',
            )}
          >
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            role="listbox"
            id={listboxId}
            aria-label={label}
            aria-activedescendant={
              focusedIndex >= 0 && enabledOptions[focusedIndex]
                ? `${listboxId}-opt-${enabledOptions[focusedIndex].value}`
                : undefined
            }
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="absolute top-full left-0 w-full mt-[8px] bg-white border border-neutral-100 rounded-lg shadow-[0px_4px_16px_2px_rgba(70,31,174,0.10)] py-[4px] max-h-[320px] overflow-y-auto z-50 outline-none dark:bg-ink-900 dark:border-ink-700"
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value
              const isDisabled = Boolean(option.disabled)
              const isFocused = enabledOptions.indexOf(option) === focusedIndex
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-opt-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || undefined}
                  data-index={idx}
                  onMouseEnter={() => {
                    if (!isDisabled) {
                      const enabledIdx = enabledOptions.indexOf(option)
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
                      ? 'text-neutral-300 cursor-not-allowed dark:text-ink-600'
                      : isSelected || isFocused
                        ? 'bg-neutral-50 text-neutral-800 cursor-pointer dark:bg-ink-700 dark:text-ink-100'
                        : 'text-neutral-800 cursor-pointer hover:bg-neutral-50 dark:text-ink-100 dark:hover:bg-ink-700',
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <span className="shrink-0 text-neutral-800 dark:text-ink-100">
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
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full flex items-center gap-[4px]",
            isError
              ? 'text-error-base'
              : isSuccess
                ? 'text-success-dark dark:text-success-light'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {isError && <Icon name="error" size={15} />}
          {isSuccess && <Icon name="check_circle" size={15} />}
          {hintText}
        </p>
      )}
    </div>
  )
}
```

Note: the trigger's border/background no longer special-cases `isOpen` — per the spec, the "open" affordance now comes only from the existing `focus-visible:ring-2` utility already on the button, exactly as `Input` relies on `focus-within` rather than a separate open-state class. `Icon` is newly imported here (previously unused in `Select.tsx`) to render the same `error`/`check_circle` glyphs `Input`/`Textarea` already use.

- [ ] **Step 4: Run `pnpm test Select.test.tsx` — expect PASS (all existing tests plus the new ones)**

- [ ] **Step 5: Run `pnpm typecheck && pnpm lint` — expect PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/Select/Select.tsx src/components/Select/Select.test.tsx
git commit -m "feat(Select): add variant/size/success, fix background gray-bug and fixed height"
```

---

### Task 5: Stories for both components

**Files:**
- Modify: `src/components/Textarea/Textarea.stories.tsx`
- Modify: `src/components/Select/Select.stories.tsx`

**Interfaces:**
- Consumes: `Textarea`/`Select` public props as built in Tasks 2-4. No production code changes in this task — stories only.

- [ ] **Step 1: Rewrite `Textarea.stories.tsx`**

```tsx
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
      <Textarea label="Underline" placeholder="Underline variant" variant="underline" id="all-underline" />
      <Textarea
        label="Bio"
        placeholder="With counter"
        showCount
        maxLength={80}
        id="all-counter"
      />
    </div>
  ),
}
```

- [ ] **Step 2: Rewrite `Select.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '../../docs-types'
import { useState } from 'react'
import { Select } from './Select'

const OPTIONS = [
  { value: 'phoenix', label: 'Phoenix Baker' },
  { value: 'olivia', label: 'Olivia Rhye' },
  { value: 'lana', label: 'Lana Steiner' },
  { value: 'demi', label: 'Demi Wilkinson', disabled: true },
  { value: 'candice', label: 'Candice Wu' },
]

const MANY_OPTIONS = [
  { value: 'option-1', label: 'Option 1' },
  { value: 'option-2', label: 'Option 2' },
  { value: 'option-3', label: 'Option 3' },
  { value: 'option-4', label: 'Option 4' },
  { value: 'option-5', label: 'Option 5' },
  { value: 'option-6', label: 'Option 6' },
  { value: 'option-7', label: 'Option 7' },
  { value: 'option-8', label: 'Option 8' },
  { value: 'option-9', label: 'Option 9' },
  { value: 'option-10', label: 'Option 10' },
  { value: 'option-11', label: 'Option 11' },
  { value: 'option-12', label: 'Option 12' },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    options: OPTIONS,
    placeholder: 'Select team member',
  },
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
  args: {
    id: 'member',
    label: 'Team member',
  },
}

export const WithHint: Story = {
  args: {
    id: 'member',
    label: 'Team member',
    hint: 'Select one team member.',
  },
}

export const WithError: Story = {
  args: {
    id: 'member',
    label: 'Team member',
    error: 'This field is required.',
  },
}

export const WithSuccess: Story = {
  args: {
    id: 'member-ok',
    label: 'Team member',
    success: 'Great choice.',
    value: 'olivia',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Team member',
    disabled: true,
  },
}

export const OutlineVariant: Story = {
  args: { id: 'member-outline', label: 'Team member', variant: 'outline' },
}

export const FilledVariant: Story = {
  args: { id: 'member-filled', label: 'Team member', variant: 'filled' },
}

export const UnderlineVariant: Story = {
  args: { id: 'member-underline', label: 'Team member', variant: 'underline' },
}

export const SmallSize: Story = {
  args: { id: 'member-sm', label: 'Team member', size: 'sm' },
}

export const LargeSize: Story = {
  args: { id: 'member-lg', label: 'Team member', size: 'lg' },
}

export const ManyOptions: Story = {
  args: {
    options: MANY_OPTIONS,
    id: 'many-select',
    label: 'Choose an option',
    placeholder: 'Select from list...',
  },
}

export const AllStates: Story = {
  render: (args) => {
    const [value2, setValue2] = useState('olivia')

    return (
      <div className="flex flex-col gap-6 p-4 max-w-sm">
        <div>
          <h3 className="text-sm font-semibold mb-2">Default</h3>
          <Select {...args} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Value</h3>
          <Select {...args} value={value2} onChange={setValue2} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Label</h3>
          <Select {...args} id="all-label" label="Team member" />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Hint</h3>
          <Select {...args} id="all-hint" label="Team member" hint="Select one team member." />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Error</h3>
          <Select {...args} id="all-error" label="Team member" error="This field is required." />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">With Success</h3>
          <Select {...args} id="all-success" label="Team member" success="Great choice." value="olivia" />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Disabled</h3>
          <Select {...args} label="Team member" disabled />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Filled</h3>
          <Select {...args} id="all-filled" label="Team member" variant="filled" />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Underline</h3>
          <Select {...args} id="all-underline" label="Team member" variant="underline" />
        </div>
      </div>
    )
  },
}
```

- [ ] **Step 3: Run `pnpm build` — confirm `docs-site` picks up the new stories without error (glob-discovered, no manual registration)**

- [ ] **Step 4: Commit**

```bash
git add src/components/Textarea/Textarea.stories.tsx src/components/Select/Select.stories.tsx
git commit -m "docs: add variant/size/success/counter stories for Textarea and Select"
```

---

### Task 6: Verification and changeset

**Files:**
- Create: `.changeset/textarea-select-parity.md`

**Interfaces:**
- None — this task only verifies the prior four and records the version bump.

- [ ] **Step 1: Run the full verification sequence**

```bash
pnpm lint && pnpm typecheck && pnpm build && pnpm test
```

Expect all four green. If the test count looks doubled, check for a leftover worktree per the known `AGENTS.md` artifact — not a real failure.

- [ ] **Step 2: Write the changeset**

```md
---
"@starbemtech/react-starsystem": minor
---

`Textarea`: move the `label` above the field instead of floating it inside the bordered box (matches `Input`/`Select`/`FormField`'s label position — visual change for consumers using `<Textarea label="..."/>` standalone, no type-level breaking change). Add `variant` (`outline` default, `filled`, `underline`), `size` (`sm`, `md` default, `lg`), a `success` state (parallel to `error`, mutually exclusive — `error` wins if both are set), and an opt-in character counter (`showCount`, requires `maxLength`).

`Select`: add `variant`, `size`, and `success`, matching `Input`/`Textarea`. Fixes the trigger's fixed `56px` height and `16px/8px` padding (now organic height with `14px/10px` padding on the `md` default, matching the design system), and fixes the trigger and popover menu background, which used an incorrect gray (`#F7F7F7`) instead of white.

Internal: extracted the `variant`/`size` color and sizing logic shared by `Input`, `Textarea`, and `Select` into `src/components/shared/fieldStyles.ts` — not part of the public API, but public type aliases (`InputVariant`, `InputSize`, `TextareaVariant`, `TextareaSize`, `SelectVariant`, `SelectSize`) are preserved for existing imports.
```

- [ ] **Step 3: Commit**

```bash
git add .changeset/textarea-select-parity.md
git commit -m "chore: add changeset for Textarea/Select DS parity"
```

## Self-Review Notes

- **Spec coverage:** every section of `docs/superpowers/specs/2026-07-30-textarea-select-redesign-design.md` maps to a task — shared module (Task 1), Textarea variant/size/success/label (Task 2), Textarea counter (Task 3), Select variant/size/success/background (Task 4), stories (Task 5), changeset (Task 6). `FormField` is explicitly out of scope, matching the spec's "no gap found" conclusion.
- **Placeholder scan:** no `TBD`/`TODO`, no "add appropriate error handling"-style steps — every step carries full code or an exact shell command.
- **Type consistency:** `FieldVariant`/`FieldSize` from Task 1 are the single source of truth; `InputVariant`/`InputSize` (Task 1), `TextareaVariant`/`TextareaSize` (Task 2), `SelectVariant`/`SelectSize` (Task 4) are all declared as aliases of the same two types, checked for name consistency across all four tasks.
- **Select's label styling is deliberately left untouched** (`text-[12px] text-neutral-400`, distinct from `Input`/`Textarea`'s `text-[14px] text-neutral-800`) — the spec found no gap in `Select`'s label position or style, only in its field background/sizing, so Task 4 does not touch it. This is a known minor inconsistency across the three components, not addressed here — flag to Julio after merge if full label-style unification is wanted later; out of this plan's approved scope.
- **Counter right-alignment**: Task 3 resolves the spec's "implementer's choice" note on how to right-align a lone counter by using `ml-auto` on the counter span, keeping the DOM structure (hint `<p>` conditionally present, counter `<span>` always present when `showCounter`) simple and testable — documented inline in Task 3 Step 3.
