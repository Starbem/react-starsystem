# P1 — Design Tokens: Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate `src/tokens/` and `globals.css @theme` with Figma Star System tokens, and add a Storybook showcase.

**Architecture:** Four TypeScript token files + CSS custom properties in `globals.css` + barrel re-exports in `index.ts` + Storybook-only showcase stories. No runtime deps. No component changes in this phase.

**Tech Stack:** Figma MCP (`get_design_context`), TypeScript strict + `as const`, Tailwind CSS v4 `@theme`, Storybook 8.x.

## Global Constraints

- Figma Star System library key: `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`
- All color/shadow values must be extracted from Figma via `get_design_context` — no invented values
- CSS custom properties go in `@theme {}` (not `:root`) — Tailwind v4 requirement
- All token constants use `as const` for literal type inference
- No new runtime npm dependencies
- Gate: `pnpm build && pnpm typecheck && pnpm test` must pass after each task
- Commit after each task

---

### Task 1: Figma Value Extraction (research task — no code)

**Files:**
- Create: `.specs/features/p1-design-tokens/figma-values.md` (reference doc, not shipped)

**Interfaces:**
- Produces: documented hex/px values for all token categories, consumed by Tasks 2–5

- [ ] **Step 1: Get Star System Header component design context**

  Use Figma MCP `search_design_system` to find the Header component key, then use
  `get_design_context` to extract its actual fill colors, text sizes, and spacing.

  ```
  Tool: mcp__claude_ai_Figma__search_design_system
  Args: { query: "Header", fileKey: "6wfkhBhONJ7r4A0PZWIsIs", includeComponents: true }
  Then: get_design_context on the Header componentKey
  ```

- [ ] **Step 2: Get a Button or form component for additional token extraction**

  Look for any Button, Input, or Card component in the Star System library (not "Old").
  Extract fills, border radius, font sizes, spacing.

- [ ] **Step 3: Document all extracted values**

  Write `.specs/features/p1-design-tokens/figma-values.md` with:
  - Primary color scale: Base → Darkest (hex values)
  - Secondary color scale: Base → Darkest (hex values)
  - Neutral colors (found in component backgrounds/text)
  - Heading font sizes H1–H4 (px or rem)
  - Elevation shadow values 00–06 (box-shadow CSS string)
  - Border radius values observed in components
  - Spacing values observed in components

- [ ] **Step 4: Commit reference doc**

  ```bash
  git add .specs/features/p1-design-tokens/figma-values.md
  git commit -m "docs(tokens): document Figma-extracted values for P1"
  ```

**Done when:** `figma-values.md` exists with real hex values for Primary/Secondary palettes and
at least one elevation shadow CSS value.

---

### Task 2: Color Tokens (ID-3164)

**Files:**
- Create: `src/tokens/colors.ts`
- Modify: `src/styles/globals.css` (add color custom properties to `@theme`)

**Interfaces:**
- Depends on: Task 1 (figma-values.md has the hex values)
- Produces: `colors` object exported from `src/tokens/colors.ts`
  - `colors.primary.base`, `.light`, `.lighter`, `.dark`, `.darker`, `.darkest` — hex strings
  - `colors.secondary.base`, `.light`, `.lighter`, `.dark`, `.darker`, `.darkest` — hex strings
  - `colors.neutral[100..900]`, `.white`, `.black` — hex strings

- [ ] **Step 1: Write the failing test**

  Create `src/tokens/colors.test.ts`:

  ```typescript
  import { describe, expect, it } from 'vitest'
  import { colors } from './colors'

  describe('colors', () => {
    it('exports primary palette with 6 shades', () => {
      expect(colors.primary.base).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.primary.light).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.primary.lighter).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.primary.dark).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.primary.darker).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.primary.darkest).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
    it('exports secondary palette with 6 shades', () => {
      expect(colors.secondary.base).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(colors.secondary.darkest).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
    it('exports neutral palette', () => {
      expect(colors.neutral.white).toBe('#FFFFFF')
      expect(colors.neutral[900]).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })
  ```

- [ ] **Step 2: Run test — expect FAIL**

  ```bash
  pnpm test -- src/tokens/colors.test.ts
  ```
  Expected: `Cannot find module './colors'`

- [ ] **Step 3: Create `src/tokens/colors.ts`**

  Use values from `figma-values.md` (Task 1). Structure:

  ```typescript
  export const colors = {
    primary: {
      base:    '#FF6B19', // verify against Figma
      light:   '#FF9A62', // verify against Figma
      lighter: '#FFCAAA', // verify against Figma
      dark:    '#E55A0E', // verify against Figma
      darker:  '#BF4A0A', // verify against Figma
      darkest: '#7A2F06', // verify against Figma
    },
    secondary: {
      base:    '#FF3F72', // verify against Figma
      light:   '#FF7DA1', // verify against Figma
      lighter: '#FFBDCF', // verify against Figma
      dark:    '#D92E5E', // verify against Figma
      darker:  '#B32049', // verify against Figma
      darkest: '#6E1430', // verify against Figma
    },
    neutral: {
      white: '#FFFFFF',
      100:   '#F5F5F5',
      200:   '#E5E5E5',
      300:   '#D4D4D4',
      400:   '#A3A3A3',
      500:   '#737373',
      600:   '#525252',
      700:   '#404040',
      800:   '#262626',
      900:   '#171717',
      black: '#000000',
    },
  } as const

  export type Colors = typeof colors
  ```

  > **Important:** Replace placeholder values with the real hex values from `figma-values.md`.
  > If Figma values differ, use Figma values — not these placeholders.

- [ ] **Step 4: Add color CSS custom properties to `globals.css` `@theme` block**

  ```css
  @theme {
    --font-family-display: "Funnel Display", sans-serif;

    /* Primary palette */
    --color-primary-base:    #FF6B19;
    --color-primary-light:   #FF9A62;
    --color-primary-lighter: #FFCAAA;
    --color-primary-dark:    #E55A0E;
    --color-primary-darker:  #BF4A0A;
    --color-primary-darkest: #7A2F06;

    /* Secondary palette */
    --color-secondary-base:    #FF3F72;
    --color-secondary-light:   #FF7DA1;
    --color-secondary-lighter: #FFBDCF;
    --color-secondary-dark:    #D92E5E;
    --color-secondary-darker:  #B32049;
    --color-secondary-darkest: #6E1430;

    /* Neutral */
    --color-neutral-white: #FFFFFF;
    --color-neutral-100:   #F5F5F5;
    --color-neutral-200:   #E5E5E5;
    --color-neutral-300:   #D4D4D4;
    --color-neutral-400:   #A3A3A3;
    --color-neutral-500:   #737373;
    --color-neutral-600:   #525252;
    --color-neutral-700:   #404040;
    --color-neutral-800:   #262626;
    --color-neutral-900:   #171717;
    --color-neutral-black: #000000;
  }
  ```

  > Replace hex values with those from `figma-values.md`.

- [ ] **Step 5: Run test — expect PASS**

  ```bash
  pnpm test -- src/tokens/colors.test.ts
  ```
  Expected: 3 tests passing.

- [ ] **Step 6: Gate check**

  ```bash
  pnpm build && pnpm typecheck && pnpm test
  ```
  Expected: build succeeds, no type errors, all tests pass.

- [ ] **Step 7: Commit**

  ```bash
  git add src/tokens/colors.ts src/tokens/colors.test.ts src/styles/globals.css
  git commit -m "feat(tokens): add color tokens — Primary, Secondary, Neutral palettes"
  ```

**Done when:** Test passes, build succeeds, `colors` is exported from `src/tokens/colors.ts`.

---

### Task 3: Typography Tokens (ID-3165)

**Files:**
- Create: `src/tokens/typography.ts`
- Create: `src/tokens/typography.test.ts`
- Modify: `src/styles/globals.css` (add typography custom properties)

**Interfaces:**
- Depends on: Task 1 (figma-values.md has font sizes)
- Produces: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` exported from `src/tokens/typography.ts`

- [ ] **Step 1: Write the failing test**

  Create `src/tokens/typography.test.ts`:

  ```typescript
  import { describe, expect, it } from 'vitest'
  import { fontFamily, fontSize, fontWeight, lineHeight } from './typography'

  describe('typography', () => {
    it('exports fontFamily with display and body', () => {
      expect(fontFamily.display).toContain('Funnel Display')
      expect(fontFamily.body).toBeDefined()
    })
    it('exports fontSize scale with heading and body sizes', () => {
      expect(fontSize.h1).toMatch(/^\d+(\.\d+)?rem$/)
      expect(fontSize.h2).toMatch(/^\d+(\.\d+)?rem$/)
      expect(fontSize.h3).toMatch(/^\d+(\.\d+)?rem$/)
      expect(fontSize.h4).toMatch(/^\d+(\.\d+)?rem$/)
      expect(fontSize.body).toBeDefined()
    })
    it('exports fontWeight with regular/medium/bold', () => {
      expect(fontWeight.regular).toBe('400')
      expect(fontWeight.medium).toBe('500')
      expect(fontWeight.bold).toBe('700')
    })
    it('exports lineHeight scale', () => {
      expect(lineHeight.tight).toBeDefined()
      expect(lineHeight.base).toBeDefined()
    })
  })
  ```

- [ ] **Step 2: Run test — expect FAIL**

  ```bash
  pnpm test -- src/tokens/typography.test.ts
  ```

- [ ] **Step 3: Create `src/tokens/typography.ts`**

  Use font sizes from `figma-values.md` (Task 1). If exact px not found, use standard heading
  scale and note it.

  ```typescript
  export const fontFamily = {
    display: '"Funnel Display", sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  } as const

  export const fontSize = {
    h1:      '2.5rem',   // verify: Figma Heading/H1 (px ÷ 16)
    h2:      '2rem',     // verify: Figma Heading/H2
    h3:      '1.5rem',   // verify: Figma Heading/H3
    h4:      '1.25rem',  // verify: Figma Heading/H4
    bodyLg:  '1.125rem',
    body:    '1rem',
    bodySm:  '0.875rem',
    caption: '0.75rem',
  } as const

  export const fontWeight = {
    regular: '400',
    medium:  '500',
    semibold: '600',
    bold:    '700',
  } as const

  export const lineHeight = {
    tight:   '1.2',
    snug:    '1.35',
    base:    '1.5',
    relaxed: '1.75',
  } as const

  export type FontFamily = typeof fontFamily
  export type FontSize = typeof fontSize
  export type FontWeight = typeof fontWeight
  export type LineHeight = typeof lineHeight
  ```

- [ ] **Step 4: Add typography CSS custom properties to `globals.css` `@theme`**

  Append to the existing `@theme` block (after color properties):

  ```css
    /* Typography — font family */
    --font-family-display: "Funnel Display", sans-serif;
    --font-family-body: system-ui, -apple-system, sans-serif;

    /* Typography — font size */
    --font-size-h1:      2.5rem;
    --font-size-h2:      2rem;
    --font-size-h3:      1.5rem;
    --font-size-h4:      1.25rem;
    --font-size-body-lg: 1.125rem;
    --font-size-body:    1rem;
    --font-size-body-sm: 0.875rem;
    --font-size-caption: 0.75rem;

    /* Typography — font weight */
    --font-weight-regular:  400;
    --font-weight-medium:   500;
    --font-weight-semibold: 600;
    --font-weight-bold:     700;

    /* Typography — line height */
    --line-height-tight:   1.2;
    --line-height-snug:    1.35;
    --line-height-base:    1.5;
    --line-height-relaxed: 1.75;
  ```

  > Note: `--font-family-display` already exists in globals.css — update, don't duplicate.

- [ ] **Step 5: Run test — expect PASS**

  ```bash
  pnpm test -- src/tokens/typography.test.ts
  ```

- [ ] **Step 6: Gate check**

  ```bash
  pnpm build && pnpm typecheck && pnpm test
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add src/tokens/typography.ts src/tokens/typography.test.ts src/styles/globals.css
  git commit -m "feat(tokens): add typography tokens — font family, size, weight, line-height"
  ```

**Done when:** All tests pass, Funnel Display is in `fontFamily.display`, H1–H4 sizes are defined.

---

### Task 4: Spacing, Border Radius, Shadow Tokens (ID-3166)

**Files:**
- Create: `src/tokens/spacing.ts`
- Create: `src/tokens/spacing.test.ts`
- Modify: `src/styles/globals.css` (add spacing/radius/shadow custom properties)

**Interfaces:**
- Depends on: Task 1 (figma-values.md has observed spacing/radius/shadow values)
- Produces:
  - `spacing` — `{ 0: '0px', 1: '4px', 2: '8px', ... }` from `src/tokens/spacing.ts`
  - `borderRadius` — `{ none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' }`
  - `shadows` — `{ elevation00: '...', elevation01: '...', ..., elevation06: '...' }`

- [ ] **Step 1: Write the failing test**

  Create `src/tokens/spacing.test.ts`:

  ```typescript
  import { describe, expect, it } from 'vitest'
  import { spacing, borderRadius, shadows } from './spacing'

  describe('spacing', () => {
    it('exports spacing scale with px string values', () => {
      expect(spacing[0]).toBe('0px')
      expect(spacing[4]).toBe('16px')
      expect(spacing[8]).toBe('32px')
    })
    it('exports borderRadius', () => {
      expect(borderRadius.none).toBe('0')
      expect(borderRadius.md).toMatch(/^\d+px$/)
      expect(borderRadius.full).toBe('9999px')
    })
    it('exports shadows with elevation levels', () => {
      expect(shadows.elevation00).toBeDefined()
      expect(shadows.elevation01).toBeDefined()
      expect(shadows.elevation06).toBeDefined()
    })
  })
  ```

- [ ] **Step 2: Run test — expect FAIL**

  ```bash
  pnpm test -- src/tokens/spacing.test.ts
  ```

- [ ] **Step 3: Create `src/tokens/spacing.ts`**

  Use shadow values from `figma-values.md`. For elevation shadow CSS strings, format as
  `box-shadow` values (e.g. `'0 2px 4px rgba(0,0,0,0.08)'`).

  ```typescript
  export const spacing = {
    0:  '0px',
    1:  '4px',
    2:  '8px',
    3:  '12px',
    4:  '16px',
    5:  '20px',
    6:  '24px',
    8:  '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  } as const

  export const borderRadius = {
    none: '0',
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    '2xl': '24px',
    full: '9999px',
  } as const

  export const shadows = {
    elevation00: 'none',                              // verify against Figma Elevation/00
    elevation01: '0 1px 2px rgba(0,0,0,0.08)',        // verify against Figma Elevation/01
    elevation02: '0 2px 4px rgba(0,0,0,0.12)',        // verify against Figma Elevation/02
    elevation03: '0 4px 8px rgba(0,0,0,0.12)',        // verify against Figma Elevation/03
    elevation04: '0 8px 16px rgba(0,0,0,0.12)',       // verify against Figma Elevation/04
    elevation05: '0 16px 24px rgba(0,0,0,0.12)',      // verify against Figma Elevation/05
    elevation06: '0 24px 40px rgba(0,0,0,0.16)',      // verify against Figma Elevation/06
    elevationSecondary: '0 4px 16px rgba(255,63,114,0.32)', // verify: secondary color shadow
  } as const

  export type Spacing = typeof spacing
  export type BorderRadius = typeof borderRadius
  export type Shadows = typeof shadows
  ```

  > Shadow values are placeholders. Use values from `figma-values.md` (Task 1) — Figma's effect
  > styles specify exact x/y offset, blur, spread, and color with opacity.

- [ ] **Step 4: Add spacing/radius/shadow CSS custom properties to `globals.css` `@theme`**

  Tailwind v4 has a built-in spacing scale — only add `--spacing-*` if Starbem uses non-standard
  values. For P1, add radius and shadow only:

  ```css
    /* Border radius */
    --radius-none: 0;
    --radius-sm:   4px;
    --radius-md:   8px;
    --radius-lg:   12px;
    --radius-xl:   16px;
    --radius-2xl:  24px;
    --radius-full: 9999px;

    /* Elevation shadows */
    --shadow-elevation-00: none;
    --shadow-elevation-01: 0 1px 2px rgba(0,0,0,0.08);
    --shadow-elevation-02: 0 2px 4px rgba(0,0,0,0.12);
    --shadow-elevation-03: 0 4px 8px rgba(0,0,0,0.12);
    --shadow-elevation-04: 0 8px 16px rgba(0,0,0,0.12);
    --shadow-elevation-05: 0 16px 24px rgba(0,0,0,0.12);
    --shadow-elevation-06: 0 24px 40px rgba(0,0,0,0.16);
    --shadow-elevation-secondary: 0 4px 16px rgba(255,63,114,0.32);
  ```

- [ ] **Step 5: Run test — expect PASS**

  ```bash
  pnpm test -- src/tokens/spacing.test.ts
  ```

- [ ] **Step 6: Gate check**

  ```bash
  pnpm build && pnpm typecheck && pnpm test
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add src/tokens/spacing.ts src/tokens/spacing.test.ts src/styles/globals.css
  git commit -m "feat(tokens): add spacing, border-radius, and elevation shadow tokens"
  ```

**Done when:** All tests pass, shadow values are present (even if approximate pending Figma verification).

---

### Task 5: Barrel Exports + Storybook Showcase (ID-3164 + ID-3167)

**Files:**
- Modify: `src/index.ts` (add token re-exports)
- Create: `src/components/TokenShowcase/TokenShowcase.stories.tsx`

**Interfaces:**
- Depends on: Tasks 2, 3, 4 (all token files exist)
- Produces: tokens accessible via `import { colors } from '@starbemtech/react-starsystem'`

- [ ] **Step 1: Update `src/index.ts` to re-export tokens**

  ```typescript
  // Existing exports
  export { Button } from './components/Button';
  export type { ButtonProps } from './components/Button';

  // Design tokens
  export { colors } from './tokens/colors';
  export type { Colors } from './tokens/colors';
  export { fontFamily, fontSize, fontWeight, lineHeight } from './tokens/typography';
  export type { FontFamily, FontSize, FontWeight, LineHeight } from './tokens/typography';
  export { spacing, borderRadius, shadows } from './tokens/spacing';
  export type { Spacing, BorderRadius, Shadows } from './tokens/spacing';
  ```

- [ ] **Step 2: Create TokenShowcase Storybook stories**

  Create `src/components/TokenShowcase/TokenShowcase.stories.tsx`:

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react'
  import { colors } from '../../tokens/colors'
  import { fontSize, fontWeight } from '../../tokens/typography'
  import { shadows, borderRadius } from '../../tokens/spacing'

  const meta: Meta = {
    title: 'Tokens/Overview',
    tags: ['autodocs'],
  }
  export default meta

  type Story = StoryObj

  export const Colors: Story = {
    render: () => (
      <div style={{ fontFamily: 'system-ui', padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Primary</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {(Object.entries(colors.primary) as [string, string][]).map(([name, hex]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: hex, marginBottom: 4 }} />
              <div style={{ fontSize: 11 }}>{name}</div>
              <div style={{ fontSize: 10, color: '#666' }}>{hex}</div>
            </div>
          ))}
        </div>
        <h2 style={{ marginBottom: 16 }}>Secondary</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {(Object.entries(colors.secondary) as [string, string][]).map(([name, hex]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: hex, marginBottom: 4 }} />
              <div style={{ fontSize: 11 }}>{name}</div>
              <div style={{ fontSize: 10, color: '#666' }}>{hex}</div>
            </div>
          ))}
        </div>
        <h2 style={{ marginBottom: 16 }}>Neutral</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.entries(colors.neutral) as [string, string][]).map(([name, hex]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: hex, border: '1px solid #eee', marginBottom: 4 }} />
              <div style={{ fontSize: 11 }}>{name}</div>
              <div style={{ fontSize: 10, color: '#666' }}>{hex}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  export const Typography: Story = {
    render: () => (
      <div style={{ fontFamily: 'system-ui', padding: 24 }}>
        {(Object.entries(fontSize) as [string, string][]).map(([name, size]) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <span style={{ fontSize: size, fontWeight: name.includes('h') ? fontWeight.bold : fontWeight.regular }}>
              {name} — {size}
            </span>
          </div>
        ))}
      </div>
    ),
  }

  export const Elevation: Story = {
    render: () => (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 40, background: '#f9f9f9' }}>
        {(Object.entries(shadows) as [string, string][]).map(([name, shadow]) => (
          <div
            key={name}
            style={{
              width: 100,
              height: 100,
              borderRadius: borderRadius.md,
              background: '#fff',
              boxShadow: shadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
            }}
          >
            {name}
          </div>
        ))}
      </div>
    ),
  }
  ```

- [ ] **Step 3: Gate check**

  ```bash
  pnpm build && pnpm typecheck && pnpm test
  ```

  Also verify Storybook builds:
  ```bash
  pnpm build-storybook
  ```
  Expected: build succeeds, no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/index.ts src/components/TokenShowcase/
  git commit -m "feat(tokens): barrel exports + Storybook token showcase"
  ```

**Done when:** `import { colors } from '@starbemtech/react-starsystem'` works, Storybook build passes.

---

## Execution Notes

**Task order:** 1 → 2 → 3 → 4 → 5 (each depends on the previous)

**Task 1 is critical:** Without real Figma values, Tasks 2–4 ship placeholder colors. The
`figma-values.md` document is the bridge. If the Figma MCP can't extract values from
`get_design_context`, document the blockers in `figma-values.md` and use the reference values
(FF6B19, FF3F72) as temporary placeholders with `// PLACEHOLDER - verify against Figma` comments.

**Verification commitment:** Before the final whole-branch review, all placeholder comments must
be resolved — either with confirmed Figma values or with a documented decision (e.g., "Figma MCP
cannot extract fill values from published library styles — values sourced from react-native-starsystem
audit on YYYY-MM-DD").
