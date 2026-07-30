# Menu Component + Tech Debt Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** build the new `Menu` responsive navigation component (per `docs/superpowers/specs/2026-07-29-menu-component-design.md`) and fix 5 known tech-debt items from the previous session's reviews (ProgressCircle aria-label, IconButton required label, FilterChip button-in-button, FileUploader progress-bar reuse, thin secondary-prop test coverage).

**Architecture:** `Menu` is one new component (`src/components/Menu/`), aditivo, no changes to `Sidebar`/`NavItem`/`TopBar`. The 5 debt fixes each touch one existing component file plus its test file. All 6 tasks are independent of each other (no task depends on another task's output).

**Tech Stack:** React + TypeScript strict, Tailwind v4 (including native `@container` support, confirmed `tailwindcss@4.3.2`), `cn()` (`src/utils/cn.ts`), vitest + `@testing-library/react` + `vitest-axe`.

## Global Constraints

- No hardcoded hex/px colors — only existing Tailwind tokens in `src/styles/globals.css`. Valid ink scale: 900, 800, 700, 600, 500, 300, 200, 100, 50 (no 400 — this bug was hit twice in the prior session, do not repeat it).
- Icons always via `<Icon name="..." />` from `src/components/Icon`.
- Tests: vitest + vitest-axe pattern (`axe(container)` + `// @ts-expect-error -- axe() is not typed in the default vitest-axe module` + `toHaveNoViolations()`), matching `src/components/Badge/Badge.test.tsx`.
- Stories: `import type { Meta, StoryObj } from '../../docs-types'`, matching `src/components/Badge/Badge.stories.tsx`.
- Every task ends with `pnpm lint && pnpm typecheck && pnpm build` all green plus its own test file passing.
- Do not touch `eslint.config.js`. `pnpm lint` runs `eslint src` only.
- Dark-mode `dark:` variants required on all ink-scale classes, following the ink-900↔ink-100 / ink-600↔ink-400(INVALID, use ink-300)/ink-500↔ink-300 / ink-200↔ink-700 / ink-100↔ink-700 pairing already used across the library (see `src/components/Badge/Badge.tsx`, `src/components/FilterBar/FilterBar.tsx`).
- Barrel export added to `src/index.ts` for any new public export.

---

### Task 1: Menu component

**Files:**
- Create: `src/components/Menu/Menu.tsx`
- Create: `src/components/Menu/Menu.stories.tsx`
- Create: `src/components/Menu/Menu.test.tsx`
- Create: `src/components/Menu/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../Icon` (`name`, `size`, `fill`, `className` props — see `src/components/Icon/Icon.tsx`); `Avatar` from `../Avatar` (`name`, `src`, `size` props — see `src/components/Avatar/Avatar.tsx`).
- Produces: `Menu(props: MenuProps)`, `MenuProps`, `MenuItem`, `MenuUser`, `MenuPresent`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Menu/Menu.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Menu } from './Menu'

const ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', section: 'Principal' },
  { id: 'agenda', label: 'Consultas', icon: 'calendar_today', badge: 3, section: 'Principal' },
  { id: 'chat', label: 'Mensagens', icon: 'chat_bubble', section: 'Outros' },
]

describe('Menu — sidebar', () => {
  it('renders a nav with aria-label', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByRole('navigation', { name: 'Navegação' })).toBeInTheDocument()
  })

  it('renders section labels and item labels', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('Principal')).toBeInTheDocument()
    expect(screen.getByText('Outros')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Mensagens')).toBeInTheDocument()
  })

  it('marks the active item with aria-current', () => {
    render(<Menu present="sidebar" items={ITEMS} value="agenda" />)
    expect(screen.getByText('Consultas').closest('button')).toHaveAttribute('aria-current', 'page')
  })

  it('calls onChange when an item is clicked', async () => {
    const handleChange = vi.fn()
    render(<Menu present="sidebar" items={ITEMS} value="home" onChange={handleChange} />)
    await userEvent.click(screen.getByText('Consultas'))
    expect(handleChange).toHaveBeenCalledWith('agenda')
  })

  it('renders the badge', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders the brand wordmark by default', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" />)
    expect(screen.getByText('starbem')).toBeInTheDocument()
  })

  it('omits the brand when brand={false}', () => {
    render(<Menu present="sidebar" items={ITEMS} value="home" brand={false} />)
    expect(screen.queryByText('starbem')).not.toBeInTheDocument()
  })

  it('renders footerItems and the user row', () => {
    render(
      <Menu
        present="sidebar"
        items={ITEMS}
        value="home"
        footerItems={[{ id: 'logout', label: 'Sair', icon: 'logout' }]}
        user={{ name: 'Ana Carolina', sub: 'Premium' }}
      />,
    )
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.getByText('Ana Carolina')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Menu present="sidebar" items={ITEMS} value="home" user={{ name: 'Ana' }} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — rail', () => {
  it('omits labels and sections, keeps icons', () => {
    render(<Menu present="rail" items={ITEMS} value="home" />)
    expect(screen.queryByText('Início')).not.toBeInTheDocument()
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('omits the brand', () => {
    render(<Menu present="rail" items={ITEMS} value="home" />)
    expect(screen.queryByText('starbem')).not.toBeInTheDocument()
  })
})

describe('Menu — bottom', () => {
  it('renders one button per item with no sections', () => {
    render(<Menu present="bottom" items={ITEMS} value="home" />)
    expect(screen.getAllByRole('button')).toHaveLength(ITEMS.length)
    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Menu present="bottom" items={ITEMS} value="home" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — drawer', () => {
  it('renders a closed nav by default (aria-hidden)', () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-hidden') === 'true')
    expect(drawerNav).toBeDefined()
  })

  it('shows the active item label (or title) in the top bar', () => {
    render(<Menu present="drawer" items={ITEMS} value="agenda" />)
    expect(screen.getByText('Consultas')).toBeInTheDocument()
  })

  it('falls back to the title prop when nothing is active', () => {
    render(<Menu present="drawer" items={ITEMS} title="Meu App" />)
    expect(screen.getByText('Meu App')).toBeInTheDocument()
  })

  it('opens the panel when the hamburger is clicked', async () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'false')
  })

  it('closes the panel when an item is selected', async () => {
    const handleChange = vi.fn()
    render(<Menu present="drawer" items={ITEMS} value="home" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await userEvent.click(screen.getByText('Consultas'))
    expect(handleChange).toHaveBeenCalledWith('agenda')
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'true')
  })

  it('closes the panel when the close button is clicked', async () => {
    render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar menu' }))
    const navs = screen.getAllByRole('navigation', { hidden: true })
    const drawerNav = navs.find((n) => n.getAttribute('aria-label') === 'Navegação')
    expect(drawerNav).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no a11y violations when open', async () => {
    const { container } = render(<Menu present="drawer" items={ITEMS} value="home" />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Menu — auto', () => {
  it('renders both a container-query wrapper and both internal navs', () => {
    const { container } = render(<Menu items={ITEMS} value="home" />)
    expect(container.querySelector('.\\@container')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation', { hidden: true })).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Menu.test.tsx`
Expected: FAIL — `./Menu` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/Menu/Menu.tsx
import { useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import { Avatar } from '../Avatar'

export interface MenuItem {
  id: string
  label: string
  icon: string
  badge?: number | string
  section?: string
}

export interface MenuUser {
  name: string
  sub?: string
  avatarSrc?: string
}

export type MenuPresent = 'auto' | 'sidebar' | 'rail' | 'bottom' | 'drawer'

export interface MenuProps {
  items: MenuItem[]
  value?: string
  onChange?: (id: string) => void
  present?: MenuPresent
  brand?: boolean | ReactNode
  user?: MenuUser
  footerItems?: MenuItem[]
  title?: string
  className?: string
}

function groupBySection(items: MenuItem[]) {
  const groups: { section: string; items: MenuItem[] }[] = []
  for (const it of items) {
    const sec = it.section ?? ''
    let g = groups.find((x) => x.section === sec)
    if (!g) {
      g = { section: sec, items: [] }
      groups.push(g)
    }
    g.items.push(it)
  }
  return groups
}

function BrandLockup({ brand }: { brand: boolean | ReactNode }) {
  if (!brand) return null
  if (brand === true) {
    return <div className="px-3 py-2 text-[16px] font-semibold text-primary-base">starbem</div>
  }
  return <div className="px-3 py-2">{brand}</div>
}

type ItemLayout = 'full' | 'rail' | 'bottom'

function ItemButton({
  item,
  active,
  layout,
  onSelect,
}: {
  item: MenuItem
  active: boolean
  layout: ItemLayout
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(item.id)}
      className={cn(
        'flex items-center rounded-lg transition-colors',
        layout === 'bottom' ? 'flex-1 flex-col gap-0.5 py-2 text-center' : 'w-full gap-3 px-3 py-2.5',
        layout === 'rail' && 'justify-center px-0',
        active
          ? 'bg-primary-base text-neutral-25'
          : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700',
      )}
    >
      <span className="relative inline-flex">
        <Icon name={item.icon} fill={active} size={layout === 'bottom' ? 22 : 20} />
        {item.badge != null && layout !== 'full' && (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-error-base px-[3px] text-[10px] leading-[16px] text-white">
            {item.badge}
          </span>
        )}
      </span>
      {layout !== 'rail' && (
        <span
          className={cn('truncate', layout === 'bottom' ? 'text-[11px] leading-[14px]' : 'text-[14px] leading-[20px]')}
        >
          {item.label}
        </span>
      )}
      {item.badge != null && layout === 'full' && (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-error-base px-[6px] text-[11px] leading-[16px] text-white">
          {item.badge}
        </span>
      )}
    </button>
  )
}

function SidebarBody({
  groups,
  layout,
  value,
  onSelect,
  brand,
  user,
  footerItems,
}: {
  groups: { section: string; items: MenuItem[] }[]
  layout: 'full' | 'rail'
  value: string | undefined
  onSelect: (id: string) => void
  brand: boolean | ReactNode
  user: MenuUser | undefined
  footerItems: MenuItem[]
}) {
  return (
    <>
      {layout === 'full' && <BrandLockup brand={brand} />}
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
        {groups.map((g, gi) => (
          <li key={gi}>
            {layout === 'full' && g.section && (
              <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-400 first:pt-0">
                {g.section}
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {g.items.map((it) => (
                <li key={it.id}>
                  <ItemButton item={it} active={value === it.id} layout={layout} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {(footerItems.length > 0 || user) && (
        <div className="flex flex-col gap-1 border-t border-ink-200 px-2 pt-2 dark:border-ink-700">
          {footerItems.length > 0 && (
            <ul className="flex flex-col gap-1">
              {footerItems.map((it) => (
                <li key={it.id}>
                  <ItemButton item={it} active={value === it.id} layout={layout} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          )}
          {user && (
            <div className={cn('flex items-center gap-2 px-3 py-2', layout === 'rail' && 'justify-center px-0')}>
              <Avatar name={user.name} src={user.avatarSrc} size="sm" />
              {layout === 'full' && (
                <div className="min-w-0">
                  <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900 dark:text-ink-100">
                    {user.name}
                  </p>
                  {user.sub && (
                    <p className="truncate text-[12px] leading-[16px] text-ink-500 dark:text-ink-300">{user.sub}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export function Menu({
  items = [],
  value,
  onChange,
  present = 'auto',
  brand = true,
  user,
  footerItems = [],
  title = 'Menu',
  className,
}: MenuProps) {
  const [open, setOpen] = useState(false)
  const groups = groupBySection(items)

  const select = (id: string) => {
    onChange?.(id)
    if (present === 'drawer') setOpen(false)
  }

  if (present === 'drawer') {
    const active = items.find((it) => it.id === value)
    return (
      <div className={cn('flex h-full flex-col', className)}>
        <header className="flex h-16 items-center gap-3 border-b border-ink-200 px-4 dark:border-ink-700">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
          >
            <Icon name="menu" />
          </button>
          <span className="truncate text-[16px] font-medium text-ink-900 dark:text-ink-100">
            {active ? active.label : title}
          </span>
        </header>

        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className={cn(
            'fixed inset-0 z-40 bg-black/40 transition-opacity',
            open ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        />

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
      </div>
    )
  }

  if (present === 'sidebar' || present === 'rail') {
    const layout = present === 'rail' ? 'rail' : 'full'
    return (
      <nav
        aria-label="Navegação"
        className={cn(
          'flex h-full flex-col border-r border-ink-200 bg-white py-2 dark:border-ink-700 dark:bg-ink-900',
          present === 'rail' ? 'w-[72px]' : 'w-[260px]',
          className,
        )}
      >
        <SidebarBody
          groups={groups}
          layout={layout}
          value={value}
          onSelect={select}
          brand={brand}
          user={user}
          footerItems={footerItems}
        />
      </nav>
    )
  }

  if (present === 'bottom') {
    return (
      <nav
        aria-label="Navegação"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900',
          className,
        )}
      >
        {items.map((it) => (
          <ItemButton key={it.id} item={it} active={value === it.id} layout="bottom" onSelect={select} />
        ))}
      </nav>
    )
  }

  // present === 'auto': both layouts render; @container + @[640px]: toggles which is visible.
  return (
    <div className={cn('@container flex h-full', className)}>
      <nav
        aria-label="Navegação"
        aria-hidden
        className="hidden h-full w-[260px] flex-col border-r border-ink-200 bg-white py-2 @[640px]:flex dark:border-ink-700 dark:bg-ink-900"
      >
        <SidebarBody
          groups={groups}
          layout="full"
          value={value}
          onSelect={select}
          brand={brand}
          user={user}
          footerItems={footerItems}
        />
      </nav>
      <nav
        aria-label="Navegação"
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-ink-200 bg-white @[640px]:hidden dark:border-ink-700 dark:bg-ink-900"
      >
        {items.map((it) => (
          <ItemButton key={it.id} item={it} active={value === it.id} layout="bottom" onSelect={select} />
        ))}
      </nav>
    </div>
  )
}
```

**Note on the `auto` test:** both internal `<nav>` elements carry `aria-hidden` unconditionally in the `auto` case (CSS `hidden`/`flex` decides which one is visually shown — `aria-hidden` prevents screen readers from announcing both redundant navigation landmarks at once, since only one is ever visually active per container width). This is why the test file above uses `getAllByRole('navigation', { hidden: true })` — the default `hidden: false` query would find zero, since both are `aria-hidden="true"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Menu.test.tsx`
Expected: PASS (21 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/Menu/Menu.stories.tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { Menu } from './Menu'

const ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', section: 'Principal' },
  { id: 'agenda', label: 'Consultas', icon: 'calendar_today', badge: 3, section: 'Principal' },
  { id: 'chat', label: 'Mensagens', icon: 'chat_bubble', section: 'Principal' },
  { id: 'perfil', label: 'Perfil', icon: 'person', section: 'Conta' },
]

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
}
export default meta
type Story = StoryObj<typeof Menu>

export const Sidebar: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu
          present="sidebar"
          items={ITEMS}
          value={tab}
          onChange={setTab}
          user={{ name: 'Ana Carolina', sub: 'Premium' }}
          footerItems={[{ id: 'sair', label: 'Sair', icon: 'logout' }]}
        />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}

export const Rail: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu present="rail" items={ITEMS} value={tab} onChange={setTab} />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}

export const Bottom: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ position: 'relative', height: 480 }}>
        <main style={{ padding: 24 }}>Conteúdo</main>
        <Menu present="bottom" items={ITEMS} value={tab} onChange={setTab} />
      </div>
    )
  },
}

export const Drawer: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ height: 480 }}>
        <Menu present="drawer" items={ITEMS} value={tab} onChange={setTab} title="Meu App" />
      </div>
    )
  },
}

export const Auto: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480, resize: 'horizontal', overflow: 'auto', border: '1px dashed #ccc' }}>
        <Menu items={ITEMS} value={tab} onChange={setTab} />
        <main style={{ flex: 1, padding: 24 }}>Redimensione a caixa (resize horizontal) para ver a troca sidebar↔bottom</main>
      </div>
    )
  },
}

export const CustomBrand: Story = {
  render: () => {
    const [tab, setTab] = useState('home')
    return (
      <div style={{ display: 'flex', height: 480 }}>
        <Menu
          present="sidebar"
          items={ITEMS}
          value={tab}
          onChange={setTab}
          brand={<strong style={{ padding: '8px 12px', display: 'block' }}>Minha Clínica</strong>}
        />
        <main style={{ flex: 1, padding: 24 }}>Conteúdo</main>
      </div>
    )
  },
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/Menu/index.ts
export { Menu } from './Menu'
export type { MenuProps, MenuItem, MenuUser, MenuPresent } from './Menu'
```

- [ ] **Step 7: Add to src/index.ts**

Insert after the `VideoCall` export block (end of the components section, before `// Design tokens`):

```ts
export { Menu } from './components/Menu'
export type { MenuProps, MenuItem, MenuUser, MenuPresent } from './components/Menu'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/Menu src/index.ts
git commit -m "feat(menu): add responsive Menu component (sidebar/rail/bottom/drawer/auto)"
```

---

### Task 2: ProgressCircle — wire a `label` prop to `aria-label`

**Files:**
- Modify: `src/components/Progress/Progress.tsx`
- Modify: `src/components/Progress/Progress.test.tsx`

**Interfaces:**
- Modifies: `ProgressCircleProps` gains `label?: string`. No other signature changes.

- [ ] **Step 1: Write the failing test**

Add to `src/components/Progress/Progress.test.tsx`, inside the `describe('ProgressCircle', ...)` block:

```tsx
  it('sets aria-label from the label prop', () => {
    render(<ProgressCircle value={72} label="Progresso do exame" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Progresso do exame')
  })

  it('has no aria-label when label is not provided', () => {
    render(<ProgressCircle value={72} />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-label')
  })
```

Also update the existing `'has no a11y violations'` test in the same `describe` block to stop passing a raw `aria-label` prop through `rest` (now redundant with the new `label` prop):

```tsx
  it('has no a11y violations', async () => {
    const { container } = render(<ProgressCircle value={30} tone="warning" label="Processing" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Progress.test.tsx`
Expected: FAIL — `aria-label` not set (new tests), TS may also flag the unknown `label` prop depending on strictness (component doesn't have that prop yet).

- [ ] **Step 3: Implement**

In `src/components/Progress/Progress.tsx`, update `ProgressCircleProps` and `ProgressCircle`:

```tsx
export interface ProgressCircleProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number
  max?: number
  size?: number
  thickness?: number
  tone?: ProgressTone
  showValue?: boolean
  indeterminate?: boolean
  label?: string
  children?: ReactNode
}

export function ProgressCircle({
  value = 0,
  max = 100,
  size = 56,
  thickness = 6,
  tone = 'primary',
  showValue = true,
  indeterminate = false,
  label,
  className,
  children,
  ...rest
}: ProgressCircleProps) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const offset = indeterminate ? circ * 0.7 : circ * (1 - pct / 100)
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', indeterminate && 'animate-spin', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-valuemax={max}
      aria-valuemin={0}
      {...(label && { 'aria-label': label })}
      {...rest}
    >
```

(The rest of the function body — the `<svg>` and center-value `<span>` — is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Progress.test.tsx`
Expected: PASS (14 tests)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Progress
git commit -m "fix(progress): wire ProgressCircle's label prop to aria-label"
```

---

### Task 3: IconButton — make `label` required

**Files:**
- Modify: `src/components/IconButton/IconButton.tsx`

**Interfaces:**
- Modifies: `IconButtonProps.label` changes from `label?: string` to `label: string`. No runtime behavior change — `label` was already always used for both `aria-label` and `title`. Safe because `IconButton` is unpublished (shipped only in the still-pending `seven-new-components` changeset) and every existing test/story call site already passes `label` (confirmed via `grep -rn "<IconButton" src/ | grep -v "label="` returning no matches other than unrelated const declarations).

- [ ] **Step 1: Implement**

In `src/components/IconButton/IconButton.tsx`, change:

```tsx
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  pill?: boolean
  fill?: boolean
  /** Accessible label (also used as the title/tooltip). Required — this is an icon-only control with no visible text. */
  label: string
}
```

(Only the `label` field's type changes, from optional to required, plus a doc comment. No other line in the file changes.)

- [ ] **Step 2: Run the existing test suite to confirm nothing broke**

Run: `pnpm test IconButton.test.tsx`
Expected: PASS (8/8, unchanged — every existing call site already passes `label`)

- [ ] **Step 3: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green. `pnpm typecheck` is the meaningful check here — it would fail if any call site in `src/` omitted `label`.

- [ ] **Step 4: Commit**

```bash
git add src/components/IconButton
git commit -m "fix(iconbutton): make label required (icon-only control needs an accessible name)"
```

---

### Task 4: FilterChip — remove button-in-button nesting

**Files:**
- Modify: `src/components/FilterBar/FilterBar.tsx`
- Modify: `src/components/FilterBar/FilterBar.test.tsx`

**Interfaces:**
- No prop signature changes to `FilterChipProps`/`FilterBarProps`. Only the rendered DOM structure changes when `removable` is `true`: instead of a `<span role="button">` nested inside the chip's own `<button>`, the remove control becomes a real sibling `<button>`, and the two buttons are wrapped in an outer non-interactive `<span>`. When `removable` is `false` (the common case, including every chip rendered by `FilterBar` itself), the root element stays a single `<button>` exactly as before — zero DOM change for that path.

- [ ] **Step 1: Write the failing test**

Replace the two existing removable tests in `src/components/FilterBar/FilterBar.test.tsx`'s `describe('FilterChip', ...)` block (the ones named `'calls onRemove without toggling selection when removable'` and `'calls onRemove when the remove control is activated via keyboard (Enter/Space)'`) with:

```tsx
  it('renders two sibling buttons when removable, not nested', () => {
    const { container } = render(<FilterChip label="Dermatologia" removable onRemove={() => {}} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.contains(buttons[1]!)).toBe(false)
    expect(buttons[1]!.contains(buttons[0]!)).toBe(false)
  })

  it('calls onRemove when the remove button is clicked, without toggling selection', async () => {
    const handleRemove = vi.fn()
    const handleClick = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('calls onRemove when the remove button is activated via keyboard (native button semantics)', async () => {
    const handleRemove = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} />)
    const removeButton = screen.getByRole('button', { name: 'Remover filtro' })
    removeButton.focus()
    await userEvent.keyboard('{Enter}')
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('disables the remove button when the chip is disabled', () => {
    render(<FilterChip label="Dermatologia" removable disabled onRemove={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remover filtro' })).toBeDisabled()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test FilterBar.test.tsx`
Expected: FAIL — current implementation renders 1 button (root) + 1 nested `role="button"` span, not 2 real `<button>` elements; `container.querySelectorAll('button')` returns length 1.

- [ ] **Step 3: Implement**

In `src/components/FilterBar/FilterBar.tsx`, replace the entire `FilterChip` function body with:

```tsx
export function FilterChip({
  label,
  icon,
  count,
  selected = false,
  variant = 'outline',
  tone = 'primary',
  size = 'md',
  dropdown = false,
  open = false,
  removable = false,
  onRemove,
  disabled = false,
  className,
  children,
  ...rest
}: FilterChipProps) {
  const content = (
    <>
      {selected && !icon && !dropdown && <Icon name="check" size={18} />}
      {icon && <Icon name={icon} size={18} />}
      <span>{label || children}</span>
      {count != null && (
        <span className="inline-flex items-center justify-center rounded-full bg-ink-100 px-[6px] text-[12px] leading-[16px] text-ink-700">
          {count}
        </span>
      )}
      {dropdown && (
        <Icon name="keyboard_arrow_down" size={18} className={cn('transition-transform', open && 'rotate-180')} />
      )}
    </>
  )

  const selectButtonClassName = cn(
    'inline-flex items-center rounded-full border font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    SIZE_CLASSES[size],
    selected
      ? cn(TONE_SELECTED[tone], variant === 'solid' && 'border-transparent')
      : 'bg-neutral-25 border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-ink-700 dark:text-ink-100',
    !removable && className,
  )

  if (!removable) {
    return (
      <button type="button" aria-pressed={selected} disabled={disabled} className={selectButtonClassName} {...rest}>
        {content}
      </button>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <button type="button" aria-pressed={selected} disabled={disabled} className={selectButtonClassName} {...rest}>
        {content}
      </button>
      <button
        type="button"
        aria-label="Remover filtro"
        disabled={disabled}
        onClick={() => onRemove?.()}
        className="inline-flex shrink-0 items-center justify-center rounded-full p-1 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon name="close" size={16} />
      </button>
    </span>
  )
}
```

(`FilterBar` itself is unchanged — it never passes `removable` to the `FilterChip`s it renders, so its own rendering and existing tests are unaffected.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test FilterBar.test.tsx`
Expected: PASS (13 tests — 12 existing minus the 2 replaced, plus the 4 new ones = net +2)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/FilterBar
git commit -m "fix(filterbar): render FilterChip's remove control as a sibling button, not nested"
```

---

### Task 5: FileUploader — reuse `Progress` for the inline upload bar

**Files:**
- Modify: `src/components/FileUploader/FileUploader.tsx`
- Modify: `src/components/FileUploader/FileUploader.test.tsx`

**Interfaces:**
- Consumes: `Progress` from `../Progress` (`value`, `size`, `label` props — see `src/components/Progress/Progress.tsx`).
- No `FileItemProps`/`FileUploaderProps` signature changes — `progress` stays `number | undefined` on `UploadFile`.

- [ ] **Step 1: Write the failing test**

Add to `src/components/FileUploader/FileUploader.test.tsx`'s `describe('FileItem', ...)` block:

```tsx
  it('renders an accessible progressbar when progress is set and not done/error', () => {
    render(<FileItem name="foto-pele.jpg" size={1200000} progress={60} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '60')
  })

  it('does not render a progressbar once done', () => {
    render(<FileItem name="foto-pele.jpg" size={1200000} progress={100} done />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test FileUploader.test.tsx`
Expected: FAIL — current manual `<div>` bar has no `role="progressbar"`.

- [ ] **Step 3: Implement**

In `src/components/FileUploader/FileUploader.tsx`:

1. Add the import at the top:

```tsx
import { Progress } from '../Progress'
```

2. Replace the manual progress bar block inside `FileItem`:

```tsx
        {progress != null && !done && !error && (
          <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
            <div className="h-full rounded-full bg-primary-base" style={{ width: `${progress}%` }} />
          </div>
        )}
```

with:

```tsx
        {progress != null && !done && !error && (
          <div className="mt-1">
            <Progress value={progress} size="sm" label={`Enviando ${name}`} />
          </div>
        )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test FileUploader.test.tsx`
Expected: PASS (13 tests)

- [ ] **Step 5: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/components/FileUploader
git commit -m "fix(fileuploader): reuse Progress component for the inline upload bar (adds ARIA progressbar semantics)"
```

---

### Task 6: Secondary-prop test coverage

**Files:**
- Modify: `src/components/Progress/Progress.test.tsx`
- Modify: `src/components/IconButton/IconButton.test.tsx`
- Modify: `src/components/FilterBar/FilterBar.test.tsx`
- Modify: `src/components/Chart/Chart.test.tsx`

**Interfaces:** none — test-only task, no production code changes.

- [ ] **Step 1: Add Progress size coverage**

Add to `src/components/Progress/Progress.test.tsx`'s `describe('Progress', ...)` block:

```tsx
  it('applies the sm and lg track height classes', () => {
    const { container: small } = render(<Progress value={50} size="sm" />)
    expect(small.querySelector('[role="progressbar"]')).toHaveClass('h-[4px]')
    const { container: large } = render(<Progress value={50} size="lg" />)
    expect(large.querySelector('[role="progressbar"]')).toHaveClass('h-[12px]')
  })
```

- [ ] **Step 2: Add IconButton size/fill/disabled coverage**

Add to `src/components/IconButton/IconButton.test.tsx`:

```tsx
  it('applies the sm size padding', () => {
    render(<IconButton icon="close" label="Fechar" size="sm" />)
    expect(screen.getByRole('button')).toHaveClass('p-[6px]')
  })

  it('applies the lg size padding', () => {
    render(<IconButton icon="close" label="Fechar" size="lg" />)
    expect(screen.getByRole('button')).toHaveClass('p-[10px]')
  })

  it('renders the filled icon glyph when fill is true', () => {
    render(<IconButton icon="close" label="Fechar" fill />)
    const icon = screen.getByRole('button').querySelector('.material-symbols-rounded')
    expect(icon?.getAttribute('style')).toContain("'FILL' 1")
  })

  it('disables the button and blocks clicks', async () => {
    const handleClick = vi.fn()
    render(<IconButton icon="close" label="Fechar" disabled onClick={handleClick} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
```

(`userEvent` and `vi` are already imported at the top of this file.)

- [ ] **Step 3: Add FilterBar disabled-option and segmented-deselect coverage**

Add to `src/components/FilterBar/FilterBar.test.tsx`'s `describe('FilterBar', ...)` block:

```tsx
  it('disables a chip when its option is marked disabled', () => {
    render(<FilterBar options={[{ id: 'a', label: 'A', disabled: true }, ...OPTIONS]} />)
    expect(screen.getByRole('button', { name: 'A' })).toBeDisabled()
  })

  it('deselects the active chip when re-clicked in segmented mode', async () => {
    const handleChange = vi.fn()
    render(<FilterBar variant="segmented" options={OPTIONS} defaultValue="online" onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith(null)
  })
```

- [ ] **Step 4: Add Chart dispatcher and DonutChart legend coverage**

Add to `src/components/Chart/Chart.test.tsx`'s `describe('Chart', ...)` block:

```tsx
  it('dispatches to Sparkline when type="sparkline"', () => {
    const { container } = render(<Chart type="sparkline" data={[1, 2, 3]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelectorAll('circle').length).toBe(0)
  })

  it('dispatches to DonutChart when type="donut"', () => {
    const { container } = render(<Chart type="donut" segments={[{ label: 'A', value: 1 }]} />)
    expect(container.querySelectorAll('circle').length).toBe(2)
  })
```

Add to `src/components/Chart/Chart.test.tsx`'s `describe('DonutChart', ...)` block:

```tsx
  it('hides the legend when legend is false', () => {
    render(<DonutChart segments={[{ label: 'Concluídas', value: 78 }]} legend={false} />)
    expect(screen.queryByText('Concluídas')).not.toBeInTheDocument()
  })
```

- [ ] **Step 5: Run all four affected test files**

Run: `pnpm test Progress.test.tsx IconButton.test.tsx FilterBar.test.tsx Chart.test.tsx`
Expected: PASS, all green, no regressions.

- [ ] **Step 6: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add src/components/Progress src/components/IconButton src/components/FilterBar src/components/Chart
git commit -m "test: add secondary-prop coverage for Progress, IconButton, FilterBar, Chart"
```

---

### Task 7: Changeset

**Files:**
- Create: `.changeset/menu-and-debt-fixes.md`

- [ ] **Step 1: Write the changeset**

```md
---
"@starbemtech/react-starsystem": minor
---

Add responsive `Menu` navigation component (sidebar/rail/bottom/drawer/auto, container-query driven). Also fixes: ProgressCircle now accepts a `label` prop wired to `aria-label`; IconButton's `label` prop is now required (was optional but functionally mandatory); FilterChip's remove control is now a real sibling button instead of nested inside the chip's own button; FileUploader's inline upload progress bar now reuses the `Progress` component (adds proper ARIA progressbar semantics).
```

- [ ] **Step 2: Verify the full suite one more time**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add .changeset/menu-and-debt-fixes.md
git commit -m "chore: add changeset for Menu component and debt fixes"
```
