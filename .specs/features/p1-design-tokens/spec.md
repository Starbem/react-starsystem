# P1 — Design Tokens: Spec

**Feature:** Design Tokens
**Phase:** P1
**Jira:** ID-3164 (colors) · ID-3165 (typography) · ID-3166 (spacing + radius) · ID-3167 (Storybook)
**Status:** Specified

---

## Context

P0 delivered the library scaffold. P1 populates it with the design tokens from Figma Star System,
making them available as:

1. **TypeScript constants** in `src/tokens/` — consumed by component code and tests
2. **CSS custom properties** in `src/styles/globals.css @theme` — consumed by Tailwind v4 utilities
3. **Storybook token showcase** — consumed by designers/developers for reference

Figma Star System uses **fill/text/effect styles** (not Figma Variables). The MCP search
confirms style names but not hex/px values — actual values must be extracted during implementation
via `get_design_context` on a Star System component (e.g. Header, Button).

---

## Source of Truth

**Figma file:** `6wfkhBhONJ7r4A0PZWIsIs`
**Library key:** `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`
**Library name:** Star System (current)

> Star System (Old) is the deprecated library — do NOT use its styles.
> "Projeto - Julio (Não mexer)" is a personal project — do NOT use it.

---

## Requirements

### REQ-01: Color Tokens — Primary Palette (Orange)
**Jira:** ID-3164

The Primary color scale (orange brand color) exists in Figma as fill styles.
Confirmed base value: `#FF5100` (verified via `get_design_context`).

Style family: `Primary/` — 7 shades: Base, Light, Lighter, Lightest, Dark, Darker, Darkest

**Deliverables:**
- [ ] `src/tokens/colors.ts` — exports `colors.primary` object with all 7 shades
- [ ] `src/styles/globals.css` `@theme` block — CSS custom properties `--color-primary-base`, `--color-primary-light`, etc.

**Done when:**
- `colors.primary.base === '#FF5100'`
- `--color-primary-base` is defined in `@theme`

---

### REQ-02: Color Tokens — Secondary Palette (Purple/Violet)
**Jira:** ID-3164

The Secondary color scale in Figma is **purple/violet**, not pink.
Confirmed values: `secondary.base = #8660EC`, `secondary.darker = #461FAE` (both verified via `get_design_context`).

> **Decision (2026-06-30):** Figma has 3 brand palettes. Previous spec assumed 2. Following Figma exactly.

Style family: `Secondary/` — 7 shades: Base, Light, Lighter, Lightest, Dark, Darker, Darkest

**Deliverables:**
- [ ] `src/tokens/colors.ts` — exports `colors.secondary` object with all 7 shades
- [ ] `src/styles/globals.css` `@theme` — `--color-secondary-base`, etc.

---

### REQ-02b: Color Tokens — Terciary Palette (Pink/Magenta)
**Jira:** ID-3164

The Terciary color scale (pink/magenta) is what was previously assumed to be "secondary".
Confirmed base value: `#ED2E98` (verified via `get_design_context`).

> **Note:** Figma spells it `Terciary` (not "Tertiary") — match that spelling in CSS custom properties for consistency. TypeScript export can use `terciary` (same spelling).

Style family: `Terciary/` — 7 shades: Base, Light, Lighter, Lightest, Dark, Darker, Darkest

**Deliverables:**
- [ ] `src/tokens/colors.ts` — exports `colors.terciary` object with all 7 shades
- [ ] `src/styles/globals.css` `@theme` — `--color-terciary-base`, etc.

---

### REQ-03: Color Tokens — Neutral Palette
**Jira:** ID-3164

Neutral scale confirmed in Figma: 12 stops — `Neutral/25`, `Neutral/50`, `Neutral/100` through `Neutral/1000`.
Verified values: white `#FFFFFF`, black `#000000`, Neutral/25 `#F7F7F7`, Neutral/300 `#B6B6B6`, Neutral/800 `#393939`, Neutral/1000 `#101828`.

Minimum required: all 12 stops + white/black exported and in `@theme`. Unverified shades use PLACEHOLDER comments.

**Done when:** At least 6 neutral shades (white, 25, 300, 800, 1000, black) exported and in `@theme`.

---

### REQ-04: Typography Tokens
**Jira:** ID-3165

**Font families confirmed via Figma:**
- Display/Heading: `Funnel Display` (already in `globals.css`)
- Body: `Inter` (verified from `_Design system header` component)

**Verified typography:**
- `Heading/H3/Regular` — 24px / 1.5rem, weight 400, lineHeight 32px
- `Heading/H3/Semibold` — 24px / 1.5rem, weight 600, lineHeight 32px
- `Display/LG/Regular` — 52px / 3.25rem, weight 400, lineHeight 64px
- H1/H2/H4 sizes — style names confirmed, px values PLACEHOLDER

**Font weights confirmed:**
- Regular: 400, Semibold: 600, ExtraBold: 800 — all verified
- Medium (500) and Bold (700) — style names confirmed, numeric weight PLACEHOLDER

Body/Caption styles NOT in Star System. Define practical defaults.

**Deliverables:**
- [ ] `src/tokens/typography.ts` — exports:
  - `fontFamily` — `{ display: '"Funnel Display", sans-serif', body: '"Inter", sans-serif' }`
  - `fontSize` — scale object (e.g. `{ h1: '2.5rem', h2: '2rem', h3: '1.5rem', h4: '1.25rem', bodyLg: '1.125rem', body: '1rem', bodySm: '0.875rem', caption: '0.75rem' }`)
  - `fontWeight` — `{ regular: '400', medium: '500', bold: '700' }`
  - `lineHeight` — `{ tight: '1.2', base: '1.5', relaxed: '1.75' }`
- [ ] `src/styles/globals.css` `@theme` — CSS custom properties for all typography tokens
- [ ] Values extracted from Figma via `get_design_context` — verify H1–H4 font sizes against
  Figma heading styles

**Done when:**
- All typography constants exported from `src/tokens/typography.ts`
- CSS custom properties in `@theme`
- H1–H4 font sizes verified against Figma

---

### REQ-05: Spacing Tokens
**Jira:** ID-3166

Spacing is not defined as named styles in Figma. Use the Tailwind v4 default spacing scale as the
base and verify that component designs align with it. Extract actual spacing values observed in
`get_design_context` on 2–3 Star System components.

Standard scale (4px base unit):
```
0: 0px, 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px, 8: 32px,
10: 40px, 12: 48px, 16: 64px, 20: 80px, 24: 96px
```

**Deliverables:**
- [ ] `src/tokens/spacing.ts` — exports `spacing` object with named keys
- [ ] `src/styles/globals.css` `@theme` — `--spacing-*` properties (only non-default overrides
  needed, since Tailwind v4 has a built-in spacing scale)

> **Note:** Tailwind v4 ships a full spacing scale by default. Only define `--spacing-*` overrides
> if Starbem uses non-standard values (e.g., 6px increments). P1 implementation should verify this
> before adding redundant CSS.

---

### REQ-06: Border Radius Tokens
**Jira:** ID-3166

Not present as named styles in Figma. Extract from `get_design_context` on Button and Card
components. Define a practical set:
- `none: 0`, `sm: 4px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `full: 9999px`

**Deliverables:**
- [ ] `src/tokens/spacing.ts` — add `borderRadius` export (same file)
- [ ] `src/styles/globals.css` `@theme` — `--radius-sm`, `--radius-md`, etc.

---

### REQ-07: Shadow / Elevation Tokens
**Jira:** ID-3166

Elevation styles confirmed in Star System library:
- `Elevation/00` — no shadow (flat)
- `Elevation/01` through `Elevation/06` — progressively deeper shadows
- `Elevation/Secondary` — secondary-colored shadow
- `Elevation/Hover/Secondary` — hover state shadow with secondary color

**Deliverables:**
- [ ] `src/tokens/spacing.ts` — add `shadows` export (or separate `src/tokens/shadows.ts`)
- [ ] `src/styles/globals.css` `@theme` — `--shadow-elevation-01` through `--shadow-elevation-06`
- [ ] Actual `box-shadow` values extracted from Figma via `get_design_context`

---

### REQ-08: Storybook Token Showcase
**Jira:** ID-3167

**Deliverables:**
- [ ] `src/components/TokenShowcase/TokenShowcase.stories.tsx` — Storybook stories displaying:
  - Color swatches grid (Primary + Secondary + Neutral palettes)
  - Typography scale (each size/weight combination)
  - Spacing scale (visual boxes)
  - Shadow/elevation scale (cards with each elevation)
- [ ] No component export needed — this is a documentation-only artifact (no `index.ts` needed)
- [ ] Stories tagged with `autodocs`

---

### REQ-09: Barrel Exports
**Jira:** ID-3164

Update `src/index.ts` to re-export all token constants:
```typescript
export { colors } from './tokens/colors';
// colors.primary.base, colors.secondary.base, colors.terciary.base, colors.neutral.*
export { fontFamily, fontSize, fontWeight, lineHeight } from './tokens/typography';
export { spacing, borderRadius, shadows } from './tokens/spacing';
```

Consumers can then do: `import { colors } from '@starbemtech/react-starsystem'`

---

## Constraints

1. **Figma is source of truth** (D-005): All hex values must come from Figma `get_design_context`,
   not invented. Reference values (FF6B19, FF3F72) are starting points only — verify before committing.
2. **No Figma Variables** in Star System — tokens are styles. `get_variable_defs` will not work.
   Use `get_design_context` on actual components to extract fill/text/effect values.
3. **Tailwind v4**: CSS custom properties go in `@theme {}` block, not `:root {}`. Tailwind v4
   reads `@theme` — using `:root` for design tokens does NOT make them available as Tailwind utilities.
4. **TypeScript strict**: all exported constants must be typed. Use `as const` on token objects for
   literal type inference.
5. **No runtime dependencies**: token files are pure TypeScript constants — no imports from
   external packages.
6. **Single file for color tokens**: colors.ts exports the complete color map. Do not split into
   primary-colors.ts + secondary-colors.ts.

---

## Out of Scope for P1

- Dark mode / theme switching (v2 consideration per PROJECT.md)
- Icon tokens
- Motion / animation tokens
- Gradient CSS utilities (Tailwind v4 doesn't have gradient helpers — defer to P2+ components)
- Automated Figma sync CI action (deferred idea in STATE.md)
