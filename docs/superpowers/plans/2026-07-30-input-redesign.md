# Input Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `Input` (`src/components/Input/Input.tsx`) to parity with the Design System reference kit: label moves above the field, adds `variant` (`outline`/`filled`/`underline`), `size` (`sm`/`md`/`lg`), `success` state, and `prefix`/`suffix` add-ons.

**Architecture:** Single component, `Record<Variant, ...>`/`Record<Size, ...>` class maps composed via `cn()` (no new dependency), matching `Button.tsx`/`Radio.tsx` conventions. Outer wrapper (border/radius/bg/color) + inner content flex row (icons/input, with its own padding) so `prefix`/`suffix` can sit flush against the outer border without disturbing the input's own padding.

**Tech Stack:** React, TypeScript, Tailwind CSS v4 (arbitrary-value utility classes), vitest + `@testing-library/react` + `vitest-axe`.

## Global Constraints

- No `multiline` prop on `Input` — `Textarea` stays the dedicated component for that (confirmed decision, see spec).
- No new dependency (no `cva`) — variant/size resolve via plain class maps.
- `error` and `success` are mutually exclusive; `error` wins if both are passed: `hintText = error ?? success ?? hint`.
- Icon slots stay fixed at `size-[24px]` regardless of `size` (existing lib-wide convention).
- `disabled` always renders the flat neutral box regardless of `variant` — `filled`/`underline` shape and color are suppressed while disabled.
- Every new/changed class must have its dark-mode pair per `AGENTS.md`'s established pairing convention (`ink-100`↔`ink-700` for backgrounds, etc.) — never introduce an `ink-400` class (doesn't exist).
- `pnpm lint && pnpm typecheck && pnpm build && pnpm test` must pass at the end of every task.
- Spec: `docs/superpowers/specs/2026-07-30-input-redesign-design.md` — read it before Task 1 if anything below is unclear.

---

### Task 1: Variant, size, label position, structural split

**Files:**
- Modify: `src/components/Input/Input.tsx`
- Test: `src/components/Input/Input.test.tsx`

**Interfaces:**
- Produces: `InputVariant = 'outline' | 'filled' | 'underline'`, `InputSize = 'sm' | 'md' | 'lg'`, both exported from `Input.tsx`. `InputProps` gains `variant?: InputVariant` (default `'outline'`) and `size?: InputSize` (default `'md'`). These are consumed by Task 2 (`success`) and Task 3 (`prefix`/`suffix`), which extend this same file.

- [ ] **Step 1: Write failing tests for label position, variant, and size**

Add to `src/components/Input/Input.test.tsx`, right after the existing `'renders label when provided'` test:

```tsx
  it('renders the label above the field, not inside the bordered box', () => {
    render(<Input label="Email" id="email-label-pos" />)
    const label = screen.getByText('Email')
    const fieldBox = screen.getByRole('textbox').closest('div')
    // The label must be a sibling of the field box, not a descendant of it.
    expect(fieldBox?.contains(label)).toBe(false)
  })

  it('applies outline variant classes by default', () => {
    render(<Input placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-neutral-300')
  })

  it('applies filled variant classes', () => {
    render(<Input variant="filled" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('bg-ink-100')
  })

  it('applies underline variant classes', () => {
    render(<Input variant="underline" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-b')
  })

  it('applies sm size classes', () => {
    render(<Input size="sm" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[14px]')
  })

  it('applies lg size classes', () => {
    render(<Input size="lg" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveClass('text-[17px]')
  })

  it('defaults to md size with the corrected padding/radius', () => {
    render(<Input placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('rounded-md')
  })

  it('disabled renders the flat box shape even with underline variant', () => {
    render(<Input variant="underline" disabled placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).not.toHaveClass('rounded-none')
    expect(box).toHaveClass('bg-neutral-50')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test Input.test.tsx`
Expected: FAIL — `variant`/`size` don't exist yet, label is still inside the box, `md` still uses `rounded-lg`.

- [ ] **Step 3: Rewrite `Input.tsx`**

Replace the entire file with:

```tsx
import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type InputVariant = 'outline' | 'filled' | 'underline'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  variant?: InputVariant
  size?: InputSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const SIZE_TEXT_CLASSES: Record<InputSize, string> = {
  sm: 'text-[14px] leading-[20px]',
  md: 'text-[16px] leading-[24px]',
  lg: 'text-[17px] leading-[26px]',
}

const SIZE_PADDING_Y_CLASSES: Record<InputSize, string> = {
  sm: 'py-[7px]',
  md: 'py-[10px]',
  lg: 'py-[13px]',
}

const SIZE_PADDING_X_CLASSES: Record<InputSize, string> = {
  sm: 'px-[12px]',
  md: 'px-[14px]',
  lg: 'px-[16px]',
}

const SIZE_RADIUS_CLASSES: Record<InputSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
}

function getFieldColorClasses(
  variant: InputVariant,
  disabled: boolean,
  state: 'error' | null,
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
    )
  }

  if (variant === 'filled') {
    return cn(
      'border border-transparent bg-ink-100 hover:bg-ink-50 dark:bg-ink-700 dark:hover:bg-ink-600',
      'focus-within:bg-neutral-25 focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)] dark:focus-within:bg-neutral-900',
      state === 'error' &&
        'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
    )
  }

  return cn(
    'border bg-neutral-25 border-neutral-300 hover:border-neutral-400 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700 dark:hover:border-ink-600',
    'focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)]',
    state === 'error' &&
      'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
  )
}

export function Input({
  label,
  hint,
  error,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const isError = Boolean(error)
  const state: 'error' | null = isError ? 'error' : null
  const hintText = error ?? hint
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
          !isUnderlineShape && SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
        )}
      >
        <div
          className={cn(
            'flex flex-1 min-w-0 items-center gap-[8px]',
            SIZE_PADDING_Y_CLASSES[size],
            !isUnderlineShape && SIZE_PADDING_X_CLASSES[size],
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
              SIZE_TEXT_CLASSES[size],
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
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full",
            isError ? 'text-error-base' : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  )
}
```

Note: the `label` is now `htmlFor={id}` and rendered as a sibling of the field wrapper `<div>`, not inside it — this is the structural fix. Default focus-within treatment changed from `ring-2 ring-primary-base ring-offset-2` to a direct `box-shadow` glow (`shadow-[0_0_0_4px_rgba(255,81,0,0.2)]`) so all three variants and both states (default/error) share one focus technique — `ring-offset-2` doesn't compose cleanly with `filled`'s background swap or `underline`'s borderless sides.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test Input.test.tsx`
Expected: PASS — all new tests plus the full pre-existing suite (label/hint/error/disabled/onChange/icons/a11y).

- [ ] **Step 5: Commit**

```bash
git add src/components/Input/Input.tsx src/components/Input/Input.test.tsx
git commit -m "feat(Input): add variant/size, move label above field"
```

---

### Task 2: `success` state with hint icons

**Files:**
- Modify: `src/components/Input/Input.tsx`
- Test: `src/components/Input/Input.test.tsx`

**Interfaces:**
- Consumes: `getFieldColorClasses`, `InputVariant`, `InputSize` from Task 1 (same file, extended in place).
- Produces: `InputProps.success?: string`. `hintText = error ?? success ?? hint` (Task 3's `prefix`/`suffix` don't touch this).

- [ ] **Step 1: Write failing tests**

Add to `src/components/Input/Input.test.tsx`:

```tsx
  it('renders success text when provided', () => {
    render(<Input id="email-ok" success="Email available" />)
    expect(screen.getByText('Email available')).toBeInTheDocument()
  })

  it('error overrides success when both are provided', () => {
    render(<Input success="Success text" error="Error text" />)
    expect(screen.getByText('Error text')).toBeInTheDocument()
    expect(screen.queryByText('Success text')).not.toBeInTheDocument()
  })

  it('renders a success icon in the hint row', () => {
    render(<Input id="email-ok" success="Email available" />)
    const hint = screen.getByText('Email available').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('check_circle')
  })

  it('renders an error icon in the hint row', () => {
    render(<Input id="email-bad" error="Invalid email" />)
    const hint = screen.getByText('Invalid email').closest('p')
    expect(hint?.querySelector('.material-symbols-rounded')).toHaveTextContent('error')
  })

  it('applies success border classes to the field box', () => {
    render(<Input success="ok" placeholder="x" />)
    const box = screen.getByPlaceholderText('x').closest('div')?.parentElement
    expect(box).toHaveClass('border-success-base')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test Input.test.tsx`
Expected: FAIL — `success` prop doesn't exist, no icons rendered in the hint row yet.

- [ ] **Step 3: Add `success` + hint icons**

In `src/components/Input/Input.tsx`:

1. Add the import at the top:

```tsx
import { Icon } from '../Icon'
```

2. In `InputProps`, add after `error?: string`:

```tsx
  success?: string
```

3. Change the `getFieldColorClasses` signature and underline/filled/outline branches to accept `'error' | 'success' | null` and add the success branch to each. Full updated function:

```tsx
function getFieldColorClasses(
  variant: InputVariant,
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
      'focus-within:bg-neutral-25 focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)] dark:focus-within:bg-neutral-900',
      state === 'error' &&
        'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
      state === 'success' &&
        'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
    )
  }

  return cn(
    'border bg-neutral-25 border-neutral-300 hover:border-neutral-400 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700 dark:hover:border-ink-600',
    'focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)]',
    state === 'error' &&
      'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
    state === 'success' &&
      'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
  )
}
```

4. In the `Input` function signature, destructure `success` alongside `error`, and update the derived values:

```tsx
export function Input({
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
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
```

5. Replace the hint `<p>` block at the bottom with:

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test Input.test.tsx`
Expected: PASS — all tests including Task 1's.

- [ ] **Step 5: Commit**

```bash
git add src/components/Input/Input.tsx src/components/Input/Input.test.tsx
git commit -m "feat(Input): add success state with hint icon"
```

---

### Task 3: `prefix`/`suffix` add-ons

**Files:**
- Modify: `src/components/Input/Input.tsx`
- Test: `src/components/Input/Input.test.tsx`

**Interfaces:**
- Consumes: the outer/inner wrapper split from Task 1 — `prefix`/`suffix` render as siblings of the inner content `<div>`, inside the same outer wrapper.
- Produces: `InputProps.prefix?: ReactNode`, `InputProps.suffix?: ReactNode`.

- [ ] **Step 1: Write failing tests**

Add to `src/components/Input/Input.test.tsx`:

```tsx
  it('renders prefix', () => {
    render(<Input prefix="R$" placeholder="0,00" />)
    expect(screen.getByText('R$')).toBeInTheDocument()
  })

  it('renders suffix', () => {
    render(<Input suffix="BRL" placeholder="0,00" />)
    expect(screen.getByText('BRL')).toBeInTheDocument()
  })

  it('renders both prefix and suffix alongside the input', () => {
    render(<Input prefix="R$" suffix="BRL" placeholder="0,00" />)
    expect(screen.getByText('R$')).toBeInTheDocument()
    expect(screen.getByText('BRL')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test Input.test.tsx`
Expected: FAIL — `prefix`/`suffix` props don't exist yet.

- [ ] **Step 3: Add `prefix`/`suffix`**

In `src/components/Input/Input.tsx`:

1. Add a small helper above `export function Input`:

```tsx
function InputAffix({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 flex items-center px-[12px] bg-neutral-50 text-neutral-600 text-[14px] font-medium border-neutral-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700 select-none">
      {children}
    </span>
  )
}
```

2. In `InputProps`, add after `trailingIcon?: ReactNode`:

```tsx
  prefix?: ReactNode
  suffix?: ReactNode
```

3. Destructure `prefix`/`suffix` in the `Input` function signature, alongside `leadingIcon`/`trailingIcon`:

```tsx
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
```

4. In the JSX, wrap the inner content `<div>` with `prefix`/`suffix` siblings — the outer wrapper `<div>` (with `items-stretch` from Task 1) now contains three children instead of one:

```tsx
      <div
        className={cn(
          'flex items-stretch w-full overflow-hidden',
          !isUnderlineShape && SIZE_RADIUS_CLASSES[size],
          getFieldColorClasses(variant, Boolean(disabled), state),
        )}
      >
        {prefix && <InputAffix>{prefix}</InputAffix>}
        <div
          className={cn(
            'flex flex-1 min-w-0 items-center gap-[8px]',
            SIZE_PADDING_Y_CLASSES[size],
            !isUnderlineShape && SIZE_PADDING_X_CLASSES[size],
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
              SIZE_TEXT_CLASSES[size],
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
        {suffix && <InputAffix>{suffix}</InputAffix>}
      </div>
```

Only that block changes — everything above (label) and below (hint `<p>`) stays exactly as Task 2 left it.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test Input.test.tsx`
Expected: PASS — all tests including Tasks 1 and 2.

- [ ] **Step 5: Commit**

```bash
git add src/components/Input/Input.tsx src/components/Input/Input.test.tsx
git commit -m "feat(Input): add prefix/suffix add-ons"
```

---

### Task 4: Update stories

**Files:**
- Modify: `src/components/Input/Input.stories.tsx`

**Interfaces:**
- Consumes: `variant`, `size`, `success`, `prefix`, `suffix` from Tasks 1–3 (all on the same `Input` component).

- [ ] **Step 1: Add new story exports**

Append to `src/components/Input/Input.stories.tsx`, after the existing `WithTrailingIcon` export and before `NoLabel`:

```tsx
export const OutlineVariant: Story = {
  args: {
    label: 'Outline',
    placeholder: 'voce@email.com',
    variant: 'outline',
    id: 'variant-outline',
  },
}

export const FilledVariant: Story = {
  args: {
    label: 'Filled',
    placeholder: 'Buscar especialidade',
    variant: 'filled',
    id: 'variant-filled',
  },
}

export const UnderlineVariant: Story = {
  args: {
    label: 'Underline',
    placeholder: 'Nome completo',
    variant: 'underline',
    id: 'variant-underline',
  },
}

export const SmallSize: Story = {
  args: {
    label: 'Pequeno',
    placeholder: 'sm',
    size: 'sm',
    id: 'size-sm',
  },
}

export const LargeSize: Story = {
  args: {
    label: 'Grande',
    placeholder: 'lg',
    size: 'lg',
    id: 'size-lg',
  },
}

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    placeholder: 'ana@email.com',
    defaultValue: 'ana@email.com',
    success: 'E-mail disponível',
    id: 'email-with-success',
  },
}

export const WithPrefixSuffix: Story = {
  args: {
    label: 'Valor',
    placeholder: '0,00',
    prefix: 'R$',
    suffix: 'BRL',
    id: 'with-prefix-suffix',
  },
}
```

2. Update `AllStates` to also cover the new variants/states, replacing the existing `render` body:

```tsx
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 max-w-sm">
      <Input placeholder="Placeholder (no label)" />
      <Input label="Email" placeholder="olivia@untitledui.com" />
      <Input
        label="Email"
        placeholder="olivia@untitledui.com"
        hint="This is a hint text."
        id="all-hint"
      />
      <Input
        label="Email"
        placeholder="olivia@untitledui.com"
        error="This email is already taken."
        id="all-error"
      />
      <Input
        label="Email"
        placeholder="ana@email.com"
        defaultValue="ana@email.com"
        success="E-mail disponível"
        id="all-success"
      />
      <Input label="Email" placeholder="olivia@untitledui.com" disabled />
      <Input label="Filled" placeholder="Buscar" variant="filled" id="all-filled" />
      <Input label="Underline" placeholder="Nome completo" variant="underline" id="all-underline" />
      <Input label="Valor" placeholder="0,00" prefix="R$" suffix="BRL" id="all-affix" />
    </div>
  ),
}
```

- [ ] **Step 2: Verify the docs site builds with the new stories**

Run: `pnpm docs:build`
Expected: build succeeds, no errors. (Stories aren't unit-tested — this is a build-time smoke check, not a vitest run.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/Input.stories.tsx
git commit -m "docs(Input): add stories for variant/size/success/prefix-suffix"
```

---

### Task 5: Full verification + changeset

**Files:**
- Create: `.changeset/input-redesign.md`

- [ ] **Step 1: Run full verification suite**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: all four succeed, 0 errors. Test count should be higher than before Task 1 (16 new tests added across Tasks 1–3: 8 in Task 1, 5 in Task 2, 3 in Task 3 — verify the delta matches, investigate any mismatch before proceeding).

- [ ] **Step 2: Create the changeset**

Run: `pnpm changeset`

When prompted:
- Select `@starbemtech/react-starsystem`.
- Bump type: ask Julio directly (patch vs. minor — this is a visual breaking change with no type-level break, same open question flagged in the spec's Versioning section; do not decide silently).
- Summary text (English, per this repo's established convention — see `feedback_changeset_english` precedent): describe the label repositioning as the breaking part and the new props as additive, e.g. "Input: move label above the field (breaking visual change for standalone `label` usage without `FormField`), add `variant` (outline/filled/underline), `size` (sm/md/lg), `success` state, and `prefix`/`suffix` add-ons."

- [ ] **Step 3: Commit the changeset**

```bash
git add .changeset/
git commit -m "chore: add changeset for Input redesign"
```

## Self-Review Notes

- **Spec coverage:** label position (Task 1), variant/size incl. `md` padding/radius bug fix (Task 1), `success` + hint icons (Task 2), `prefix`/`suffix` (Task 3), disabled overriding variant shape (Task 1, tested), no `multiline` (never added, confirmed by omission), stories (Task 4), changeset (Task 5). All spec sections have a corresponding task.
- **Type consistency:** `InputVariant`/`InputSize` defined once in Task 1, reused verbatim (not redefined) in Tasks 2–3. `state` type grows from `'error' | null` (Task 1) to `'error' | 'success' | null` (Task 2) — Task 2's Step 3 replaces the whole `getFieldColorClasses` function rather than patching it, so there's no leftover reference to the narrower type.
- **No placeholders:** every step has literal code or an exact command; Task 5's bump-type step is a real "ask Julio" instruction (a genuine human decision point, not a TBD).
