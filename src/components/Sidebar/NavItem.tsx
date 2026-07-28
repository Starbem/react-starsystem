import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Tooltip } from '../Tooltip'

export interface NavItemConfig {
  icon?: ReactNode
  label: string
  href?: string
  active?: boolean
  badge?: ReactNode
  onClick?: () => void
  children?: NavItemConfig[]
}

export interface NavItemProps {
  item: NavItemConfig
  collapsed?: boolean
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-[12px] transition-transform duration-150', open && 'rotate-90')}
    >
      <path
        d="M5.25 3.5L9.91667 7L5.25 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NavItemRow({ item, collapsed }: { item: NavItemConfig; collapsed?: boolean }) {
  const Tag = item.href ? 'a' : 'button'

  return (
    <Tag
      href={item.href}
      type={item.href ? undefined : 'button'}
      onClick={item.onClick}
      aria-current={item.active ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] text-[14px] font-medium outline-none',
        'text-[#344054] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        item.active && 'bg-[#FFF1EB] text-[#FF5100] hover:bg-[#FFF1EB]',
        collapsed && 'justify-center px-0',
      )}
    >
      {item.icon && <span className="shrink-0 inline-flex items-center justify-center size-[20px]">{item.icon}</span>}
      {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
      {!collapsed && item.badge}
    </Tag>
  )
}

export function NavItem({ item, collapsed = false }: NavItemProps) {
  const [open, setOpen] = useState(Boolean(item.active))
  const hasChildren = Boolean(item.children && item.children.length > 0)

  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        <div>
          <NavItemRow item={item} collapsed />
        </div>
      </Tooltip>
    )
  }

  if (!hasChildren) {
    return <NavItemRow item={item} />
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[8px] text-[14px] font-medium outline-none',
          'text-[#344054] hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        )}
      >
        {item.icon && <span className="shrink-0 inline-flex items-center justify-center size-[20px]">{item.icon}</span>}
        <span className="flex-1 truncate text-left">{item.label}</span>
        {item.badge}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="mt-[4px] ml-[20px] flex flex-col gap-[2px] border-l border-[#EAECF0] pl-[8px]">
          {item.children?.map((child, index) => (
            <NavItemRow key={`${child.label}-${index}`} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}
