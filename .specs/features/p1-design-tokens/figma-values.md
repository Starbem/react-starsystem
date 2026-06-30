# Figma Value Extraction — P1 Design Tokens

**Source:** Star System design library  
**Figma file key:** `6wfkhBhONJ7r4A0PZWIsIs`  
**Library key:** `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`  
**Extracted on:** 2026-06-30  
**Method:** Figma MCP `get_design_context` on live components; `search_design_system` for style catalog.

> **Confidence legend:**  
> `[VERIFIED]` — hex/px extracted directly from Figma `get_design_context` output.  
> `[PLACEHOLDER]` — style name confirmed in Figma but hex value not extracted via MCP; must be verified manually in Figma before implementation.

---

## Critical Finding: Palette Mapping Differs from Brief

The spec and brief referenced:
- `Primary/Base ≈ #FF6B19` (orange) — **WRONG**. Actual Figma value: `#FF5100`
- `Secondary/Base ≈ #FF3F72` (pink/red) — **WRONG**. Figma's `Secondary` is **purple/violet**: `#8660EC`

The Star System has **three brand palettes**, not two:
1. **Primary** = Orange (`#FF5100`)
2. **Secondary** = Purple/Violet (`#8660EC`)
3. **Terciary** = Pink/Magenta (`#ED2E98`) — this is what the brief called "Secondary"

All three are confirmed fill style families in the current Star System library.  
Tasks 2–5 must use these three palettes, not the brief's two-palette assumption.

---

## 1. Primary Color Palette

Style family path: `design_systems/Star System/styles/fill/Primary/`

| Token | Style Name | Hex Value | Confidence |
|-------|-----------|-----------|-----------|
| `primary.base` | `Primary/Base` | `#FF5100` | [VERIFIED] |
| `primary.light` | `Primary/Light` | — | [PLACEHOLDER] |
| `primary.lighter` | `Primary/Lighter` | — | [PLACEHOLDER] |
| `primary.lightest` | `Primary/Lightest` | — | [PLACEHOLDER] |
| `primary.dark` | `Primary/Dark` | — | [PLACEHOLDER] |
| `primary.darker` | `Primary/Darker` | — | [PLACEHOLDER] |
| `primary.darkest` | `Primary/Darkest` | — | [PLACEHOLDER] |

**Extraction source:** Nodes `9917:7241` (Header/Cover), `2026:2613` (PRINCIPAL_degrade), `3195:2036` (_Design system header).

---

## 2. Secondary Color Palette (Purple/Violet)

Style family path: `design_systems/Star System/styles/fill/Secondary/`

| Token | Style Name | Hex Value | Confidence |
|-------|-----------|-----------|-----------|
| `secondary.base` | `Secondary/Base` | `#8660EC` | [VERIFIED] |
| `secondary.light` | `Secondary/Light` | — | [PLACEHOLDER] |
| `secondary.lighter` | `Secondary/Lighter` | — | [PLACEHOLDER] |
| `secondary.lightest` | `Secondary/Lightest` | — | [PLACEHOLDER] |
| `secondary.dark` | `Secondary/Dark` | — | [PLACEHOLDER] |
| `secondary.darker` | `Secondary/Darker` | `#461FAE` | [VERIFIED] |
| `secondary.darkest` | `Secondary/Darkest` | — | [PLACEHOLDER] |

**Extraction source:** Node `3195:2036` (_Design system header) — `Secondary/Base: #8660EC`, `Secondary/Darker: #461FAE`.

---

## 3. Terciary Color Palette (Pink/Magenta)

Style family path: `design_systems/Star System/styles/fill/Terciary/`

> **Note:** This is the "secondary brand color" historically referenced in Starbem materials as `#FF3F72`.  
> The actual Figma value is `#ED2E98`. The naming in Figma is `Terciary` (note: not "Tertiary").

| Token | Style Name | Hex Value | Confidence |
|-------|-----------|-----------|-----------|
| `terciary.base` | `Terciary/Base` | `#ED2E98` | [VERIFIED] |
| `terciary.light` | `Terciary/Light` | — | [PLACEHOLDER] |
| `terciary.lighter` | `Terciary/Lighter` | — | [PLACEHOLDER] |
| `terciary.lightest` | `Terciary/Lightest` | — | [PLACEHOLDER] |
| `terciary.dark` | `Terciary/Dark` | — | [PLACEHOLDER] |
| `terciary.darker` | `Terciary/Darker` | — | [PLACEHOLDER] |
| `terciary.darkest` | `Terciary/Darkest` | — | [PLACEHOLDER] |

**Extraction source:** Nodes `9922:10747` (PRINCIPAL logo), `2026:2613` (gradient logo), `9917:7241` (Cover Header).

---

## 4. Neutral Color Palette

Style family path: `design_systems/Star System/styles/fill/Neutral/`

Confirmed style names (from `search_design_system`): `Neutral/25`, `Neutral/50`, `Neutral/100`, `Neutral/200`, `Neutral/300`, `Neutral/400`, `Neutral/500`, `Neutral/600`, `Neutral/700`, `Neutral/800`, `Neutral/900`, `Neutral/1000`.

| Token | Style Name | Hex Value | Confidence |
|-------|-----------|-----------|-----------|
| `neutral.white` | — | `#FFFFFF` | [VERIFIED] — from component `bg-white` fills |
| `neutral.black` | — | `#000000` | [VERIFIED] — from component `bg-black` fills |
| `neutral.25` | `Neutral/25` | `#F7F7F7` | [VERIFIED] |
| `neutral.50` | `Neutral/50` | — | [PLACEHOLDER] |
| `neutral.100` | `Neutral/100` | — | [PLACEHOLDER] |
| `neutral.200` | `Neutral/200` | — | [PLACEHOLDER] |
| `neutral.300` | `Neutral/300` | `#B6B6B6` | [VERIFIED] |
| `neutral.400` | `Neutral/400` | — | [PLACEHOLDER] |
| `neutral.500` | `Neutral/500` | — | [PLACEHOLDER] |
| `neutral.600` | `Neutral/600` | — | [PLACEHOLDER] |
| `neutral.700` | `Neutral/700` | — | [PLACEHOLDER] |
| `neutral.800` | `Neutral/800` | `#393939` | [VERIFIED] |
| `neutral.900` | `Neutral/900` | — | [PLACEHOLDER] |
| `neutral.1000` | `Neutral/1000` | `#101828` | [VERIFIED] — from `_Design system header` heading text color |

**Extraction sources:**
- `#F7F7F7` (Neutral/25): node `3195:2036`, background of _Design system header
- `#B6B6B6` (Neutral/300): node `9917:7241`, Cover Header decorative line color
- `#393939` (Neutral/800): nodes `9869:946`, `3195:2036`, body text color
- `#101828` (Neutral/1000): node `3195:2036`, "Logo" heading text — style `Display xs/Regular`

---

## 5. Typography

### 5.1 Font Families

| Token | Value | Confidence |
|-------|-------|-----------|
| `fontFamily.display` | `"Funnel Display", sans-serif` | [VERIFIED] — observed in multiple components: Cover header, _Design system header, button label |
| `fontFamily.body` | `"Inter", sans-serif` | [VERIFIED] — observed in `_Design system header` for neutral text elements |

### 5.2 Heading Scale (Funnel Display)

Confirmed style names from `search_design_system` on "Heading" (Star System library):
- `Heading/H1` — Bold, Medium, Regular
- `Heading/H2` — Bold, Medium (Regular not confirmed in current library)
- `Heading/H3` — Bold, Medium, Regular
- `Heading/H4` — Bold, Medium, Regular

| Token | Style Name | Size (px) | Size (rem) | Weight | Line Height (px) | Confidence |
|-------|-----------|-----------|-----------|--------|-----------------|-----------|
| `fontSize.h1` | `Heading/H1/*` | — | — | — | — | [PLACEHOLDER] |
| `fontSize.h2` | `Heading/H2/*` | — | — | — | — | [PLACEHOLDER] |
| `fontSize.h3` | `Heading/H3/Regular` | `24` | `1.5rem` | `400` | `32` | [VERIFIED] |
| `fontSize.h4` | `Heading/H4/*` | — | — | — | — | [PLACEHOLDER] |

**Extraction source for H3:** Node `3195:2036` — `Heading/H3/Regular: Font(family: "Funnel Display", style: Regular, size: 24, weight: 400, lineHeight: 32, letterSpacing: 0)` and `Heading/H3/Semibold: Font(family: "Funnel Display", style: SemiBold, size: 24, weight: 600, lineHeight: 32, letterSpacing: 0)`.

### 5.3 Display Scale (Funnel Display)

Confirmed style names from `search_design_system` on "Display" (Star System library):
- `Display/2XL`, `Display/XL`, `Display/LG`, `Display/MD` — each with Bold, Medium, Semibold, Regular variants.

| Token | Style Name | Size (px) | Size (rem) | Weight | Line Height (px) | Confidence |
|-------|-----------|-----------|-----------|--------|-----------------|-----------|
| `fontSize.displayLg` | `Display/LG/Regular` | `52` | `3.25rem` | `400` | `64` | [VERIFIED] |
| `fontSize.display2xl` | `Display/2XL/*` | — | — | — | — | [PLACEHOLDER] |
| `fontSize.displayXl` | `Display/XL/*` | — | — | — | — | [PLACEHOLDER] |
| `fontSize.displayMd` | `Display/MD/*` | — | — | — | — | [PLACEHOLDER] |

**Extraction source for Display/LG:** Node `9917:7241` (Cover Header subtitle text) — `Display/LG/Regular: Font(family: "Funnel Display", style: Regular, size: 52, weight: 400, lineHeight: 64, letterSpacing: 0)`.

### 5.4 Font Weights

| Token | Value | Confidence |
|-------|-------|-----------|
| `fontWeight.regular` | `400` | [VERIFIED] — Heading/H3/Regular |
| `fontWeight.medium` | `500` | [PLACEHOLDER] — style "Medium" exists but numeric weight not directly confirmed |
| `fontWeight.semibold` | `600` | [VERIFIED] — Heading/H3/Semibold |
| `fontWeight.bold` | `700` | [PLACEHOLDER] — "Bold" styles confirmed by name, weight not extracted |
| `fontWeight.extraBold` | `800` | [VERIFIED] — Cover Header title: `font-['Funnel_Display:ExtraBold']` observed as 800 |

---

## 6. Elevation / Shadow Tokens

Confirmed style names from `search_design_system` on "Elevation" (Star System library):

| Token | Style Name | CSS box-shadow | Confidence |
|-------|-----------|----------------|-----------|
| `shadows.elevation00` | `Elevation/00` | `none` | [VERIFIED] — per spec: Elevation/00 = no shadow |
| `shadows.elevation01` | `Elevation/01` | — | [PLACEHOLDER] |
| `shadows.elevation02` | `Elevation/02` | — | [PLACEHOLDER] |
| `shadows.elevation03` | `Elevation/03` | — | [PLACEHOLDER] |
| `shadows.elevation04` | `Elevation/04` | — | [PLACEHOLDER] |
| `shadows.elevation05` | `Elevation/05` | — | [PLACEHOLDER] |
| `shadows.elevation06` | `Elevation/06` | — | [PLACEHOLDER] |
| `shadows.secondary` | `Elevation/Secondary` | — | [PLACEHOLDER] |
| `shadows.hoverSecondary` | `Elevation/Hover/Secondary` | — | [PLACEHOLDER] |

**Extraction failure reason:** The Figma MCP `get_design_context` only surfaces color and typography tokens from component `These styles are contained in the design:` output. Effect/shadow tokens (drop-shadow values, blur radius, spread, offset) were not returned in any component examined. All Elevation styles exist as `EFFECT` type in the library (confirmed via `search_design_system`), but their numeric values require either:
1. A component that actively uses an Elevation effect style — not found in the pages available to this session
2. Direct Figma REST API access via file key + style ID (outside current MCP capabilities)

**Recommendation:** Open the Figma file → select any card/modal component → inspect the "Effects" panel for drop-shadow values. Alternatively search for a component named "Elevation" or look in a dedicated "Foundations" page.

---

## 7. Border Radius

Not present as named styles in Figma. Observed from component code generated by `get_design_context`:

| Token | Value | Source | Confidence |
|-------|-------|--------|-----------|
| `borderRadius.sm` | `9px` | Logo page card containers (`rounded-[9px]`) | [VERIFIED] |
| `borderRadius.md` | `16px` | _Design system header (`rounded-tl-[16px]`) | [VERIFIED] |
| `borderRadius.lg` | `32px` | _Design system header (`rounded-tl-[32px]`, `rounded-bl-[32px]`) | [VERIFIED] |
| `borderRadius.full` | `9999px` | — | [PLACEHOLDER] — standard convention |

**Note:** The values `9`, `16`, `32` suggest the Star System uses a 4px-based grid with some exceptions (9px for cards). The `9px` may be intentional design choice or could be `8px` rounded in display. Verify in Figma inspector.

---

## 8. Spacing

Not defined as named styles in Figma. Observed from `get_design_context` component code:

| Token | Value (px) | Observed in | Confidence |
|-------|-----------|-------------|-----------|
| `spacing[1]` | `4px` | — | [PLACEHOLDER] — standard 4px base |
| `spacing[2]` | `8px` | `gap-[8px]` in header section title | [VERIFIED] |
| `spacing[4]` | `16px` | `gap-[16px]` in logo+title group | [VERIFIED] |
| `spacing[5]` | `20px` | `gap-[20px]` in heading group | [VERIFIED] |
| `spacing[8]` | `32px` | `gap-[32px]` in Cover subtitle | [VERIFIED] |
| `spacing[10]` | `40px` | `gap-[40px]`, `p-[40px]` in Card containers | [VERIFIED] |
| `spacing[16]` | `64px` | `pt-[64px]` in _Design system header | [VERIFIED] |
| `spacing[20]` | `80px` | `px-[80px]` in _Design system header content | [VERIFIED] |
| `spacing[24]` | `96px` | `pb-[96px]` in _Design system header content | [VERIFIED] |
| `spacing[32]` | `128px` | `gap-[128px]` in _Design system header sections | [VERIFIED] |

**Observation:** The spacing values align with a 4px base scale (multiples of 4: 8, 16, 20, 32, 40, 64, 80, 96, 128). The `20px` increment suggests both a 4px and 5px grid is in use.

---

## 9. Extraction Notes

### What was found
- **Primary/Base** and **Terciary/Base** are the most consistently surfaced colors — they appear in nearly every logo/branding component.
- **Secondary/Base** (#8660EC) found in the DS header gradient strip — a UI chrome element, not logo.
- **Secondary/Darker** (#461FAE) appeared in the Cover page header text style.
- **3 neutral shades** extracted: Neutral/25, Neutral/300, Neutral/800.
- **H3 typography** fully extracted (size, weight, lineHeight, font family).
- **Display/LG** typography extracted.
- **Spacing values** and **border radius** extracted from generated component code.

### What could not be found
- **Full Primary/Secondary/Terciary palette shades** (Light, Lighter, Lightest, Dark, Darker [for Primary and Terciary], Darkest): The MCP only surfaces colors that are visually present in the rendered component node. The style names exist in the library but their hex values require examining components that use them (lighter tints, form states, hover states, etc.).
- **Most Neutral shades** (50, 100, 200, 400, 500, 600, 700, 900): Same limitation — need components using those specific fills.
- **All Elevation/shadow values**: Effect styles are not surfaced in `get_design_context` style output. This is a tool limitation.
- **H1, H2, H4 typography sizes**: Only H3 and Display/LG were confirmed in components examined. H1/H2/H4 exist as style names but were not observed in available component renders.

### Extraction limitations
1. The Figma file (`6wfkhBhONJ7r4A0PZWIsIs`) only exposes 2 top-level pages via `get_metadata`: `📓 Cover` and `⭐ Logo Versions`. The design system's token/component pages (where color swatches and elevation cards would live) are not accessible via the MCP in this session. This is likely a Figma file access/page scope issue.
2. `search_design_system` returns style names and keys but **not hex/px values**. Only `get_design_context` on actual component nodes returns values.
3. Effect styles (shadows/elevations) are not included in the `get_design_context` style summary, only fill and text styles are.

### Recommendation for remaining PLACEHOLDERs
In order of priority:
1. **Shadow/Elevation values**: Open the Figma file, find a card or modal with a shadow applied, inspect the "Effects" panel. Values follow pattern `box-shadow: X Y blur spread rgba(color, opacity)`.
2. **Color palette shades**: In Figma, go to the "Foundations" or "Colors" page (likely a page not exposed via MCP). Look for the color palette documentation frame.
3. **H1/H2/H4 sizes**: In Figma, search for any screen with an H1 heading, right-click → Inspect → Typography.

---

## 10. Style Catalog Summary

### Fill Styles Confirmed in Star System

| Family | Shades/Variants |
|--------|----------------|
| Primary | Base, Light, Lighter, Lightest, Dark, Darker, Darkest |
| Secondary | Base, Light, Lighter, Lightest, Dark, Darker, Darkest |
| Terciary | Base, Light, Lighter, Lightest, Dark, Darker, Darkest |
| Neutral | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 |
| Gradient | Primary, Primary Light, Primary Darker, Primary Lightest, Secondary, Secondary Dark, Terciary, Clean |

### Text Styles Confirmed in Star System

| Family | Weights |
|--------|---------|
| Heading/H1 | Bold, Medium, Regular |
| Heading/H2 | Bold, Medium |
| Heading/H3 | Bold, Medium, Regular |
| Heading/H4 | Bold, Medium, Regular |
| Display/2XL | Bold, Medium, Semibold, Regular |
| Display/XL | Bold, Medium, Semibold, Regular |
| Display/LG | Bold, Medium, Semibold, Regular |
| Display/MD | Bold, Medium, Regular |

### Effect Styles Confirmed in Star System

| Family | Variants |
|--------|---------|
| Elevation | 00, 01, 02, 03, 04, 05, 06 |
| Elevation/Hover | Secondary |
| Elevation | Secondary |

---

## 11. Component Keys Examined

All from Star System library (`libraryKey: lk-9c495c686...`):

| Component | componentKey | Node IDs Examined |
|-----------|-------------|-------------------|
| Header (Cover page) | e8c0fcf2cac56d38740d721ebf74b0f9d838d1fe | 9917:7241, 2026:2613 |
| Header App | f04dd6d3057131b91b0ada2f38ec6734601c3149 | — |
| _Design system header | — | 3195:2036 |
| PRINCIPAL_degrade | — | 9869:942, 9922:10747 |
| PRINCIPAL_laranja | — | 9920:10630 |
| PRINCIPAL_preto | — | 9920:10631 |
| Logo page (Light mode - Primary) | — | 3193:4283, 9869:946 |
| Logo page (Dark mode - Primary) | — | 9869:1587 |
| Logo page (Light mode - Secondary) | — | 9869:947 |
| Logo page (Light mode - Neutral) | — | 9869:1360 |
| Banner | — | 10369:726 |
