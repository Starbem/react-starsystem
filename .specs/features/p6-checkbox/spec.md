# Checkbox Component Spec — P6

**Jira:** ID-3172
**Figma:** Star System → Checkboxes page (fileKey: `6wfkhBhONJ7r4A0PZWIsIs`, nodeId: `3228:15912`)
**Branch:** `feat/ID-3172-checkbox`

**Architecture decision:** Custom implementation, NOT Radix UI. The Jira description mentions "Baseado em Radix UI Checkbox" but this is inconsistent with the rest of the library — Button, Input, Textarea and Select (P2–P5) are all 100% custom with zero UI deps beyond `clsx`+`tailwind-merge`. Validated with the user (julio.sousa@starbem.app): stay custom for Checkbox and all remaining Radix-mentioning tasks (Radio, Toggle, Modal, Tooltip, Popover, Dropdown) to keep the dependency footprint and pattern consistent. Same accessibility guarantees achieved via `role="checkbox"` + `aria-checked` (including `"mixed"` for indeterminate).

---

## Figma-Verified Nodes

| Node | Description |
|---|---|
| `3228:15912` | Canvas root — "Checkboxes" page |
| `3228:16276` | Checkbox, sm, unchecked, Default (bare, 16px) |
| `3228:16280` | Checkbox, md, unchecked, Default (bare, 24px) |
| `3228:16240` / `3228:16246` | Checkbox, sm/md, checked, Default |
| `3228:16242` / `3228:16248` | Checkbox, sm/md, indeterminate, Default |
| `3228:16294` / `3228:16338` | Checkbox, sm/md, unchecked, Hover |
| `3228:16332` | Checkbox, md, unchecked, Disabled |
| `3228:16349` / `3228:16351` | Checkbox, md, checked/indeterminate, Disabled |
| `3228:16000` / `3228:16096` | Checkbox + label + supporting text, md, checked/unchecked, Default (344px row anatomy) |
| `3228:16342` | `check` icon (checkmark vector) |
| `3228:16344` | `check_indeterminate_small` icon (dash vector) |

---

## Requirements

### R-01: Box anatomy

Two sizes, both Figma-verified:

| Size | Box | Radius | Icon inset |
|---|---|---|---|
| `sm` | 16×16px | 4px | ~12.5% |
| `md` (default) | 24×24px | 6px | ~15% |

### R-02: States & colors (Figma-verified)

| State | Background | Border | Icon color | Extra |
|---|---|---|---|---|
| Unchecked, Default | `#F7F7F7` (Neutral/25) | `#B6B6B6` (Neutral/300) | — | — |
| Checked, Default | `#F7F7F7` | `#FF5100` (Primary/Base) | `#FF5100` | checkmark |
| Indeterminate, Default | `#F7F7F7` | `#FF5100` | `#FF5100` | dash icon |
| Any, Hover | `#F7F7F7` | `#FF5100` | `#FF5100` if checked | glow shadow `0px 0px 12px 0px rgba(255,169,71,0.4)` (Elevation/Hover/Secondary) |
| Unchecked, Disabled | `#E2E2E2` (Neutral/100) | `#CFCFCF` (Neutral/200) | — | cursor-not-allowed |
| Checked/Indeterminate, Disabled | `#E2E2E2` | `#CFCFCF` | `#CFCFCF` [Provável] | cursor-not-allowed |

> **[Provável]** Disabled icon color: Figma's design-context response for the disabled checked/indeterminate icon did not surface an explicit color style (unlike the enabled variant, which explicitly reports `Primary/Base #FF5100`). Visual inspection shows the icon barely visible/blended with the border. Inferred as `#CFCFCF` (matches border, same convention as Input's disabled placeholder using its border-adjacent gray). Validate with design if this reads as too low-contrast.

No distinct **error** state exists in Figma for Checkbox (unlike Input/Select). Out of scope — see below.

### R-03: Icons (inline SVG, no external asset — same convention as Select)

Checkmark (from Figma `check` vector, fill = icon color):
```
M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z
```
(Same path already used in `Select.tsx` for the selected-option check — reuse, don't duplicate.)

Indeterminate dash (horizontal bar, centered, Figma `check_indeterminate_small`):
```
M5 11h14v2H5z
```
Both rendered `aria-hidden="true"`, sized to ~60% of the box (matches Figma's ~12.5–15% inset), `fill="currentColor"` so `text-[#FF5100]` / `text-[#CFCFCF]` on the wrapping span controls color.

### R-04: Label + supporting text anatomy (Figma-verified, `Text=True, Supporting text=True` variant)

| Property | Value |
|---|---|
| Row layout | `flex items-start gap-[12px]` |
| Checkbox wrapper | `pt-[2px]` (aligns box to first line of label) |
| Label | Funnel Display, 16px/24px, `#393939` (Neutral/800) — **Regular (400) when unchecked, Medium (500) when checked or indeterminate** |
| Supporting text | Funnel Display, 14px/20px, tracking 0.1px, `#808080` (Neutral/500) — same weight/color regardless of checked state |
| Gap label↔supporting | `2px` (flex-col) |

> Label weight change (Regular→Medium on check) mirrors the same "emphasize when active" convention already used in `Select`'s selected menu item.

### R-05: Props API

```ts
export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'   // default 'md'
  id?: string
  name?: string
  value?: string
  className?: string
}

export interface CheckboxGroupProps {
  children: ReactNode
  orientation?: 'vertical' | 'horizontal'  // default 'vertical'
  label?: string
  className?: string
}
```

- Controlled via `checked` + `onChange`; no internal state (consumer owns it) — same pattern as `Select`.
- `indeterminate` takes visual precedence over `checked` (renders dash icon regardless of `checked` value) but does NOT change what `onChange` reports — clicking always toggles based on current `checked`.
- `CheckboxGroup` is a structural wrapper only (no Figma-distinct visual spec found for the group frame itself) — renders `role="group"`, `aria-label={label}`, flex container with `gap-[12px]` (vertical) or `gap-[24px]` (horizontal), consistent with existing spacing scale. **[Provável]** — no dedicated Figma frame for the group container was found; validate spacing with design if a "Checkbox group" frame surfaces later.

### R-06: Accessibility

- Root element: `<span role="checkbox" tabIndex={disabled ? -1 : 0} aria-checked={indeterminate ? 'mixed' : checked} aria-disabled={disabled || undefined} aria-labelledby aria-describedby>` — NOT a native `<input type="checkbox">`, because indeterminate + custom styling needs full control (same reasoning `Select` used for combobox vs native `<select>`).
- Hidden native `<input type="checkbox">` (visually hidden, `sr-only` or `hidden`) only when `name` is provided, so the value participates in native form submission — mirrors `Select`'s hidden-input pattern for `name`.
- Keyboard: `Space`/`Enter` toggles. `Tab` moves focus normally (no roving tabindex inside a single Checkbox; `CheckboxGroup` does NOT trap/rove focus — each checkbox is independently tabbable, unlike `RadioGroup`).
- `label` + `id` → external `<label htmlFor={id}>`; clicking label toggles (native `<label>` behavior).
- Focus-visible ring: reuse existing orange ring convention (`focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2`) rather than the Hover glow (glow is hover-only per Figma; focus uses the established WCAG ring pattern from Button/Input).

---

## Out of scope (P6)

| Feature | Reason |
|---|---|
| Error/invalid state | No Figma variant exists for Checkbox error state (unlike Input/Select) |
| `CheckboxGroup` value-array management (`value`, `onChange` returning selected list) | Jira ID-3172 only asks for "suporte a CheckboxGroup para múltiplos checkboxes relacionados" — structural grouping, not controlled multi-select state. Consumers compose their own state with individual `Checkbox` `checked`/`onChange` inside the group. |
| Radix UI adoption | Explicitly rejected — see Architecture decision above |
| FormField wrapper component itself | ID-3175, not yet built — Checkbox exposes `label`/`supportingText` props compatible with future FormField composition, doesn't depend on it |
