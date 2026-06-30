# @starbemtech/react-starsystem — P0 Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the `@starbemtech/react-starsystem` React component library with Vite lib mode, Tailwind v4, Storybook 8, ESLint, Changesets, and GitHub Actions — ready for first component authoring.

**Architecture:** Vite in lib mode compiles `src/index.ts` → `dist/index.js` + `dist/index.d.ts`. Tailwind v4 (via `@tailwindcss/vite`) is compiled into `dist/style.css` — consumers import the CSS file directly, no Tailwind config needed on their side. Storybook 8 runs as a parallel dev environment for component authoring and visual testing.

**Tech Stack:** React 18+, TypeScript 5 (strict), Vite 6, `@tailwindcss/vite` (Tailwind v4), Storybook 8, `vite-plugin-dts`, `@changesets/cli`, ESLint 9 (flat config), Prettier, pnpm

## Global Constraints

- Package manager: **pnpm** only — never `npm install`
- Package name: `@starbemtech/react-starsystem`
- React is a **peerDependency** — never bundle it
- Output formats: **ESM only** (`"type": "module"`)
- CSS output: single `dist/style.css` — `cssCodeSplit: false`
- TypeScript: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Node ≥ 20
- Jira card lifecycle: transition ID-3157 → In Progress on start; add comment + transition → QA on finish

---

## File Map

```
react-starsystem/
├── src/
│   ├── components/          # one folder per component
│   ├── tokens/              # design token constants
│   ├── styles/
│   │   └── globals.css      # @import "tailwindcss" + @theme overrides
│   └── index.ts             # barrel export (public API)
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── .github/
│   └── workflows/
│       ├── ci.yml           # lint + typecheck + build on PR
│       └── publish.yml      # changeset publish on main push
├── .changeset/
│   └── config.json
├── dist/                    # gitignored build output
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.js
├── .prettierrc
├── .npmrc
└── .gitignore
```

---

## Task 1: pnpm init + package.json + .npmrc + .gitignore

**Jira:** ID-3157

**Files:**
- Create: `package.json`
- Create: `.npmrc`
- Create: `.gitignore`

**Interfaces:**
- Produces: `@starbemtech/react-starsystem` package skeleton consumed by all subsequent tasks

- [ ] **Step 1: Initialize pnpm project**

```bash
cd /Users/julio-starbem/Documents/Projects/starbem/libs/react-starsystem
pnpm init
```

- [ ] **Step 2: Replace package.json with full config**

Write `package.json`:

```json
{
  "name": "@starbemtech/react-starsystem",
  "version": "0.0.0",
  "description": "Starbem Star System — React component library",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"],
  "sideEffects": ["./dist/style.css"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "typecheck": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "release": "changeset publish"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {}
}
```

- [ ] **Step 3: Create .npmrc**

Write `.npmrc`:

```ini
@starbemtech:registry=https://registry.npmjs.org/
access=public
```

- [ ] **Step 4: Create .gitignore**

Write `.gitignore`:

```
node_modules/
dist/
storybook-static/
*.local
.DS_Store
coverage/
```

- [ ] **Step 5: Commit**

```bash
git init
git add package.json .npmrc .gitignore
git commit -m "chore: initialize @starbemtech/react-starsystem package"
```

---

## Task 2: Vite lib mode + TypeScript + vite-plugin-dts

**Jira:** ID-3157 (same task — config is part of initialization)

**Files:**
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `src/index.ts`

**Interfaces:**
- Consumes: `package.json` from Task 1
- Produces: `vite build` → `dist/index.js`, `dist/index.d.ts`, `dist/style.css`

- [ ] **Step 1: Install core dependencies**

```bash
pnpm add -D vite @vitejs/plugin-react vite-plugin-dts typescript react react-dom @types/react @types/react-dom
```

- [ ] **Step 2: Write vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})
```

- [ ] **Step 3: Write tsconfig.json** (for IDE + typecheck, noEmit)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  },
  "include": ["src", "vite.config.ts", "eslint.config.js", ".storybook"]
}
```

- [ ] **Step 4: Write tsconfig.build.json** (used by vite-plugin-dts for declarations)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowImportingTsExtensions": false,
    "noEmit": false,
    "declaration": true,
    "declarationDir": "dist",
    "emitDeclarationOnly": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Update vite.config.ts to reference tsconfig.build.json**

Edit `vite.config.ts` — add `tsconfigPath` to dts plugin options:

```typescript
dts({
  include: ['src'],
  insertTypesEntry: true,
  rollupTypes: true,
  tsconfigPath: './tsconfig.build.json',
}),
```

- [ ] **Step 6: Create minimal src/index.ts**

```typescript
// Public API — add exports here as components are built
export const version = '0.0.0'
```

- [ ] **Step 7: Verify build works**

```bash
pnpm build
```

Expected output:
```
dist/index.js
dist/index.d.ts
dist/style.css  (may be empty — that's fine at this stage)
```

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts tsconfig.json tsconfig.build.json src/index.ts
git commit -m "chore: configure vite lib mode + TypeScript"
```

---

## Task 3: Tailwind CSS v4

**Jira:** ID-3158

**Files:**
- Create: `src/styles/globals.css`
- Modify: `vite.config.ts` (add tailwind plugin)
- Modify: `src/index.ts` (import globals.css so Vite picks it up)

**Interfaces:**
- Consumes: `vite.config.ts` from Task 2
- Produces: `dist/style.css` with compiled Tailwind utilities + Starbem design tokens

- [ ] **Step 1: Install Tailwind v4**

```bash
pnpm add -D @tailwindcss/vite tailwindcss
```

- [ ] **Step 2: Add Tailwind plugin to vite.config.ts**

Edit `vite.config.ts` — import and add plugin (before `react()`):

```typescript
import tailwindcss from '@tailwindcss/vite'

// In plugins array:
plugins: [
  tailwindcss(),
  react(),
  dts({ ... }),
],
```

- [ ] **Step 3: Create src/styles/globals.css**

```css
@import "tailwindcss";

/* Starbem Star System design tokens — to be expanded in P1 */
@theme {
  /* Placeholder: tokens will be populated from Figma in Phase P1 */
  --font-family-display: "Funnel Display", sans-serif;
}
```

- [ ] **Step 4: Import CSS in src/index.ts so Vite bundles it**

```typescript
import './styles/globals.css'

export const version = '0.0.0'
```

- [ ] **Step 5: Build and verify CSS output**

```bash
pnpm build
```

Expected: `dist/style.css` now contains Tailwind base/utilities.

- [ ] **Step 6: Commit**

```bash
git add src/styles/globals.css vite.config.ts src/index.ts
git commit -m "chore: add Tailwind CSS v4 with @theme token placeholder"
```

---

## Task 4: Storybook 8.x

**Jira:** ID-3159

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Create: `src/components/Button/Button.tsx` (placeholder — verifies Storybook renders)
- Create: `src/components/Button/Button.stories.tsx`
- Create: `src/components/Button/index.ts`

**Interfaces:**
- Consumes: `src/styles/globals.css` from Task 3
- Produces: Storybook running on port 6006 with one working story

- [ ] **Step 1: Install Storybook**

```bash
pnpm dlx storybook@latest init --type react --builder @storybook/builder-vite --yes
```

If init doesn't use the right builder, manually install:

```bash
pnpm add -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions storybook
```

- [ ] **Step 2: Write .storybook/main.ts**

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
```

- [ ] **Step 3: Write .storybook/preview.ts**

```typescript
import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

- [ ] **Step 4: Create placeholder Button component**

`src/components/Button/Button.tsx`:

```typescript
import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'secondary',
          'text-gray-700 hover:bg-gray-100': variant === 'ghost',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-11 px-6 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Create cn utility** (needed by Button)

Create `src/utils/cn.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install deps:

```bash
pnpm add clsx tailwind-merge
```

- [ ] **Step 6: Create Button index**

`src/components/Button/index.ts`:

```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

- [ ] **Step 7: Create Button story**

`src/components/Button/Button.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Button',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

- [ ] **Step 8: Update src/index.ts exports**

```typescript
import './styles/globals.css'

export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'

export const version = '0.0.0'
```

- [ ] **Step 9: Start Storybook and verify**

```bash
pnpm storybook
```

Expected: browser opens at `http://localhost:6006` with Button story visible in all 3 variants.

- [ ] **Step 10: Verify build still works**

```bash
pnpm build
```

- [ ] **Step 11: Commit**

```bash
git add .storybook src/components/Button src/utils/cn.ts src/index.ts
git commit -m "chore: add Storybook 8 + placeholder Button component"
```

---

## Task 5: ESLint 9 (flat config) + Prettier

**Jira:** ID-3160

**Files:**
- Create: `eslint.config.js`
- Create: `.prettierrc`
- Create: `.prettierignore`

**Interfaces:**
- Produces: `pnpm lint` and `pnpm lint:fix` working correctly

- [ ] **Step 1: Install ESLint + plugins**

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals prettier eslint-config-prettier eslint-plugin-storybook
```

- [ ] **Step 2: Write eslint.config.js**

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', '*.config.*'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  ...storybook.configs['flat/recommended'],
)
```

- [ ] **Step 3: Write .prettierrc**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- [ ] **Step 4: Write .prettierignore**

```
dist/
storybook-static/
node_modules/
```

- [ ] **Step 5: Run lint and verify no errors**

```bash
pnpm lint
```

Expected: no errors (warnings for react-refresh in stories are acceptable)

- [ ] **Step 6: Commit**

```bash
git add eslint.config.js .prettierrc .prettierignore
git commit -m "chore: add ESLint 9 flat config + Prettier"
```

---

## Task 6: Changesets

**Jira:** ID-3162

**Files:**
- Create: `.changeset/config.json`

**Interfaces:**
- Produces: `pnpm changeset` workflow for versioning; `pnpm release` for npm publish

- [ ] **Step 1: Install changesets**

```bash
pnpm add -D @changesets/cli
```

- [ ] **Step 2: Initialize changesets**

```bash
pnpm changeset init
```

- [ ] **Step 3: Edit .changeset/config.json**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 4: Commit**

```bash
git add .changeset
git commit -m "chore: add changesets for versioning"
```

---

## Task 7: GitHub Actions — CI + Publish

**Jira:** ID-3161

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/publish.yml`

**Interfaces:**
- Consumes: `pnpm lint`, `pnpm typecheck`, `pnpm build` scripts from prior tasks
- Produces: automated CI on PRs; npm publish on merged changesets

- [ ] **Step 1: Create CI workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint

      - run: pnpm typecheck

      - run: pnpm build
```

- [ ] **Step 2: Create publish workflow**

`.github/workflows/publish.yml`:

```yaml
name: Publish

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          title: "chore: release packages"
          commit: "chore: release packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/ci.yml .github/workflows/publish.yml
git commit -m "chore: add GitHub Actions CI + changeset publish workflow"
```

---

## Task 8: Final folder structure + CLAUDE.md

**Jira:** ID-3163

**Files:**
- Create: `src/tokens/.gitkeep`
- Create: `CLAUDE.md`

**Interfaces:**
- Produces: complete P0 scaffold — ready for P1 token extraction

- [ ] **Step 1: Create token and utils directories**

```bash
mkdir -p src/tokens src/utils
touch src/tokens/.gitkeep
```

- [ ] **Step 2: Write CLAUDE.md**

```markdown
# @starbemtech/react-starsystem

React component library for Starbem's Star System Design System.

## Commands

\`\`\`bash
pnpm install          # install deps
pnpm build            # compile lib → dist/
pnpm dev              # watch mode
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint
pnpm lint:fix         # ESLint --fix
pnpm storybook        # Storybook dev on :6006
pnpm build-storybook  # static Storybook build
pnpm test             # vitest run
\`\`\`

## Architecture

- Entry: `src/index.ts` — barrel export of all public components
- Styles: `src/styles/globals.css` — Tailwind v4 + @theme tokens
- Components: `src/components/<ComponentName>/` — one folder per component
- Tokens: `src/tokens/` — design token TS constants (colors, typography, spacing)
- Utils: `src/utils/cn.ts` — clsx + tailwind-merge helper

## Figma Source

- File: Star System (`fileKey: 6wfkhBhONJ7r4A0PZWIsIs`)
- Library key: `lk-9c495c686dadb150500e7aa13dd795390c752ea1e44d631d6092ab520cd70f99ff656dff3415e0ac9fac977eab654a4a167c927b572b82bc85e8b51a457cb019`

## Adding a Component

1. Create `src/components/<Name>/`
2. `<Name>.tsx` — component implementation
3. `<Name>.stories.tsx` — Storybook stories with `autodocs` tag
4. `<Name>.test.tsx` — vitest unit tests
5. `index.ts` — re-export component + types
6. Add export to `src/index.ts`

## Publishing

Uses Changesets. On any PR, run:
\`\`\`bash
pnpm changeset        # pick bump type + write summary
\`\`\`
On merge to main, the Publish GitHub Action creates a Release PR or publishes automatically.
\`\`\`
\`\`\`

- [ ] **Step 3: Final build + lint verification**

```bash
pnpm lint && pnpm typecheck && pnpm build
```

Expected: all pass, `dist/` has `index.js`, `index.d.ts`, `style.css`

- [ ] **Step 4: Commit**

```bash
git add src/tokens/.gitkeep CLAUDE.md
git commit -m "chore: finalize P0 scaffold — ready for component authoring"
```

---

## P0 Done Checklist

- [ ] `pnpm build` → produces `dist/index.js`, `dist/index.d.ts`, `dist/style.css`
- [ ] `pnpm typecheck` → no errors
- [ ] `pnpm lint` → no errors
- [ ] `pnpm storybook` → Button story renders at localhost:6006
- [ ] `.changeset/config.json` present with `access: public`
- [ ] GitHub Actions workflows committed
- [ ] Jira ID-3157 through ID-3163 transitioned to QA - Testing with comment

---

## Next Phase

After P0 complete: **P1 — Design Tokens** (ID-3164 to ID-3167)

Extract colors, typography, spacing, and shadows from Figma Star System library (`libraryKey: lk-9c495c68...`) using `search_design_system` + `get_variable_defs`, then populate:
- `src/tokens/colors.ts`
- `src/tokens/typography.ts`
- `src/tokens/spacing.ts`
- `src/styles/globals.css` `@theme` block with all CSS custom properties
