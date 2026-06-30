# Select — P5 Spec (ID-3171)

**Figma source:** Star System DS · fileKey `6wfkhBhONJ7r4A0PZWIsIs`  
**Verified nodes:**
- `3236:20820` — Trigger, State=Placeholder, Type=Default, Label=False, Supporting text=False
- `3236:20898` — Trigger, State=Open/focused, Type=Default (includes open menu)
- `3236:20241` — Menu item, State=Default, Check=False
- `3236:20249` — Menu item, State=Default, Check=True (selected)

---

## Component

`Select` — custom dropdown select with accessible combobox semantics. Shows a trigger button (closed state) that opens a floating list of options. NOT a native `<select>` — custom implementation to match the Figma design exactly.

**File path:** `src/components/Select/`

---

## Figma-Verified Tokens

### Trigger — Closed

| Property | Value | Token |
|---|---|---|
| Background | `#F7F7F7` | Neutral/25 |
| Border (default) | `#B6B6B6` | Neutral/300 |
| Border radius | `16px` | |
| Height | `56px` (total: `py-[8px]` × 2 + `h-[40px]` content) | |
| Padding | `px-[16px] py-[8px]` | |
| Shadow | `0px 1px 2px 0px rgba(12,17,29,0.10)` | Elevation/00 |
| Placeholder text | `#9C9C9C`, 16px, Regular | Neutral/400 |
| Selected value text | `#393939`, 16px, **Medium (500)** | Neutral/800 |
| Chevron icon | `keyboard_arrow_down`, `20px` | ⚠️ 20px not 24px (differs from Input icons) |

### Trigger — Open / Focused

| Property | Value | Token |
|---|---|---|
| Border | `#D1B4F6` | Secondary/Lighter (purple) — ⚠️ replaces orange focus ring |
| Shadow | `0px 1px 2px 0px rgba(12,17,29,0.10)` | Elevation/00 (unchanged) |
| Chevron icon | `keyboard_arrow_up`, `20px` | rotates to indicate open |

> **Key difference from Input/Textarea:** Select open state uses a purple border (`#D1B4F6`) instead of the orange `focus-within:ring-2 ring-[#FF5100]` used by Input/Textarea. There is NO orange focus ring on Select.

### Trigger — Disabled

| Property | Value |
|---|---|
| Background | `#EFEFEF` (Neutral/50) |
| Border | `#B6B6B6` (Neutral/300) |
| Text / placeholder | `#B6B6B6` (Neutral/300) |
| Shadow | none |
| Cursor | `not-allowed` |

### Floating Label (inside trigger, same pattern as Input)

| Property | Value |
|---|---|
| Font size | 12px |
| Line height | 16px |
| Color | `#9C9C9C` (Neutral/400) |
| Font weight | Regular |

### Hint / Error Text (below trigger)

| State | Color |
|---|---|
| Hint | `#808080` (Neutral/500) |
| Error | `#FF4242` (Support/Error/Base) |

> **[Incerto]** Error border color for Select trigger not explicitly shown in Figma variants (no "Error" state). Using `#FF4242` aligned with Input pattern (most consistent form field behavior). Verify with design if Select can have an error state.

### Menu Panel

| Property | Value | Token |
|---|---|---|
| Background | `#F7F7F7` | Neutral/25 |
| Border | `#E2E2E2` | Neutral/100 |
| Border radius | `16px` | |
| Shadow | `0px 4px 16px 2px rgba(70,31,174,0.10)` | Elevation/Secondary (purple glow) |
| Inner padding | `py-[4px]` (on items list container) | |
| Gap from trigger | `8px` (`mt-[8px]`) | |
| Max height | `320px` (Figma shows 320px, use `max-h-[320px] overflow-y-auto`) | |
| Width | matches trigger width (`w-full`) | |
| Position | absolute, below trigger | |
| z-index | `z-50` | |

### Menu Item

| State | Background | Text color | Extra |
|---|---|---|---|
| Default | none | `#393939` (Neutral/800) | — |
| Hover | `#EFEFEF` (Neutral/50) | `#393939` | — |
| Selected (Check=True) | `#EFEFEF` (Neutral/50) | `#393939` | + checkmark icon 20px |
| Disabled | none | `#B6B6B6` (Neutral/300) | cursor-not-allowed |

| Property | Value | Token |
|---|---|---|
| Padding | `px-[16px] py-[8px]` | |
| Height | `40px` (8+8 padding + 24px line height) | |
| Font size | 16px | |
| Font weight | **Medium (500)** | Subtitle/MD/Medium — ⚠️ differs from placeholder (Regular) |
| Line height | 24px | |
| Font family | Funnel Display | |
| Check icon | `check`, 20px, `#393939` | |

---

## States

| State | Trigger border | Shadow | Notes |
|---|---|---|---|
| Default (placeholder) | `#B6B6B6` | yes (Elevation/00) | Chevron down |
| Default (has value) | `#B6B6B6` | yes | Selected text Medium |
| Open | `#D1B4F6` (purple) | yes | Chevron up, menu visible |
| Error | `#FF4242` [Incerto] | yes | See note above |
| Disabled | `#B6B6B6` | no | cursor-not-allowed, no open |

---

## Props API

```tsx
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string      // floating label inside trigger (12px, #9C9C9C)
  hint?: string       // helper text below trigger
  error?: string      // error message below; also sets error border; overrides hint
  disabled?: boolean
  id?: string
  name?: string       // hidden <input type="hidden"> for form integration
  className?: string
}
```

- Controlled via `value` + `onChange`; no internal value state (consumers own the state)
- `error` overrides `hint` for text below the trigger
- `disabled` → trigger not clickable, options not reachable
- `name` → renders a hidden `<input type="hidden" name={name} value={value ?? ''}>` for form submission
- `id` wires `<label htmlFor={id}>` if both `id` and `label` are provided

---

## Accessibility

- Trigger: `<button role="combobox" aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={`${id}-listbox`} aria-labelledby={labelId}`>`
- Menu: `<ul role="listbox" id={`${id}-listbox`}>`
- Options: `<li role="option" aria-selected={isSelected} aria-disabled={isDisabled}>`
- When `label` + `id` provided: render `<label id={labelId} htmlFor={id}>` above the trigger wrapper
- Error: `aria-invalid="true"` on trigger, `aria-describedby` → hint/error `<p>` id
- Keyboard:
  - `Enter` / `Space` → open/close
  - `ArrowDown` → next option (wraps)
  - `ArrowUp` → prev option (wraps)
  - `Enter` on focused option → select + close
  - `Escape` → close without selecting
  - Tab → closes menu (focus leaves)
- Click outside → close menu (mousedown listener on document)

---

## Anatomy

```
<div> (root wrapper — flex col gap-[6px] w-full relative)
  [label? → <label htmlFor={id}> 12px #9C9C9C]
  <div> (trigger wrapper — relative w-full)
    <button role="combobox"> (trigger — bg, border, rounded-[16px], px-[16px] py-[8px] h-[56px], flex items-center gap-[8px])
      <div> (content — flex-1 flex flex-col justify-center)
        [label? → <span> 12px #9C9C9C]
        <span> (value or placeholder — 16px, Regular or Medium)
      <ChevronIcon size=20px>
    [isOpen →
      <ul role="listbox" > (menu panel — absolute w-full mt-[8px] bg #F7F7F7 border #E2E2E2 rounded-[16px] shadow py-[4px] max-h-[320px] overflow-y-auto z-50)
        <li role="option"> (item — px-[16px] py-[8px] flex items-center gap-[8px] 16px Medium)
          <span> option label
          [selected → <CheckIcon size=20px>]
    ]
  [hint|error? → <p> 14px]
  [name → <input type="hidden">]
```

---

## Icons (inline SVG — no external dependency)

```tsx
// keyboard_arrow_down (24px viewBox, 20px render)
<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>

// keyboard_arrow_up (24px viewBox, 20px render)
<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>

// check (24px viewBox, 20px render)
<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
```

Use `aria-hidden="true"` on all icon SVGs.

---

## Differences from Input / Textarea

| Property | Input | Textarea | Select |
|---|---|---|---|
| Focus ring | orange `ring-[#FF5100]` | orange `ring-[#FF5100]` | purple border `#D1B4F6` (open state) |
| Icon size | 24px | — | 20px chevron |
| Content element | `<input>` | `<textarea>` | custom `<button>` + `<ul>` |
| Height | 56px | flexible | 56px (trigger fixed) |
| Item text weight | — | — | Medium 500 (options) |

---

## Not in scope (P5)

- Search/filter input inside dropdown (Type=Search variant — separate feature)
- Avatar/Icon leading trigger variants
- Multi-select
- Portal rendering (absolute positioning within relative wrapper sufficient)
- Async options loading
- Option groups / sections
- Custom option rendering (only label string)
