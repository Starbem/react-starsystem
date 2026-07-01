# Toggle Component Spec — P8

**Jira:** ID-3174
**Figma:** Star System → "Toogle" page (fileKey: `6wfkhBhONJ7r4A0PZWIsIs`, nodeId: `3228:12955`)
**Branch:** `feat/ID-3174-toggle`

**Architecture decision:** Custom, not Radix UI — same decision/rationale as Checkbox and Radio (see `.specs/features/p6-checkbox/spec.md`).

---

## Figma-Verified Nodes

| Node | Description |
|---|---|
| `3228:13517` | Toggle, md, off, Default (bare, 44×24) |
| `3228:13437` | Toggle, md, on, Default |
| `3228:13537` | Toggle, md, off, Disabled |
| `3228:13457` | Toggle, md, on, Disabled |
| `3228:13527` | Toggle, sm, off, Default (bare, 36×20) |
| `3228:13447` | Toggle, sm, on, Default |
| `3228:13522` | Toggle + label + supporting text, md, off, Default (344px row anatomy) |

No Hover variant exists in Figma for Toggle (unlike Checkbox/Radio, which have an explicit glow-on-hover state) — not implemented, to avoid inventing a state.

## Requirements

### R-01: Track & thumb anatomy

| Size | Track | Thumb | Thumb travel (off→on) |
|---|---|---|---|
| `sm` | 36×20px, `rounded-full`, `p-[2px]` | 16×16px | 16px |
| `md` (default) | 44×24px, `rounded-full`, `p-[2px]` | 20×20px | 20px |

Thumb: `bg-[#F7F7F7]` (Neutral/25) always, with shadow `0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.10)` (Figma `Shadow/sm`, both states). Travel distance = track width − thumb size − 2×padding (e.g. md: 44−20−4=20), same math as shadcn's Switch — cross-checked, not coincidence.

### R-02: States & colors (Figma-verified)

| State | Track background | Thumb |
|---|---|---|
| Off, Default | `#E2E2E2` (Neutral/100) | `#F7F7F7` + shadow |
| **On, Default** | **`#461FAE` (Secondary/Darker — purple, NOT Primary/Base orange)** | `#F7F7F7` + shadow |
| Off, Disabled | `#E2E2E2` | `#EFEFEF` (Neutral/50) muted, `opacity-50` on whole control |
| On, Disabled | `#461FAE` (same hex Figma reports for both default/disabled — muting is via layer opacity in Figma, not a distinct color) | `#F7F7F7`, `opacity-50` on whole control |

> **Important, don't "fix" this to match Checkbox/Radio:** Toggle's "on" color is genuinely purple (`#461FAE`), verified twice (bare node + labeled row node both report `Secondary/Darker: #461FAE`, no orange token anywhere in the on-state response). This is a deliberate Figma distinction between binary settings toggles (purple) and selection controls (orange checkmarks/radios).

### R-03: Label + supporting text anatomy (Figma-verified, differs from Checkbox/Radio)

| Property | Value |
|---|---|
| Row layout | `flex items-start gap-[12px]` (no `pt-[2px]` wrapper — track is vertically centered differently since it has no top-aligned checkbox-style icon) |
| Label | Funnel Display, **Medium (500) always** — 16px/24px, `#4D4D4D` (Neutral/700) |
| Supporting text | Funnel Display, Regular, 16px/24px (not 14px like Checkbox/Radio's supporting text — Figma's Toggle row uses the same 16px size for both lines), `#808080` (Neutral/500) |
| Gap label↔supporting | `2px` |

> Two deliberate divergences from Checkbox/Radio, both Figma-verified: (1) label color is Neutral/700 `#4D4D4D`, not Neutral/800 `#393939`; (2) label weight is always Medium, it does NOT switch Regular↔Medium based on checked state (Checkbox/Radio's "emphasize when active" convention does not apply here — the fetched Pressed=False anatomy example already renders `Funnel_Display:Medium`).

### R-04: Props API

```ts
export interface ToggleProps {
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  className?: string
}
```

Self-contained like `Checkbox` (not group-owned like `Radio`) — matches Jira's prop list (`checked`, `disabled`, `onChange`, `label`, `size` directly on `Toggle`, no separate group component requested).

### R-05: Accessibility

- `role="switch"`, `aria-checked`, `aria-disabled`, `tabIndex={disabled ? -1 : 0}`.
- `Space`/`Enter` toggles (per Jira "Label clicavel alterna estado" + native switch keyboard convention — switches don't use arrow keys, that's Radio's pattern).
- Clicking the label text toggles too (same `<span onClick>` pattern as Checkbox — root is `role="switch"`, not a native form control, so no `htmlFor`).
- `transition-colors` on track (background) + `transition-transform` on thumb (translateX) for the on/off animation Jira requires.
- Focus-visible ring: same orange WCAG ring convention as Button/Input/Checkbox/Radio (`focus-visible:ring-2 ring-[#FF5100] ring-offset-2`) — Figma has no distinct focus token for Toggle, reusing the established library-wide convention is the safer default over inventing one.

---

## Out of scope (P8)

| Feature | Reason |
|---|---|
| Hover state | Not in Figma for Toggle (present for Checkbox/Radio, absent here — verified via metadata, not an oversight) |
| Error/invalid state | Not in Figma (same as Checkbox/Radio) |
| Radix UI adoption | Rejected — see Architecture decision |
| `FormField` wrapper | ID-3175, not yet built |
