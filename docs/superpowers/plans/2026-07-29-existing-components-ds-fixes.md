# Existing Components — DS Fidelity Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the public API of 11 existing components (`Button`, `Checkbox`, `Radio`, `Select`, `Avatar`, `Modal`, `Tabs`, `Badge`, `Spinner`, `Tooltip`, `Pagination`) so they match the Starbem Design System reference kit (`/Users/juliosousa/Downloads/Starbem Design System/`) wherever the gap is a real capability loss, as a single breaking major-version release.

**Architecture:** Each task modifies one component in place — same file, same architecture (ARIA-custom widgets for Checkbox/Radio/Select, Radix UI for Modal/Tabs/Tooltip, native `<button>`/`<a>` for Button). No new dependencies. Breaking prop renames/type changes ship without compatibility shims.

**Tech Stack:** React 18+, TypeScript strict, Tailwind CSS v4 (arbitrary values), Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip` — already dependencies), vitest + `@testing-library/react` + `vitest-axe`, Changesets.

## Global Constraints

- Icon convention: `icon?: ReactNode` everywhere, never `icon: string`. (established lib-wide decision)
- Keep existing architecture per component: ARIA-custom widget for Checkbox/Radio/Select, Radix UI for Modal/Tabs/Tooltip. Do not rewrite to native elements or to a non-Radix custom implementation.
- Colors/radii for every new class must use the corrected token hex values from `src/tokens/colors.ts` (already fixed 2026-07-29): `primary.base #FF5100`, `primary.dark #D03700`, `primary.darker #A31B00`, `primary.light #FF9353`, `primary.lightest #FFF1E0`, `secondary.base #7F56D9`, `secondary.lightest #F3E9FC`, `secondary.darker #461FAE` (DS's `--secondary-darker` — closest existing step is `secondary.darker`), `terciary.base #ED2E98`, `neutral[400] #9C9C9C`, `ink[900] #101828`, `ink[800] #1C1B1F`, `ink[700] #344054`, `ink[600] #475467`, `ink[100] #F2F4F7`, `ink[50] #F9FAFB`, `error.base #FF4242`, `error.lightest #FFEDE7`, `error.darker #9A0912`, `warning.lightest #FEF8E9`, `warning.dark #CE7734`, `success.lightest #E3F6EF`, `success.base #1FBA5D`, `success.darker #0E5A19`. Components keep hardcoding literal hex/px per existing lib convention — no token-file imports.
- Test convention: vitest + `@testing-library/react` + `vitest-axe`, copy this exact pattern verbatim on every new a11y assertion (from `Card.test.tsx:67-76`):
  ```tsx
  // @ts-expect-error vitest-axe matcher types not compatible with this vitest version
  expect(results).toHaveNoViolations()
  ```
- Story convention: `Meta`/`StoryObj` from `../../docs-types` (relative import, matches existing stories files), one named export per variant/prop combination added.
- No component may lose an existing prop, test, or story coverage as a side effect — every fix is additive-or-explicitly-renamed, never a silent capability removal beyond what is explicitly listed in this plan.
- Every task's final steps run `pnpm lint && pnpm typecheck && pnpm build && pnpm test` — must pass with 0 errors before commit.
- Every commit message uses conventional-commit style (`feat:`, `fix:`) and notes `BREAKING CHANGE:` in the body for any renamed/retyped prop, matching the changeset's per-component breaking list (Task 12 assembles the full changeset; earlier tasks just need to commit their own change).

---

## Task 1: Button — add variants, sizes, pill/block, polymorphic `as`

**Files:**
- Modify: `src/components/Button/Button.tsx`
- Modify: `src/components/Button/Button.test.tsx`
- Modify: `src/components/Button/Button.stories.tsx`

**Interfaces:**
- Produces: `ButtonProps` — discriminated union `({ as?: 'button' } & ...) | ({ as: 'a' } & ...)`, `variant: 'primary'|'secondary'|'outline'|'ghost'|'danger'|'tertiary'|'link'|'glass'|'glass-dark'|'glass-brand'`, `size: 'sm'|'md'|'lg'|'xl'`, `pill?: boolean`, `block?: boolean`. No other task consumes these.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Button/Button.test.tsx` (inside the existing top-level `describe` block, next to the other cases — read the file first to match its exact existing `import`/`describe` structure before appending):

```tsx
  it('renders new DS-aligned variants', () => {
    const { rerender } = render(<Button variant="tertiary">Tertiary</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-[#D03700]')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4')

    rerender(<Button variant="glass">Glass</Button>)
    expect(screen.getByRole('button')).toHaveClass('backdrop-blur-[12px]')

    rerender(<Button variant="glass-dark">Glass dark</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-white')

    rerender(<Button variant="glass-brand">Glass brand</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-white')
  })

  it('renders size xl', () => {
    render(<Button size="xl">XL</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-[16px]')
  })

  it('applies pill radius when pill is true', () => {
    render(<Button pill>Pill</Button>)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('stretches full width when block is true', () => {
    render(<Button block>Block</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('renders as an anchor when as="a" is passed, with href and no disabled attribute', () => {
    render(
      <Button as="a" href="/somewhere">
        Link button
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Link button' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/somewhere')
    expect(link).not.toHaveAttribute('disabled')
  })

  it('applies aria-disabled instead of disabled when as="a" and loading is true', () => {
    render(
      <Button as="a" href="/x" loading>
        Loading link
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Loading link' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveClass('pointer-events-none')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Button/Button.test.tsx`
Expected: FAIL — `variant="tertiary"` etc. not assignable to `ButtonProps['variant']`, `as="a"` prop does not exist yet.

- [ ] **Step 3: Replace `Button.tsx` with the full corrected implementation**

```tsx
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'tertiary'
  | 'link'
  | 'glass'
  | 'glass-dark'
  | 'glass-brand'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonSharedProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
  pill?: boolean
  block?: boolean
  className?: string
  children?: ReactNode
}

type ButtonAsButton = { as?: 'button' } & ButtonSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

type ButtonAsAnchor = { as: 'a' } & ButtonSharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF5100] border border-[#FF5100] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  secondary: 'bg-transparent border border-[#FF5100] text-[#FF5100]',
  outline:
    'bg-[#F7F7F7] border border-[#B6B6B6] text-[#393939] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)] dark:bg-[#1F2937] dark:border-[#374151] dark:text-[#F2F4F7]',
  ghost: 'bg-[#E2E2E2] border-0 text-[#808080] dark:bg-[#374151] dark:text-[#9CA3AF]',
  danger:
    'bg-[#FF4242] border border-[#FF4242] text-[#F7F7F7] shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]',
  tertiary: 'bg-transparent border-0 text-[#D03700] hover:bg-[#FFF1E0] disabled:text-[#9C9C9C]',
  link: 'bg-transparent border-0 text-[#FF5100] underline-offset-4 hover:underline hover:text-[#A31B00] p-0! rounded-none',
  glass:
    'bg-gradient-to-br from-white/55 to-white/25 text-[#A31B00] border border-white/60 backdrop-blur-[12px] shadow-[0_4px_18px_-6px_rgba(16,24,40,0.28)] hover:from-white/70 hover:to-white/40',
  'glass-dark':
    'bg-gradient-to-br from-[rgba(28,27,31,0.55)] to-[rgba(28,27,31,0.32)] text-white border border-white/20 backdrop-blur-[12px] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] hover:from-[rgba(28,27,31,0.66)] hover:to-[rgba(28,27,31,0.46)]',
  'glass-brand':
    'bg-gradient-to-br from-[rgba(255,81,0,0.66)] to-[rgba(255,81,0,0.4)] text-white border border-white/35 backdrop-blur-[12px] shadow-[0_6px_20px_-8px_rgba(208,55,0,0.5)] hover:from-[rgba(255,81,0,0.8)] hover:to-[rgba(255,81,0,0.55)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-[14px] py-[8px] text-[14px] leading-[20px]',
  md: 'px-[16px] py-[10px] text-[14px] leading-[20px]',
  lg: 'px-[18px] py-[10px] text-[16px] leading-[24px]',
  xl: 'px-[24px] py-[14px] text-[16px] leading-[24px]',
}

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'p-[8px] text-[14px] leading-[20px]',
  md: 'p-[10px] text-[14px] leading-[20px]',
  lg: 'p-[10px] text-[16px] leading-[24px]',
  xl: 'p-[14px] text-[16px] leading-[24px]',
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

export function Button(props: ButtonProps) {
  const {
    as = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    iconOnly = false,
    pill = false,
    block = false,
    className,
    children,
    ...rest
  } = props

  const sharedClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
    pill && 'rounded-full',
    block && 'w-full',
    className,
  )

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {!iconOnly && children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  )

  if (as === 'a') {
    const { ...anchorRest } = rest as Omit<ButtonAsAnchor, keyof ButtonSharedProps | 'as'>
    return (
      <a
        className={cn(sharedClassName, loading && 'pointer-events-none')}
        aria-disabled={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const { disabled, ...buttonRest } = rest as Omit<ButtonAsButton, keyof ButtonSharedProps | 'as'>
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={sharedClassName}
      {...buttonRest}
    >
      {content}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Button/Button.test.tsx`
Expected: PASS, including all pre-existing test cases (variant/size/loading/iconLeft/iconRight/iconOnly/disabled behavior unchanged).

- [ ] **Step 5: Add stories**

Append to `src/components/Button/Button.stories.tsx` (match the file's existing `Meta`/`StoryObj` import and `export const` pattern):

```tsx
export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Tertiary' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
}

export const Glass: Story = {
  args: { variant: 'glass', children: 'Glass' },
}

export const GlassDark: Story = {
  args: { variant: 'glass-dark', children: 'Glass dark' },
}

export const GlassBrand: Story = {
  args: { variant: 'glass-brand', children: 'Glass brand' },
}

export const ExtraLarge: Story = {
  args: { size: 'xl', children: 'Extra large' },
}

export const Pill: Story = {
  args: { pill: true, children: 'Pill button' },
}

export const Block: Story = {
  args: { block: true, children: 'Block button' },
}

export const AsLink: Story = {
  args: { as: 'a', href: '#', children: 'As anchor' },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Button`
Expected: all pass, 0 errors.

```bash
git add src/components/Button
git commit -m "feat(Button): add DS variants, xl size, pill, block, polymorphic as prop

BREAKING CHANGE: Button no longer always renders <button> internally when as=\"a\" is passed — disabled semantics change to aria-disabled for the anchor branch."
```

---

## Task 2: Checkbox — tone, card variant, error, size lg

**Files:**
- Modify: `src/components/Checkbox/Checkbox.tsx`
- Modify: `src/components/Checkbox/Checkbox.test.tsx`
- Modify: `src/components/Checkbox/Checkbox.stories.tsx`

**Interfaces:**
- Produces: `CheckboxProps` gains `tone?: 'primary'|'success'|'accent'`, `variant?: 'default'|'card'`, `error?: boolean`, `size` grows to `'sm'|'md'|'lg'`. No other task consumes these.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Checkbox/Checkbox.test.tsx` (inside the existing `describe` block):

```tsx
  it('renders size lg', () => {
    render(<Checkbox size="lg" label="Large" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('size-[32px]')
  })

  it('applies success tone border color when checked', () => {
    render(<Checkbox tone="success" checked label="Success" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-[#1FBA5D]')
  })

  it('applies accent tone border color when checked', () => {
    render(<Checkbox tone="accent" checked label="Accent" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-[#ED2E98]')
  })

  it('renders card variant with a bordered wrapper', () => {
    render(<Checkbox variant="card" label="Card" onChange={() => {}} />)
    expect(screen.getByText('Card').closest('[data-checkbox-card]')).toBeInTheDocument()
  })

  it('renders error state in error color regardless of tone', () => {
    render(<Checkbox error label="Errored" supportingText="Required" onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-[#FF4242]')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Checkbox/Checkbox.test.tsx`
Expected: FAIL — `size="lg"`, `tone`, `variant`, `error` not assignable/found.

- [ ] **Step 3: Replace `Checkbox.tsx` with the full corrected implementation**

```tsx
import { useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'

export type CheckboxTone = 'primary' | 'success' | 'accent'

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: CheckboxTone
  variant?: 'default' | 'card'
  error?: boolean
  id?: string
  name?: string
  value?: string
  className?: string
  'aria-label'?: string
}

const BOX_SIZE = {
  sm: 'size-[16px] rounded-[4px]',
  md: 'size-[24px] rounded-[6px]',
  lg: 'size-[32px] rounded-[8px]',
}

const ICON_INSET = {
  sm: 'inset-[12.5%]',
  md: 'inset-[15%]',
  lg: 'inset-[15%]',
}

const TONE_BORDER: Record<CheckboxTone, string> = {
  primary: 'border-[#FF5100]',
  success: 'border-[#1FBA5D]',
  accent: 'border-[#ED2E98]',
}

const ERROR_BORDER = 'border-[#FF4242]'

const TONE_ICON_COLOR: Record<CheckboxTone, string> = {
  primary: 'text-[#FF5100]',
  success: 'text-[#1FBA5D]',
  accent: 'text-[#ED2E98]',
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
  tone = 'primary',
  variant = 'default',
  error = false,
  id,
  name,
  value,
  className,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const labelId = label ? `${checkboxId}-label` : undefined
  const descId = supportingText ? `${checkboxId}-desc` : undefined
  const isActive = checked || indeterminate
  const activeBorder = error ? ERROR_BORDER : TONE_BORDER[tone]
  const activeIconColor = error ? 'text-[#FF4242]' : TONE_ICON_COLOR[tone]

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

  const box = (
    <span className="flex items-center justify-center pt-[2px] shrink-0">
      <span
        id={checkboxId}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled || undefined}
        aria-label={labelId ? undefined : ariaLabel}
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
            ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed dark:bg-[#374151] dark:border-[#2A3441]'
            : isActive
              ? cn('bg-[#F7F7F7] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]', activeBorder)
              : error
                ? 'bg-[#F7F7F7] border-[#FF4242] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937] dark:border-[#374151]',
        )}
      >
        {isActive && (
          <span className={cn('absolute', ICON_INSET[size], disabled ? 'text-[#CFCFCF] dark:text-[#4B5563]' : activeIconColor)}>
            {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {name && <input type="checkbox" name={name} value={value} checked={checked} readOnly className="hidden" />}
    </span>
  )

  const textBlock = (label || supportingText) && (
    <span className="flex flex-col gap-[2px] flex-1 min-w-0">
      {label && (
        <span
          id={labelId}
          onClick={toggle}
          className={cn(
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none dark:text-[#F2F4F7]",
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
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px]",
            error ? 'text-[#FF4242]' : 'text-[#808080] dark:text-[#9CA3AF]',
          )}
        >
          {supportingText}
        </p>
      )}
    </span>
  )

  if (variant === 'card') {
    return (
      <div
        data-checkbox-card
        className={cn(
          'flex items-start gap-[12px] rounded-[12px] border p-[16px] transition-colors',
          isActive ? cn('bg-[#F7F7F7] dark:bg-[#1F2937]', activeBorder) : 'border-[#E2E2E2] dark:border-[#374151]',
          className,
        )}
      >
        {box}
        {textBlock}
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      {box}
      {textBlock}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Checkbox/Checkbox.test.tsx`
Expected: PASS, including every pre-existing test case.

- [ ] **Step 5: Add stories**

Append to `src/components/Checkbox/Checkbox.stories.tsx`:

```tsx
export const Large: Story = {
  args: { size: 'lg', label: 'Large checkbox', checked: true },
}

export const ToneSuccess: Story = {
  args: { tone: 'success', label: 'Success tone', checked: true },
}

export const ToneAccent: Story = {
  args: { tone: 'accent', label: 'Accent tone', checked: true },
}

export const CardVariant: Story = {
  args: { variant: 'card', label: 'Card checkbox', supportingText: 'Tile-style selectable card' },
}

export const ErrorState: Story = {
  args: { error: true, label: 'Errored checkbox', supportingText: 'This field is required' },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Checkbox`
Expected: all pass.

```bash
git add src/components/Checkbox
git commit -m "feat(Checkbox): add tone, card variant, error state, size lg"
```

---

## Task 3: Radio — tone, card variant, error, size lg

**Files:**
- Modify: `src/components/Radio/Radio.tsx`
- Modify: `src/components/Radio/Radio.test.tsx`
- Modify: `src/components/Radio/Radio.stories.tsx`

**Interfaces:**
- Produces: `RadioProps` gains `tone?: 'primary'|'success'|'accent'`, `variant?: 'default'|'card'`, `error?: boolean`, `size` grows to `'sm'|'md'|'lg'`. Mirrors Task 2's `CheckboxTone` values but is a separate local type (`RadioTone`) — Radio and Checkbox do not share a type import.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Radio/Radio.test.tsx`:

```tsx
  it('renders size lg', () => {
    render(<Radio value="a" size="lg" label="Large" checked onSelect={() => {}} />)
    expect(screen.getByRole('radio')).toHaveClass('size-[32px]')
  })

  it('applies success tone border color when checked', () => {
    render(<Radio value="a" tone="success" checked label="Success" onSelect={() => {}} />)
    expect(screen.getByRole('radio')).toHaveClass('border-[#1FBA5D]')
  })

  it('applies accent tone border color when checked', () => {
    render(<Radio value="a" tone="accent" checked label="Accent" onSelect={() => {}} />)
    expect(screen.getByRole('radio')).toHaveClass('border-[#ED2E98]')
  })

  it('renders card variant with a bordered wrapper', () => {
    render(<Radio value="a" variant="card" label="Card" onSelect={() => {}} />)
    expect(screen.getByText('Card').closest('[data-radio-card]')).toBeInTheDocument()
  })

  it('renders error state in error color regardless of tone', () => {
    render(<Radio value="a" error label="Errored" supportingText="Required" onSelect={() => {}} />)
    expect(screen.getByRole('radio')).toHaveClass('border-[#FF4242]')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Radio/Radio.test.tsx`
Expected: FAIL — new props not found.

- [ ] **Step 3: Replace `Radio.tsx` with the full corrected implementation**

```tsx
import { cn } from '../../utils/cn'

export type RadioTone = 'primary' | 'success' | 'accent'

export interface RadioProps {
  value: string
  checked?: boolean
  disabled?: boolean
  label?: string
  supportingText?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: RadioTone
  variant?: 'default' | 'card'
  error?: boolean
  id?: string
  name?: string
  tabIndex?: number
  onSelect?: (value: string) => void
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px]',
  md: 'size-[24px]',
  lg: 'size-[32px]',
}

const DOT_SIZE = {
  sm: 'size-[8px]',
  md: 'size-[12px]',
  lg: 'size-[16px]',
}

const TONE_BORDER: Record<RadioTone, string> = {
  primary: 'border-[#FF5100]',
  success: 'border-[#1FBA5D]',
  accent: 'border-[#ED2E98]',
}

const TONE_DOT: Record<RadioTone, string> = {
  primary: 'bg-[#FF5100]',
  success: 'bg-[#1FBA5D]',
  accent: 'bg-[#ED2E98]',
}

export function Radio({
  value,
  checked = false,
  disabled,
  label,
  supportingText,
  size = 'md',
  tone = 'primary',
  variant = 'default',
  error = false,
  id,
  name,
  tabIndex = 0,
  onSelect,
  className,
}: RadioProps) {
  const labelId = label ? `${id}-label` : undefined
  const descId = supportingText ? `${id}-desc` : undefined
  const activeBorder = error ? 'border-[#FF4242]' : TONE_BORDER[tone]
  const activeDot = error ? 'bg-[#FF4242]' : TONE_DOT[tone]

  function select() {
    if (disabled) return
    onSelect?.(value)
  }

  const circle = (
    <span className="flex items-center justify-center pt-[2px] shrink-0">
      <span
        id={id}
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={select}
        data-value={value}
        data-radio-name={name}
        className={cn(
          'relative flex items-center justify-center rounded-full border outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
          BOX_SIZE[size],
          disabled
            ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed dark:bg-[#374151] dark:border-[#2A3441]'
            : checked
              ? cn('bg-[#F7F7F7] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]', activeBorder)
              : error
                ? 'bg-[#F7F7F7] border-[#FF4242] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937]'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-[#1F2937] dark:border-[#374151]',
        )}
      >
        {checked && (
          <span className={cn('rounded-full', DOT_SIZE[size], disabled ? 'bg-[#CFCFCF] dark:bg-[#4B5563]' : activeDot)} />
        )}
      </span>
    </span>
  )

  const textBlock = (label || supportingText) && (
    <span className="flex flex-col gap-[2px] flex-1 min-w-0">
      {label && (
        <span
          id={labelId}
          onClick={select}
          className={cn(
            "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none dark:text-[#F2F4F7]",
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            checked ? 'font-medium' : 'font-normal',
          )}
        >
          {label}
        </span>
      )}
      {supportingText && (
        <p
          id={descId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px]",
            error ? 'text-[#FF4242]' : 'text-[#808080] dark:text-[#9CA3AF]',
          )}
        >
          {supportingText}
        </p>
      )}
    </span>
  )

  if (variant === 'card') {
    return (
      <div
        data-radio-card
        className={cn(
          'flex items-start gap-[12px] rounded-[12px] border p-[16px] transition-colors',
          checked ? cn('bg-[#F7F7F7] dark:bg-[#1F2937]', activeBorder) : 'border-[#E2E2E2] dark:border-[#374151]',
          className,
        )}
      >
        {circle}
        {textBlock}
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      {circle}
      {textBlock}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Radio/Radio.test.tsx`
Expected: PASS, including every pre-existing test case.

- [ ] **Step 5: Add stories**

Append to `src/components/Radio/Radio.stories.tsx`:

```tsx
export const Large: Story = {
  args: { value: 'a', size: 'lg', label: 'Large radio', checked: true },
}

export const ToneSuccess: Story = {
  args: { value: 'a', tone: 'success', label: 'Success tone', checked: true },
}

export const ToneAccent: Story = {
  args: { value: 'a', tone: 'accent', label: 'Accent tone', checked: true },
}

export const CardVariant: Story = {
  args: { value: 'a', variant: 'card', label: 'Card radio', supportingText: 'Tile-style selectable card' },
}

export const ErrorState: Story = {
  args: { value: 'a', error: true, label: 'Errored radio', supportingText: 'This field is required' },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Radio`
Expected: all pass.

```bash
git add src/components/Radio
git commit -m "feat(Radio): add tone, card variant, error state, size lg"
```

---

## Task 4: Select — document the `onChange` value-callback contract

**Files:**
- Modify: `src/components/Select/Select.tsx`

**Interfaces:**
- No prop/type change. This task only adds a doc comment; no other task depends on it.

- [ ] **Step 1: Add the clarifying JSDoc comment**

In `src/components/Select/Select.tsx`, change the `onChange` line in `SelectProps` from:

```tsx
  onChange?: (value: string) => void
```

to:

```tsx
  /**
   * Called with the newly selected option's value. This is a value
   * callback, not a native change event handler — Select is an ARIA
   * combobox widget, not a wrapped <select>, so there is no ChangeEvent
   * to forward.
   */
  onChange?: (value: string) => void
```

- [ ] **Step 2: Verify no behavior changed**

Run: `pnpm vitest run src/components/Select/Select.test.tsx`
Expected: PASS — every existing test still passes unchanged (this task is doc-only).

- [ ] **Step 3: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all pass.

```bash
git add src/components/Select/Select.tsx
git commit -m "docs(Select): clarify onChange is a value callback, not a native change event"
```

---

## Task 5: Avatar & AvatarGroup — size 2xl, status/alt/shape/icon/ring, children-based group

**Files:**
- Modify: `src/components/Avatar/Avatar.tsx`
- Modify: `src/components/Avatar/Avatar.test.tsx`
- Modify: `src/components/Avatar/Avatar.stories.tsx`

**Interfaces:**
- Produces: `AvatarProps = AvatarBaseProps & { src?: string; alt?: string }` (no longer a discriminated union), `AvatarSize` grows to include `'2xl'`, `status?: boolean | 'online' | 'offline' | 'away'`, new `shape?: 'circle'|'rounded'|'square'`, new `icon?: ReactNode`, new `ring?: boolean`. `AvatarGroupProps` changes from `{ avatars: AvatarGroupItem[] }` to `{ children: ReactNode }`; `AvatarGroupItem` type is removed. Task 12 does not reference Avatar/AvatarGroup (no consumer usage found in `example/`), so no downstream update is needed for this task.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Avatar/Avatar.test.tsx` (check the file's existing imports first — it likely imports both `Avatar` and `AvatarGroup` from `./Avatar` or `./index`; match that import style):

```tsx
  it('renders size 2xl', () => {
    render(<Avatar name="Jane Doe" size="2xl" />)
    expect(screen.getByText('JD').parentElement).toHaveClass('size-[72px]')
  })

  it('accepts a boolean status and renders a plain indicator', () => {
    render(<Avatar name="Jane Doe" status />)
    expect(screen.getByLabelText('status indicator')).toBeInTheDocument()
  })

  it('does not require alt when src is provided', () => {
    render(<Avatar src="/a.png" name="Jane Doe" />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Jane Doe')
  })

  it('renders shape square', () => {
    render(<Avatar name="Jane Doe" shape="square" />)
    expect(screen.getByText('JD').parentElement).toHaveClass('rounded-none')
  })

  it('renders a custom fallback icon when provided and there is no name', () => {
    render(<Avatar icon={<span data-testid="custom-icon" />} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies ring classes when ring is true', () => {
    render(<Avatar name="Jane Doe" ring />)
    expect(screen.getByText('JD').parentElement).toHaveClass('ring-2')
  })
})

describe('AvatarGroup', () => {
  it('renders Avatar children and forwards size to each', () => {
    render(
      <AvatarGroup size="sm">
        <Avatar name="Ann Lee" />
        <Avatar name="Bo Kim" />
      </AvatarGroup>,
    )
    expect(screen.getByText('AL').parentElement).toHaveClass('size-[28px]')
    expect(screen.getByText('BK').parentElement).toHaveClass('size-[28px]')
  })

  it('shows an overflow count beyond max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ann Lee" />
        <Avatar name="Bo Kim" />
        <Avatar name="Cy Ora" />
      </AvatarGroup>,
    )
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Avatar/Avatar.test.tsx`
Expected: FAIL — `size="2xl"`, boolean `status`, missing `alt`, `shape`, `icon`, `ring`, and `AvatarGroup` `children` prop all fail to compile/assert.

- [ ] **Step 3: Replace `Avatar.tsx` with the full corrected implementation**

```tsx
import { useState, Children, cloneElement, isValidElement, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarStatus = boolean | 'online' | 'offline' | 'away'
export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  shape?: AvatarShape
  icon?: ReactNode
  ring?: boolean
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[20px] text-[10px]',
  sm: 'size-[28px] text-[12px]',
  md: 'size-[36px] text-[14px]',
  lg: 'size-[48px] text-[16px]',
  xl: 'size-[64px] text-[20px]',
  '2xl': 'size-[72px] text-[24px]',
}

const STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[6px]',
  sm: 'size-[8px]',
  md: 'size-[10px]',
  lg: 'size-[12px]',
  xl: 'size-[14px]',
  '2xl': 'size-[16px]',
}

const STATUS_COLOR_CLASSES: Record<'online' | 'offline' | 'away', string> = {
  online: 'bg-[#12B76A]',
  offline: 'bg-[#98A2B3]',
  away: 'bg-[#F79009]',
}

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-[12px]',
  square: 'rounded-none',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
}

function FallbackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[60%]" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" fill="currentColor" />
    </svg>
  )
}

export function Avatar({ src, alt, name, size = 'md', status, shape = 'circle', icon, ring = false, className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const initials = name ? getInitials(name) : ''
  const showImage = Boolean(src) && !imageError
  const resolvedAlt = alt ?? name ?? ''
  const statusKind = typeof status === 'string' ? status : status === true ? 'online' : undefined

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden bg-[#FFD4BF] font-medium text-[#B42318] select-none',
          SIZE_CLASSES[size],
          SHAPE_CLASSES[shape],
          ring && 'ring-2 ring-white dark:ring-[#151B2C]',
        )}
      >
        {showImage ? (
          <img src={src} alt={resolvedAlt} className="size-full object-cover" onError={() => setImageError(true)} />
        ) : initials ? (
          <span>{initials}</span>
        ) : icon ? (
          icon
        ) : (
          <FallbackIcon />
        )}
      </span>
      {statusKind && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#151B2C]',
            STATUS_SIZE_CLASSES[size],
            STATUS_COLOR_CLASSES[statusKind],
          )}
          aria-label={typeof status === 'string' ? `status: ${status}` : 'status indicator'}
          role="img"
        />
      )}
    </span>
  )
}

export interface AvatarGroupProps {
  children: ReactNode
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ children, max, size = 'md', className }: AvatarGroupProps) {
  const items = Children.toArray(children)
  const visible = max ? items.slice(0, max) : items
  const overflow = max && items.length > max ? items.length - max : 0

  return (
    <div className={cn('flex items-center -space-x-[8px]', className)}>
      {visible.map((child, index) =>
        isValidElement<AvatarProps>(child)
          ? cloneElement(child, { key: index, size, ring: true })
          : child,
      )}
      {overflow > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-[#F2F4F7] font-medium text-[#344054] ring-2 ring-white dark:bg-[#1F2937] dark:text-[#D0D5DD] dark:ring-[#151B2C]',
            SIZE_CLASSES[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Avatar/Avatar.test.tsx`
Expected: PASS, including every pre-existing test case (rewrite any pre-existing `AvatarGroup` test that used the old `avatars` array prop to use `children` instead — read the current test file and update those specific cases to pass `<Avatar>` children).

- [ ] **Step 5: Add / update stories**

Update `src/components/Avatar/Avatar.stories.tsx`: find any existing `AvatarGroup` story using `avatars={[...]}` and rewrite it to pass `<Avatar>` children instead, e.g.:

```tsx
export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Ann Lee" />
      <Avatar name="Bo Kim" />
      <Avatar name="Cy Ora" />
      <Avatar name="Dee Wu" />
    </AvatarGroup>
  ),
}
```

Then append:

```tsx
export const ExtraLarge2xl: Story = {
  args: { name: 'Jane Doe', size: '2xl' },
}

export const BooleanStatus: Story = {
  args: { name: 'Jane Doe', status: true },
}

export const ShapeSquare: Story = {
  args: { name: 'Jane Doe', shape: 'square' },
}

export const ShapeRounded: Story = {
  args: { name: 'Jane Doe', shape: 'rounded' },
}

export const CustomFallbackIcon: Story = {
  args: { icon: <span>👤</span> },
}

export const WithRing: Story = {
  args: { name: 'Jane Doe', ring: true },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Avatar`
Expected: all pass.

```bash
git add src/components/Avatar
git commit -m "feat(Avatar): add size 2xl, boolean status, optional alt, shape, icon fallback, ring; AvatarGroup takes children

BREAKING CHANGE: AvatarGroup no longer accepts an avatars array — pass <Avatar> elements as children instead. Avatar.alt is no longer required when src is set (falls back to name). Avatar.status is now boolean | 'online' | 'offline' | 'away' instead of a closed enum."
```

---

## Task 6: Modal — present (responsive sheet), tone, icon badge, align

**Files:**
- Modify: `src/components/Modal/Modal.tsx`
- Modify: `src/components/Modal/Modal.test.tsx`
- Modify: `src/components/Modal/Modal.stories.tsx`

**Interfaces:**
- Produces: `ModalProps.title` type changes from `string` to `ReactNode`; new `present?: 'auto'|'center'|'sheet'`, `tone?: 'default'|'success'|'error'|'warning'|'info'`, `icon?: ReactNode`, `align?: 'start'|'center'`. No other task consumes `ModalProps`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Modal/Modal.test.tsx`:

```tsx
  it('renders sheet layout classes when present="sheet"', () => {
    render(
      <Modal open onClose={() => {}} present="sheet" title="Sheet">
        Body
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('rounded-b-none')
  })

  it('renders centered layout classes when present="center"', () => {
    render(
      <Modal open onClose={() => {}} present="center" title="Centered">
        Body
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('top-1/2')
    expect(dialog).not.toHaveClass('rounded-b-none')
  })

  it('renders a tone badge with the icon when tone is set', () => {
    render(
      <Modal open onClose={() => {}} tone="success" icon={<span data-testid="tone-icon" />} title="Success">
        Body
      </Modal>,
    )
    expect(screen.getByTestId('tone-icon')).toBeInTheDocument()
  })

  it('accepts ReactNode as title', () => {
    render(
      <Modal open onClose={() => {}} title={<span data-testid="rich-title">Rich</span>}>
        Body
      </Modal>,
    )
    expect(screen.getByTestId('rich-title')).toBeInTheDocument()
  })

  it('center-aligns title and body when align="center"', () => {
    render(
      <Modal open onClose={() => {}} align="center" title="Centered align">
        Body
      </Modal>,
    )
    expect(screen.getByText('Centered align')).toHaveClass('text-center')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Modal/Modal.test.tsx`
Expected: FAIL — `present`, `tone`, `icon`, `align` props not found; `title` as `ReactNode` not accepted by the current `string` type.

- [ ] **Step 3: Replace `Modal.tsx` with the full corrected implementation**

```tsx
import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalPresent = 'auto' | 'center' | 'sheet'
export type ModalTone = 'default' | 'success' | 'error' | 'warning' | 'info'
export type ModalAlign = 'start' | 'center'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: string
  footer?: ReactNode
  size?: ModalSize
  present?: ModalPresent
  tone?: ModalTone
  icon?: ReactNode
  align?: ModalAlign
  closeOnOverlayClick?: boolean
  children?: ReactNode
  className?: string
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[960px]',
  full: 'max-w-[calc(100vw-32px)] h-[calc(100vh-32px)]',
}

const TONE_BADGE_CLASSES: Record<Exclude<ModalTone, 'default'>, string> = {
  success: 'bg-[#E3F6EF] text-[#1FBA5D]',
  error: 'bg-[#FFEDE7] text-[#FF4242]',
  warning: 'bg-[#FEF8E9] text-[#CE7734]',
  info: 'bg-[#F3E9FC] text-[#7F56D9]',
}

const CENTER_LAYOUT =
  'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[12px] max-h-[calc(100vh-32px)]'

const SHEET_LAYOUT =
  'left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-[16px] rounded-b-none max-h-[92vh] w-full max-w-full'

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  present = 'auto',
  tone = 'default',
  icon,
  align = 'center',
  closeOnOverlayClick = true,
  children,
  className,
}: ModalProps) {
  const layoutClasses =
    present === 'sheet'
      ? SHEET_LAYOUT
      : present === 'center'
        ? CENTER_LAYOUT
        : cn(
            'left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-[16px] rounded-b-none max-h-[92vh] w-full max-w-full',
            'sm:left-1/2 sm:top-1/2 sm:right-auto sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[12px] sm:rounded-t-[12px] sm:max-h-[calc(100vh-32px)] sm:w-full',
          )

  const showBadge = tone !== 'default' || Boolean(icon)
  const badgeClasses = tone !== 'default' ? TONE_BADGE_CLASSES[tone] : 'bg-[#F9FAFB] text-[#475467]'

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200',
            'data-[state=closed]:opacity-0',
          )}
        />
        <Dialog.Content
          onPointerDownOutside={(event) => {
            if (!closeOnOverlayClick) event.preventDefault()
          }}
          onInteractOutside={(event) => {
            if (!closeOnOverlayClick) event.preventDefault()
          }}
          className={cn(
            'fixed z-[101] flex w-full flex-col',
            'bg-white p-[24px] shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)] outline-none',
            'dark:bg-[#151B2C]',
            'transition-opacity duration-200 data-[state=closed]:opacity-0',
            layoutClasses,
            present !== 'sheet' && SIZE_CLASSES[size],
            className,
          )}
        >
          {(title || showBadge) && (
            <div className={cn('flex items-center gap-[12px]', align === 'center' && 'flex-col justify-center text-center')}>
              {showBadge && (
                <span className={cn('flex size-[36px] shrink-0 items-center justify-center rounded-full', badgeClasses)}>
                  {icon}
                </span>
              )}
              {title ? (
                <Dialog.Title
                  className={cn(
                    'flex-1 text-[18px] font-medium leading-[24px] pr-[32px] text-[#101828] dark:text-white',
                    align === 'center' && 'flex-none text-center pr-0',
                  )}
                >
                  {title}
                </Dialog.Title>
              ) : (
                <Dialog.Title className="sr-only">Modal</Dialog.Title>
              )}
            </div>
          )}
          {!title && !showBadge && <Dialog.Title className="sr-only">Modal</Dialog.Title>}
          {description && (
            <Dialog.Description
              className={cn(
                'mt-[4px] text-[14px] leading-[20px] text-[#667085] dark:text-[#98A2B3]',
                align === 'center' && 'text-center',
              )}
            >
              {description}
            </Dialog.Description>
          )}
          <div className="mt-[16px] flex-1 overflow-y-auto text-[#101828] dark:text-white">{children}</div>
          {footer && <div className="mt-[24px] flex justify-end gap-[8px]">{footer}</div>}
          <Dialog.Close
            aria-label="Fechar modal"
            className={cn(
              'absolute right-[16px] top-[16px] inline-flex size-[24px] items-center justify-center rounded-full outline-none',
              'text-[#101828] hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
              'dark:text-white',
            )}
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

Note: `layoutClasses`'s `auto` branch above uses a static literal Tailwind class string (not a dynamically built template) — Tailwind's JIT compiler only detects literal class names, so the `sm:` responsive variants must be written out verbatim as shown, never composed at runtime from another constant.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Modal/Modal.test.tsx`
Expected: PASS, including every pre-existing test case.

- [ ] **Step 5: Add stories**

Append to `src/components/Modal/Modal.stories.tsx` (each needs local `open` state via `useState` — match the existing file's pattern for interactive stories, likely a `render` function with `useState`):

```tsx
export const SheetPresent: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onClose={() => setOpen(false)} present="sheet" title="Sheet modal">
        Always renders as a bottom sheet, regardless of viewport width.
      </Modal>
    )
  },
}

export const CenterPresent: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onClose={() => setOpen(false)} present="center" title="Centered modal">
        Always renders centered, regardless of viewport width.
      </Modal>
    )
  },
}

export const WithTone: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        tone="success"
        icon={<span>✓</span>}
        title="Payment confirmed"
        align="center"
      >
        Your payment was processed successfully.
      </Modal>
    )
  },
}
```

Add `import { useState } from 'react'` to the top of the stories file if it is not already imported.

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Modal`
Expected: all pass.

```bash
git add src/components/Modal
git commit -m "feat(Modal): add present (responsive sheet), tone badge, icon, align

BREAKING CHANGE: Modal.title type changes from string to ReactNode."
```

---

## Task 7: Tabs — optional content, icon, count, enclosed variant, size, block

**Files:**
- Modify: `src/components/Tabs/Tabs.tsx`
- Modify: `src/components/Tabs/Tabs.test.tsx`
- Modify: `src/components/Tabs/Tabs.stories.tsx`

**Interfaces:**
- Produces: `TabItem.content` becomes optional; new `TabItem.icon?: ReactNode`, `TabItem.count?: number`; `TabsVariant` grows to include `'enclosed'`; new `TabsProps.size?: 'sm'|'md'|'lg'`, `TabsProps.block?: boolean`. No other task consumes `TabItem`/`TabsProps`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Tabs/Tabs.test.tsx`:

```tsx
  it('renders without a content panel when every item omits content', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    )
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
  })

  it('still renders a content panel for items that provide content', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'A', content: 'Panel A' },
          { value: 'b', label: 'B', content: 'Panel B' },
        ]}
      />,
    )
    expect(screen.getByText('Panel A')).toBeInTheDocument()
  })

  it('renders item icon and count', () => {
    render(
      <Tabs
        items={[
          { value: 'a', label: 'Inbox', icon: <span data-testid="tab-icon" />, count: 3, content: 'x' },
        ]}
      />,
    )
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders enclosed variant', () => {
    render(
      <Tabs variant="enclosed" items={[{ value: 'a', label: 'A', content: 'x' }]} />,
    )
    expect(screen.getByRole('tab')).toHaveClass('rounded-full')
  })

  it('renders size lg', () => {
    render(<Tabs size="lg" items={[{ value: 'a', label: 'A', content: 'x' }]} />)
    expect(screen.getByRole('tab')).toHaveClass('text-[16px]')
  })

  it('renders block layout with equal-width triggers', () => {
    render(<Tabs block items={[{ value: 'a', label: 'A', content: 'x' }]} />)
    expect(screen.getByRole('tab')).toHaveClass('flex-1')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Tabs/Tabs.test.tsx`
Expected: FAIL — omitting `content` fails the current required-field type, `icon`/`count`/`size`/`block`/`variant="enclosed"` not found.

- [ ] **Step 3: Replace `Tabs.tsx` with the full corrected implementation**

```tsx
import * as RadixTabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TabsVariant = 'line' | 'filled' | 'enclosed'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsSize = 'sm' | 'md' | 'lg'

export interface TabItem {
  value: string
  label: ReactNode
  content?: ReactNode
  icon?: ReactNode
  count?: number
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  variant?: TabsVariant
  size?: TabsSize
  orientation?: TabsOrientation
  block?: boolean
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

const LIST_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: 'gap-[24px] border-b border-[#EAECF0] dark:border-[#1F2937]',
  filled: 'gap-[4px] rounded-[10px] bg-[#F2F4F7] p-[4px] dark:bg-[#1F2937]',
  enclosed: 'gap-[8px]',
}

const TRIGGER_VARIANT_CLASSES: Record<TabsVariant, string> = {
  line: cn(
    'px-[4px] py-[10px] font-medium text-[#667085] border-b-2 border-transparent -mb-px',
    'data-[state=active]:text-[#FF5100] data-[state=active]:border-[#FF5100]',
    'dark:text-[#98A2B3]',
  ),
  filled: cn(
    'rounded-[8px] px-[12px] py-[6px] font-medium text-[#667085]',
    'data-[state=active]:bg-white data-[state=active]:text-[#101828] data-[state=active]:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]',
    'dark:text-[#98A2B3] dark:data-[state=active]:bg-[#151B2C] dark:data-[state=active]:text-white',
  ),
  enclosed: cn(
    'rounded-full px-[16px] py-[8px] font-medium text-[#667085] border border-[#D0D5DD] bg-white',
    'hover:bg-[#F9FAFB]',
    'data-[state=active]:bg-[#FF5100] data-[state=active]:border-[#FF5100] data-[state=active]:text-white',
    'dark:bg-[#151B2C] dark:text-[#98A2B3] dark:border-[#374151]',
  ),
}

const SIZE_CLASSES: Record<TabsSize, string> = {
  sm: 'text-[13px]',
  md: 'text-[14px]',
  lg: 'text-[16px]',
}

const COUNT_BADGE_CLASSES =
  'inline-flex items-center justify-center rounded-full bg-[#F2F4F7] px-[7px] text-[11px] font-bold text-[#667085] dark:bg-[#374151] dark:text-[#98A2B3]'

export function Tabs({
  items,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  block = false,
  defaultValue,
  value,
  onChange,
  className,
}: TabsProps) {
  const hasAnyContent = items.some((item) => item.content !== undefined)

  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onChange}
      orientation={orientation}
      className={cn('flex', orientation === 'vertical' ? 'flex-row gap-[24px]' : 'flex-col', className)}
    >
      <RadixTabs.List
        className={cn(
          'flex outline-none',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          block && orientation === 'horizontal' && 'w-full',
          LIST_VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
        )}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              'inline-flex items-center gap-[6px]',
              'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
              TRIGGER_VARIANT_CLASSES[variant],
              block && orientation === 'horizontal' && 'flex-1 justify-center',
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
            {item.count !== undefined && <span className={COUNT_BADGE_CLASSES}>{item.count}</span>}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {hasAnyContent &&
        items
          .filter((item) => item.content !== undefined)
          .map((item) => (
            <RadixTabs.Content
              key={item.value}
              value={item.value}
              className={cn('outline-none flex-1', orientation === 'horizontal' && 'mt-[16px]')}
            >
              {item.content}
            </RadixTabs.Content>
          ))}
    </RadixTabs.Root>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Tabs/Tabs.test.tsx`
Expected: PASS, including every pre-existing test case.

- [ ] **Step 5: Add stories**

Append to `src/components/Tabs/Tabs.stories.tsx`:

```tsx
export const TabBarOnly: Story = {
  args: {
    items: [
      { value: 'a', label: 'Overview' },
      { value: 'b', label: 'Details' },
      { value: 'c', label: 'History' },
    ],
  },
}

export const WithIconsAndCounts: Story = {
  args: {
    items: [
      { value: 'inbox', label: 'Inbox', icon: <span>📥</span>, count: 4, content: 'Inbox content' },
      { value: 'sent', label: 'Sent', icon: <span>📤</span>, content: 'Sent content' },
    ],
  },
}

export const Enclosed: Story = {
  args: {
    variant: 'enclosed',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}

export const Block: Story = {
  args: {
    block: true,
    items: [
      { value: 'a', label: 'Overview', content: 'Overview content' },
      { value: 'b', label: 'Details', content: 'Details content' },
    ],
  },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Tabs`
Expected: all pass.

```bash
git add src/components/Tabs
git commit -m "feat(Tabs): make content optional, add icon, count, enclosed variant, size, block

BREAKING CHANGE: TabItem.content is now optional — Tabs with no item content renders no tabpanel at all (pure tab-bar mode), matching the DS. Existing callers that always pass content are unaffected."
```

---

## Task 8: Badge — DS variant set, dot, ...rest spread

**Files:**
- Modify: `src/components/Badge/Badge.tsx`
- Modify: `src/components/Badge/Badge.test.tsx`
- Modify: `src/components/Badge/Badge.stories.tsx`

**Interfaces:**
- Produces: `BadgeProps.variant` changes from `'default'|'success'|'warning'|'error'|'info'` to `'neutral'|'primary'|'accent'|'success'|'warning'|'error'|'solid'|'info'`; new `dot?: boolean`; `BadgeProps` extends `HTMLAttributes<HTMLSpanElement>` and spreads `...rest`. No other task consumes `BadgeProps`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Badge/Badge.test.tsx`:

```tsx
  it('renders the neutral variant (replaces the old default variant)', () => {
    render(<Badge variant="neutral">Neutral</Badge>)
    expect(screen.getByText('Neutral')).toHaveClass('bg-[#F2F4F7]')
  })

  it('renders the primary variant (purple)', () => {
    render(<Badge variant="primary">Primary</Badge>)
    expect(screen.getByText('Primary')).toHaveClass('bg-[#F3E9FC]')
  })

  it('renders the accent variant (orange)', () => {
    render(<Badge variant="accent">Accent</Badge>)
    expect(screen.getByText('Accent')).toHaveClass('bg-[#FFF1E0]')
  })

  it('renders the solid variant', () => {
    render(<Badge variant="solid">Solid</Badge>)
    expect(screen.getByText('Solid')).toHaveClass('bg-[#7F56D9]')
  })

  it('renders a status dot when dot is true', () => {
    const { container } = render(<Badge dot>With dot</Badge>)
    expect(container.querySelector('[data-badge-dot]')).toBeInTheDocument()
  })

  it('spreads extra HTML attributes onto the root element', () => {
    render(<Badge data-testid="custom-badge" onClick={() => {}}>Clickable</Badge>)
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Badge/Badge.test.tsx`
Expected: FAIL — `variant="neutral"`/`"primary"`/`"accent"`/`"solid"` not assignable, `dot` not found, `data-testid`/`onClick` not accepted.

- [ ] **Step 3: Replace `Badge.tsx` with the full corrected implementation**

```tsx
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'solid' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
  icon?: ReactNode
  dot?: boolean
  className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-[#F2F4F7] text-[#344054] dark:bg-[#374151] dark:text-[#D1D5DB]',
  primary: 'bg-[#F3E9FC] text-[#461FAE]',
  accent: 'bg-[#FFF1E0] text-[#A31B00]',
  success: 'bg-[#D4F4DD] text-[#166534]',
  warning: 'bg-[#FEF3C7] text-[#92400E]',
  error: 'bg-[#FFE1E1] text-[#B42318]',
  solid: 'bg-[#7F56D9] text-white',
  info: 'bg-[#DBEAFE] text-[#1E40AF]',
}

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-[8px] py-[2px] text-[12px] leading-[16px] gap-[4px]',
  md: 'px-[10px] py-[4px] text-[14px] leading-[20px] gap-[6px]',
}

const REMOVE_ICON_SIZE: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'size-[12px]',
  md: 'size-[14px]',
}

const DOT_SIZE: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'size-[5px]',
  md: 'size-[6px]',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  removable = false,
  onRemove,
  icon,
  dot = false,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {dot && <span data-badge-dot className={cn('shrink-0 rounded-full bg-current', DOT_SIZE[size])} aria-hidden="true" />}
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${typeof children === 'string' ? children : 'tag'}`}
          className={cn(
            'shrink-0 inline-flex items-center justify-center rounded-full outline-none',
            'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
            REMOVE_ICON_SIZE[size],
          )}
        >
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
```

Note: any pre-existing test/story asserting the old `'default'` variant's class must be updated to `variant="neutral"` — there is no `'default'` value anymore.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Badge/Badge.test.tsx`
Expected: PASS. Update any pre-existing test that used `variant="default"` (now `"neutral"`) or asserted the old `default` background color (`#E8E8E8` → `#F2F4F7`).

- [ ] **Step 5: Add stories**

In `src/components/Badge/Badge.stories.tsx`, rename any existing `Default`-variant story to use `variant="neutral"` instead of `variant="default"` (or remove `variant` entirely to rely on the new default), then append:

```tsx
export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
}

export const Accent: Story = {
  args: { variant: 'accent', children: 'Accent' },
}

export const Solid: Story = {
  args: { variant: 'solid', children: 'Solid' },
}

export const WithDot: Story = {
  args: { dot: true, variant: 'success', children: 'Active' },
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Badge`
Expected: all pass.

```bash
git add src/components/Badge
git commit -m "feat(Badge): DS-aligned variant set, dot indicator, HTML attribute spread

BREAKING CHANGE: Badge variant 'default' is renamed to 'neutral'. New variants 'primary', 'accent', 'solid' added."
```

---

## Task 9: Spinner — numeric size, thickness, default label, new Dots component

**Files:**
- Modify: `src/components/Spinner/Spinner.tsx`
- Modify: `src/components/Spinner/Spinner.test.tsx`
- Modify: `src/components/Spinner/Spinner.stories.tsx`
- Modify: `src/components/Spinner/index.ts`

**Interfaces:**
- Produces: `SpinnerProps.size` becomes `number | 'sm'|'md'|'lg'`; new `thickness?: number`; `label` gets default `'Carregando'` (no longer required); new exported `Dots` component with `DotsProps`. No other task consumes these.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Spinner/Spinner.test.tsx` (add `Dots` to the existing import from `./Spinner`):

```tsx
  it('renders without a label prop using the default', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando')
  })

  it('accepts a numeric size in pixels', () => {
    render(<Spinner size={40} label="Loading" />)
    const el = screen.getByRole('status')
    expect(el).toHaveStyle({ width: '40px', height: '40px' })
  })

  it('accepts a thickness override', () => {
    render(<Spinner thickness={6} label="Loading" />)
    expect(screen.getByRole('status')).toHaveStyle({ borderWidth: '6px' })
  })
})

describe('Dots', () => {
  it('renders three dots with staggered animation delays', () => {
    const { container } = render(<Dots />)
    const dots = container.querySelectorAll('[data-dot]')
    expect(dots).toHaveLength(3)
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' })
    expect(dots[1]).toHaveStyle({ animationDelay: '150ms' })
    expect(dots[2]).toHaveStyle({ animationDelay: '300ms' })
  })

  it('has an accessible status role and label', () => {
    render(<Dots />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando')
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Spinner/Spinner.test.tsx`
Expected: FAIL — `<Spinner />` with no `label` fails to compile (required prop), `size={40}` not assignable, `thickness` not found, `Dots` does not exist.

- [ ] **Step 3: Replace `Spinner.tsx` with the full corrected implementation**

```tsx
import { type HTMLAttributes, type CSSProperties } from 'react'
import { cn } from '../../utils/cn'

export type SpinnerColor = 'brand' | 'white' | 'muted'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | 'sm' | 'md' | 'lg'
  color?: SpinnerColor
  thickness?: number
  label?: string
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-[16px] border-2',
  md: 'size-[24px] border-2',
  lg: 'size-[32px] border-[3px]',
}

const COLOR_CLASSES: Record<SpinnerColor, string> = {
  brand: 'border-[#FF5100]/25 border-t-[#FF5100]',
  white: 'border-white/30 border-t-white',
  muted: 'border-[#9C9C9C]/25 border-t-[#9C9C9C] dark:border-[#6B7280]/25 dark:border-t-[#9CA3AF]',
}

const COLOR_FILL_CLASSES: Record<SpinnerColor, string> = {
  brand: 'bg-[#FF5100]',
  white: 'bg-white',
  muted: 'bg-[#9C9C9C] dark:bg-[#9CA3AF]',
}

export function Spinner({
  size = 'md',
  color = 'brand',
  thickness,
  label = 'Carregando',
  className,
  style,
  ...props
}: SpinnerProps) {
  const isNumeric = typeof size === 'number'
  const inlineStyle: CSSProperties = {
    ...style,
    ...(isNumeric ? { width: size, height: size } : {}),
    ...(thickness !== undefined ? { borderWidth: thickness } : {}),
  }

  return (
    <span
      role="status"
      aria-label={label}
      style={inlineStyle}
      className={cn(
        'inline-block rounded-full animate-spin motion-reduce:!animate-none',
        isNumeric ? 'border-2' : SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        className,
      )}
      {...props}
    />
  )
}

export interface DotsProps {
  color?: SpinnerColor
  className?: string
}

const DOT_DELAYS = [0, 150, 300]

export function Dots({ color = 'brand', className }: DotsProps) {
  return (
    <span role="status" aria-label="Carregando" className={cn('inline-flex items-center gap-[4px]', className)}>
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          data-dot
          aria-hidden="true"
          style={{ animationDelay: `${delay}ms` }}
          className={cn('size-[6px] rounded-full animate-bounce motion-reduce:!animate-none', COLOR_FILL_CLASSES[color])}
        />
      ))}
    </span>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Spinner/Spinner.test.tsx`
Expected: PASS, including every pre-existing test case (any test that passed `label="..."` explicitly still works unchanged).

- [ ] **Step 5: Update the barrel export and add stories**

In `src/components/Spinner/index.ts`, add `Dots` and `DotsProps` alongside the existing `Spinner`/`SpinnerProps` export:

```ts
export { Spinner, Dots } from './Spinner'
export type { SpinnerProps, DotsProps } from './Spinner'
```

Append to `src/components/Spinner/Spinner.stories.tsx` (add `Dots` to the existing import from `../Spinner`):

```tsx
export const NumericSize: Story = {
  args: { size: 48, label: 'Loading' },
}

export const CustomThickness: Story = {
  args: { thickness: 6, label: 'Loading' },
}

export const InlineDots: StoryObj<typeof Dots> = {
  render: () => <Dots />,
}
```

If the file's `Meta`/`StoryObj` setup is typed to `typeof Spinner` for the default export, add the `Dots` story as a separate small export using `StoryObj<typeof Dots>` as shown — do not change the file's default `meta` export, which stays scoped to `Spinner`.

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Spinner`
Expected: all pass.

```bash
git add src/components/Spinner
git commit -m "feat(Spinner): numeric size, thickness override, default label; add Dots component

BREAKING CHANGE: Spinner.label is no longer a required prop (defaults to 'Carregando')."
```

---

## Task 10: Tooltip — tone, rich title+content

**Files:**
- Modify: `src/components/Tooltip/Tooltip.tsx`
- Modify: `src/components/Tooltip/Tooltip.test.tsx`
- Modify: `src/components/Tooltip/Tooltip.stories.tsx`

**Interfaces:**
- Produces: `TooltipProps` gains `tone?: 'dark'|'light'|'brand'`, `title?: ReactNode`. No other task consumes `TooltipProps`.

- [ ] **Step 1: Write the failing tests**

Append to `src/components/Tooltip/Tooltip.test.tsx`:

```tsx
  it('renders light tone with a border', async () => {
    render(
      <Tooltip content="Light tooltip" tone="light">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    const tooltip = await screen.findByText('Light tooltip')
    expect(tooltip.closest('[role="tooltip"]')).toHaveClass('bg-white')
  })

  it('renders brand tone', async () => {
    render(
      <Tooltip content="Brand tooltip" tone="brand">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    const tooltip = await screen.findByText('Brand tooltip')
    expect(tooltip.closest('[role="tooltip"]')).toHaveClass('bg-[#FF5100]')
  })

  it('renders a rich tooltip with title and content', async () => {
    render(
      <Tooltip content="Details here" title="Heads up">
        <button>Trigger</button>
      </Tooltip>,
    )
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    expect(await screen.findByText('Heads up')).toBeInTheDocument()
    expect(await screen.findByText('Details here')).toBeInTheDocument()
  })
```

Check the top of the existing test file for how it triggers hover (Radix Tooltip needs `fireEvent.mouseEnter`/`await screen.findByText` since content mounts asynchronously via Portal) — match whatever helper/import pattern the file already uses; the calls above assume `fireEvent` is already imported from `@testing-library/react`, add it to the existing import if missing.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Tooltip/Tooltip.test.tsx`
Expected: FAIL — `tone` and `title` props not found.

- [ ] **Step 3: Replace `Tooltip.tsx` with the full corrected implementation**

```tsx
import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'
export type TooltipTone = 'dark' | 'light' | 'brand'

export interface TooltipProps {
  content: ReactNode
  title?: ReactNode
  children: ReactElement
  side?: TooltipSide
  tone?: TooltipTone
  delay?: number
  disabled?: boolean
  className?: string
}

const TONE_CLASSES: Record<TooltipTone, string> = {
  dark: 'bg-[#101828] text-white',
  light: 'bg-white text-[#101828] border border-[#EAECF0] shadow-[0px_4px_12px_0px_rgba(16,24,40,0.10)] dark:bg-[#151B2C] dark:text-white dark:border-[#1F2937]',
  brand: 'bg-[#FF5100] text-white',
}

const ARROW_FILL_CLASSES: Record<TooltipTone, string> = {
  dark: 'fill-[#101828]',
  light: 'fill-white dark:fill-[#151B2C]',
  brand: 'fill-[#FF5100]',
}

export function Tooltip({
  content,
  title,
  children,
  side = 'top',
  tone = 'dark',
  delay = 200,
  disabled = false,
  className,
}: TooltipProps) {
  if (disabled) return children

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-[100] max-w-[280px] rounded-[8px] px-[12px] py-[8px] text-[12px] leading-[16px] shadow-[0px_4px_12px_0px_rgba(16,24,40,0.16)]',
              'transition-opacity duration-150 data-[state=delayed-open]:opacity-100 data-[state=closed]:opacity-0',
              TONE_CLASSES[tone],
              className,
            )}
          >
            {title ? (
              <>
                <p className="font-semibold text-[13px] mb-[2px]">{title}</p>
                <p className="opacity-85">{content}</p>
              </>
            ) : (
              content
            )}
            <RadixTooltip.Arrow className={ARROW_FILL_CLASSES[tone]} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Tooltip/Tooltip.test.tsx`
Expected: PASS, including every pre-existing test case.

- [ ] **Step 5: Add stories**

Append to `src/components/Tooltip/Tooltip.stories.tsx`:

```tsx
export const LightTone: Story = {
  render: () => (
    <Tooltip content="Light tooltip" tone="light">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}

export const BrandTone: Story = {
  render: () => (
    <Tooltip content="Brand tooltip" tone="brand">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}

export const Rich: Story = {
  render: () => (
    <Tooltip title="Keyboard shortcut" content="Press Cmd+K to open the command palette">
      <button type="button">Hover me</button>
    </Tooltip>
  ),
}
```

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Tooltip`
Expected: all pass.

```bash
git add src/components/Tooltip
git commit -m "feat(Tooltip): add tone (dark/light/brand) and rich title+content layout"
```

---

## Task 11: Pagination — rename to page/total/onChange, add pill, add ...rest spread

**Files:**
- Modify: `src/components/Pagination/Pagination.tsx`
- Modify: `src/components/Pagination/Pagination.test.tsx`
- Modify: `src/components/Pagination/Pagination.stories.tsx`

**Interfaces:**
- Produces: `PaginationProps` renames `currentPage→page`, `totalPages→total`, `onPageChange→onChange`; new `pill?: boolean`; extends `Omit<HTMLAttributes<HTMLElement>, 'onChange'>` and spreads `...rest`. Task 12 (`example/src/pages/Employees.tsx`) consumes this new shape: `{ page, total, onChange }`.

- [ ] **Step 1: Rewrite the existing tests to use the new prop names, and add new-behavior tests**

Read `src/components/Pagination/Pagination.test.tsx` first and replace every `currentPage=`/`totalPages=`/`onPageChange=` occurrence with `page=`/`total=`/`onChange=` respectively (mechanical rename across the whole file — there is no old-name compatibility, so every existing test must be updated, not just appended to). Then append:

```tsx
  it('applies pill radius to page buttons when pill is true', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} pill />)
    expect(screen.getByText('1').closest('button')).toHaveClass('rounded-full')
  })

  it('spreads extra HTML attributes onto the root nav element', () => {
    render(<Pagination page={1} total={5} onChange={() => {}} data-testid="custom-pagination" />)
    expect(screen.getByTestId('custom-pagination')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/components/Pagination/Pagination.test.tsx`
Expected: FAIL — `page`/`total`/`onChange` not found (old names still referenced by `Pagination.tsx`), `pill` not found, `data-testid` not accepted.

- [ ] **Step 3: Replace `Pagination.tsx` with the full corrected implementation**

```tsx
import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number
  total: number
  onChange: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  pill?: boolean
  className?: string
}

const ELLIPSIS = 'ellipsis' as const

type PageEntry = number | typeof ELLIPSIS

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let page = start; page <= end; page++) result.push(page)
  return result
}

function buildPageEntries(page: number, total: number, siblingCount: number): PageEntry[] {
  const totalSlots = siblingCount * 2 + 5

  if (total <= totalSlots) return range(1, total)

  const leftSiblingIndex = Math.max(page - siblingCount, 1)
  const rightSiblingIndex = Math.min(page + siblingCount, total)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, siblingCount * 2 + 3)
    return [...leftRange, ELLIPSIS, total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(total - (siblingCount * 2 + 2), total)
    return [1, ELLIPSIS, ...rightRange]
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, total]
}

function PageButton({
  page,
  active,
  pill,
  onClick,
}: {
  page: number
  active: boolean
  pill: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-[36px] items-center justify-center text-[14px] font-medium outline-none',
        pill ? 'rounded-full' : 'rounded-[8px]',
        'text-[#101828] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'dark:text-white dark:hover:bg-[#1F2937]',
        active && 'bg-[#FF5100] text-white hover:bg-[#FF5100] dark:hover:bg-[#FF5100]',
      )}
    >
      {page}
    </button>
  )
}

function NavButton({
  label,
  disabled,
  pill,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  pill: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-[36px] items-center justify-center outline-none',
        pill ? 'rounded-full' : 'rounded-[8px]',
        'text-[#101828] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        'dark:text-white dark:hover:bg-[#1F2937]',
      )}
    >
      {children}
    </button>
  )
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
      <path
        d="M8.75 10.5 5.25 7l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
      <path
        d="M5.25 3.5 8.75 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Pagination({
  page,
  total,
  onChange,
  siblingCount = 1,
  showFirstLast = false,
  pill = false,
  className,
  ...rest
}: PaginationProps) {
  const entries = buildPageEntries(page, total, siblingCount)
  const canGoPrev = page > 1
  const canGoNext = page < total

  return (
    <nav aria-label="pagination" className={cn('flex items-center', className)} {...rest}>
      <div data-testid="pagination-compact" className="flex items-center gap-[4px] sm:hidden">
        <NavButton label="Página anterior" disabled={!canGoPrev} pill={pill} onClick={() => onChange(page - 1)}>
          <ChevronLeft />
        </NavButton>
        <span className="px-[8px] text-[14px] text-[#344054] dark:text-[#D0D5DD]">
          Página {page} de {total}
        </span>
        <NavButton label="Próxima página" disabled={!canGoNext} pill={pill} onClick={() => onChange(page + 1)}>
          <ChevronRight />
        </NavButton>
      </div>

      <div data-testid="pagination-full" className="hidden items-center gap-[4px] sm:flex">
        {showFirstLast && (
          <NavButton label="Primeira página" disabled={!canGoPrev} pill={pill} onClick={() => onChange(1)}>
            «
          </NavButton>
        )}
        <NavButton label="Página anterior" disabled={!canGoPrev} pill={pill} onClick={() => onChange(page - 1)}>
          <ChevronLeft />
        </NavButton>
        {entries.map((entry, index) =>
          entry === ELLIPSIS ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className="inline-flex size-[36px] items-center justify-center text-[#98A2B3] dark:text-[#667085]">
              …
            </span>
          ) : (
            <PageButton key={entry} page={entry} active={entry === page} pill={pill} onClick={() => onChange(entry)} />
          ),
        )}
        <NavButton label="Próxima página" disabled={!canGoNext} pill={pill} onClick={() => onChange(page + 1)}>
          <ChevronRight />
        </NavButton>
        {showFirstLast && (
          <NavButton label="Última página" disabled={!canGoNext} pill={pill} onClick={() => onChange(total)}>
            »
          </NavButton>
        )}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/components/Pagination/Pagination.test.tsx`
Expected: PASS, including every renamed pre-existing test case.

- [ ] **Step 5: Update stories and check the Table integration type**

In `src/components/Pagination/Pagination.stories.tsx`, replace every `currentPage=`/`totalPages=`/`onPageChange=` in existing story `args`/`render` functions with `page=`/`total=`/`onChange=`. Then append:

```tsx
export const Pill: Story = {
  args: { page: 3, total: 10, pill: true },
}
```

`src/components/Table/Table.tsx:29` types its `pagination` prop as `Omit<PaginationProps, 'className'>` — this requires no code change (the type follows `PaginationProps` automatically), but run a repo-wide search to confirm no other file references the old names:

```bash
grep -rn "currentPage\|totalPages\|onPageChange" src/ --include="*.tsx" --include="*.ts"
```

Expected: no matches remain inside `src/` (the only remaining match should be in `example/`, handled in Task 12).

- [ ] **Step 6: Run full verification and commit**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm vitest run src/components/Pagination`
Expected: all pass. `pnpm build` also validates that `Table.tsx`'s `Omit<PaginationProps, 'className'>` usage still compiles.

```bash
git add src/components/Pagination
git commit -m "feat(Pagination): rename currentPage/totalPages/onPageChange to page/total/onChange, add pill, spread HTML attributes

BREAKING CHANGE: Pagination props renamed to match the DS: currentPage -> page, totalPages -> total, onPageChange -> onChange."
```

---

## Task 12: Consumer update, changeset, full-suite verification

**Files:**
- Modify: `example/src/pages/Employees.tsx:106`
- Create: `.changeset/existing-components-ds-fixes.md`

**Interfaces:**
- Consumes: `PaginationProps` from Task 11 (`page`, `total`, `onChange`).

- [ ] **Step 1: Update the only internal consumer of a renamed prop**

In `example/src/pages/Employees.tsx`, find line 106:

```tsx
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
```

Replace it with:

```tsx
        pagination={{ page, total: totalPages, onChange: setPage }}
```

- [ ] **Step 2: Verify the example app still builds**

Run: `cd example && pnpm build && cd ..`
Expected: PASS, 0 type errors.

- [ ] **Step 3: Run the full lib test/lint/typecheck/build suite**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: PASS, 0 errors, 0 failing tests, includes every new test case added in Tasks 1–11 plus all pre-existing tests for components not touched by this plan.

- [ ] **Step 4: Confirm no stale references to renamed/removed APIs remain**

Run:

```bash
grep -rn "currentPage\|totalPages\|onPageChange\|AvatarGroupItem\|variant=\"default\"" src/ example/src/ --include="*.tsx" --include="*.ts"
```

Expected: no matches (the old `Pagination` prop names, the deleted `AvatarGroupItem` type, and the removed Badge `"default"` variant string should not appear anywhere in `src/` or `example/src/`). If any match is found in a file not touched by Tasks 1–11, fix it as part of this step.

- [ ] **Step 5: Create the changeset**

Create `.changeset/existing-components-ds-fixes.md`:

```markdown
---
"@starbemtech/react-starsystem": major
---

Fix 11 existing components to match the Starbem Design System reference kit's public API. This is a breaking release — see the full list below before upgrading.

**Button**: added variants `tertiary`, `link`, `glass`, `glass-dark`, `glass-brand` (9 total); added `size="xl"`; added `pill` and `block` props; added polymorphic `as="a"` rendering (disabled semantics become `aria-disabled` for the anchor branch).

**Checkbox** / **Radio**: added `tone` ("primary" | "success" | "accent"), `variant="card"` (tile layout), `error`, and `size="lg"`.

**Select**: no prop changes — `onChange`'s value-callback contract is now documented via JSDoc to avoid confusion with a native change event handler.

**Avatar**: added `size="2xl"`; `status` is now `boolean | "online" | "offline" | "away"` instead of a closed enum; `alt` is no longer required when `src` is set (falls back to `name`); added `shape`, `icon` fallback, and `ring` props. **AvatarGroup** now takes `children` (`<Avatar>` elements) instead of an `avatars` array — the `AvatarGroupItem` type is removed.

**Modal**: `title` type changed from `string` to `ReactNode`; added `present` ("auto" | "center" | "sheet" — responsive bottom-sheet layout), `tone`, `icon`, and `align`.

**Tabs**: `TabItem.content` is now optional (Tabs can be used as a pure tab-bar with no panel, matching the DS — existing usage with content on every item is unaffected); added `TabItem.icon`, `TabItem.count`, `variant="enclosed"`, `size`, and `block`.

**Badge**: variant `"default"` is renamed to `"neutral"`; added variants `"primary"`, `"accent"`, `"solid"`; added `dot`; now spreads extra HTML attributes (`onClick`, `data-*`, `aria-*`, etc.) onto the root element.

**Spinner**: `size` now also accepts a `number` (pixel diameter) in addition to `"sm" | "md" | "lg"`; added `thickness`; `label` is no longer a required prop (defaults to `"Carregando"`). Added a new `Dots` component (three-dot inline loader).

**Tooltip**: added `tone` ("dark" | "light" | "brand") and a "rich" layout via the new `title` prop (renders `title` + `content` as two lines).

**Pagination**: renamed `currentPage` → `page`, `totalPages` → `total`, `onPageChange` → `onChange` to match the DS; added `pill`; now spreads extra HTML attributes onto the root `<nav>`.

Migration: update every `Pagination` and `AvatarGroup` usage per the renames above (`Table`'s `pagination` prop follows automatically via its `PaginationProps` type). Every other change is additive — no other call site changes are required to keep compiling.
```

- [ ] **Step 6: Final commit**

```bash
git add example/src/pages/Employees.tsx .changeset/existing-components-ds-fixes.md
git commit -m "fix(example): update Pagination usage for renamed props; chore: add major changeset for DS fidelity fixes"
```
