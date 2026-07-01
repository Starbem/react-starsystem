# Radio Component Spec — P7

**Jira:** ID-3173
**Figma:** Star System → Checkboxes page (fileKey: `6wfkhBhONJ7r4A0PZWIsIs`, nodeId: `3228:15912` — Radio variants live on the same page/frame as Checkbox)
**Branch:** `feat/ID-3173-radio`

**Architecture decision:** Custom, not Radix UI — same decision and rationale as `Checkbox` (see `.specs/features/p6-checkbox/spec.md` Architecture decision). Already validated with the user for all remaining Radix-mentioning tasks.

---

## Figma-Verified Nodes

| Node | Description |
|---|---|
| `3228:16330` / `3228:16282` | Radio, md, unchecked, Default (bare, 24px — two duplicate refs, same values) |
| `3228:16345` / `3228:16250` | Radio, md, checked, Default |
| `3228:16339` / `3228:16258` | Radio, md, unchecked, Hover |
| `3228:16369` / `3228:16238` | Radio, md, checked, Hover |
| `3228:16333` / `3228:16274` | Radio, md, unchecked, Disabled |
| `3228:16353` / `3228:16226` | Radio, md, checked, Disabled |
| `3228:16006` | Radio + label + supporting text, md, checked, Default (344px row anatomy — identical layout to Checkbox's) |

## Requirements

### R-01: Box anatomy

Same two sizes as Checkbox, but fully round (`rounded-full` — Figma reports `rounded-[16px]` on a 24px box, which is geometrically a full circle):

| Size | Outer circle | Inner dot (checked) |
|---|---|---|
| `sm` | 16×16px | ~8px — **[Provável]**, see note |
| `md` (default) | 24×24px | ~12px — **[Provável]**, see note |

> **[Provável]** Inner dot size: the Figma checked-radio node renders as a single flattened image (composited vector group), not exposed as separate border+fill layers via the design-context API. Visual inspection (pixel-upscaled screenshot of node `3228:16345`) shows a solid center dot roughly 40–50% of the box diameter. Used a clean 50% ratio (dot = box/2, centered). Validate against Figma directly if pixel-perfect match matters.

### R-02: States & colors (Figma-verified for ring/background; dot color inferred from Checkbox's identical icon-color convention)

| State | Background | Ring border | Dot color | Extra |
|---|---|---|---|---|
| Unchecked, Default | `#F7F7F7` (Neutral/25) | `#B6B6B6` (Neutral/300) | — | — |
| Checked, Default | `#F7F7F7` | `#FF5100` (Primary/Base) | `#FF5100` | — |
| Any, Hover | `#F7F7F7` | `#FF5100` | `#FF5100` if checked | glow shadow `0px 0px 12px 0px rgba(255,169,71,0.4)` (Elevation/Hover/Secondary) — identical to Checkbox's hover glow |
| Unchecked, Disabled | `#E2E2E2` (Neutral/100) | `#CFCFCF` (Neutral/200) | — | cursor-not-allowed |
| Checked, Disabled | `#E2E2E2` | `#CFCFCF` | `#CFCFCF` **[Provável]** | cursor-not-allowed — same inference as Checkbox's disabled icon color (no explicit color style surfaced by Figma for this state) |

No indeterminate state (radios don't have one) and no error state (same as Checkbox — not in Figma).

### R-03: Label + supporting text anatomy

Identical to Checkbox's R-04 (same 344px row Figma component, same spacing/typography/weight-on-active convention): `flex items-start gap-[12px]`, `pt-[2px]` wrapper, label 16px/24px `#393939` (Regular unchecked → Medium checked), supporting text 14px/20px `#808080`.

### R-04: Props API

```ts
export interface RadioProps {
  value: string
  checked?: boolean
  disabled?: boolean
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  className?: string
}

export interface RadioGroupProps {
  children: ReactNode
  value?: string
  onChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  label?: string
  name?: string
  className?: string
}
```

- Unlike `Checkbox` (self-contained `checked`/`onChange`), `Radio` is **presentation-only** inside a `RadioGroup` — `checked` is computed and injected by `RadioGroup` (via `cloneElement`, comparing each child's `value` to the group's `value`), and clicks bubble up to the group's `onChange`. A standalone `<Radio>` outside a group can still be used with an explicit `checked` prop for one-off cases, but has no `onChange` of its own — matches Jira's prop list (`value`, `disabled`, `label` only for `Radio`; `value`/`onChange`/`orientation` on `RadioGroup`).
- `RadioGroup`'s `disabled` cascades to all children (a child's own `disabled={true}` still wins if explicitly set).

### R-05: Accessibility

- `RadioGroup` root: `role="radiogroup"`, `aria-label={label}`.
- Each `Radio`: `role="radio"`, `aria-checked`, `aria-disabled`, single shared `tabIndex` roving pattern — **only the checked radio (or the first, if none checked) is `tabIndex=0`; all others are `tabIndex=-1`**, matching native `<input type="radio">` group behavior and the Jira requirement ("setas navegam entre opções").
- Keyboard on the group (`onKeyDown` at the `radiogroup` container, per WAI-ARIA radiogroup pattern): `ArrowDown`/`ArrowRight` → next option (wraps), `ArrowUp`/`ArrowLeft` → previous (wraps), moving focus AND selecting immediately (native radio group convention — arrow keys both move and select, unlike Select's arrow-then-Enter). `Space`/`Enter` on a focused radio also selects (redundant with arrow-select but required by Jira's acceptance criteria).
- `label` + `id` → `aria-labelledby`, same click-to-toggle span pattern as Checkbox (not native `<label htmlFor>`, same reasoning: root is `role="radio"`, not a form control).

---

## Out of scope (P7)

| Feature | Reason |
|---|---|
| Error/invalid state | Not in Figma (same as Checkbox) |
| Radix UI adoption | Rejected — see Architecture decision |
| `FormField` wrapper | ID-3175, not yet built |
| Card-style radio (Figma has a separate "App / Card checkbox" component) | Different component, not requested by ID-3173 |
