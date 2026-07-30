import { useEffect, useRef, useState, type ReactNode } from 'react'
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
    const last = groups[groups.length - 1]
    const g = last && last.section === sec ? last : { section: sec, items: [] }
    if (g !== last) groups.push(g)
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
        layout === 'bottom'
          ? 'flex-1 flex-col gap-0.5 py-2 text-center'
          : 'w-full gap-3 px-3 py-2.5',
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
          className={cn(
            'truncate',
            layout === 'bottom' ? 'text-[11px] leading-[14px]' : 'text-[14px] leading-[20px]',
          )}
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
              <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-500 first:pt-0">
                {g.section}
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {g.items.map((it) => (
                <li key={it.id}>
                  <ItemButton
                    item={it}
                    active={value === it.id}
                    layout={layout}
                    onSelect={onSelect}
                  />
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
                  <ItemButton
                    item={it}
                    active={value === it.id}
                    layout={layout}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          )}
          {user && (
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-2',
                layout === 'rail' && 'justify-center px-0',
              )}
            >
              <Avatar name={user.name} src={user.avatarSrc} size="sm" />
              {layout === 'full' && (
                <div className="min-w-0">
                  <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900 dark:text-ink-100">
                    {user.name}
                  </p>
                  {user.sub && (
                    <p className="truncate text-[12px] leading-[16px] text-ink-500 dark:text-ink-300">
                      {user.sub}
                    </p>
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(true)
  const groups = groupBySection(items)

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width != null) setWide(width >= 640)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
          {...(!open ? { inert: true } : {})}
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
          <ItemButton
            key={it.id}
            item={it}
            active={value === it.id}
            layout="bottom"
            onSelect={select}
          />
        ))}
      </nav>
    )
  }

  // present === 'auto': a ResizeObserver on the wrapper picks sidebar vs bottom layout —
  // only one real <nav> is ever mounted, so it stays in the accessibility tree.
  return (
    <div ref={containerRef} className={cn('h-full', className)}>
      {wide ? (
        <nav
          aria-label="Navegação"
          className="flex h-full w-[260px] flex-col border-r border-ink-200 bg-white py-2 dark:border-ink-700 dark:bg-ink-900"
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
      ) : (
        <nav
          aria-label="Navegação"
          className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900"
        >
          {items.map((it) => (
            <ItemButton
              key={it.id}
              item={it}
              active={value === it.id}
              layout="bottom"
              onSelect={select}
            />
          ))}
        </nav>
      )}
    </div>
  )
}
