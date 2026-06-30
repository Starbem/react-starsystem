# @starbemtech/react-starsystem

React component library for Starbem's Star System Design System. Provides reusable, accessible, and type-safe React components built with TypeScript, Tailwind CSS v4, and Vite.

## Commands

```bash
pnpm install          # install dependencies
pnpm build            # compile library → dist/
pnpm dev              # watch mode (incremental rebuild)
pnpm typecheck        # tsc --noEmit (type validation)
pnpm lint             # ESLint (code quality)
pnpm lint:fix         # ESLint --fix (auto-fix violations)
pnpm storybook        # start Storybook dev server on localhost:6006
pnpm build-storybook  # build static Storybook site
pnpm test             # vitest run (unit tests)
pnpm test:watch       # vitest (interactive test runner)
pnpm release          # publish (via Changesets)
```

## Architecture

- **Entry point:** `src/index.ts` — barrel export of all public components and utilities.
- **Styles:** `src/styles/globals.css` — Tailwind CSS v4 base, with `@theme` block for design tokens (colors, typography, spacing, shadows).
- **Components:** `src/components/<ComponentName>/` — one folder per component. Each component has:
  - `<ComponentName>.tsx` — component implementation
  - `<ComponentName>.stories.tsx` — Storybook stories
  - `<ComponentName>.test.tsx` — unit tests
  - `index.ts` — re-export component and types
- **Tokens:** `src/tokens/` — TypeScript design tokens (populated in P1):
  - `colors.ts` — color palette constants
  - `typography.ts` — font families, sizes, weights
  - `spacing.ts` — spacing scale
  - (imported by `globals.css` `@theme` block)
- **Utils:** `src/utils/cn.ts` — class name utility (clsx + tailwind-merge) for safe Tailwind merging.

## Build Output

Vite produces:
- `dist/index.js` — ESM-only (type: module)
- `dist/index.d.ts` — TypeScript type definitions
- `dist/style.css` — compiled Tailwind stylesheet (sideEffect: true)

## Figma Source

The Star System library is the single source of truth for component design and tokens:

- **Design File:** Star System
  - **File Key:** `6wfkhBhONJ7r4A0PZWIsIs`
  - **Library Key:** `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`

Use the Figma MCP to query component designs and extract token definitions.

## Adding a Component

1. **Create folder:** `src/components/<ComponentName>/`
2. **Implementation:** `<ComponentName>.tsx`
   - Write component as a functional component with TypeScript
   - Export types alongside (e.g., `ComponentNameProps`)
   - Use `cn()` utility for safe class merging
   - Keep components focused and composable
3. **Stories:** `<ComponentName>.stories.tsx`
   - Use Storybook Meta + Story format
   - Tag stories with `autodocs` for auto-generated documentation
   - Include all component variants and use cases
4. **Tests:** `<ComponentName>.test.tsx`
   - Use vitest for unit tests
   - Test rendering, props, interactions, accessibility
5. **Re-export:** `index.ts` at component root
   ```typescript
   export { ComponentName } from './ComponentName';
   export type { ComponentNameProps } from './ComponentName';
   ```
6. **Add to library export:** Update `src/index.ts`
   ```typescript
   export { ComponentName } from './components/ComponentName';
   ```

## Publishing & Versioning

Uses **Changesets** for semantic versioning (semver) and release coordination:

1. **On any PR:** Run `pnpm changeset` locally (not in CI)
   - Pick version bump: major, minor, patch
   - Write human-readable summary of changes
   - Generates entry in `.changeset/` directory
2. **On merge to main:** GitHub Actions automatically:
   - Detects `changeset` entries
   - Creates a Release PR or publishes directly (depending on config)
   - Publishes to npm as `@starbemtech/react-starsystem@<version>`

**No manual version bumping or publishing required.**

## Type Safety

- **TypeScript:** strict mode, all components fully typed
- **Props:** export `ComponentNameProps` type from each component
- **No `any` types:** all parameters and returns have explicit types

## Accessibility

- All components must meet **WCAG 2.1 AA** accessibility standards
- Use semantic HTML and ARIA attributes where needed
- Test with Storybook A11y addon (included)
- Reference: https://www.w3.org/WAI/standards-guidelines/wcag/

## Code Quality

- **Linting:** ESLint (config: eslint.config.js)
- **Formatting:** Prettier (config: .prettierrc)
- **Type checking:** TypeScript strict mode
- **Before committing:** Run `pnpm lint && pnpm typecheck && pnpm build` — all must pass

## Dependencies

- **Peer:** React >=18, React DOM >=18
- **Runtime:** clsx, tailwind-merge
- **Dev:** Vite, TypeScript, Tailwind CSS v4, Storybook 8, vitest, ESLint

## Directory Structure

```
.
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       ├── Button.test.tsx
│   │       └── index.ts
│   ├── tokens/                 # Design token constants (P1)
│   ├── styles/
│   │   └── globals.css         # Tailwind config + @theme
│   ├── utils/
│   │   └── cn.ts               # clsx + tailwind-merge helper
│   ├── vite-env.d.ts
│   └── index.ts                # Public API barrel export
├── dist/                       # Build output (excluded from git)
├── storybook-static/           # Storybook static build
├── .storybook/                 # Storybook config
├── .changeset/                 # Changesets (version & publishing)
├── .github/workflows/          # CI/CD (lint, build, publish)
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── package.json
└── CLAUDE.md                   # This file
```

## Next Phase: P1 — Design Tokens

After P0 complete, extract token definitions from Figma Star System library:
- Query `search_design_system` + `get_variable_defs` from Figma MCP
- Populate `src/tokens/colors.ts`, `src/tokens/typography.ts`, `src/tokens/spacing.ts`
- Update `src/styles/globals.css` `@theme` block with CSS custom properties
- Generate component storybook stories with token usage examples
