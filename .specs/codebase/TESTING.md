# Testing

## Framework

| Tool | Version | Role |
|---|---|---|
| vitest | ^2.0.0 | Test runner |
| @testing-library/react | ^16.0.0 | Component rendering utilities |
| @testing-library/jest-dom | ^6.0.0 | DOM assertion matchers |
| jsdom | ^29.1.1 | DOM simulation environment |
| @vitest/coverage-v8 | ^2.0.0 | Coverage reporting (V8) |

## Configuration

`vitest.config.ts` — uses `defineConfig` from `vitest/config` (not from `vite`):

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

`globals: true` enables `describe`, `it`, `expect` etc. without explicit import. However, tests import them explicitly for clarity.

## Setup File

`src/test-setup.ts` runs before every test file:

```ts
import '@testing-library/jest-dom'
```

This registers all `@testing-library/jest-dom` matchers (e.g. `toBeInTheDocument`, `toBeDisabled`, `toHaveClass`).

## Test Location

Tests are co-located with the component they test:

```
src/components/Button/
  Button.tsx
  Button.test.tsx   ← test lives here, not in a separate __tests__ folder
```

## Commands

```bash
pnpm test          # vitest run (single pass, CI mode)
pnpm test:watch    # vitest (interactive watch mode)
```

Run a single test file:

```bash
pnpm test -- src/components/Button/Button.test.tsx
```

## Coverage

`@vitest/coverage-v8` is installed. To generate a report:

```bash
pnpm test -- --coverage
```

Coverage thresholds are not yet enforced in CI (P3 concern).

## Coverage Matrix

| Layer | Test type | Location | Command |
|---|---|---|---|
| Components | Unit | `src/components/**/*.test.tsx` | `pnpm test` |
| Utils (cn) | Unit | `src/utils/**/*.test.ts` | `pnpm test` |
| Build output | Build | n/a | `pnpm build` |
| Stories | Visual (Storybook) | `src/components/**/*.stories.tsx` | `pnpm storybook` |

## Gate Checks

**Quick gate** (pre-commit minimum):

```bash
pnpm test
```

**Full gate** (required before merge):

```bash
pnpm lint && pnpm typecheck && pnpm build && pnpm test
```

## Why vitest.config.ts Is Separate from vite.config.ts

vitest@2 bundles its own Vite 5 type definitions. Importing `defineConfig` from `vite` in the same config file causes a TS2769 type overload error because Vite 8 and Vite 5 `UserConfig` types diverge. The fix is to use `defineConfig` from `vitest/config` in a separate file. They coexist: `vite.config.ts` for builds, `vitest.config.ts` for tests.
