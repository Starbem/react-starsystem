# Directory Structure

## Source Files (as of 2026-06-30)

```
react-starsystem/
├── .changeset/
│   └── config.json                          # Changesets configuration
├── .claude/
│   ├── settings.json                        # Claude Code project settings
│   └── settings.local.json                  # Claude Code local overrides
├── .specs/                                  # SDD spec artifacts (this directory)
│   ├── codebase/
│   │   ├── ARCHITECTURE.md
│   │   ├── CONCERNS.md
│   │   ├── CONVENTIONS.md
│   │   ├── INTEGRATIONS.md
│   │   ├── STACK.md
│   │   ├── STRUCTURE.md
│   │   └── TESTING.md
│   └── project/
│       ├── PROJECT.md
│       ├── ROADMAP.md
│       └── STATE.md
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.stories.tsx           # Storybook stories
│   │       ├── Button.test.tsx              # Unit tests
│   │       ├── Button.tsx                   # Component implementation
│   │       └── index.ts                     # Re-export
│   ├── styles/
│   │   └── globals.css                      # Tailwind v4 base + @theme tokens
│   ├── tokens/                              # Design token constants (empty — P1 work)
│   ├── utils/
│   │   └── cn.ts                            # clsx + tailwind-merge helper
│   ├── index.ts                             # Public API barrel export
│   ├── test-setup.ts                        # vitest setup (@testing-library/jest-dom)
│   └── vite-env.d.ts                        # Vite client type reference
├── package.json
├── tsconfig.json                            # IDE / typecheck (noEmit)
├── tsconfig.build.json                      # DTS generation (excludes stories/tests)
├── vite.config.ts                           # Vite lib mode config
└── vitest.config.ts                         # vitest config (separate from vite.config.ts)
```

## Key Entry Points

| File | Role |
|---|---|
| `src/index.ts` | Library public API — only exports from here reach consumers |
| `src/styles/globals.css` | Tailwind v4 base import + `@theme` design token block |
| `vite.config.ts` | Build pipeline — lib mode, ESM output, CSS rename, external deps |
| `vitest.config.ts` | Test runner config — jsdom environment, setup file |
| `tsconfig.build.json` | TypeScript config used by vite-plugin-dts for declaration generation |

## Build Output (dist/ — gitignored)

```
dist/
├── index.js          # ESM bundle
├── index.js.map      # Source map
├── index.d.ts        # TypeScript declarations (insertTypesEntry)
└── style.css         # Compiled Tailwind stylesheet
```

## What Is Excluded from Git

- `dist/` — built output
- `node_modules/`
- `storybook-static/` — Storybook static build output

## Adding a New Component

Create `src/components/<Name>/` with four files:

```
<Name>.tsx           # implementation
<Name>.stories.tsx   # stories
<Name>.test.tsx      # tests
index.ts             # re-export
```

Then add the export to `src/index.ts`.
