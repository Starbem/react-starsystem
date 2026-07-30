# AGENTS.md — @starbemtech/react-starsystem

React component library for Starbem's **Star System Design System**. TypeScript, Tailwind CSS v4, Vite. This file is the operating manual for any agent (Claude, Codex, Copilot, etc.) working in this repo — development, testing, CI/CD, and publishing rules all live here.

## Commands

```bash
pnpm install          # install dependencies
pnpm build            # compile library → dist/
pnpm dev              # watch mode (incremental rebuild)
pnpm typecheck        # tsc --noEmit (type validation)
pnpm lint             # ESLint (eslint src only)
pnpm lint:fix         # ESLint --fix (auto-fix violations)
pnpm format           # Prettier --write (auto-format src)
pnpm format:check     # Prettier --check (CI's formatting gate — does NOT run as part of `pnpm lint`)
pnpm docs:dev         # start the component docs site (localhost:5173, or next free port)
pnpm docs:build       # build the static docs site → docs-site/dist/
pnpm test             # vitest run (unit tests, all *.test.tsx)
pnpm test:watch       # vitest (interactive test runner)
pnpm test <file>      # run one test file, e.g. pnpm test Button.test.tsx
pnpm changeset        # add a changeset entry for the current change (run locally, not in CI)
```

**Before every commit, run:** `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build` — all four must be green. `pnpm lint` alone does NOT catch formatting drift (`format:check` is a separate CI job, added in `55e1c12`, not part of `eslint src`) — a commit that's lint-clean can still fail CI on formatting alone. If `format:check` fails, run `pnpm format` and re-check before committing. Also run the relevant `pnpm test <file>` for anything touched, and the full `pnpm test` before finishing a task/PR.

## Architecture

- **Entry point:** `src/index.ts` — barrel export of every public component, type, and token.
- **Styles:** `src/styles/globals.css` — Tailwind CSS v4, `@theme` block holds every design token (colors, typography, spacing, shadows, radius). No `tailwind.config.js` — v4 is CSS-config-only.
- **Components:** `src/components/<ComponentName>/` — one folder per component:
  - `<ComponentName>.tsx` — implementation
  - `<ComponentName>.stories.tsx` — stories (see Adding a Component)
  - `<ComponentName>.test.tsx` — unit tests
  - `index.ts` — re-export component and types
- **Tokens:** `src/tokens/` — TypeScript constants (`colors.ts`, `typography.ts`, `spacing.ts`) mirroring `globals.css`'s `@theme` block. Keep both in sync when either changes.
- **Utils:** `src/utils/cn.ts` — `clsx` + `tailwind-merge` wrapper. Always use `cn()` for conditional/merged classNames, never string concatenation.
- **`docs-site/`** — a separate Vite+React app that auto-discovers every component's `.stories.tsx` via glob at build time and imports the component source directly. No manual registration needed when adding a component — deployed to GitHub Pages by `.github/workflows/docs.yml`.
- **`example/`** — a small demo dashboard app, `private: true`, part of the pnpm workspace (`pnpm-workspace.yaml`, tracked in git). Depends on the library via `"@starbemtech/react-starsystem": "workspace:*"` — always resolves to the local `dist/`, never the published npm version. Run `pnpm build` at the repo root before building/running `example/` so its workspace link has something to point at.

## Design Tokens & Styling Rules

- **No hardcoded hex/px colors** in component `.tsx` files — always use the Tailwind utility classes generated from `@theme` tokens (`bg-primary-base`, `text-ink-700`, etc.).
- **Valid `ink` scale:** `900, 800, 700, 600, 500, 300, 200, 100, 50` — **there is no `ink-400`.** This exact bug (`bg-ink-400`/`text-ink-400`, a nonexistent class that silently compiles to nothing) has shipped twice in past sessions. Before using any `ink-N` class, confirm `N` is in the list above.
- **Note the spelling:** the tertiary/pink scale is spelled `terciary` throughout this codebase (`terciary-base`, `terciary-lightest`, etc.) — not `tertiary`. This is intentional and consistent; don't "fix" it to the standard English spelling.
- **Dark mode:** every component must ship `dark:` variants for ink-scale classes. The established pairing convention: `ink-900↔ink-100`, `ink-600↔ink-300` (there's no `ink-400`, don't pair through it), `ink-500↔ink-300`, `ink-200↔ink-700`, `ink-100↔ink-700` for backgrounds. Dark mode is opt-in and class-based (`.dark` on an ancestor), not tied to `prefers-color-scheme`. Brand colors (primary orange) and semantic status colors (success/warning/error/info in Alert/Badge/Toast) are theme-invariant — same value in both themes, don't add `dark:` overrides for those.
- **SVG `stroke`/`fill` attributes** (charts, custom icons) cannot read Tailwind classes for computed color values — use `style={{ stroke: color }}` with a CSS variable reference (`var(--color-primary-base)`), never a Tailwind class, on those specific SVG attributes. Non-color SVG styling (grid lines via `className="stroke-ink-100"`) works fine as a class since Tailwind can set `stroke` via CSS.
- Container queries (`@container`, `@[640px]:`) are supported natively by the installed Tailwind v4 — no plugin needed. Confirmed working (used in the `Menu` component's `auto` mode via `ResizeObserver` + conditional render rather than pure CSS, since ARIA visibility needs JS-driven state, not just CSS show/hide — see `src/components/Menu/Menu.tsx`).

## Adding a Component

1. **Create folder:** `src/components/<ComponentName>/`
2. **Implementation:** `<ComponentName>.tsx`
   - Functional component, TypeScript, export `<ComponentName>Props` alongside it
   - Use `cn()` for className merging
   - No `any` types
3. **Stories:** `<ComponentName>.stories.tsx`
   - `import type { Meta, StoryObj } from '../../docs-types'` — **not** `@storybook/react` (this lib doesn't use Storybook, `docs-types.ts` is a lightweight shim with the same shape)
   - Cover every variant/prop combination as named exports
   - No registration step — `docs-site/` discovers it via glob
4. **Tests:** `<ComponentName>.test.tsx`
   - vitest + `@testing-library/react` + `vitest-axe`
   - Every component needs at least one a11y test: `axe(container)` + `// @ts-expect-error -- axe() is not typed in the default vitest-axe module` + `toHaveNoViolations()` (match the exact pattern in `src/components/Badge/Badge.test.tsx`)
   - Cover rendering, every prop/variant, interactions, and keyboard behavior where relevant
5. **Re-export:** `index.ts`:
   ```ts
   export { ComponentName } from './ComponentName'
   export type { ComponentNameProps } from './ComponentName'
   ```
6. **Barrel export:** add the same two lines to `src/index.ts`.
7. **Changeset:** `pnpm changeset` (see Versioning & Publishing).

## Accessibility

- **WCAG 2.1 AA** minimum on every component.
- Semantic HTML first; ARIA only to fill real gaps.
- `vitest-axe` in every `.test.tsx` (see pattern above).
- Never nest an interactive control inside another interactive control (e.g. a `<button>` inside a `<button>`) — this is invalid HTML and breaks keyboard/AT navigation. If a component needs two independent actions (e.g. a chip with a remove button), render them as siblings.
- Content that's visually hidden but still mounted in the DOM (off-canvas panels, closed drawers) needs both `aria-hidden="true"` AND `inert` (or equivalent focus-trapping) — `aria-hidden` alone does not stop keyboard focus from reaching descendants. When adding `inert` conditionally with React, never render `inert={false}` explicitly — spread it in only when true (`{...(condition ? { inert: true } : {})}`), since `inert` is a boolean HTML attribute where presence alone matters regardless of the string value, and older React/browser combinations can render `inert={false}` as the literal (and therefore active) `inert="false"` attribute.
- Reference: https://www.w3.org/WAI/standards-guidelines/wcag/

## Code Quality

- **Linting:** ESLint, config in `eslint.config.js`. `pnpm lint` only lints `src/` (`eslint src`) — it does not touch `example/`, `docs-site/`, or config files. Do not add `example/`-specific ignores or other scope creep to `eslint.config.js` without a real reason tied to `src/`.
- **Formatting:** Prettier (`.prettierrc`).
- **Type checking:** TypeScript strict mode, no `any`.
- **YAGNI:** don't add props, variants, or abstractions the current task doesn't need.

## Testing

- vitest + `@testing-library/react` + `vitest-axe`.
- Run a single file during iteration: `pnpm test <ComponentName>.test.tsx`. Run the full suite (`pnpm test`) before considering any task done.
- If you see the test count roughly double (e.g. 550 → 1100), you're running from a directory that also has a leftover git worktree checked out — vitest's glob picks up both copies. This is a known artifact, not a real failure; it resolves once the worktree is removed.

## Versioning & Publishing

Uses [Changesets](https://github.com/changesets/changesets):

1. **Every change that ships to consumers gets a changeset.** Run `pnpm changeset` locally (never hand-write `package.json`'s version), pick `patch`/`minor`/`major`, write a summary that documents the actual API change (not just "fixed a bug") — this text becomes the CHANGELOG entry and the GitHub Release notes verbatim.
2. **Multiple pending changesets accumulate** in `.changeset/*.md` until someone runs `pnpm changeset version` (bumps `package.json` + `CHANGELOG.md`, consumes and deletes the changeset files). **If any pending changeset is `major`, the resulting bump is major** regardless of how many `minor`/`patch` changesets are also pending — check `.changeset/*.md` before assuming a release is a small bump.
3. **Real publish trigger: a `v*` git tag pushed to the remote**, not a merge to `main` by itself. `.github/workflows/publish.yml` runs on `push: tags: ['v*']`, builds, and runs `npm publish --access public` directly (not `pnpm release`/`changeset publish` — pnpm's OIDC/Trusted Publishing support is inconsistent across pnpm major versions as of this writing; the workflow comment explains why npm's CLI is used directly instead). No `NPM_TOKEN` needed — publish auth is OIDC Trusted Publishing via the workflow's `id-token: write` permission.
4. **Full release flow:**
   ```bash
   pnpm changeset version        # bump package.json + CHANGELOG.md, delete consumed changesets
   pnpm lint && pnpm typecheck && pnpm build && pnpm test   # verify green before tagging
   git add -A && git commit -m "chore: release vX.Y.Z"
   git push origin main
   git tag vX.Y.Z
   git push origin vX.Y.Z        # this push is what triggers the actual npm publish
   ```
5. **If a tag's publish run fails before the `npm publish` step**, nothing was actually published — it's safe to fix the problem, delete the tag (`git push origin :refs/tags/vX.Y.Z && git tag -d vX.Y.Z`), and re-push the same tag once the fix is committed. If the run failed *after* `npm publish` succeeded, do not re-push the tag — the version is already live; fix forward with a new patch release instead.
6. A GitHub Release is auto-generated from the tag by the same workflow, including the changelog section for that version and a commit list since the previous tag.

## CI/CD

Three workflows in `.github/workflows/`, all using `pnpm/action-setup@v4`:

- **`ci.yml`** — every push/PR to `main`: install, lint, format:check, typecheck, build, test.
- **`docs.yml`** — every push to `main`: builds `docs-site/` and deploys to GitHub Pages.
- **`publish.yml`** — on `v*` tag push: builds and publishes to npm (see Versioning & Publishing above).

**Critical rule: never hardcode a pnpm version in any workflow's `pnpm/action-setup@v4` step.** The repo pins its pnpm version via `"packageManager": "pnpm@X.Y.Z"` in the root `package.json`, and `pnpm/action-setup@v4` reads that automatically when no `version:` input is given. If you add `version: N` to any workflow's `pnpm/action-setup` step, it will conflict with the `packageManager` field (`Error: Multiple versions of pnpm specified`) and the job will fail outright. If you ever need to bump pnpm, update **only** `package.json`'s `packageManager` field — never touch the workflow files for this.

**Also watch for:** if `package.json`'s `packageManager` field ever gets out of sync with the actual pnpm version used to generate the committed `pnpm-lock.yaml`, CI's `pnpm install --frozen-lockfile` can fail with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` (seen in production once, root-caused to `pnpm-workspace.yaml`'s `overrides` block being interpreted differently across pnpm major versions). If you see that error, first check whether `packageManager` matches your local `pnpm --version`; if not, that's very likely the actual cause, not a real lockfile corruption.

Branch protection on `main` requires PRs and a passing `ci` status check — direct pushes are technically blocked but can be bypassed with sufficient repo permissions. Prefer PRs; only bypass when the repo owner has explicitly said to push directly.

## Monorepo / Workspace

- `pnpm-workspace.yaml` (root, tracked in git) declares `packages: ['.', 'example']` plus `overrides` and `allowBuilds` pnpm-supply-chain settings. **This file must stay tracked** — it used to be gitignored, which meant every fresh clone silently lost workspace linking and pnpm supply-chain policy; don't re-add it to `.gitignore`.
- `example/package.json` depends on the library via `"workspace:*"`, not a semver range — this is intentional so the example always builds against local `dist/`, catching integration breaks before publish. Never change it back to a version pin.
- `example/*.tsbuildinfo`, `example/vite.config.js`, `example/vite.config.d.ts` are build artifacts of `example/`'s own `tsc -b` step — gitignored, never commit them even if they show up as untracked after a local build.

## Dependencies

- **Peer:** `react >=18`, `react-dom >=18`, `material-symbols >=0.45.0` (required by `Icon` — consumers must import the font CSS themselves, e.g. `import 'material-symbols/rounded.css'`).
- **Runtime:** `clsx`, `tailwind-merge`.
- **Dev:** Vite, TypeScript, Tailwind CSS v4, vitest, ESLint, Changesets.

## Figma Source

The Star System Figma library is the primary source of truth for component design and tokens:

- **File Key:** `6wfkhBhONJ7r4A0PZWIsIs`
- **Library Key:** `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`

Use the Figma MCP tools to query component designs and extract token definitions. **If a component has no reliable match in this Figma library** (check both the current "Star System" library and any "(Old)"/legacy library before concluding this), fall back to the local reference bundle at `~/Downloads/Starbem Design System/components/` if present on the machine — it's a scraped `.jsx`/`.d.ts`/`.prompt.md` export of the design system that has covered gaps in the Figma library before (e.g. `Menu`, `Progress`, `Tag`, `IconButton`, `FilterBar`, `FileUploader`, `ListItem`, `Chart` were all sourced this way).

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
│   ├── tokens/                 # Design token constants (colors.ts, typography.ts, spacing.ts)
│   ├── styles/
│   │   └── globals.css         # Tailwind @theme config
│   ├── utils/
│   │   └── cn.ts               # clsx + tailwind-merge helper
│   ├── docs-types.ts            # Meta/StoryObj shim (not Storybook)
│   ├── vite-env.d.ts
│   └── index.ts                # Public API barrel export
├── dist/                       # Build output (gitignored)
├── docs-site/                  # Component docs site (Vite + React), deployed to GitHub Pages
├── example/                    # Demo dashboard app, workspace-linked to the library
├── .changeset/                 # Pending changesets + config
├── .github/workflows/          # ci.yml, docs.yml, publish.yml
├── pnpm-workspace.yaml          # Workspace + pnpm supply-chain config (tracked)
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── package.json                 # packageManager field pins the pnpm version for all CI
├── AGENTS.md                    # This file
└── CLAUDE.md                    # Points here
```
