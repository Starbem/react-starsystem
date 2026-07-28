# Docs-site redesign + Home page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the `docs-site` app a branded Home page (logo, hero, "Getting Started" CTA, 4 highlight cards) and reskin its component-browsing layout (TopBar + sidebar) using the design system's own `Button`/`Card`/`TopBar` components, without touching `loadStories.ts` or `StoryRenderer.tsx`.

**Architecture:** `App.tsx` becomes a thin router holding `view: 'home' | 'docs'` state. `Home.tsx` (new) is the full-screen landing page. `DocsLayout.tsx` (new) contains everything `App.tsx` renders today (sidebar + `StoryRenderer` area), wrapped in the library's own `TopBar` component, with a reskinned sidebar.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (via `@tailwindcss/vite`), Vite 8. No new dependencies.

## Global Constraints

- Do not modify `docs-site/src/loadStories.ts` or `docs-site/src/StoryRenderer.tsx` — spec explicitly keeps these unchanged.
- Do not add react-router or any URL-based routing — navigation stays in-memory state (`useState`), matching the existing bootstrap spec's decision.
- Do not touch `.github/workflows/` or the npm publish pipeline — out of scope (separate tickets ID-3198/ID-3199).
- `docs-site` has no test suite and its TypeScript files are NOT covered by the root `tsconfig.json` (`include: ["src", ...]` excludes `docs-site/`) or by `pnpm lint` (`"lint": "eslint src"`). The only automated gate for docs-site changes is `pnpm docs:build` succeeding (esbuild transform — catches syntax errors, not full type errors). Manual visual verification via `pnpm docs:dev` is required for each task that changes rendered output.
- Brand colors (verified against existing repo assets, matches `#FF5100` already used for focus rings across components): logo icon uses `#FF5100` (orange), `#E81F76` (pink), `#FFA947` (light orange); wordmark text uses `#221C35` (dark navy).

---

### Task 1: Copy Starbem brand assets into `docs-site/public/brand/`

**Files:**
- Create: `docs-site/public/brand/starbem-logo.svg` (copy of `frontend/star-portal/public/login/logos_starbem.svg`, an existing Starbem project on disk — NOT part of this repo, read-only source)
- Create: `docs-site/public/brand/starbem-mark.svg` (copy of `frontend/star-portal/public/dashboard/logo-star.svg`, same source project)

**Interfaces:**
- Produces: two static assets servable at build/dev time as `./brand/starbem-logo.svg` (full logo, 92×56 viewBox, icon+wordmark) and `./brand/starbem-mark.svg` (icon only, 33×32 viewBox). Both are referenced by relative path (no leading `/`) to work with `vite.config.ts`'s `base: './'` on any GitHub Pages sub-path.

- [ ] **Step 1: Create the brand assets directory and copy the two SVGs**

```bash
mkdir -p /Users/juliosousa/Projects/Starbem/libs/react-starsystem/docs-site/public/brand
cp "/Users/juliosousa/Projects/Starbem/frontend/star-portal/public/login/logos_starbem.svg" \
   /Users/juliosousa/Projects/Starbem/libs/react-starsystem/docs-site/public/brand/starbem-logo.svg
cp "/Users/juliosousa/Projects/Starbem/frontend/star-portal/public/dashboard/logo-star.svg" \
   /Users/juliosousa/Projects/Starbem/libs/react-starsystem/docs-site/public/brand/starbem-mark.svg
```

- [ ] **Step 2: Verify both files exist and are valid SVG**

Run: `head -c 200 docs-site/public/brand/starbem-logo.svg && echo && head -c 200 docs-site/public/brand/starbem-mark.svg`
Expected: both outputs start with `<svg width="92" height="56"...` and `<svg width="33" height="32"...` respectively.

- [ ] **Step 3: Commit**

```bash
git add docs-site/public/brand/starbem-logo.svg docs-site/public/brand/starbem-mark.svg
git commit -m "docs: add Starbem brand assets for docs-site"
```

---

### Task 2: Create the Home page (`Home.tsx`)

**Files:**
- Create: `docs-site/src/Home.tsx`

**Interfaces:**
- Consumes: `Button` from `../../src/components/Button` (props used: `size="lg"`, `onClick`, `children` — see `src/components/Button/Button.tsx:4-11`), `Card` + `Card.Body` from `../../src/components/Card` (props used: `variant="elevated"` — see `src/components/Card/Card.tsx:8-13`).
- Produces: `export function Home({ onGetStarted }: HomeProps): JSX.Element` where `HomeProps = { onGetStarted: () => void }`. Consumed by `App.tsx` in Task 4.

- [ ] **Step 1: Write `Home.tsx`**

```tsx
import { Button } from '../../src/components/Button'
import { Card } from '../../src/components/Card'

export interface HomeProps {
  onGetStarted: () => void
}

function RadixIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3.5v17M3.5 12h17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function A11yIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <path
        d="M4 9.5 12 11l8-1.5M12 11v10M8.5 21 12 15l3.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TailwindIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 10c.8-3 2.4-4.5 5-4.5s4.2 1.5 5 4.5c-.8-1.5-2-2-3.5-1.5-1 .3-1.7 1.2-2.5 2C9 11.7 8 12.2 6 11.5c1 1.5 2.4 2 4 1.5M6 15.5c.8-3 2.4-4.5 5-4.5s4.2 1.5 5 4.5c-.8-1.5-2-2-3.5-1.5-1 .3-1.7 1.2-2.5 2-1 .7-2 1.2-4 .5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypeScriptIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12h4M10 12v5.5M14.5 16c0 1 .8 1.5 1.8 1.5s1.7-.5 1.7-1.3c0-2-3.3-1.3-3.3-3.4 0-.9.8-1.5 1.8-1.5s1.7.5 1.8 1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const HIGHLIGHTS = [
  {
    title: 'Baseado em Radix UI',
    description: 'Primitivas acessíveis e testadas por baixo dos panos de cada componente interativo.',
    icon: <RadixIcon />,
  },
  {
    title: 'Acessível (WCAG 2.1 AA)',
    description: 'Cada componente é testado com vitest-axe para garantir conformidade de acessibilidade.',
    icon: <A11yIcon />,
  },
  {
    title: 'Tailwind CSS v4',
    description: 'Estilização via tokens do design system, com suporte nativo a tema claro e escuro.',
    icon: <TailwindIcon />,
  },
  {
    title: 'TypeScript strict',
    description: 'Todo componente com props totalmente tipadas, sem uso de any.',
    icon: <TypeScriptIcon />,
  },
] as const

export function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-[24px] py-[64px]">
      <img src="./brand/starbem-logo.svg" alt="Starbem" className="mb-[32px] h-[56px] w-auto" />

      <h1 className="mb-[12px] text-center text-[32px] font-semibold text-[#101828]">Star System</h1>
      <p className="mb-[32px] max-w-[480px] text-center text-[16px] text-[#667085]">
        Design system oficial da Starbem: componentes React acessíveis, tipados e prontos pra produção.
      </p>

      <Button size="lg" onClick={onGetStarted}>
        Getting Started
      </Button>

      <div className="mt-[64px] grid w-full max-w-[960px] grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <Card key={item.title} variant="elevated">
            <Card.Body>
              <div className="mb-[8px] text-[#FF5100]">{item.icon}</div>
              <strong className="mb-[4px] block text-[14px] text-[#101828]">{item.title}</strong>
              <p className="text-[13px] text-[#667085]">{item.description}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify Tailwind picks up classes from `docs-site/src/` (content-scanning check)**

`src/styles/globals.css:2` has `@source "../components";`, which is a path relative to that CSS file (resolves to `src/components/`, inside the main library). `docs-site/src/` is a different directory tree that this explicit `@source` does NOT cover. Tailwind v4 also does automatic content detection based on the active build's root — `docs-site/vite.config.ts:6` sets `root: __dirname` (i.e. `docs-site/`), so `docs-site/src/**` should be auto-detected as it's inside that root. This step verifies that assumption empirically before relying on it.

Run:
```bash
pnpm docs:build
grep -c "mb-\[32px\]" docs-site/dist/assets/*.css
```
Expected: a non-zero count (the arbitrary-value class `mb-[32px]` used only in `Home.tsx` appears in the compiled CSS).

- [ ] **Step 2b (only if Step 2 printed 0 or errored): add an explicit `@source` for `docs-site`**

If the grep found no match, Tailwind's auto-detection did not reach `docs-site/src`. Fix by adding one line to `src/styles/globals.css` right after the existing `@source` line (line 2):

```css
@source "../components";
@source "../../docs-site/src";
```

Then re-run Step 2's `pnpm docs:build` + `grep` to confirm it now passes. (This edits the same stylesheet that ships in the published npm package — the added path only affects which utility classes get *generated*, it does not add runtime code or change any component's behavior; the marginal CSS size increase from docs-site-only classes is acceptable and expected.)

- [ ] **Step 3: Commit**

```bash
git add docs-site/src/Home.tsx
# If Step 2b was needed, also: git add src/styles/globals.css
git commit -m "feat(docs-site): add branded Home page with Getting Started CTA"
```

---

### Task 3: Extract and reskin the component browser (`DocsLayout.tsx`)

**Files:**
- Create: `docs-site/src/DocsLayout.tsx`
- Read (unchanged): `docs-site/src/loadStories.ts`, `docs-site/src/StoryRenderer.tsx`

**Interfaces:**
- Consumes: `loadStories` from `./loadStories` (returns `LoadedComponentDoc[]`, see `docs-site/src/loadStories.ts:10-16`), `StoryRenderer` from `./StoryRenderer` (props `{ doc: LoadedComponentDoc; story: LoadedStory }`), `TopBar` from `../../src/components/TopBar` (props used: `bordered`, `start`, `center` — see `src/components/TopBar/TopBar.tsx:9-16`), `cn` from `../../src/utils/cn`.
- Produces: `export function DocsLayout({ onBackToHome }: DocsLayoutProps): JSX.Element` where `DocsLayoutProps = { onBackToHome: () => void }`. Consumed by `App.tsx` in Task 4.

- [ ] **Step 1: Write `DocsLayout.tsx`**

```tsx
import { useState } from 'react'
import { loadStories } from './loadStories'
import { StoryRenderer } from './StoryRenderer'
import { TopBar } from '../../src/components/TopBar'
import { cn } from '../../src/utils/cn'

export interface DocsLayoutProps {
  onBackToHome: () => void
}

export function DocsLayout({ onBackToHome }: DocsLayoutProps) {
  const docs = loadStories()
  const [selectedTitle, setSelectedTitle] = useState(docs[0]?.title ?? '')

  const groups = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    ;(acc[doc.group] ??= []).push(doc)
    return acc
  }, {})

  const selected = docs.find((d) => d.title === selectedTitle)

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        bordered
        start={
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1"
          >
            <img src="./brand/starbem-mark.svg" alt="Voltar para a home" className="h-[28px] w-auto" />
          </button>
        }
        center={<span className="text-[16px] font-medium text-[#101828]">Star System</span>}
      />

      <div className="flex flex-1">
        <nav className="w-[240px] shrink-0 overflow-y-auto border-r border-[#EAECF0] bg-white p-[16px]">
          {Object.entries(groups).map(([group, groupDocs]) => (
            <div key={group} className="mb-[16px]">
              <div className="mb-[4px] text-[11px] font-medium uppercase tracking-wide text-[#667085]">
                {group}
              </div>
              {groupDocs.map((d) => (
                <button
                  key={d.title}
                  type="button"
                  onClick={() => setSelectedTitle(d.title)}
                  className={cn(
                    'block w-full rounded-[6px] px-[8px] py-[6px] text-left text-[13px] outline-none',
                    'hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
                    d.title === selectedTitle ? 'bg-[#FFF1EB] font-medium text-[#FF5100]' : 'text-[#344054]',
                  )}
                >
                  {d.page}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-[24px]">
          {selected ? (
            <>
              <h1 className="mb-[16px] text-[20px] font-semibold text-[#101828]">{selected.title}</h1>
              {selected.stories.map((story) => (
                <StoryRenderer key={`${selected.title}/${story.name}`} doc={selected} story={story} />
              ))}
            </>
          ) : (
            <p>No stories found.</p>
          )}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build and confirm no errors**

Run: `pnpm docs:build`
Expected: build succeeds with no errors (esbuild will fail loudly on syntax/import errors — e.g. a wrong relative path to `TopBar` or `cn`).

- [ ] **Step 3: Commit**

```bash
git add docs-site/src/DocsLayout.tsx
git commit -m "feat(docs-site): extract component browser into DocsLayout, reskin with TopBar"
```

---

### Task 4: Wire up routing in `App.tsx`

**Files:**
- Modify: `docs-site/src/App.tsx` (full rewrite — current content is the sidebar+main markup now living in `DocsLayout.tsx`)

**Interfaces:**
- Consumes: `Home` from `./Home` (Task 2), `DocsLayout` from `./DocsLayout` (Task 3).
- Produces: `export function App(): JSX.Element`, unchanged export signature — `docs-site/src/main.tsx` already does `<App />` with no props, nothing else needs to change there.

- [ ] **Step 1: Replace `App.tsx` contents**

```tsx
import { useState } from 'react'
import { Home } from './Home'
import { DocsLayout } from './DocsLayout'

export function App() {
  const [view, setView] = useState<'home' | 'docs'>('home')

  if (view === 'home') {
    return <Home onGetStarted={() => setView('docs')} />
  }

  return <DocsLayout onBackToHome={() => setView('home')} />
}
```

- [ ] **Step 2: Build**

Run: `pnpm docs:build`
Expected: build succeeds.

- [ ] **Step 3: Manual visual verification**

Run: `pnpm docs:dev`, open the printed local URL (default `http://localhost:5173`) in a browser.

Check, in order:
1. Home page loads: Starbem logo visible, "Star System" title, description, orange "Getting Started" button, 4 highlight cards below in a responsive grid (resize the window to confirm 1 → 2 → 4 columns as it widens).
2. Click "Getting Started" → view switches to the component browser (TopBar with icon mark + "Star System" label, sidebar with grouped component list, first component's stories rendered on the right — same content as before this redesign).
3. Click a different component in the sidebar → its stories render, sidebar highlights the new selection in orange (`#FF5100` text on `#FFF1EB` background).
4. Click the small Starbem icon in the top-left of the TopBar → view switches back to the Home page.

If any check fails, stop and fix before proceeding — this is the only verification this app gets.

- [ ] **Step 4: Commit**

```bash
git add docs-site/src/App.tsx
git commit -m "feat(docs-site): route between Home and DocsLayout"
```

---

## Self-Review Notes

- **Spec coverage:** Home hero + 4 highlight cards (Task 2) ✅. Sidebar/TopBar reskin with logo (Task 3) ✅. Home↔docs routing without react-router (Task 4) ✅. Brand assets sourced and copied (Task 1) ✅. `loadStories.ts`/`StoryRenderer.tsx` untouched ✅ (never listed as Modify in any task). No npm publish / GitHub Pages changes ✅ (not touched in any task).
- **Type consistency:** `HomeProps.onGetStarted: () => void` (Task 2) matches `<Home onGetStarted={() => setView('docs')} />` call in Task 4. `DocsLayoutProps.onBackToHome: () => void` (Task 3) matches `<DocsLayout onBackToHome={() => setView('home')} />` call in Task 4.
- **Placeholder scan:** no TBD/TODO; every step has full code or an exact shell command with expected output.
