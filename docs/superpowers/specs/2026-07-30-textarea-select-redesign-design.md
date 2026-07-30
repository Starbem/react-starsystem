# Textarea & Select DS Parity — Design Spec

**Date:** 2026-07-30
**Status:** Approved by Julio, ready for implementation plan.

## Context

The `Input` component was fully redesigned in an earlier session (2026-07-30, "Sessão 10") to match the Starbem Design System reference kit (`~/Downloads/Starbem Design System/components/components.css`): `variant` (`outline`/`filled`/`underline`), `size` (`sm`/`md`/`lg`), `success` state, label positioned above the field, correct white background (`bg-white`/`dark:bg-ink-900` instead of the pre-existing `bg-neutral-25`/`dark:bg-neutral-900` gray bug).

Comparing `Textarea` and `Select` against the same kit CSS found the same class of gaps:

- **`Textarea`**: label renders inside the bordered box (kit + `FormField`/`Select` render it above); no `variant`/`size`/`success`; background uses the same gray bug (`bg-neutral-25`/`dark:bg-neutral-900`) fixed in Input.
- **`Select`**: background uses the same gray bug (in both the trigger and the popover menu `<ul>`); no `variant`/`size`; fixed `h-[56px]` trigger height with old `px-[16px] py-[8px] rounded-lg` (the same wrong `md` values Input had before its redesign — kit specifies `14px/10px` padding, `radius-md`); no `success`. Label position is already correct (above the field) — no change needed there.
- **`FormField`**: audited, no gap found. It only wraps label + child + hint, has no background of its own, and already places the label above the field. Out of scope — no changes.

Julio approved full API parity with `Input` (`variant`, `size`, `success`) for both components, plus a character counter for `Textarea` (present in the kit as `.sb-field__counter`, not carried into the original `Input` redesign since `Input` has no `maxLength` use case in the same way).

## Scope decisions

1. **Full parity, not incremental** — same breaking visual change class as Input (label moves outside the box for `Textarea`); Julio chose to do this directly rather than add new props while leaving the old label position as a legacy path.
2. **Shared style helper** — extract `getFieldColorClasses` and the four `SIZE_*_CLASSES` maps out of `Input.tsx` into a shared module, consumed by `Input`, `Textarea`, and `Select`. This is new relative to the Input session (which left the logic local to `Input.tsx`); doing it now prevents a third copy of the same logic and prevents the gray-background bug from being reintroduced by a future one-off edit.
3. **Character counter is Textarea-only, opt-in, tied to `maxLength`** — not part of `Input` or `Select` scope. No counter without `maxLength` set (a counter with no denominator is not useful and not in the kit).
4. **No prefix/suffix, no leading/trailing icons** for either component — the kit does not use them on `textarea` or `select`, and Julio did not request them. YAGNI.
5. **Select stays an ARIA combobox**, not a wrapped native `<select>` — no change to its interaction model, only to its visual layer (background, padding, radius, size scale) and the addition of `variant`/`size`/`success`.

## Shared style module

New file: `src/components/shared/fieldStyles.ts`.

Exports (moved verbatim from `Input.tsx`, values unchanged except the background-color bug fix already applied to `Input` in the prior session):

```ts
export type FieldVariant = 'outline' | 'filled' | 'underline'
export type FieldSize = 'sm' | 'md' | 'lg'

export const FIELD_SIZE_TEXT_CLASSES: Record<FieldSize, string>
export const FIELD_SIZE_PADDING_Y_CLASSES: Record<FieldSize, string>
export const FIELD_SIZE_PADDING_X_CLASSES: Record<FieldSize, string>
export const FIELD_SIZE_RADIUS_CLASSES: Record<FieldSize, string>

export function getFieldColorClasses(
  variant: FieldVariant,
  disabled: boolean,
  state: 'error' | 'success' | null,
): string
```

Exact values (copied from `Input.tsx` as it stands today, post-bugfix):

```ts
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
```

```ts
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

`Input.tsx` is refactored in the same pass to import these from the shared module instead of defining them locally, and its own `InputVariant`/`InputSize` types become aliases of `FieldVariant`/`FieldSize` (re-exported from `Input.tsx` for backward compatibility — `export type InputVariant = FieldVariant` etc. — so existing consumers importing `InputVariant`/`InputSize` from the library keep working unchanged).

`disabled` note: the shared `getFieldColorClasses` returns `bg-neutral-50 dark:bg-neutral-900` for the disabled state, matching `Input.tsx`'s current disabled branch exactly (this is intentionally the neutral/gray look Task 1 of the Input redesign chose for disabled — disabled is not part of the gray-background bug, it is meant to look flat and neutral, unlike the interactive states which must be white).

## Textarea — full API

```ts
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: FieldVariant   // default 'outline'
  size?: FieldSize          // default 'md'
  showCount?: boolean       // default false; no-op unless maxLength is also set
}
```

### Label position

Moves above the field, identical markup/classes to `Input.tsx`'s label:

```tsx
{label && (
  <label
    htmlFor={id}
    className="font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 select-none dark:text-ink-100"
  >
    {label}
  </label>
)}
```

### Field box

Same wrapper pattern as `Input`'s outer box, using the shared helper and size maps, but the box wraps a `<textarea>` directly (no inner icon-affix split needed — no icons/prefix/suffix in scope):

```tsx
<div
  className={cn(
    'flex flex-col w-full overflow-hidden',
    variant !== 'underline' && FIELD_SIZE_RADIUS_CLASSES[size],
    getFieldColorClasses(variant, Boolean(disabled), state),
    FIELD_SIZE_PADDING_X_CLASSES[size],
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
```

`min-h-[96px]` matches the kit's `.sb-textarea{min-height:96px}` and is size-invariant (not part of the `sm`/`md`/`lg` scale — the kit does not vary it by size, only `Input`'s single-line height varies by size).

### Success / error state

Identical mutual-exclusion rule to `Input`: `isError = Boolean(error)`, `isSuccess = !isError && Boolean(success)`, `error` wins if both set. Hint row renders the same `error`/`check_circle` icon pattern already in `Input.tsx`.

### Character counter

```ts
const length = typeof props.value === 'string'
  ? props.value.length
  : typeof props.defaultValue === 'string'
    ? props.defaultValue.length
    : uncontrolledLength // from internal useState, updated onChange
```

Rendered only when `showCount && props.maxLength != null`:

```tsx
{showCount && props.maxLength != null && (
  <span className="text-[12px] text-neutral-400 dark:text-ink-500 tabular-nums shrink-0">
    {length}/{props.maxLength}
  </span>
)}
```

Layout: the hint row becomes a flex row (`flex items-center justify-between gap-[8px]`) so hint text sits left and the counter sits right when both exist; when there is no hint, the counter renders alone, still right-aligned via `justify-end` (or the same `justify-between` with an empty first child collapsed — implementer's choice, covered by a test either way).

For a controlled `Textarea` (consumer passes `value` + `onChange`), length reads directly from `props.value`, no internal state needed. For an uncontrolled one (no `value`, optional `defaultValue`), the component tracks length via its own `onChange` handler wrapping the consumer's `onChange` (call the consumer's handler first, then update internal length state from `e.target.value.length`) — never blocks or alters the consumer's own `onChange`.

### Disabled

Same rule as `Input`/`Select`: `disabled` short-circuits `getFieldColorClasses` before any variant check, always renders the flat neutral disabled look regardless of `variant`.

## Select — full API

```ts
export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  success?: string          // new
  variant?: FieldVariant     // new, default 'outline'
  size?: FieldSize            // new, default 'md'
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}
```

### Trigger button

Replaces the current fixed `h-[56px] px-[16px] py-[8px] rounded-lg` and the inline `bg-neutral-25`/`isOpen`/`isError` ternary with the shared helper + size maps:

```tsx
<button
  ...
  className={cn(
    'flex gap-[8px] items-center w-full text-left',
    'outline-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
    variant !== 'underline' && FIELD_SIZE_RADIUS_CLASSES[size],
    FIELD_SIZE_PADDING_X_CLASSES[size],
    FIELD_SIZE_PADDING_Y_CLASSES[size],
    getFieldColorClasses(variant, Boolean(disabled), openOrState),
  )}
>
```

Where `openOrState` folds the existing "open" affordance into the same `error`/`success`/`null` state model: being open with no error/success still needs the focus-ring look. Simplest approach that matches Input's own behavior (`focus-within` classes fire automatically on real focus) — drive the "open" visual via `aria-expanded` and the existing `focus-visible:ring-2` utility already on the trigger, and stop special-casing `isOpen` in the background/border logic entirely. `state` passed to `getFieldColorClasses` is purely `error`/`success`/`null`, exactly like `Input`; opening the menu no longer changes the trigger's border/background beyond what already happens on focus.

Trigger height becomes organic (padding-driven, matching `Input`), not a fixed `h-[56px]`.

Text sizing inside the trigger (`selectedOption`/`placeholder` span) switches from the hardcoded `text-[16px] leading-[24px]` to `FIELD_SIZE_TEXT_CLASSES[size]`, matching `Input`'s size-driven text.

### Popover menu

`bg-neutral-25 dark:bg-neutral-900` on the `<ul>` becomes `bg-white dark:bg-ink-900` — the same gray-bug fix, applied to the menu surface as well as the trigger. Border/shadow/radius on the menu itself are unchanged (not part of the reported bug, not part of the kit's dropdown gap either — kit's `.sb-dd__menu` already uses `#fff` there consistently, so no other change is needed).

### Success state

New: `success?: string`, same mutual exclusion as `Input`/`Textarea` (`error` wins). Hint row gets the same `check_circle` icon treatment.

### Disabled

No change in behavior — already correctly ignores `variant`-driven look today (`disabled` branch in the current ternary is variant-agnostic already); after the refactor this continues to hold because `getFieldColorClasses` still short-circuits on `disabled` first.

## Accessibility

No change to either component's ARIA model:
- `Textarea` is a plain labeled `<textarea>`, `aria-invalid`/`aria-describedby` unchanged.
- `Select` keeps its combobox/listbox pattern unchanged (`role="combobox"`, `aria-expanded`, `aria-controls`, `role="listbox"`, `role="option"`, `aria-selected`).
- Both get a `success`-state `vitest-axe` test, following the exact pattern already in `Input.test.tsx` (`// @ts-expect-error` + `axe(container)` + `toHaveNoViolations()`).
- The counter text is not marked `aria-live` — it is not an urgent update and constant announcements on every keystroke would be noisy for screen reader users; this matches the kit's own plain-text `.sb-field__counter` with no ARIA live region.

## Testing

- `fieldStyles.test.ts` (new): unit tests for `getFieldColorClasses` across all `variant`×`disabled`×`state` combinations (12 cases) and for each size map having all three keys.
- `Textarea.test.tsx`: extend with label-position test (label appears before the textarea in the DOM, not inside a shared bordered wrapper with it — assert via `container` structure, not implementation-detail selectors), one test per new `variant`, one per `size`, `success` state test + a11y test, counter tests (renders when `showCount` + `maxLength` set, hidden when either is missing, updates on typing for both controlled and uncontrolled usage, correct format `n/max`).
- `Select.test.tsx`: extend with one test per new `variant`, one per `size`, `success` state test + a11y test, a regression test confirming the trigger no longer has a fixed `h-[56px]` class and confirming the popover menu no longer carries `bg-neutral-25`/`dark:bg-neutral-900`.
- Existing tests for both components must keep passing with the label-position and background changes accounted for (existing assertions that check for `bg-neutral-25` or the old fixed height are expected to be updated as part of this work, not treated as regressions to preserve).

## Non-goals

- No `multiline` unification between `Input` and `Textarea` — out of scope, decided in the Input session.
- No prefix/suffix/leading/trailing icons for `Textarea` or `Select`.
- No character counter for `Input` or `Select`.
- No change to `FormField` — audited, no gap.
- No change to `Select`'s interaction model (still a custom ARIA combobox, not a native `<select>` wrapper).
- No `rgba()` hardcoded focus-shadow cleanup — same pre-existing, cross-component tech debt noted and parked during the Input session (Next Steps #25 in the project vault); this work does not touch it, only reuses the same `shadow-[0_0_0_4px_rgba(...)]` pattern already present in `getFieldColorClasses` as it stands today.

## Versioning

`minor` changeset (same reasoning as the Input redesign: new props are additive, but the label-position change for `Textarea` and the background/sizing change for `Select` are real visual changes for existing consumers — not a type-level breaking change, but visually breaking, which this codebase's convention (per the Input changeset) treats as `minor`, not `major`, pre-1.0-adoption reasoning aside — final bump confirmed with Julio at plan time, matching how the Input task handled it).
