import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export type IconButtonVariant = 'ghost' | 'solid' | 'outline'
export type IconButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700',
  solid: 'bg-secondary-base text-white hover:bg-secondary-dark',
  outline:
    'bg-neutral-25 border border-neutral-300 text-neutral-800 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700 dark:text-ink-100',
}

const SIZE_CLASSES: Record<IconButtonSize, { padding: string; icon: number }> = {
  sm: { padding: 'p-[6px]', icon: 18 },
  md: { padding: 'p-[8px]', icon: 20 },
  lg: { padding: 'p-[10px]', icon: 24 },
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  pill?: boolean
  fill?: boolean
  /** Accessible label (also used as the title/tooltip). Required — this is an icon-only control with no visible text. */
  label: string
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  pill = false,
  fill = false,
  label,
  className,
  ...rest
}: IconButtonProps) {
  const { padding, icon: iconSize } = SIZE_CLASSES[size]
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        padding,
        pill && 'rounded-full',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize} fill={fill} />
    </button>
  )
}
