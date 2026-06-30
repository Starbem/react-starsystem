# Architecture

## Pattern

Vite library mode — builds a reusable ESM npm package consumed by Starbem frontend projects. No application shell, no routing, no server. Pure component library.

## High-Level Structure

```
src/
  components/       # One folder per component (see Component Pattern)
  styles/
    globals.css     # Tailwind v4 base + @theme design tokens
  tokens/           # TypeScript design token constants (populated in P1)
  utils/
    cn.ts           # clsx + tailwind-merge helper
  index.ts          # Public API barrel export
  test-setup.ts     # vitest global setup (@testing-library/jest-dom)
  vite-env.d.ts     # Vite client type reference
```

## Build Pipeline

```
src/index.ts
  └─ Vite 8 (Rolldown) lib mode
       ├─ @tailwindcss/vite plugin   → scans JSX/TSX for Tailwind classes
       ├─ @vitejs/plugin-react       → JSX transform (React 19)
       └─ vite-plugin-dts v5        → reads tsconfig.build.json
            ├─ dist/index.js        ← ESM bundle (external: react, react-dom)
            ├─ dist/index.d.ts      ← type declarations (insertTypesEntry)
            └─ dist/style.css       ← compiled Tailwind CSS (cssCodeSplit: false)
```

Key build decisions:
- `formats: ['es']` — ESM-only, no CJS output
- `external: ['react', 'react-dom', 'react/jsx-runtime']` — never bundle React
- `cssCodeSplit: false` — single CSS file regardless of entrypoint count
- `assetFileNames` maps Vite's default `index.css` → `style.css` (compatible with Rolldown's `assetInfo.names` array API)
- `tsconfig.build.json` used for DTS (excludes `*.stories.tsx` and `*.test.tsx` — their Storybook-specific imports would break declaration generation)

## Tailwind CSS v4

No `postcss.config.js`. Tailwind is driven entirely by the `@tailwindcss/vite` plugin. Configuration lives in `src/styles/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* design tokens as CSS custom properties */
}
```

The `@theme` block in `globals.css` is the source of truth for all CSS custom properties used in component classes.

## Component Pattern

Each component is self-contained in its own folder:

```
src/components/<Name>/
  <Name>.tsx          # Implementation + exported Props type
  <Name>.stories.tsx  # Storybook stories (Meta + StoryObj)
  <Name>.test.tsx     # Unit tests (vitest + @testing-library/react)
  index.ts            # Re-export: component + types
```

The component folder is opaque — consumers import from the barrel (`src/index.ts`), not directly from component folders.

## Public API

`src/index.ts` is the single public API surface. Every component and exported type must flow through it:

```ts
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'
```

Anything not re-exported from `src/index.ts` is private.

## Two tsconfig Files

| File | Purpose | Used by |
|---|---|---|
| `tsconfig.json` | IDE + typecheck (`noEmit: true`) | `pnpm typecheck`, editor |
| `tsconfig.build.json` | DTS generation (excludes stories/tests) | `vite-plugin-dts` |

`tsconfig.json` enables `allowImportingTsExtensions: true` (required for IDE resolution of `.ts` imports without file extension aliases). `tsconfig.build.json` disables this and excludes story/test files.

## Separate vitest.config.ts

`vitest.config.ts` uses `defineConfig` from `vitest/config` — NOT from `vite`. This is intentional: vitest@2 bundles its own Vite 5 types. Mixing with Vite 8's `defineConfig` produces a TS2769 type overload error. The configs are kept separate to avoid this conflict.

## Consumer Integration

Consumers must do two things:

```ts
// 1. Import components
import { Button } from '@starbemtech/react-starsystem'

// 2. Import stylesheet (not auto-injected)
import '@starbemtech/react-starsystem/style.css'
```

The CSS is never auto-injected — the consumer controls stylesheet loading order.
