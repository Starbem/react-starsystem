# @starbemtech/react-starsystem

**Vision:** React component library for Starbem's Star System Design System — shared UI primitives consumed by all Starbem frontend projects via npm.
**For:** Starbem frontend developers (partner-portal, backoffice-portal, web app, mobile web)
**Solves:** Code replication — each frontend project currently reimplements the same UI components from scratch, causing inconsistency and maintenance overhead.

## Goals

- Ship a versioned npm package (`@starbemtech/react-starsystem`) so developers `import { Button } from '@starbemtech/react-starsystem'` instead of rewriting components
- All components implement Figma Star System DS tokens (colors, typography, spacing) — pixel-accurate and consistent across products
- Type-safe props, accessible (WCAG 2.1 AA), tested, documented in Storybook

## Tech Stack

**Core:**
- Framework: React 19
- Language: TypeScript 6.0.3
- Build: Vite 8.1.1 (Rolldown)

**Key dependencies:** @tailwindcss/vite 4.x, vite-plugin-dts 5.x, Storybook 8.x, vitest 2.x, @changesets/cli

## Scope

**v1 includes:**
- Design tokens extracted from Figma Star System (colors, typography, spacing, shadows)
- Foundation components: Button, Input, Select, Checkbox, Radio, Badge, Tag, Avatar, Spinner
- Composite components: Modal, Dropdown, Tooltip, Toast, Table, Card, Form
- Storybook documentation for all components
- Published on npm, consumed by partner-portal and backoffice-portal

**Explicitly out of scope:**
- Server-side rendering (SSR) support — ESM-only, consumer decides
- React Native components (separate project: react-native-starsystem)
- Theme switching / dark mode (v2 consideration)
- Icon library (separate package)

## Constraints

- Technical: Must use Tailwind CSS v4 (no v3) — aligns with all Starbem frontends
- Technical: Figma Star System DS is the single source of truth — no token invented outside Figma
- Process: All components reviewed against Figma before merge
- Publishing: @starbemtech npm scope, access: public, Changesets for versioning
