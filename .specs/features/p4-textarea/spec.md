# Textarea — P4 Spec (ID-3170)

**Figma source:** Star System DS · fileKey `6wfkhBhONJ7r4A0PZWIsIs`  
**Verified nodes:** `3206:17573` (default), `3206:17585` (with label), `3206:17575` (error), `3206:17589` (disabled), `3206:17583` (error+hint)

---

## Component

`Textarea` — multiline text input with optional floating label, hint/error text. Wraps `<textarea>`.

**File path:** `src/components/Textarea/`

---

## Figma-Verified Tokens

### Container

| Property | Value | Token |
|---|---|---|
| Background (default/error) | `#F7F7F7` | Neutral/25 |
| Background (disabled) | `#EFEFEF` | Neutral/50 |
| Border (default) | `#B6B6B6` | Neutral/300 |
| Border (error) | `#FF867E` | Support/Error/Light ⚠️ differs from Input |
| Border radius | `16px` | |
| Padding | `px-[14px] py-[10px]` | ⚠️ differs from Input `px-[16px] py-[8px]` |
| Gap (label ↔ textarea) | `gap-[4px]` | |
| Gap (container ↔ hint) | `gap-[6px]` | |
| Shadow (default) | `0px 1px 2px 0px rgba(12,17,29,0.10)` | Elevation/00 |
| Shadow (error) | none | |
| Shadow (disabled) | none | |
| Disabled opacity | `opacity-60` on outer wrapper | ⚠️ Input uses color swap, Textarea uses opacity |

### Typography

| Element | Size | Line height | Letter spacing | Color | Token |
|---|---|---|---|---|---|
| Label (floating) | 12px | 16px | 0 | `#9C9C9C` | Neutral/400, Caption/Regular |
| Textarea text / placeholder | 16px | 24px | 0 | `#808080` | Neutral/500 |
| Hint text | 14px | 20px | 0.1px | `#808080` | Neutral/500, Subtitle/SM/Regular |
| Error text | 14px | 20px | 0.1px | `#FF4242` | Support/Error/Base |

Font family: `Funnel Display` (all elements)

---

## States

| State | bg | border | shadow | wrapper opacity |
|---|---|---|---|---|
| Default (placeholder/filled) | `#F7F7F7` | `#B6B6B6` | yes | 1 |
| Error | `#F7F7F7` | `#FF867E` | no | 1 |
| Disabled | `#EFEFEF` | `#B6B6B6` | no | 0.6 |

---

## Props API

```tsx
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string    // floating label inside container (12px, Neutral/400)
  hint?: string     // helper text below container (14px, Neutral/500)
  error?: string    // error message below; also sets error border; overrides hint
}
```

- Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` — passthrough `disabled`, `id`, `rows`, `value`, `onChange`, `placeholder`, `aria-*`, etc.
- `error` overrides `hint` for the text below.
- `error` → border `#FF867E`, hint text `#FF4242`.
- `disabled` → bg `#EFEFEF`, `opacity-60` on outer wrapper, `cursor-not-allowed`.
- `label` renders as a `<span>` inside the container above the `<textarea>`.
- No icon slots — not in Figma spec.
- Default `rows` not set in component — consumers use the HTML `rows` prop.
- Default browser resize is `resize-y`; can be overridden via `className`.

---

## Accessibility

- When `id` provided + `label` prop set: render `<label htmlFor={id}>` outside container wrapping the full component, OR use `aria-label` fallback.
  - **Implementation note:** Since label is inside the container (floating), use `aria-label` if `id` is missing, or wire `<label>` if `id` is present via htmlFor.
- Error state: `aria-invalid="true"` on `<textarea>`, `aria-describedby` → hint/error `<p>` id.
- Hint state: `aria-describedby` → hint `<p>` id.
- `disabled`: HTML `disabled` attr on `<textarea>`.

---

## Anatomy

```
<div> (wrapper — flex col gap-[6px] w-full)
  <div> (container — bg, border, rounded-[16px], px-[14px] py-[10px], flex col gap-[4px])
    [label? → <span> 12px #9C9C9C shrink-0]
    <textarea> (16px Funnel Display, bg-transparent, resize-y)
  [hint|error? → <p> 14px]
```

---

## Differences from Input

| Property | Input | Textarea |
|---|---|---|
| HTML element | `<input>` | `<textarea>` |
| Error border | `#FF4242` | `#FF867E` |
| Disabled | color swap | `opacity-60` on wrapper |
| Padding | `px-[16px] py-[8px]` | `px-[14px] py-[10px]` |
| Inner gap | `h-[40px]` fixed inner div | `gap-[4px]` flex col |
| Icon slots | yes (leading + trailing) | no |
| Resize | n/a | `resize-y` default |

---

## Not in scope (P4)

- Rich text / WYSIWYG toolbar (separate component seen on same Figma page)
- Character count display
- Auto-resize to content height (consumers can implement via `onInput`)
- Readonly state (not in Figma variants)
