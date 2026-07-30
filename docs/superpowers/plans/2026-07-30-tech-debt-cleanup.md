# Tech Debt Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** clear the accumulated tech-debt backlog in `react-starsystem`: 3 real bugs (Progress dark-mode gap, Menu drawer animation, AvatarGroup ring override), 1 hardcoded-color/dark-mode gap (Checkbox hover), 3 test-coverage gaps (FilterChip disabled, Tabs mixed content, Spinner thickness+size), and the `example/` app's workspace-link misconfiguration.

**Architecture:** each item is independent, touching its own file(s). No task depends on another.

**Tech Stack:** React + TypeScript strict, Tailwind v4, vitest + `@testing-library/react` + `vitest-axe`, pnpm workspaces.

## Global Constraints

- No hardcoded hex/px colors — only existing Tailwind tokens in `src/styles/globals.css`. Valid ink scale: 900, 800, 700, 600, 500, 300, 200, 100, 50 (no 400).
- Every task ends with `pnpm lint && pnpm typecheck && pnpm build` all green plus its own test file(s) passing.
- Do not touch `eslint.config.js`. `pnpm lint` runs `eslint src` only.
- Dark-mode `dark:` variants required on all ink-scale classes touched by these fixes.

---

### Task 1: Progress — add dark-mode track color

**Files:**
- Modify: `src/components/Progress/Progress.tsx`
- Modify: `src/components/Progress/Progress.test.tsx`

**Interfaces:** none — pure className fix, no prop/signature change.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Progress/Progress.test.tsx`'s `describe('Progress', ...)` block:

```tsx
  it('applies a dark-mode track background class', () => {
    const { container } = render(<Progress value={50} />)
    const track = container.querySelector('[role="progressbar"]')
    expect(track).toHaveClass('dark:bg-ink-700')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Progress.test.tsx`
Expected: FAIL — current track className is `'w-full overflow-hidden rounded-full bg-ink-100'`, no `dark:` variant.

- [ ] **Step 3: Implement**

In `src/components/Progress/Progress.tsx`, change the track's `className`:

```tsx
        className={cn('w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700', SIZE_TRACK[size])}
```

(This is the only line that changes — the `bg-ink-100` string gains ` dark:bg-ink-700`, matching the ink-100↔ink-700 pairing convention used across the rest of the library, e.g. `src/components/Badge/Badge.tsx`'s neutral variant.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Progress.test.tsx`
Expected: PASS (16 tests)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Progress
git commit -m "fix(progress): add dark-mode track background color"
```

---

### Task 2: Menu drawer — keep panel content mounted while closed

**Files:**
- Modify: `src/components/Menu/Menu.tsx`
- Modify: `src/components/Menu/Menu.test.tsx`

**Interfaces:** none — pure rendering fix, no prop/signature change.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Menu/Menu.test.tsx`'s `describe('Menu — drawer', ...)` block:

```tsx
  it('keeps the panel content in the DOM while closed (so the close animation has something to slide)', () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Menu.test.tsx`
Expected: FAIL — the close button only renders when `open` is `true` (currently wrapped in `{open && (...)}`), so it's absent by default.

- [ ] **Step 3: Implement**

In `src/components/Menu/Menu.tsx`, find the drawer's `<nav>` block:

```tsx
        <nav
          aria-label="Navegação"
          aria-hidden={!open}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white transition-transform duration-200 dark:bg-ink-900',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {open && (
            <>
              <div className="flex items-center justify-between px-2 py-2">
                <BrandLockup brand={brand} />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
                >
                  <Icon name="close" />
                </button>
              </div>
              <SidebarBody
                groups={groups}
                layout="full"
                value={value}
                onSelect={select}
                brand={false}
                user={user}
                footerItems={footerItems}
              />
            </>
          )}
        </nav>
```

Remove the `{open && (` / `)}` wrapper entirely — the content (the header row with the close button, and `<SidebarBody>`) renders unconditionally, exactly as it was written inside the fragment, just without the conditional gate:

```tsx
        <nav
          aria-label="Navegação"
          aria-hidden={!open}
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white transition-transform duration-200 dark:bg-ink-900',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-2 py-2">
            <BrandLockup brand={brand} />
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
            >
              <Icon name="close" />
            </button>
          </div>
          <SidebarBody
            groups={groups}
            layout="full"
            value={value}
            onSelect={select}
            brand={false}
            user={user}
            footerItems={footerItems}
          />
        </nav>
```

This means the panel's content (including its close button and every nav item) now always exists in the DOM, and only the `aria-hidden` attribute plus the `translate-x-0`/`-translate-x-full` CSS transform control visibility — so the close (slide-out) transition now has real content to animate instead of an empty panel. This does NOT reintroduce the earlier `auto`-mode accessibility bug from a prior session (that was about TWO simultaneously-rendered `<nav>` landmarks both permanently `aria-hidden`; here there is exactly one `<nav>`, and its `aria-hidden` correctly tracks `open` — a closed-but-mounted drawer panel with `aria-hidden="true"` is the standard, correct pattern for animatable off-canvas panels).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Menu.test.tsx`
Expected: PASS (24 tests) — also re-verify the existing `'renders a closed nav by default (aria-hidden)'` test still passes (it only checks `aria-hidden`, not content absence, so it's unaffected).

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Menu
git commit -m "fix(menu): keep drawer panel content mounted while closed for a real slide-out animation"
```

---

### Task 3: AvatarGroup — respect a child Avatar's explicit `ring` prop

**Files:**
- Modify: `src/components/Avatar/Avatar.tsx`
- Modify: `src/components/Avatar/Avatar.test.tsx`

**Interfaces:** none — `AvatarGroup`'s own props are unchanged; this only changes how it treats its `<Avatar>` children's existing `ring` prop.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Avatar/Avatar.test.tsx`'s `describe('AvatarGroup', ...)` block (create the block if a describe for `AvatarGroup` doesn't already exist — check the file first):

```tsx
  it('forces ring=true on children by default', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Ana" />
      </AvatarGroup>,
    )
    expect(container.querySelector('.ring-2')).toBeInTheDocument()
  })

  it('respects an explicit ring={false} on a child Avatar', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Ana" ring={false} />
      </AvatarGroup>,
    )
    expect(container.querySelector('.ring-2')).not.toBeInTheDocument()
  })
```

(Import `AvatarGroup` alongside `Avatar` at the top of the test file if it isn't already imported.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Avatar.test.tsx`
Expected: the second new test FAILS — `cloneElement(child, { key, size, ring: true })` unconditionally overwrites the child's own `ring={false}` with `true`.

- [ ] **Step 3: Implement**

In `src/components/Avatar/Avatar.tsx`, inside `AvatarGroup`, change:

```tsx
      {visible.map((child, index) =>
        isValidElement<AvatarProps>(child) && child.type === Avatar
          ? cloneElement(child, { key: index, size, ring: true })
          : child,
      )}
```

to:

```tsx
      {visible.map((child, index) =>
        isValidElement<AvatarProps>(child) && child.type === Avatar
          ? cloneElement(child, { key: index, size, ring: child.props.ring ?? true })
          : child,
      )}
```

(`child.props.ring ?? true` means: if the consumer explicitly passed `ring` on the child `<Avatar>` — including `false` — that value wins; if they didn't pass it at all (`undefined`), it defaults to `true`, preserving today's behavior for the common case.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Avatar.test.tsx`
Expected: PASS (all tests, including the 2 new ones)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Avatar
git commit -m "fix(avatar): let AvatarGroup children override ring via an explicit ring prop"
```

---

### Task 4: Checkbox — tone-aware, dark-mode-aware hover shadow

**Files:**
- Modify: `src/components/Checkbox/Checkbox.tsx`
- Modify: `src/components/Checkbox/Checkbox.test.tsx`

**Interfaces:** none — no prop/signature change, only the hover shadow's color source changes.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Checkbox/Checkbox.test.tsx` (create a new `describe('Checkbox hover shadow', ...)` block, or add to the existing top-level `describe('Checkbox', ...)` block — check the file's structure first and match its convention):

```tsx
  it('uses a tone-matched hover shadow for the success tone', () => {
    const { container } = render(<Checkbox checked tone="success" />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(31,186,93/)
  })

  it('uses a tone-matched hover shadow for the accent tone', () => {
    const { container } = render(<Checkbox checked tone="accent" />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(237,46,152/)
  })

  it('uses the primary-orange hover shadow by default', () => {
    const { container } = render(<Checkbox checked />)
    const box = container.querySelector('[role="checkbox"]')
    expect(box?.className).toMatch(/hover:shadow-\[0px_0px_12px_0px_rgba\(255,81,0/)
  })
```

(These RGB triples come from this project's own token values, confirmed in `src/styles/globals.css`: `--color-success-base: #1FBA5D` → `rgb(31,186,93)`; `--color-terciary-base: #ED2E98` → `rgb(237,46,152)`; `--color-primary-base: #FF5100` → `rgb(255,81,0)`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Checkbox.test.tsx`
Expected: FAIL — the current hover shadow is a single hardcoded `rgba(255,169,71,0.4)` (an amber tone unrelated to any of `primary`/`success`/`accent`) applied identically regardless of `tone`.

- [ ] **Step 3: Implement**

In `src/components/Checkbox/Checkbox.tsx`, add a new tone-to-shadow map near the existing `TONE_BORDER`/`TONE_ICON_COLOR` maps:

```tsx
const TONE_HOVER_SHADOW: Record<CheckboxTone, string> = {
  primary: 'hover:shadow-[0px_0px_12px_0px_rgba(255,81,0,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(255,81,0,0.5)]',
  success: 'hover:shadow-[0px_0px_12px_0px_rgba(31,186,93,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(31,186,93,0.5)]',
  accent: 'hover:shadow-[0px_0px_12px_0px_rgba(237,46,152,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(237,46,152,0.5)]',
}

const ERROR_HOVER_SHADOW =
  'hover:shadow-[0px_0px_12px_0px_rgba(255,66,66,0.35)] dark:hover:shadow-[0px_0px_12px_0px_rgba(255,66,66,0.5)]'
```

(`rgba(255,66,66,...)` matches `--color-error-base: #FF4242`.)

Then replace the box's className logic (currently three branches each hardcoding the same amber `rgba(255,169,71,0.4)`):

```tsx
          disabled
            ? 'bg-neutral-100 border-neutral-200 cursor-not-allowed dark:bg-ink-700 dark:border-neutral-800'
            : isActive
              ? cn('bg-neutral-25 hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900', activeBorder)
              : error
                ? 'bg-neutral-25 border-error-base hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900'
                : 'bg-neutral-25 border-neutral-300 hover:border-primary-base hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer dark:bg-neutral-900 dark:border-ink-700',
```

with:

```tsx
          disabled
            ? 'bg-neutral-100 border-neutral-200 cursor-not-allowed dark:bg-ink-700 dark:border-neutral-800'
            : isActive
              ? cn('bg-neutral-25 cursor-pointer dark:bg-neutral-900', activeBorder, error ? ERROR_HOVER_SHADOW : TONE_HOVER_SHADOW[tone])
              : error
                ? cn('bg-neutral-25 border-error-base cursor-pointer dark:bg-neutral-900', ERROR_HOVER_SHADOW)
                : cn(
                    'bg-neutral-25 border-neutral-300 hover:border-primary-base cursor-pointer dark:bg-neutral-900 dark:border-ink-700',
                    TONE_HOVER_SHADOW.primary,
                  ),
```

(The unchecked/non-error state always hovers with the `primary` shadow, matching its existing `hover:border-primary-base` — unchecked checkboxes don't yet have a `tone` to reflect since `tone` only visually matters once `isActive`. The `isActive` branch now picks `error` over `tone` when both apply, matching the existing precedent where `activeBorder` already does `error ? ERROR_BORDER : TONE_BORDER[tone]`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Checkbox.test.tsx`
Expected: PASS (all tests, including the 3 new ones)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Checkbox
git commit -m "fix(checkbox): make hover shadow tone-aware and dark-mode-aware (was a hardcoded amber rgba unrelated to tone)"
```

---

### Task 5: FilterChip — cover `disabled` on the select button in the removable path

**Files:**
- Modify: `src/components/FilterBar/FilterBar.test.tsx`

**Interfaces:** none — test-only.

- [ ] **Step 1: Add the test**

Add to `src/components/FilterBar/FilterBar.test.tsx`'s `describe('FilterChip', ...)` block, right next to the existing `'disables the remove button when the chip is disabled'` test:

```tsx
  it('disables both the select button and the remove button when disabled + removable', () => {
    render(<FilterChip label="Dermatologia" removable disabled onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: 'Dermatologia' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remover filtro' })).toBeDisabled()
  })
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm test FilterBar.test.tsx`
Expected: PASS immediately — this is a coverage addition for already-correct behavior (both buttons already receive `disabled={disabled}`), not a bug fix. If it somehow fails, that's a real regression to investigate, not expected.

- [ ] **Step 3: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add src/components/FilterBar
git commit -m "test: cover disabled propagation to both FilterChip buttons in the removable path"
```

---

### Task 6: Tabs — mixed-content coverage test

**Files:**
- Modify: `src/components/Tabs/Tabs.test.tsx`

**Interfaces:** none — test-only.

- [ ] **Step 1: Add the test**

Add to `src/components/Tabs/Tabs.test.tsx` (find its top-level `describe` block and add inside it):

```tsx
  it('renders a heterogeneous mix of plain, icon+label, and icon+label+count tabs together', () => {
    render(
      <Tabs
        items={[
          { value: 'plain', label: 'Plain' },
          { value: 'iconlabel', label: 'Icon+Label', icon: <span data-testid="icon-1" /> },
          { value: 'full', label: 'Full', icon: <span data-testid="icon-2" />, count: 5 },
        ]}
      />,
    )
    expect(screen.getByText('Plain')).toBeInTheDocument()
    expect(screen.getByText('Icon+Label')).toBeInTheDocument()
    expect(screen.getByTestId('icon-1')).toBeInTheDocument()
    expect(screen.getByText('Full')).toBeInTheDocument()
    expect(screen.getByTestId('icon-2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
```

(Check the file's existing imports — `render`/`screen` from `@testing-library/react` and `Tabs` should already be imported; reuse them.)

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm test Tabs.test.tsx`
Expected: PASS immediately — coverage addition for already-correct rendering (each `TabItem` in the array independently renders its own `icon`/`label`/`count`), not a bug fix.

- [ ] **Step 3: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add src/components/Tabs
git commit -m "test: cover Tabs rendering a heterogeneous mix of plain/icon/count tab items together"
```

---

### Task 7: Spinner — combined size+thickness coverage test

**Files:**
- Modify: `src/components/Spinner/Spinner.test.tsx`

**Interfaces:** none — test-only.

- [ ] **Step 1: Add the tests**

Add to `src/components/Spinner/Spinner.test.tsx` (find its top-level `describe` block and add inside it):

```tsx
  it('lets an explicit thickness override a preset size', () => {
    const { container } = render(<Spinner size="lg" thickness={6} />)
    const spinner = container.querySelector('[role="status"]') as HTMLElement
    expect(spinner).toHaveClass('size-[32px]')
    expect(spinner.style.borderWidth).toBe('6px')
  })

  it('applies both a numeric size and a custom thickness together', () => {
    const { container } = render(<Spinner size={40} thickness={6} />)
    const spinner = container.querySelector('[role="status"]') as HTMLElement
    expect(spinner.style.width).toBe('40px')
    expect(spinner.style.height).toBe('40px')
    expect(spinner.style.borderWidth).toBe('6px')
  })
```

(Check the file's existing imports — `render` from `@testing-library/react` and `Spinner` should already be imported; reuse them.)

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm test Spinner.test.tsx`
Expected: PASS immediately — coverage addition proving the existing inline-style-overrides-class behavior (CSS specificity: inline `style.borderWidth` wins over the class-based `border-2`/`border-[3px]`), not a bug fix.

- [ ] **Step 3: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add src/components/Spinner
git commit -m "test: cover Spinner's combined size+thickness prop interaction"
```

---

### Task 8: `example/` — version the pnpm workspace config and use a real workspace link

**Files:**
- Modify: `.gitignore` (root)
- Create: `pnpm-workspace.yaml` (root) — already exists on disk untracked; this task adds it to git
- Modify: `example/package.json`

**Interfaces:** none — build/tooling config only, no source code change.

- [ ] **Step 1: Remove `pnpm-workspace.yaml` from `.gitignore`**

In the root `.gitignore`, remove the line:

```
pnpm-workspace.yaml
```

(Every other line in `.gitignore` — `node_modules/`, `dist/`, `*.local`, `.DS_Store`, `coverage/`, `.worktrees/` — stays unchanged.)

- [ ] **Step 2: Add example's build artifacts to `.gitignore`**

Add these lines to the root `.gitignore` (in the same file, anywhere sensible — e.g. after `coverage/`):

```
example/*.tsbuildinfo
example/vite.config.js
example/vite.config.d.ts
```

(These are build-output artifacts of `example/`'s own `tsc -b && vite build` script — `example/vite.config.ts` is the real source file, TypeScript's project-reference build emits the compiled `.js`/`.d.ts` copies alongside it plus `.tsbuildinfo` incremental-build caches. None of these should be committed.)

- [ ] **Step 3: Stage the existing untracked `pnpm-workspace.yaml` as-is**

Do not edit `pnpm-workspace.yaml`'s content — it already exists on disk (currently untracked because of the `.gitignore` line removed in Step 1) with this content, which should be committed verbatim:

```yaml
packages:
  - '.'
  - 'example'
allowBuilds:
  esbuild: true
minimumReleaseAgeExclude:
  - '@starbemtech/react-starsystem@0.2.0 || 0.3.0'
overrides:
  postcss: '^8.5.18'
  'brace-expansion@>=2.0.0 <2.1.2': '^2.1.2'
```

- [ ] **Step 4: Switch `example/package.json` to a workspace link**

In `example/package.json`, change:

```json
    "@starbemtech/react-starsystem": "^0.3.0",
```

to:

```json
    "@starbemtech/react-starsystem": "workspace:*",
```

- [ ] **Step 5: Reinstall and rebuild to pick up the workspace link**

Run: `pnpm install`
Expected: pnpm re-resolves `example`'s dependency to a symlink into the repo's own `dist/` (built package), not the npm registry copy. Then run: `pnpm build` (root, to ensure `dist/` exists for `example` to link against), then `cd example && pnpm build && cd ..` to confirm `example` itself still type-checks and builds against the local workspace copy.
Expected: both builds succeed with no errors.

- [ ] **Step 6: Verify lint, typecheck, build, test (root)**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: all green — this task doesn't touch `src/`, so the existing 537 tests should be entirely unaffected.

- [ ] **Step 7: Commit**

```bash
git add .gitignore pnpm-workspace.yaml example/package.json
git commit -m "fix(example): version pnpm-workspace.yaml and link example/ to the local package via workspace:*"
```

---

### Task 9: Changeset

**Files:**
- Create: `.changeset/tech-debt-cleanup.md`

- [ ] **Step 1: Write the changeset**

```md
---
"@starbemtech/react-starsystem": patch
---

Tech debt cleanup: Progress track now has a dark-mode background color; Menu's drawer panel content stays mounted while closed so the close animation actually slides; AvatarGroup now respects an explicit `ring` prop on child Avatars instead of always forcing it to `true`; Checkbox's hover shadow is now tone-aware and dark-mode-aware (previously a single hardcoded amber color regardless of tone). Also added test coverage for FilterChip's disabled propagation, Tabs' mixed-content rendering, and Spinner's combined size+thickness behavior. No public API changes.
```

- [ ] **Step 2: Verify the full suite one more time**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: all green, 537 + new test count (Progress +1, Menu +1, Avatar +2, Checkbox +3, FilterBar +1, Tabs +1, Spinner +2 = +11, so 548 total).

- [ ] **Step 3: Commit**

```bash
git add .changeset/tech-debt-cleanup.md
git commit -m "chore: add changeset for tech debt cleanup"
```
