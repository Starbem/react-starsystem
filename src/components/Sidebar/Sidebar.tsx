import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { NavItem, type NavItemConfig } from './NavItem'

export interface SidebarProps {
  items: NavItemConfig[]
  collapsed?: boolean
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Sidebar({ items, collapsed = false, header, footer, className }: SidebarProps) {
  return (
    <nav
      aria-label="Menu principal"
      className={cn(
        'flex h-full flex-col gap-[16px] border-r border-ink-200 bg-white p-[12px] transition-[width] duration-200',
        'dark:border-neutral-900 dark:bg-ink-900',
        collapsed ? 'w-[72px] items-center' : 'w-[260px]',
        className,
      )}
    >
      {header && <div className={cn('px-[4px]', collapsed && 'px-0')}>{header}</div>}
      <ul className={cn('flex flex-1 flex-col gap-[4px]', collapsed ? 'items-center w-full' : 'w-full')}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="w-full">
            <NavItem item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
      {footer && <div className={cn('px-[4px]', collapsed && 'px-0')}>{footer}</div>}
    </nav>
  )
}
