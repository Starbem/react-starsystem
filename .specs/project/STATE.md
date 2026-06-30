# Project State

**Last updated:** 2026-06-30
**Current phase:** P2 — Components

## Decisions

### D-001: ESM-only build (no CJS)
- **Date:** 2026-06-30
- **Decision:** Ship only ESM (`formats: ['es']`). No CommonJS output.
- **Rationale:** All Starbem frontends are ESM (Vite + React). CJS adds bundle weight and dual-publish complexity.
- **Status:** Applied

### D-002: CSS output as dist/style.css
- **Date:** 2026-06-30
- **Decision:** Rename Vite's default `index.css` → `style.css` via `assetFileNames` in rollupOptions.
- **Rationale:** Consumers import as `@starbemtech/react-starsystem/style.css` — the name must match the exports map.
- **Status:** Applied. Also hardened for Rolldown `assetInfo.names` API.

### D-003: tsconfig.build.json separate from tsconfig.json
- **Date:** 2026-06-30
- **Decision:** Two configs — tsconfig.json (IDE/typecheck, noEmit) + tsconfig.build.json (DTS gen, excludes stories/tests).
- **Rationale:** vite-plugin-dts generates .d.ts for all included files. Stories/tests import Storybook-specific types not in the lib's peer deps — including them causes DTS build failures.
- **Status:** Applied

### D-004: vitest.config.ts separate from vite.config.ts
- **Date:** 2026-06-30
- **Decision:** Dedicated vitest.config.ts using `defineConfig` from `vitest/config`.
- **Rationale:** vitest@2 bundles Vite 5 types. Mixing with Vite 8's `defineConfig` causes TS2769 type overload error.
- **Status:** Applied

### D-005: Figma is the single source of truth
- **Date:** 2026-06-30
- **Decision:** All tokens and component designs come from Figma Star System DS (fileKey: 6wfkhBhONJ7r4A0PZWIsIs). No token invented in code.
- **Rationale:** Design consistency across all Starbem products requires a single source.
- **Status:** Policy

### D-007: Figma Star System uses styles, not Variables
- **Date:** 2026-06-30
- **Decision:** Token values are encoded as fill/text/effect styles in Figma, NOT as Figma Variables. `get_variable_defs` returns nothing. Use `get_design_context` on real components to extract hex/px values.
- **Status:** Discovered during P1 spec research

### D-006: Consumers import CSS separately
- **Date:** 2026-06-30
- **Decision:** CSS is NOT auto-injected. Consumers must `import '@starbemtech/react-starsystem/style.css'` explicitly.
- **Rationale:** Vite lib mode compiles CSS to a separate asset. Auto-injection would require bundled runtime CSS-in-JS which conflicts with Tailwind v4's approach.
- **Status:** Documented in exports map and CLAUDE.md

## Blockers

(none active)

## Lessons

### L-001: vitest as Storybook transitive dep doesn't install the runner
- **Date:** 2026-06-30
- `@storybook/addon-interactions` pulls `@vitest/expect`, `@vitest/spy` etc. but NOT the `vitest` runner itself.
- Always add `vitest` explicitly to devDependencies.
- Also: `jsdom` is a vitest optional peer — must also be explicit.

### L-002: vite-plugin-dts v5 removed rollupTypes
- **Date:** 2026-06-30
- `rollupTypes: true` was removed in v5. Use `insertTypesEntry: true` instead.

### L-003: publish.yml must build before changeset publish
- **Date:** 2026-06-30
- `dist/` is gitignored — doesn't exist in fresh CI checkout. `changeset publish` publishes whatever is in `dist/`. Add `pnpm build` step before `changesets/action`.

### L-004: eslint-config-prettier must be last in tseslint.config()
- **Date:** 2026-06-30
- Must be the last entry to override all formatting rules from other plugins.

## Todos

- [x] P0: Wrap up branch — pushed to origin/main (2026-06-30)
- [x] P0: Transition Jira tasks ID-3157 to ID-3163 → QA Testing (2026-06-30)
- [x] P1: Feature spec written → .specs/features/p1-design-tokens/ (2026-06-30)
- [x] P1: Implement Task 1 — Figma value extraction (2026-06-30)
- [x] P1: Implement Task 2 — Color tokens (ID-3164) → QA Testing (2026-06-30, commit bb67dab)
- [x] P1: Implement Task 3 — Typography tokens (ID-3165) → QA Testing (2026-06-30, commit 892b2fc)
- [x] P1: Implement Task 4 — Spacing/radius/shadow tokens (ID-3166) → QA Testing (2026-06-30, commit 18ee8b0)
- [x] P1: Implement Task 5 — Barrel exports + Storybook showcase (ID-3167) → QA Testing (2026-06-30, commit 1485546)
- [x] P1: Final review + fixes applied (commit e8c837f) — branch pushed to origin/main

## Deferred Ideas

- Figma Code Connect mappings (map components to Figma nodes for design↔code sync)
- Visual regression tests (Chromatic or similar)
- Automated Figma token sync via GitHub Action
