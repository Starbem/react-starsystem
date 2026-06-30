# Roadmap

**Current Milestone:** P1 — Design Tokens
**Status:** In Progress

---

## P0 — Project Setup

**Goal:** Library scaffold ready for component authoring
**Target:** Complete
**Jira:** ID-3157 to ID-3163

### Features

**Project Scaffold** - COMPLETE
- pnpm + package.json + ESM lib config
- Vite 8 lib mode + TypeScript 6 + vite-plugin-dts v5
- Tailwind CSS v4 via @tailwindcss/vite
- Storybook 8.x + placeholder Button
- ESLint 9 + Prettier
- Changesets semantic versioning
- GitHub Actions CI + Publish

---

## P1 — Design Tokens

**Goal:** All Figma Star System tokens extracted and available as CSS custom properties + TypeScript constants
**Target:** ~2026-07-07
**Jira:** ID-3164 to ID-3167

### Features

**Token Extraction** - PLANNED
- Extract colors, typography, spacing, shadows from Figma (fileKey: 6wfkhBhONJ7r4A0PZWIsIs)
- Populate src/tokens/colors.ts, typography.ts, spacing.ts
- Update src/styles/globals.css @theme block with CSS custom properties
- Storybook stories demonstrating token usage

---

## P2 — Foundation Components

**Goal:** Primitive UI components implementing Star System tokens
**Target:** TBD
**Jira:** ID-3168 to ID-3183 (estimated)

### Features

**Primitives** - PLANNED
- Button (replace placeholder with Figma-accurate implementation)
- Input, Textarea
- Select, Checkbox, Radio
- Badge, Tag
- Avatar
- Spinner / Loading

---

## P3 — Composite Components

**Goal:** Complex multi-part components
**Target:** TBD
**Jira:** ID-3184 to ID-3193 (estimated)

### Features

**Composites** - PLANNED
- Modal / Dialog
- Dropdown / Menu
- Tooltip
- Toast / Alert
- Table
- Card

---

## P4 — Documentation

**Goal:** Full Storybook docs, usage examples, migration guide
**Target:** TBD
**Jira:** ID-3194 to ID-3197 (estimated)

### Features

**Storybook** - PLANNED
- All components with autodocs
- Token showcase pages
- Figma Code Connect mappings
- Accessibility audit

---

## P5 — Publishing & Integration

**Goal:** Consumed by at least one Starbem frontend (partner-portal)
**Target:** TBD
**Jira:** ID-3198 to ID-3200 (estimated)

### Features

**Integration** - PLANNED
- First public npm release (v0.1.0)
- Integration guide for partner-portal
- Migration example: replace one replicated component

---

## Future Considerations

- Dark mode / theming support (v2)
- Icon package (@starbemtech/react-starsystem-icons)
- SSR support
- React Native token alignment with react-native-starsystem
