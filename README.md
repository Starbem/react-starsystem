# @starbemtech/react-starsystem

React component library for [Starbem](https://starbem.app)'s **Star System Design System** — accessible, type-safe components built with TypeScript, Tailwind CSS v4, and Vite.

[![npm version](https://img.shields.io/npm/v/@starbemtech/react-starsystem)](https://www.npmjs.com/package/@starbemtech/react-starsystem)
[![license](https://img.shields.io/npm/l/@starbemtech/react-starsystem)](./LICENSE)

**[📖 Interactive docs & component browser](https://starbem.github.io/react-starsystem/)**

## Overview

- **Figma-first** — every token and component maps 1:1 to the Star System DS file
- **Fully typed** — strict TypeScript, exported prop types for every component
- **Accessible** — WCAG 2.1 AA, semantic HTML, ARIA attributes throughout
- **ESM only** — tree-shakeable, no CommonJS bundle
- **Tailwind CSS v4** — tokens in `@theme {}`, no `tailwind.config.js` required

---

## Installation

```bash
pnpm add @starbemtech/react-starsystem
# or
npm install @starbemtech/react-starsystem
# or
yarn add @starbemtech/react-starsystem
```

**Peer dependencies:**

```bash
pnpm add react react-dom
```

---

## Setup

Import the stylesheet once in your app entry point:

```tsx
// main.tsx / _app.tsx / layout.tsx
import '@starbemtech/react-starsystem/style.css'
```

The library uses [Funnel Display](https://fonts.google.com/specimen/Funnel+Display) as its brand font. Add it to your HTML or CSS:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
  rel="stylesheet"
/>
```

---

## Dark Mode

All components ship with first-class dark mode support via Tailwind's `dark:` variant. It's opt-in and class-based — not tied to OS/browser `prefers-color-scheme` — so it composes with your own theme switcher instead of silently following system preference.

Enable it by adding the `dark` class to `<html>` (or any ancestor element):

```tsx
document.documentElement.classList.toggle('dark')
```

```html
<html class="dark">
  <!-- every component under here renders in dark mode -->
</html>
```

Brand colors (primary orange) and semantic status colors (Alert, Badge, Toast variants like success/warning/error/info) are intentionally theme-invariant — they stay the same in both themes.

---

## Components

Quick example:

```tsx
import { Button, Input } from '@starbemtech/react-starsystem'

<Input id="email" label="Email" placeholder="olivia@starbem.app" hint="We'll never share your email." />
<Button variant="primary" size="md">Get started</Button>
```

Every component is fully typed — import its prop type alongside the component (`import type { ButtonProps } from '@starbemtech/react-starsystem'`) for the full API, or open its source folder below. Full interactive docs (all variants, live prop controls) are at **[starbem.github.io/react-starsystem](https://starbem.github.io/react-starsystem/)**, or run locally via `pnpm docs:dev`.

**Form**

| Component | Source |
|---|---|
| `Button` | [`src/components/Button`](./src/components/Button) |
| `Input` | [`src/components/Input`](./src/components/Input) |
| `Textarea` | [`src/components/Textarea`](./src/components/Textarea) |
| `Select` | [`src/components/Select`](./src/components/Select) |
| `Checkbox`, `CheckboxGroup` | [`src/components/Checkbox`](./src/components/Checkbox) |
| `Radio`, `RadioGroup` | [`src/components/Radio`](./src/components/Radio) |
| `Toggle` | [`src/components/Toggle`](./src/components/Toggle) |
| `FormField` | [`src/components/FormField`](./src/components/FormField) |

**Feedback**

| Component | Source |
|---|---|
| `Badge` | [`src/components/Badge`](./src/components/Badge) |
| `Alert` | [`src/components/Alert`](./src/components/Alert) |
| `ToastProvider`, `toast` | [`src/components/Toast`](./src/components/Toast) |
| `Skeleton` | [`src/components/Skeleton`](./src/components/Skeleton) |
| `Spinner` | [`src/components/Spinner`](./src/components/Spinner) |
| `EmptyState` | [`src/components/EmptyState`](./src/components/EmptyState) |

**Overlay**

| Component | Source |
|---|---|
| `Modal` | [`src/components/Modal`](./src/components/Modal) |
| `Drawer` | [`src/components/Drawer`](./src/components/Drawer) |
| `Tooltip` | [`src/components/Tooltip`](./src/components/Tooltip) |
| `Popover` | [`src/components/Popover`](./src/components/Popover) |
| `DropdownMenu` | [`src/components/DropdownMenu`](./src/components/DropdownMenu) |

**Navigation**

| Component | Source |
|---|---|
| `TopBar` | [`src/components/TopBar`](./src/components/TopBar) |
| `Sidebar`, `NavItem` | [`src/components/Sidebar`](./src/components/Sidebar) |
| `Tabs` | [`src/components/Tabs`](./src/components/Tabs) |
| `Breadcrumb` | [`src/components/Breadcrumb`](./src/components/Breadcrumb) |
| `Pagination` | [`src/components/Pagination`](./src/components/Pagination) |

**Data display**

| Component | Source |
|---|---|
| `Table` | [`src/components/Table`](./src/components/Table) |
| `Card` | [`src/components/Card`](./src/components/Card) |
| `Avatar`, `AvatarGroup` | [`src/components/Avatar`](./src/components/Avatar) |
| `Accordion` | [`src/components/Accordion`](./src/components/Accordion) |
| `Divider` | [`src/components/Divider`](./src/components/Divider) |

**Accessibility:** every component ships a `vitest-axe` test asserting zero WCAG 2.1 AA violations — see each component's `.test.tsx`.

---

## Design Tokens

Tokens are exported as typed constants and CSS custom properties:

```tsx
import { colors, spacing, borderRadius, fontFamily, fontSize, fontWeight, lineHeight, shadows } from '@starbemtech/react-starsystem'

colors.primary.base    // '#FF5100'
colors.secondary.base  // '#8660EC'
borderRadius.md        // '16px'
fontFamily.display     // '"Funnel Display", sans-serif'
fontSize.h1            // '2.5rem'
shadows.elevation02    // '0 2px 4px rgba(0,0,0,0.12)'
```

All tokens are also available as CSS variables (set by the imported stylesheet):

```css
color: var(--color-primary-base);  /* #FF5100 */
border-radius: var(--radius-md);   /* 16px */
```

---

## Figma Source

All components and tokens are derived from the **Star System DS** Figma library.

- **File key:** `6wfkhBhONJ7r4A0PZWIsIs`
- **Library key:** `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`

---

## Development

```bash
# Install dependencies
pnpm install

# Start the component docs site (localhost:5173)
pnpm docs:dev

# Build the static docs site → docs-site/dist/
pnpm docs:build

# Build library → dist/
pnpm build

# Run tests
pnpm test
pnpm test:watch

# Type check
pnpm typecheck

# Lint
pnpm lint
pnpm lint:fix
```

### Adding a component

1. Create `src/components/<ComponentName>/`
2. Add `<ComponentName>.tsx`, `<ComponentName>.stories.tsx`, `<ComponentName>.test.tsx`, `index.ts`
3. Re-export from `src/index.ts`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution guide, and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations. For security issues, see [SECURITY.md](./SECURITY.md) instead of opening a public issue.

---

## Versioning & Publishing

This library uses [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
# After making changes, add a changeset
pnpm changeset

# Choose: patch / minor / major
# Write a summary of the change
# Commit the generated .changeset/ file
```

Publishing happens automatically when a tag matching `v*` is pushed to `main` — a GitHub Release is created and the package is published to npm.

---

## License

MIT © [Starbem](https://starbem.app)
