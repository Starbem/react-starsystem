import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  illustration?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

const CONTAINER_SIZE_CLASSES: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'gap-2 py-6 px-4',
  md: 'gap-3 py-10 px-6',
  lg: 'gap-4 py-16 px-8 min-h-[400px]',
}

const MEDIA_SIZE_CLASSES: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'size-[32px]',
  md: 'size-[48px]',
  lg: 'size-[80px]',
}

const TITLE_SIZE_CLASSES: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'text-[14px] leading-[20px] font-medium',
  md: 'text-[16px] leading-[24px] font-semibold',
  lg: 'text-[20px] leading-[28px] font-semibold',
}

const DESCRIPTION_SIZE_CLASSES: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'text-[12px] leading-[18px]',
  md: 'text-[14px] leading-[20px]',
  lg: 'text-[16px] leading-[24px]',
}

export function EmptyState({
  size = 'md',
  icon,
  illustration,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        CONTAINER_SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {illustration ? (
        <div className={cn('flex items-center justify-center', MEDIA_SIZE_CLASSES[size])}>
          {illustration}
        </div>
      ) : icon ? (
        <div
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-full bg-[#F0F0F0] text-[#808080]',
            MEDIA_SIZE_CLASSES[size],
          )}
        >
          {icon}
        </div>
      ) : null}

      <h3 className={cn('text-[#252525]', TITLE_SIZE_CLASSES[size])}>{title}</h3>

      {description && (
        <p className={cn('max-w-sm text-[#626262]', DESCRIPTION_SIZE_CLASSES[size])}>
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
