# @starbemtech/react-starsystem

React component library for [Starbem](https://starbem.app)'s **Star System Design System** — accessible, type-safe components built with TypeScript, Tailwind CSS v4, and Vite.

[![npm version](https://img.shields.io/npm/v/@starbemtech/react-starsystem)](https://www.npmjs.com/package/@starbemtech/react-starsystem)
[![license](https://img.shields.io/npm/l/@starbemtech/react-starsystem)](./LICENSE)

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

## Components

### Button

```tsx
import { Button } from '@starbemtech/react-starsystem'

<Button variant="primary" size="md">
  Get started
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `iconLeft` | `ReactNode` | — | Icon before label |
| `iconRight` | `ReactNode` | — | Icon after label |
| `iconOnly` | `boolean` | `false` | Square padding for icon-only buttons |

Extends all native `<button>` attributes.

```tsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Saving…</Button>
<Button disabled>Unavailable</Button>

// With icons
<Button iconLeft={<SearchIcon />}>Search</Button>
<Button iconOnly><PlusIcon /></Button>
```

---

### Input

```tsx
import { Input } from '@starbemtech/react-starsystem'

<Input
  id="email"
  label="Email"
  placeholder="olivia@starbem.app"
  hint="We'll never share your email."
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Floating label inside the container (12px) |
| `hint` | `string` | — | Helper text below the input |
| `error` | `string` | — | Error message; overrides `hint`, sets error border |
| `leadingIcon` | `ReactNode` | — | Icon at the leading edge (24×24) |
| `trailingIcon` | `ReactNode` | — | Icon at the trailing edge (24×24) |

Extends all native `<input>` attributes (`type`, `disabled`, `value`, `onChange`, `id`, `placeholder`, …).

```tsx
// With label
<Input id="name" label="Full name" placeholder="Jane Doe" />

// With hint
<Input id="email" label="Email" hint="We'll never share your email." />

// Error state
<Input id="email" label="Email" error="This email is already taken." />

// Disabled
<Input label="Email" placeholder="olivia@starbem.app" disabled />

// With icons
<Input
  label="Search"
  leadingIcon={<SearchIcon />}
  trailingIcon={<ClearIcon />}
/>
```

**Accessibility notes:**
- Pass `id` to enable `aria-describedby` linking between the input and its hint/error text
- `aria-invalid="true"` is set automatically when `error` is provided

---

## Design Tokens

Tokens are exported as typed constants and CSS custom properties:

```tsx
import { colors, spacing, borderRadius, fontFamily } from '@starbemtech/react-starsystem'

colors.primary[500]    // '#FF5100'
colors.secondary[500]  // '#8660EC'
borderRadius.md        // '16px'
fontFamily.display     // "'Funnel Display', sans-serif"
```

All tokens are also available as CSS variables (set by the imported stylesheet):

```css
color: var(--color-primary-500);   /* #FF5100 */
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

# Start Storybook dev server (localhost:6006)
pnpm storybook

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

See [CLAUDE.md](./CLAUDE.md) for the full contribution guide.

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
