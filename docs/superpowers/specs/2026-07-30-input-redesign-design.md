# Input — Design System Fidelity Redesign

## Context

Julio reported a real visual gap between the shipped `Input` component
(`src/components/Input/Input.tsx`) and the reference kit at
`/Users/juliosousa/Downloads/Starbem Design System/` (`components/forms/Input.jsx`,
`Input.prompt.md`, `components/components.css`), treated as design source of
truth per `AGENTS.md`'s Figma-fallback rule — confirmed real, not
kit-only, by `search_design_system` returning a matching Figma
component_set named "Input field outline" in the Star System library.

Current `Input`: single fixed visual treatment, label floats *inside*
the bordered box (above the value, sharing the box with the input),
only `error` state, no `variant`, no `size`, no `success`, no
`prefix`/`suffix`. This is a real capability/fidelity gap, not a color
or token drift — same class of fix as
`2026-07-29-existing-components-ds-fixes-design.md`, scoped to one
component.

## Goal

Bring `Input` to parity with the DS reference kit's variant/size/state
surface, while keeping this lib's existing structural conventions
(flex-row icon slots, `icon?: ReactNode`, Tailwind utility classes with
arbitrary px values, `cn()` for merging) instead of copying the kit's
DOM/CSS technique verbatim where this lib already has an equivalent,
more robust pattern.

## Explicit Scope Decisions (confirmed with Julio)

- **Full redesign, not incremental.** Label position changes for every
  existing `<Input label="X"/>` usage without a `FormField` wrapper —
  accepted as a visual breaking change, no shim.
- **No `multiline` prop on `Input`.** The kit models multiline as an
  `Input` prop that swaps `<input>`→`<textarea>`; this lib already ships
  a dedicated `Textarea` component. Confirmed: do not duplicate that
  responsibility onto `Input`.
- **Icon overlay technique not copied.** The kit positions
  leading/trailing icons with `position: absolute` over a padded input.
  This lib already solves the same visual result with a flex-row
  container (icon as a sibling flex item) — kept as-is, extended (not
  replaced) for the new variants/sizes/prefix/suffix.

## Public API (new `InputProps`)

```ts
export type InputVariant = 'outline' | 'filled' | 'underline'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: InputVariant   // default 'outline'
  size?: InputSize         // default 'md'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}
```

`error` and `success` are mutually exclusive. If both are passed,
`error` wins (same precedence the component already uses today for
`error` vs `hint`): `const hintText = error ?? success ?? hint`, and the
visual/icon state resolves the same way.

## Label

Moves from inside the bordered box to above it, reusing the exact class
string already used by `FormField`'s label
(`font-['Funnel_Display'] text-[14px] leading-[20px] font-medium text-neutral-800 dark:text-ink-100`)
instead of inventing a third label style. `Select` already renders its
label this way — this change makes `Input` consistent with `Select` and
`FormField`, not just with the kit.

## Structure

Container: `<div className="flex flex-col gap-[6px] items-start w-full">`
(label) → bordered flex-row field wrapper (icon / prefix / input /
suffix / icon) → hint row. This is the current top-level shape; only the
label's position inside it changes (moves above the field wrapper
instead of inside it).

Field wrapper is one flex-row `<div>` with `overflow-hidden` and a
single border, containing in order: `leadingIcon`, `prefix`, `<input>`,
`suffix`, `trailingIcon` — whichever are present. No separate
"grouped input" sub-structure like the kit's `.sb-inputgroup` — the
existing flex-row already achieves the same visual result for
prefix/suffix as it does for icons, so prefix/suffix work with *any*
variant (not outline-only, which is all the kit demonstrates).

## Per-size values

| size | font/line-height | padding | radius |
|---|---|---|---|
| `sm` | `text-[14px] leading-[20px]` | `px-[12px] py-[7px]` | `rounded-sm` (8px) |
| `md` (default) | `text-[16px] leading-[24px]` | `px-[14px] py-[10px]` | `rounded-md` (12px) |
| `lg` | `text-[17px] leading-[26px]` | `px-[16px] py-[13px]` | `rounded-lg` (16px) |

Icon slot stays fixed at `size-[24px]` regardless of `size` — existing
lib-wide convention (Key Decision #16 in the project note: Input icons
are 24px, distinct from Select's 20px chevron). Not resized per-`size`.

**Bug fix, not a new feature:** current `md` padding is `px-[16px]
py-[8px]` and radius is `rounded-lg` (16px). Per the kit CSS
(`.sb-input{padding:10px 14px;border-radius:var(--radius-md)}`), `md`
should be `px-[14px] py-[10px]` / `rounded-md` (12px). This table is the
corrected values — the diff task must change these on the existing
default path too, not just add `sm`/`lg`.

## Per-variant values

- **`outline`** (default): `border border-neutral-300 dark:border-ink-700`,
  `bg-neutral-25 dark:bg-neutral-900`. Hover: `border-neutral-400`.
  Focus: `border-primary-base` + existing focus-ring treatment
  (`focus-within:ring-2 focus-within:ring-primary-base focus-within:ring-offset-2`,
  unchanged from today).
- **`filled`**: `border-transparent bg-ink-100 dark:bg-ink-800`. Hover:
  lighter bg (`bg-ink-50 dark:bg-ink-700`). Focus: bg swaps to
  `bg-neutral-25 dark:bg-neutral-900` + `border-primary-base` (matches
  kit's `.sb-input--filled:focus{background:#fff;border-color:var(--primary-base)}`).
- **`underline`**: no side/top border, no radius, no horizontal padding.
  `border-b border-neutral-300 dark:border-ink-700`. Hover:
  `border-b-neutral-400`. Focus: `border-b-primary-base` (no ring —
  matches kit's 1px bottom shadow-line look via just the border-bottom
  color change, not the squared `ring-2` treatment used by the other
  two variants).

## States

- **`error`**: border/`border-b` → `border-error-base`, focus ring/line
  swaps to an error tint instead of the primary-orange one. Hint row
  renders `<Icon name="error" className="text-error-base" />` before
  the text, text color `text-error-base`.
- **`success`** (new): border/`border-b` → `border-success-base`, focus
  tint success-colored. Hint row renders
  `<Icon name="check_circle" className="text-success-base" />` before
  the text, text color `text-success-base` (or `text-success-dark` if
  contrast against `bg-neutral-25` requires it — verify during
  implementation, don't guess).
- **`disabled`**: unchanged from today, and — matching the kit's global
  `:disabled` selector, which does not vary by variant — renders the
  *same* flat neutral box regardless of `variant`. `filled`/`underline`
  visuals are suppressed while disabled.

## Prefix / suffix

`<span>` flex children inside the field wrapper, `bg-neutral-50
dark:bg-ink-800`, divider border (`border-r`/`border-l`
`border-neutral-200 dark:border-ink-700`) on the side facing the
`<input>`. No independent border/radius of their own — they sit inside
the field wrapper's single border, exactly like `leadingIcon`/`trailingIcon`
do today.

## Accessibility

No regression versus today: `htmlFor`/`id` association, `aria-invalid`,
`aria-describedby` pointing at the hint row all continue to work
identically — only the label's visual position changes, not its DOM
relationship to the input. New hint icons are `aria-hidden` (the text
already conveys the state; the icon is decorative reinforcement, same
pattern as `Alert`/`Badge` status icons elsewhere in the lib).

## Testing

- Every existing `Input.test.tsx` assertion must keep passing except
  ones that explicitly assert the *old* label-inside-box behavior or
  the *old* `md` padding/radius classes (expected to need updating, not
  a regression).
- New coverage: `variant` × 3, `size` × 3 (including the corrected `md`
  padding/radius), `success` (rendering + hint icon + mutual exclusion
  with `error`), `prefix`/`suffix` (rendering, with an icon combined),
  disabled overriding `filled`/`underline` visuals.
- At least one `vitest-axe` assertion covering a `success`-state input
  and a `prefix`+`error` combination, following the exact pattern in
  `Badge.test.tsx`.

## Non-goals

- No `multiline` prop (see Scope Decisions).
- No change to `Textarea`, `Select`, or `FormField` in this spec, even
  though `Textarea` shares the same "label inside the box" pattern
  being fixed here for `Input` — flagged as a known follow-up, not
  addressed now (Julio's request was scoped to `Input`).
- No new dependency (no `cva` or similar) — variant/size resolve via
  plain `Record<Variant, string>` maps, matching `Button.tsx`/`Radio.tsx`.

## Versioning

Visual breaking change (label position) with no type-level break.
Changeset bump (patch/minor/major) to be decided with Julio at release
time, not fixed in this spec.
