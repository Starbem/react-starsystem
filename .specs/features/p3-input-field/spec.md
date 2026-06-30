# Input Field — P3 Spec (ID-3169)

**Figma source:** Star System DS · fileKey `6wfkhBhONJ7r4A0PZWIsIs` · nodeId `3206:12256`  
**Verified nodes:** `3216:9794` (placeholder), `3216:9842` (filled), `3216:9844` (error), `3216:9824` (disabled), `3216:9802` (label), `3216:9812` (label+hint), `3216:9574` (leading icon)

---

## Component

`Input` — controlled text input with floating label, hint/error text, and optional icon slots.

**File path:** `src/components/Input/`

---

## Figma-Verified Tokens

### Container

| Property | Value | Token |
|---|---|---|
| Background (default/error) | `#F7F7F7` | Neutral/25 |
| Background (disabled) | `#EFEFEF` | Neutral/50 |
| Border (default) | `#B6B6B6` | Neutral/300 |
| Border (error) | `#FF4242` | Support/Error/Base |
| Border radius | `16px` | |
| Padding | `px-[16px] py-[8px]` | |
| Inner height | `h-[40px]` | label-input area |
| Gap (icon ↔ text) | `gap-[8px]` | |
| Shadow (default/error) | `0px 1px 2px 0px rgba(12,17,29,0.10)` | Elevation/00 |
| Shadow (disabled) | none | |

### Typography

| Element | Size | Line height | Letter spacing | Color | Token |
|---|---|---|---|---|---|
| Label (floating) | 12px | 16px | 0 | `#9C9C9C` | Neutral/400, Caption/Regular |
| Input value | 16px | 24px | 0 | `#393939` | Neutral/800, Subtitle/MD/Regular |
| Placeholder (no label) | 16px | 24px | 0 | `#9C9C9C` | Neutral/400 |
| Placeholder (with label) | 16px | 24px | 0 | `#808080` | Neutral/500 |
| Input text (disabled) | 16px | 24px | 0 | `#B6B6B6` | Neutral/300 |
| Hint text | 14px | 20px | 0.1px | `#808080` | Neutral/500, Subtitle/SM/Regular |
| Error text | 14px | 20px | 0.1px | `#FF4242` | Support/Error/Base |

Font family: `Funnel Display` (all elements)

### Icon slots

| Property | Value |
|---|---|
| Icon size | `24px × 24px` |
| Icon color (neutral) | `#808080` (Neutral/500) |
| Gap below input → hint | `6px` |

### Focus state (inferred — not in Figma)

`focus-within:ring-2 focus-within:ring-[#FF5100] focus-within:ring-offset-2` — brand primary, same pattern as Button.

---

## States

| State | bg | border | shadow | input text | placeholder |
|---|---|---|---|---|---|
| Placeholder (default) | `#F7F7F7` | `#B6B6B6` | yes | — | `#9C9C9C` |
| Filled | `#F7F7F7` | `#B6B6B6` | yes | `#393939` | — |
| Error | `#F7F7F7` | `#FF4242` | yes | `#393939` | — |
| Disabled | `#EFEFEF` | `#B6B6B6` | no | `#B6B6B6` | `#B6B6B6` |

---

## Props API

```tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string       // floating label inside container (12px, Neutral/400)
  hint?: string        // helper text below container (14px, Neutral/500)
  error?: string       // error message below; also sets error border; overrides hint
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}
```

- Extends `InputHTMLAttributes<HTMLInputElement>` — passthrough `disabled`, `id`, `onChange`, `value`, `placeholder`, `type`, `aria-*`, etc.
- `error` takes precedence over `hint` for the text below.
- When `error` is set, border → `#FF4242`; hint text → `#FF4242`.
- `disabled` from HTML attrs: bg → `#EFEFEF`, text → `#B6B6B6`, `cursor-not-allowed`, no shadow.
- `label` renders as a `<span>` inside the container above the `<input>`.

---

## Accessibility

- Wrap outer `<div>` is not the label target — the inner `<input>` must have `id` forwarded.
- When `label` prop is set, render `<label htmlFor={id}>` if `id` is provided; else use `aria-label` fallback.
- Error state: `aria-invalid="true"` on `<input>`, `aria-describedby` pointing to error text `<p>`.
- Hint state: `aria-describedby` pointing to hint text `<p>`.
- `disabled`: HTML `disabled` attr on `<input>`.

---

## Anatomy

```
<div> (wrapper — flex col gap-[6px])
  <div> (container — bg, border, rounded-[16px], shadow, px-[16px] py-[8px], flex row gap-[8px])
    [leadingIcon? → <span> size-[24px]]
    <div> (label-input — flex col h-[40px] justify-center flex-1 min-w-0)
      [label? → <span> 12px #9C9C9C]
      <input> (16px Funnel Display, bg-transparent)
    [trailingIcon? → <span> size-[24px]]
  [hint|error? → <p> 14px]
```

---

## Not in scope (P3)

- `Type=Leading dropdown`, `Type=Trailing dropdown`, `Type=Leading text`, `Type=Payment input` — deferred
- `Textarea` input — separate component
- `Verification code` input — separate component
- `Input Increment` — separate component
- Multiple sizes (Figma shows single outline size for this component)
