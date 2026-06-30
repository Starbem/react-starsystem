# Known Concerns

## P1 — High Priority

### Only 1 placeholder component (Button)
The Button component currently uses hardcoded Tailwind colors (`bg-blue-600`, `border-gray-300`) and is not mapped to Figma Star System tokens. It is a scaffold, not a production-ready implementation. P1 work (token extraction) must precede a real Button implementation.

**Impact:** The library cannot be consumed by any frontend project yet.

### `src/tokens/` is empty
The design token files (`colors.ts`, `typography.ts`, `spacing.ts`) exist as placeholders but have no content. The `@theme` block in `src/styles/globals.css` has no CSS custom properties yet.

**Impact:** No design tokens are available — all P2 components are blocked on P1 completion.

### No Figma Code Connect mapping
No component has a Figma Code Connect mapping. Without it, Figma cannot link design components to code components.

**Impact:** Low immediate impact, but required before the library can be considered complete for design↔code sync.

## P2 — Medium Priority

### Storybook 8 peer constraint excludes Vite 8
`@storybook/react-vite` declares a peer dependency on `vite: ^4.0.0 || ^5.0.0 || ^6.0.0`, which excludes Vite 8. The project resolves this via pnpm's `autoInstallPeers` behavior, which installs the compatible Vite version alongside the project's Vite 8. This works in practice but may fail in environments with strict peer dependency enforcement (`--strict-peer-dependencies` flag or npm/yarn).

`@joshwooding/vite-plugin-react-docgen-typescript` (transitive from `@storybook/react`) has the same constraint.

**Workaround:** pnpm autoInstallPeers (current approach). Long-term: wait for Storybook to release Vite 8 compatible versions.

### `version` field is hardcoded as `'0.0.0'`
`package.json` has `"version": "0.0.0"`. Changesets updates `package.json` on release, but if there is a `export const version = '...'` constant exported from the library, it would need to be manually synchronized or generated at build time.

**Status:** Not a current issue (no version constant exported), but worth tracking if one is added.

## P3 — Low Priority

### No E2E or visual regression tests
There are no visual regression tests (e.g. Chromatic) and no E2E tests (e.g. Playwright). Only unit tests with jsdom exist. Visual regressions in component rendering would not be caught automatically.

### No coverage thresholds enforced in CI
`@vitest/coverage-v8` is installed but no coverage thresholds are configured in `vitest.config.ts`. CI does not fail on low coverage.

### Storybook with Vite 8 not fully validated
The Storybook dev server (`pnpm storybook`) has not been fully verified to work correctly with Vite 8 in all scenarios. The build (`pnpm build-storybook`) may produce different results than the dev server due to the peer constraint mismatch.
