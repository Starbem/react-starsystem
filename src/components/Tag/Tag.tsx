import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  onRemove?: () => void
}

export function Tag({ children, onRemove, className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] rounded-full bg-ink-100 px-[10px] py-[4px] text-[14px] leading-[20px] text-ink-700 dark:bg-ink-700 dark:text-ink-300',
        className,
      )}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover"
          className="inline-flex shrink-0 items-center justify-center rounded-full outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  )
}
