# Button Component Spec — P2

**Jira:** ID-3168  
**Figma:** Star System → Buttons page (fileKey: `6wfkhBhONJ7r4A0PZWIsIs`, nodeId: `3201:16294`)  
**Branch:** `feat/ID-3168-button-component`

---

## Requirements

### R-01: Variants

Five variants, all Figma-verified (Star System DS):

| Variant | Figma Hierarchy | BG | Border | Text | Shadow |
|---|---|---|---|---|---|
| `primary` | Primary | `#FF5100` | `#FF5100` | `#F7F7F7` | Elevation/00 |
| `secondary` | Secondary color | transparent | `#FF5100` | `#FF5100` | none |
| `outline` | Secondary gray | `#F7F7F7` | `#B6B6B6` | `#393939` | Elevation/00 |
| `ghost` | Tertiary gray | `#E2E2E2` | none | `#808080` | none |
| `danger` | Button destrutive | `#FF4242` | `#FF4242` | `#F7F7F7` | Elevation/00 |

Elevation/00 = `box-shadow: 0px 1px 2px 0px rgba(12,17,29,0.10)`

### R-02: Sizes

All sizes Figma-verified. Border radius = 16px for all sizes.

| Size | Padding X | Padding Y | Font Size | Line Height |
|---|---|---|---|---|
| `sm` | 14px | 8px | 14px | 20px |
| `md` (default) | 16px | 10px | 14px | 20px |
| `lg` | 18px | 10px | 16px | 24px |

Font: `Funnel Display`, weight 500 (Medium), from CSS var `--font-brand`.

### R-03: States

- **disabled**: `disabled` HTML attribute + `pointer-events-none` + `opacity-50` (Figma-verified: disabled primary uses `#FFC992` bg but opacity-50 approach is applied via CSS, not color swap)
- **loading**: Shows spinner (SVG animate-spin) inline left of text; button remains `disabled` during loading; aria-label describes loading state
- **focus-visible**: visible ring 2px offset 2px (WCAG AA)

### R-04: Icon slots

- `iconLeft`: ReactNode rendered before text
- `iconRight`: ReactNode rendered after text
- `iconOnly`: boolean prop — when true, renders only the icon (no text), applies equal padding on all sides

### R-05: Accessibility

- Rendered as `<button>` element (native semantics)
- `aria-disabled` set when `disabled` or `loading`
- Focus ring visible on `focus-visible` (not `:focus` — no ring on mouse click)
- `type="button"` default to prevent accidental form submission

### R-06: API surface

```ts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
}
```

Default: `variant="primary"`, `size="md"`.

### R-07: Storybook

Stories for all 5 variants × 3 sizes = 15 base stories.  
Additional stories: loading state, disabled state, icon-left, icon-right, icon-only.  
Meta tag: `autodocs`.

### R-08: Tests

Minimum coverage:
- Renders children text
- Each variant applies correct CSS class pattern
- Disabled prop → `button.disabled === true` + `aria-disabled="true"`
- Loading prop → spinner present + button disabled
- iconLeft / iconRight rendered when provided
- Click fires handler when enabled, not when disabled

---

## Out of scope

- Hover/active/focus color overrides beyond CSS pseudo-classes
- Dark mode variants
- Button group (separate component)
- Liquid glass variant
- Social buttons
