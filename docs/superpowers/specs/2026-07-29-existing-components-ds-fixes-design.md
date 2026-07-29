# Existing Components — DS Fidelity Fixes Design

## Context

A prior audit (2026-07-29, 7 parallel agents) compared all 31 existing
`react-starsystem` components against the reference kit at
`/Users/juliosousa/Downloads/Starbem Design System/` (reconstructed
JSX + `.d.ts` + `.prompt.md` files, not Figma — treated as the design
source of truth for this project per explicit instruction). It found 11
components whose public API diverges from the DS in ways that are not
pure visual/token issues (those were already fixed separately — see
`2026-07-29-telehealth-components-design.md` sibling context and the
`loud-tokens-shift` changeset). This spec fixes those 11 components:
`Button`, `Checkbox`, `Radio`, `Select`, `Avatar`, `Modal`, `Tabs`,
`Badge`, `Spinner`, `Tooltip`, `Pagination`.

## Goal

Bring the public prop API of these 11 components to parity with the DS
reference kit wherever the gap is a real capability loss (missing
variant, wrong type, missing prop), while preserving the lib's own
deliberate architectural choices (ARIA-custom widgets for
Checkbox/Radio/Select instead of native `<input>`/`<select>`, Radix UI
as the engine for Modal/Tabs/Tooltip, `icon?: ReactNode` instead of the
DS's `icon: string`).

## Versioning Strategy

**Breaking, major version bump.** No backward-compat aliases, no
deprecated-prop shims. Confirmed by direct request: "Breaking direto +
major bump". The published package is at `0.3.0`; this release bumps to
`1.0.0` (first breaking release). One `.changeset/` entry, `major` bump,
changelog body lists every breaking change component-by-component so
consumers can diff their usage against it.

**Known internal consumer:** `example/src/pages/Employees.tsx:106` passes
`pagination={{ currentPage: page, totalPages, onPageChange: setPage }}` to
`Table`, which forwards it to `Pagination` (`Table.tsx:29` types it as
`Omit<PaginationProps, 'className'>`, so the type change propagates
automatically — only the call site literal needs updating). This is the
only usage in `example/` for any of the 11 components. Task 12 fixes this
call site so `example/` keeps building.

## Global Constraints

- Icon convention: `icon?: ReactNode` everywhere (established lib-wide
  decision, session 2026-07-29) — never the DS's `icon: string` pattern,
  even where the DS uses a string.
- Keep existing architecture per component: ARIA-custom widget
  (Checkbox/Radio/Select), Radix UI (Modal/Tabs/Tooltip). Do not rewrite
  these to native elements or to a custom (non-Radix) implementation.
- Every new/changed prop needs a Tailwind arbitrary-value implementation
  consistent with the corrected design tokens (colors, radius from
  `src/tokens/*.ts` — components still hardcode literal hex/px per the
  existing lib convention, this spec does not migrate components to
  consume the token files).
- Test convention: vitest + `@testing-library/react` + `vitest-axe`,
  copy the exact `// @ts-expect-error vitest-axe matcher types not
  compatible with this vitest version` comment pattern from
  `Card.test.tsx:67-76` verbatim on every new a11y assertion.
- Story convention: `Meta`/`StoryObj` from `src/docs-types.ts`, one named
  export per variant/prop combination that changed.
- No component may lose an existing prop, test, or story coverage as a
  side effect of this work — every fix is additive-or-renamed, never a
  silent capability removal beyond what's explicitly listed below.
- `pnpm lint && pnpm typecheck && pnpm build && pnpm test` must pass
  after every task.

## Per-Component Changes

### Button (`src/components/Button/Button.tsx`)

Current: `variant: 'primary'|'secondary'|'outline'|'ghost'|'danger'`,
`size: 'sm'|'md'|'lg'`, `loading`, `iconLeft`, `iconRight`, `iconOnly`,
extends `ButtonHTMLAttributes<HTMLButtonElement>`. Always renders
`<button type="button">`.

Changes:
- `variant` grows to `'primary'|'secondary'|'outline'|'ghost'|'danger'|'tertiary'|'link'|'glass'|'glass-dark'|'glass-brand'` (9 total, keeps the 5 existing + adds `tertiary`, `link`, `glass`, `glass-dark`, `glass-brand` from the DS). Existing 5 values keep their current visual treatment unchanged — this is additive to the variant enum only.
- `size` grows to `'sm'|'md'|'lg'|'xl'`.
- New `pill?: boolean` — when true, `rounded-full` instead of the button's normal radius.
- New `block?: boolean` — when true, `w-full` instead of `inline-flex` sizing.
- New `as?: 'button'|'a'` (default `'button'`). When `'a'`, renders `<a>` instead of `<button>`; in that case the component extends `AnchorHTMLAttributes<HTMLAnchorElement>` for that branch (e.g. `href`) instead of `ButtonHTMLAttributes`. Use a discriminated prop type: `ButtonProps = ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>) | ({ as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)`, both merged with the shared visual props (`variant`, `size`, `loading`, `iconLeft`, `iconRight`, `iconOnly`, `pill`, `block`, `className`). `loading`/`disabled` only apply to the `button` branch (an `<a>` has no `disabled` attribute — when `as="a"` and `loading` is true, apply `aria-disabled="true"` and `pointer-events-none` via class instead).

Non-breaking: `iconLeft`/`iconRight` stay `ReactNode` (lib convention, not the DS's `leadingIcon: string`/`trailingIcon: string`).

### Checkbox (`src/components/Checkbox/Checkbox.tsx`)

Current: `checked`, `indeterminate`, `disabled`, `onChange: (checked: boolean) => void`, `label`, `supportingText`, `size: 'sm'|'md'`, `id`, `name`, `value`, `className`, `aria-label`. ARIA `role="checkbox"` widget, always controlled.

Changes:
- New `tone?: 'primary'|'success'|'accent'` (default `'primary'`) — controls the active-state border/fill color (currently hardcoded to the primary orange). `success` and `accent` reuse the corrected `success`/`terciary` token colors.
- New `variant?: 'default'|'card'` (default `'default'`). `'card'` wraps the whole control in a bordered, padded card container (padding `16px`, border `1px solid`, radius matching Modal's `12px`) that highlights (border becomes `tone` color) when checked — matches the DS's tile checkbox pattern. Renders the same box+label internally regardless of variant.
- New `error?: boolean` (default `false`) — when true, box border and any `supportingText` render in the error red token regardless of `tone`.
- `size` grows to `'sm'|'md'|'lg'`.

Not changed: stays ARIA-custom, controlled-only (no `defaultChecked`/uncontrolled mode — that gap is accepted, not in scope, since fixing it would mean rearchitecting to native `<input>`, which was explicitly ruled out).

### Radio (`src/components/Radio/Radio.tsx`)

Current: `value` (required), `checked`, `disabled`, `label`, `supportingText`, `size: 'sm'|'md'`, `id`, `name`, `tabIndex`, `onSelect: (value: string) => void`, `className`. ARIA `role="radio"` widget.

Changes: same three additions as Checkbox, same semantics:
- New `tone?: 'primary'|'success'|'accent'` (default `'primary'`).
- New `variant?: 'default'|'card'` (default `'default'`), same card treatment as Checkbox but with a circular radio dot inside.
- New `error?: boolean` (default `false`).
- `size` grows to `'sm'|'md'|'lg'`.

Not changed: no roving-tabindex/arrow-key navigation added. The DS's `Radio.jsx` does not implement a `RadioGroup` with roving tabindex either (it's a bare radio, group behavior is left to the consumer) — confirmed by reading `forms/Radio.jsx`, so this is not a gap versus the DS. No `RadioGroup` component exists in this lib; out of scope for this spec.

### Select (`src/components/Select/Select.tsx`)

Current: `options: SelectOption[]`, `value`, `onChange: (value: string) => void`, `placeholder`, `label`, `hint`, `error`, `disabled`, `id`, `name`, `className`. ARIA combobox widget (`role="combobox"` trigger + `role="listbox"` popup), not a native `<select>`.

Change: none to the prop signature. The earlier audit flagged `onChange`'s
`(value: string) => void` signature as "incompatible with the DS's native
`ChangeEvent`-based `onChange`" — but per the architecture decision (keep
ARIA-custom, do not migrate to native `<select>`), a `ChangeEvent`-shaped
callback would be actively misleading (there is no real `<select>` element
backing it). Resolution: **keep `(value: string) => void` as-is**, no code
change to `Select.tsx`. Only action: add a one-line JSDoc comment on the
`onChange` prop in `SelectProps` stating explicitly that this is a
value-callback, not a native change-event handler, since this is the one
place in the audit where "fix" and "keep architecture" conflicted — the
resolution is documentation, not a prop change.

### Avatar (`src/components/Avatar/Avatar.tsx`, `AvatarGroup`)

Current `Avatar`: `name`, `size: 'xs'|'sm'|'md'|'lg'|'xl'`,
`status?: 'online'|'offline'|'away'`, `className`, and a discriminated
`{ src: string; alt: string } | { src?: undefined; alt?: undefined }` —
`alt` is required whenever `src` is present.

Current `AvatarGroup`: `avatars: AvatarGroupItem[]` (data array), `max`,
`size`, `className`.

Changes to `Avatar`:
- `size` grows to `'xs'|'sm'|'md'|'lg'|'xl'|'2xl'` (add `72px`/`text-[24px]` per DS scale progression).
- `status` type changes from the closed enum to `status?: boolean | 'online' | 'offline' | 'away'`. When `true`, render a plain status dot in the `online` color (green) with no semantic label beyond "status indicator present" (`aria-label="status indicator"`); when a string, keep current per-status color + `aria-label={\`status: ${status}\`}` behavior.
- `alt` becomes fully optional: `AvatarProps = AvatarBaseProps & { src?: string; alt?: string }` (drop the discriminated union). When `src` is set and `alt` is omitted, fall back to `alt={name ?? ''}`.
- New `shape?: 'circle'|'rounded'|'square'` (default `'circle'`) — `circle` keeps `rounded-full`, `rounded` uses the same radius as `size` follows Modal-style `12px`-scaled radius, `square` uses `rounded-none`.
- New `icon?: ReactNode` — when provided and there's no `src`/`name`-derived initials, renders this instead of the hardcoded `FallbackIcon`. When omitted, current `FallbackIcon` behavior is unchanged (this keeps the default look identical for every existing caller).
- New `ring?: boolean` (default `false`) — applies the `ring-2 ring-white dark:ring-[#151B2C]` treatment that today only `AvatarGroup` applies internally; when `AvatarGroup` renders its children it now passes `ring` instead of a `className` override (see below).

Changes to `AvatarGroup` (breaking):
- Replace `avatars: AvatarGroupItem[]` with `children: ReactNode` — consumer renders `<AvatarGroup><Avatar .../><Avatar .../></AvatarGroup>`, matching the DS. `AvatarGroup` clones each `Avatar` child via `Children.map`/`cloneElement` to inject `size` (uniform across the group) and `ring` (always `true` inside a group), and to compute overflow from `Children.count(children)` vs `max`. Non-`Avatar` children are rendered as-is without cloned props (so a group can still show a custom overflow trigger if ever needed) — but the primary contract is `Avatar` children.
- `AvatarGroupItem` type is deleted (no longer used anywhere).
- `max`, `size`, `className` stay as `AvatarGroup` props (size still overrides each child's own `size` for visual consistency in the group, same as today).

### Modal (`src/components/Modal/Modal.tsx`)

Current: `open`, `onClose`, `title?: string`, `description?: string`,
`footer`, `size: 'sm'|'md'|'lg'|'xl'|'full'`, `closeOnOverlayClick`,
`children`, `className`. Radix `Dialog`, always centered.

Changes:
- `title` type changes from `string` to `ReactNode` (so a consumer can pass a `<span>` with an icon inline, matching the DS's richer title slot).
- New `present?: 'auto'|'center'|'sheet'` (default `'auto'`). `'center'` forces today's centered-dialog layout at all viewport widths. `'sheet'` forces a bottom-sheet layout (full-width, anchored to the bottom of the viewport, slide-up transition, rounded top corners only, drag-handle bar) at all viewport widths. `'auto'` is `'center'` at `sm:` breakpoint and above, `'sheet'` below it (Tailwind: base classes are the sheet layout, `sm:` classes override to centered) — matches the DS's responsive default. Implemented as pure Tailwind class branching inside `Dialog.Content`, no new dependency.
- New `tone?: 'default'|'success'|'error'|'warning'|'info'` (default `'default'`). When not `'default'`, renders a small colored icon badge (`size-[40px]` circle, tone-colored background + icon) to the left of the title, using the corrected `success`/`error`/`warning` tokens (`info` maps to the `terciary`/purple scale, matching the Badge `info` precedent).
- New `icon?: ReactNode` — overrides the tone badge's icon when both `tone` and `icon` are given; if `icon` is given without `tone`, renders the icon badge in neutral gray.
- New `align?: 'start'|'center'` (default `'center'`) — controls text-alignment of `title`/`description` (and the tone badge's position: centered above the title when `align="center"`, inline to the left when `align="start"`).

Not changed: `size` keeps the existing superset (`sm|md|lg|xl|full` vs the DS's `sm|md|lg`) — additive, no removal.

### Tabs (`src/components/Tabs/Tabs.tsx`)

Current: `TabItem = { value, label, content, disabled? }` — `content` is
required, `Tabs` always renders both the trigger list and a
`RadixTabs.Content` panel per item. `variant: 'line'|'filled'`,
`orientation`, `defaultValue`, `value`, `onChange`, `className`.

Changes:
- `TabItem.content` becomes optional: `content?: ReactNode`. When an item has no `content`, `Tabs` does not render a `RadixTabs.Content` for it at all (so `Tabs` can be used as a pure tab-bar, matching the DS, when the consumer manages the panel externally e.g. via `onChange`). When every item omits `content`, no panel wrapper renders and no `mt-[16px]` spacing is added below the trigger list. This is additive — every existing caller that already passes `content` on every item keeps rendering exactly as today.
- New `TabItem.icon?: ReactNode` — renders to the left of `label` inside the trigger.
- New `TabItem.count?: number` — renders a small rounded badge (reusing Badge's `sm` visual treatment inline, not the `Badge` component itself to avoid a cross-component import cycle risk — a local `<span>` with the same size/shape classes) to the right of `label` inside the trigger.
- `variant` grows to `'line'|'filled'|'enclosed'` — `enclosed` renders each trigger as a bordered tab (`border border-b-0 rounded-t-[8px]`, active tab's border matches the panel's top border to look "enclosed" with the content area below), matching the DS's third variant.
- New `size?: 'sm'|'md'|'lg'` (default `'md'`) — scales trigger padding/font-size (`sm`: 12px text/tighter padding, `lg`: 16px text/looser padding); `md` matches current hardcoded sizing exactly (no visual change for existing callers).
- New `block?: boolean` (default `false`) — when true and `orientation="horizontal"`, the trigger list becomes `w-full` with each trigger `flex-1` (equal-width tabs filling the container).

### Badge (`src/components/Badge/Badge.tsx`)

Current: `children`, `variant: 'default'|'success'|'warning'|'error'|'info'`, `size: 'sm'|'md'`, `removable`, `onRemove`, `icon`, `className`. No `...rest` spread.

Changes:
- `variant` becomes `'neutral'|'primary'|'accent'|'success'|'warning'|'error'|'solid'|'info'` (8 values): rename `'default'` to `'neutral'` (breaking — `'default'` is removed, not aliased, per the no-compat-shim decision), add `'primary'` (brand orange bg/text), `'accent'` (terciary purple bg/text), `'solid'` (solid brand-orange background with white text, vs the other variants' pale-background treatment), and keep `'info'` (lib-only addition, no DS equivalent, kept since nothing forces its removal and existing callers may depend on it).
- New `dot?: boolean` (default `false`) — when true, renders a small `size-[6px]` filled circle (same color as the variant's text color) before any `icon`/`children`, matching the DS's status-dot badge.
- `BadgeProps` extends `HTMLAttributes<HTMLSpanElement>` and the root `<span>` spreads `...rest`, so `onClick`, `data-*`, `aria-*`, `id` etc. all pass through (matches DS's `React.HTMLAttributes<HTMLSpanElement>` extension).

### Spinner (`src/components/Spinner/Spinner.tsx`)

Current: `size: 'sm'|'md'|'lg'`, `color: 'brand'|'white'|'muted'`, `label` (required, no default), extends `HTMLAttributes<HTMLSpanElement>` (already spreads `...props`).

Changes:
- `size` type becomes `number | 'sm'|'md'|'lg'` (default `'md'`). When a `number` is passed, it's used directly as the pixel diameter (`style={{ width: size, height: size }}` merged with the animate-spin/rounded-full classes, no `SIZE_CLASSES` lookup); when one of the 3 enum strings, behavior is unchanged (existing `SIZE_CLASSES` lookup).
- New `thickness?: number` — pixel border-width override. When set, applied via inline `style={{ borderWidth: thickness }}` instead of the size-derived `border-2`/`border-[3px]` Tailwind class (Tailwind class still applies as the fallback border-width when `thickness` is omitted).
- `label` gets a default value: `label = 'Carregando'`. Existing behavior (customizable `aria-label`) is unchanged; only the required-ness is removed, so `<Spinner />` with no props no longer fails to compile.
- New exported component `Dots` in the same file: `export interface DotsProps { color?: 'brand'|'white'|'muted'; className?: string }` — renders 3 small circles (`size-[6px]` each, `gap-[4px]`) with a staggered pulse/bounce animation (CSS `animate-bounce` with per-dot `animation-delay` via inline style, e.g. `0ms`/`150ms`/`300ms`), reusing `COLOR_CLASSES`-equivalent solid-fill (not border) color mapping. `role="status" aria-label="Carregando"` on the wrapping `<span>`. Exported from `src/components/Spinner/index.ts` alongside `Spinner`.

### Tooltip (`src/components/Tooltip/Tooltip.tsx`)

Current: `content: ReactNode`, `children: ReactElement`, `side`, `delay`, `disabled`, `className`. Radix Tooltip, always dark background.

Changes:
- New `tone?: 'dark'|'light'|'brand'` (default `'dark'`). `'dark'` is today's exact styling (unchanged). `'light'` uses white background, dark text, a subtle border and shadow. `'brand'` uses the brand orange background with white text. `RadixTooltip.Arrow`'s fill matches the chosen tone's background.
- New `title?: ReactNode`. When provided alongside `content`, renders the "rich" two-line layout: `title` in bold/medium weight on its own line, `content` below in regular weight — both inside the same popover. When `title` is omitted, behavior is unchanged (plain single-line/content-only tooltip, exactly as today).

Not changed: `children` stays `ReactElement` (Radix `asChild` requirement, architecture kept as-is per the overlay-architecture decision — accepted trade-off vs the DS's plain-text-child support).

### Pagination (`src/components/Pagination/Pagination.tsx`)

Current: `currentPage`, `totalPages`, `onPageChange: (page: number) => void`, `siblingCount`, `showFirstLast`, `className`. No `...rest` spread. Compact/full layouts always both in the DOM, toggled by CSS breakpoint (`sm:hidden`/`hidden sm:flex`), no prop to force one or the other.

Changes:
- Rename `currentPage` → `page`, `totalPages` → `total`, `onPageChange` → `onChange` (breaking, matches DS exactly). Internal logic (`buildPageEntries`, `PageButton`, `NavButton`, ellipsis algorithm) is unchanged — only the public prop names and the internal variable names that read from them.
- New `pill?: boolean` (default `false`) — when true, page/nav buttons use `rounded-full` instead of `rounded-[8px]`.
- `PaginationProps` extends `Omit<HTMLAttributes<HTMLElement>, 'onChange'>` and the root `<nav>` spreads `...rest` (matches DS's `Omit<HTMLAttributes<HTMLElement>, "onChange">` extension — the `Omit` is required because `onChange` is redefined with the page-number signature, not the native event signature).

Not changed: `siblingCount`, `showFirstLast` stay as lib-only additions (no DS equivalent, no reason to remove). The CSS-breakpoint-toggle behavior (vs an explicit `variant: 'numbered'|'compact'` prop in the DS) stays as-is — out of scope for this spec; flagged in the prior audit as a possible follow-up, not requested here.

## Consumer Update

`example/src/pages/Employees.tsx:106` — update the `pagination` object
literal from `{ currentPage: page, totalPages, onPageChange: setPage }` to
`{ page, total: totalPages, onChange: setPage }`. `Table.tsx:29`'s
`Omit<PaginationProps, 'className'>` type requires no change (it follows
`PaginationProps` automatically).

## Testing Plan

Each component's existing `.test.tsx` keeps all current test cases
(no coverage regression) and gains new cases for:
- Every new prop's each possible value renders the expected class/attribute (snapshot-free — assert via `getByRole`/`container.querySelector` + class/attribute checks, consistent with existing test style in each file).
- Renamed props (`Pagination`, `AvatarGroup`) — old prop names are simply absent from the type, so there's nothing to test for backward compat; tests are rewritten to use the new names.
- `vitest-axe` `axe()` check still passes for at least one variant combination per component that changed its DOM structure (Modal tone badge, Tabs enclosed variant, Avatar with `icon` fallback, Badge with `dot`).
- `Button` with `as="a"`: renders `<a href="...">`, no `type="button"` attribute, `loading` applies `aria-disabled` instead of `disabled`.
- `Spinner`: numeric `size` renders inline `style` with that pixel value; `Dots` renders 3 elements with staggered `animationDelay` styles.

Stories: each changed component's `.stories.tsx` gains one named export per new prop/variant combination introduced above (e.g. `ButtonAsLink`, `ButtonPill`, `ModalSheetPresent`, `ModalWithTone`, `TabsEnclosed`, `TabsWithIconsAndCounts`, `BadgeWithDot`, `SpinnerNumericSize`, `SpinnerDots`, `TooltipRich`, `TooltipLight`, `TooltipBrand`, `PaginationPill`, `AvatarGroupChildren` replacing any `AvatarGroup` story that used the old `avatars` array prop).

## Out of Scope

- Migrating any of these components to consume `src/tokens/*.ts` instead of hardcoded Tailwind arbitrary values (tracked separately, not part of this spec).
- `RadioGroup` component / roving-tabindex keyboard navigation (no gap versus the DS confirmed — DS also has no `RadioGroup`).
- Pagination's `variant: 'numbered'|'compact'` as an explicit prop (currently CSS-breakpoint-driven) — noted as a possible future follow-up, not requested.
- Any of the 7 fully-missing components (`Progress`, `Tag`, `IconButton`, `FilterBar`, `FileUploader`, `ListItem`, `Chart`) — separate spec ("Spec B"), not started.
- Migrating `Checkbox`/`Radio`/`Select` to native `<input>`/`<select>` elements, or `Modal`/`Tabs`/`Tooltip` off Radix — both explicitly ruled out by the architecture decisions above.
