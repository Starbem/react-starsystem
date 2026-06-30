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

## P2 — Form Primitives

**Goal:** Core form components implementing Star System tokens
**Target:** TBD
**Jira:** ID-3168 to ID-3175

### Features

**Form Primitives** - PLANNED
- Button (replace placeholder with Figma-accurate implementation)
- Input
- Textarea
- Select
- Checkbox
- Radio
- Toggle
- FormField (label + error wrapper)

---

## P3 — Feedback Components

**Goal:** User feedback and status indicators
**Target:** TBD
**Jira:** ID-3176 to ID-3181

### Features

**Feedback** - PLANNED
- Badge
- Alert
- Toast
- Skeleton
- Spinner
- Empty State

---

## P4 — Overlay Components

**Goal:** Modal dialogs and floating UI patterns
**Target:** TBD
**Jira:** ID-3182 to ID-3186

### Features

**Overlay** - PLANNED
- Modal / Dialog
- Drawer
- Tooltip
- Popover
- Dropdown

---

## P5 — Navigation Components

**Goal:** App structure and navigation patterns
**Target:** TBD
**Jira:** ID-3188 to ID-3192

### Features

**Navigation** - PLANNED
- Tabs
- TopBar
- Sidebar
- Breadcrumb
- Pagination

---

## P6 — Data Display

**Goal:** Data presentation components
**Target:** TBD
**Jira:** ID-3193 to ID-3197

### Features

**Data Display** - PLANNED
- Table
- Card
- Avatar
- Accordion
- Divider

---

## P7 — Publishing & Integration

**Goal:** Consumed by at least one Starbem frontend (partner-portal)
**Target:** TBD
**Jira:** ID-3198 to ID-3200

### Features

**Integration** - PLANNED
- First public npm release (v0.1.0)
- Storybook deployed (Chromatic or static host)
- Migration guide for partner-portal

---

## Future Considerations

- Dark mode / theming support (v2)
- Icon package (@starbemtech/react-starsystem-icons)
- SSR support
- React Native token alignment with react-native-starsystem
