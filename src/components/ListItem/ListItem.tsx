import { type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  leading?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  trailingIcon?: string
  active?: boolean
  as?: 'button' | 'a' | 'div' | 'li'
  href?: string
}

export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  trailingIcon,
  active = false,
  as = 'button',
  className,
  ...rest
}: ListItemProps) {
  const Component = as as ElementType
  const extraProps = as === 'button' ? { type: 'button' } : {}
  return (
    <Component
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        'hover:bg-ink-100 dark:hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        active && 'bg-primary-lightest dark:bg-neutral-1000',
        className,
      )}
      {...extraProps}
      {...rest}
    >
      {leading}
      <span className="min-w-0 flex-1">
        {title && <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900 dark:text-ink-100">{title}</p>}
        {subtitle && <p className="truncate text-[13px] leading-[18px] text-ink-500 dark:text-ink-300">{subtitle}</p>}
      </span>
      {(trailing || trailingIcon) && (
        <span className="flex shrink-0 items-center gap-2">
          {trailing}
          {trailingIcon && <Icon name={trailingIcon} className="text-ink-500 dark:text-ink-300" />}
        </span>
      )}
    </Component>
  )
}
