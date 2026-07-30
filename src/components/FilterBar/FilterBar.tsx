import { useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export type FilterTone = 'primary' | 'success' | 'accent'

const TONE_SELECTED: Record<FilterTone, string> = {
  primary: 'bg-primary-lightest border-primary-base text-primary-darker',
  success: 'bg-success-lightest border-success-base text-success-darker',
  accent: 'bg-terciary-lightest border-terciary-base text-terciary-darker',
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-[10px] py-[4px] text-[12px] leading-[16px] gap-[4px]',
  md: 'px-[12px] py-[6px] text-[14px] leading-[20px] gap-[6px]',
  lg: 'px-[16px] py-[8px] text-[16px] leading-[24px] gap-[8px]',
}

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label?: string
  icon?: string
  count?: number
  selected?: boolean
  variant?: 'outline' | 'solid'
  tone?: FilterTone
  size?: 'sm' | 'md' | 'lg'
  dropdown?: boolean
  open?: boolean
  removable?: boolean
  onRemove?: () => void
  disabled?: boolean
  children?: ReactNode
}

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
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        SIZE_CLASSES[size],
        selected
          ? cn(TONE_SELECTED[tone], variant === 'solid' && 'border-transparent')
          : 'bg-neutral-25 border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-ink-700 dark:text-ink-100',
        className,
      )}
      {...rest}
    >
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
      {removable && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remover filtro"
          className="inline-flex shrink-0 items-center justify-center rounded-full hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onRemove?.()
            }
          }}
        >
          <Icon name="close" size={16} />
        </span>
      )}
    </button>
  )
}

export interface FilterOption {
  id: string
  label: string
  icon?: string
  count?: number
  disabled?: boolean
}

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: FilterOption[]
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
  mode?: 'multi' | 'single'
  variant?: 'outline' | 'solid' | 'segmented'
  tone?: FilterTone
  size?: 'sm' | 'md' | 'lg'
  scroll?: boolean
}

export function FilterBar({
  options = [],
  value,
  defaultValue,
  onChange,
  mode = 'multi',
  variant = 'outline',
  tone = 'primary',
  size = 'md',
  scroll = false,
  className,
  ...rest
}: FilterBarProps) {
  const isSeg = variant === 'segmented'
  const effMode = isSeg ? 'single' : mode
  const init = defaultValue !== undefined ? defaultValue : effMode === 'single' ? null : []
  const [internal, setInternal] = useState<string | string[] | null>(init)
  const sel = value !== undefined ? value : internal

  const isOn = (id: string) => (effMode === 'single' ? sel === id : Array.isArray(sel) && sel.includes(id))

  const toggle = (id: string) => {
    let next: string | string[] | null
    if (effMode === 'single') {
      next = sel === id ? null : id
    } else {
      const arr = Array.isArray(sel) ? sel : []
      next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    }
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  return (
    <div
      className={cn(
        'flex items-center',
        isSeg
          ? 'inline-flex overflow-hidden rounded-full border border-neutral-300 divide-x divide-neutral-300 dark:border-ink-700 dark:divide-ink-700'
          : cn('gap-2', scroll ? 'overflow-x-auto flex-nowrap' : 'flex-wrap'),
        className,
      )}
      role="group"
      {...rest}
    >
      {options.map((opt) => (
        <FilterChip
          key={opt.id}
          label={opt.label}
          icon={opt.icon}
          count={opt.count}
          disabled={opt.disabled}
          selected={isOn(opt.id)}
          variant={isSeg ? 'outline' : variant}
          tone={tone}
          size={size}
          className={isSeg ? 'rounded-none border-0 first:rounded-l-full last:rounded-r-full' : undefined}
          onClick={() => toggle(opt.id)}
        />
      ))}
    </div>
  )
}
