# Integrations

## Figma — Star System DS

**Role:** Single source of truth for all component designs and design tokens.

| Field | Value |
|---|---|
| File name | Star System |
| File key | `6wfkhBhONJ7r4A0PZWIsIs` |
| Library key | `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019` |

**Usage:**
- The Figma MCP (`mcp__claude_ai_Figma__*`) is used to query component designs and extract token definitions.
- Tools: `search_design_system`, `get_variable_defs`, `get_design_context`, `get_screenshot`.
- P1 work: extract colors, typography, spacing, shadows from Figma and populate `src/tokens/` + `src/styles/globals.css @theme`.

**Rule:** No token or component style may be invented in code. All visual decisions come from Figma.

## npm Registry

**Role:** Distribution — consumers install via `pnpm add @starbemtech/react-starsystem`.

| Field | Value |
|---|---|
| Registry | registry.npmjs.org |
| Scope | @starbemtech |
| Access | public |
| Current version | 0.0.0 (unreleased) |

Published files: `dist/` directory only (controlled by `"files": ["dist"]` in package.json).

## GitHub Actions CI

Two workflows in `.github/workflows/`:

### ci.yml

Runs on every PR and push to `main`. Steps:
1. Install dependencies (`pnpm install`)
2. Lint (`pnpm lint`)
3. Typecheck (`pnpm typecheck`)
4. Build (`pnpm build`)
5. Test (`pnpm test`)

Blocks merge if any step fails.

### publish.yml

Runs on push to `main` only. Uses `changesets/action@v1`:
1. Install dependencies (`pnpm install`)
2. Build (`pnpm build`) — `dist/` is gitignored, must be built in CI before publish
3. Changesets action: creates Release PR or publishes to npm (depending on open changesets)

## Changesets

**Role:** Semantic versioning and changelog management.

Config: `.changeset/config.json`

Workflow:
1. Developer runs `pnpm changeset` locally on their branch
2. Selects major/minor/patch bump, writes summary
3. Generated file in `.changeset/` is committed with the PR
4. On merge to main, `changesets/action` either:
   - Creates a "Version Packages" PR (if changesets are pending)
   - Publishes to npm and creates a GitHub release (if on the Release PR)

**Important:** Do not manually bump `version` in `package.json`. Changesets manages this.
