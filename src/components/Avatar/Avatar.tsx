import { useState, Children, cloneElement, isValidElement, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarStatus = boolean | 'online' | 'offline' | 'away'
export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  shape?: AvatarShape
  icon?: ReactNode
  ring?: boolean
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[20px] text-[10px]',
  sm: 'size-[28px] text-[12px]',
  md: 'size-[36px] text-[14px]',
  lg: 'size-[48px] text-[16px]',
  xl: 'size-[64px] text-[20px]',
  '2xl': 'size-[72px] text-[24px]',
}

const STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[6px]',
  sm: 'size-[8px]',
  md: 'size-[10px]',
  lg: 'size-[12px]',
  xl: 'size-[14px]',
  '2xl': 'size-[16px]',
}

const STATUS_COLOR_CLASSES: Record<'online' | 'offline' | 'away', string> = {
  online: 'bg-[#12B76A]',
  offline: 'bg-[#98A2B3]',
  away: 'bg-[#F79009]',
}

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-[12px]',
  square: 'rounded-none',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
}

function FallbackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[60%]" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" fill="currentColor" />
    </svg>
  )
}

export function Avatar({ src, alt, name, size = 'md', status, shape = 'circle', icon, ring = false, className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const initials = name ? getInitials(name) : ''
  const showImage = Boolean(src) && !imageError
  const resolvedAlt = alt ?? name ?? ''
  const statusKind = typeof status === 'string' ? status : status === true ? 'online' : undefined

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden bg-[#FFD4BF] font-medium text-[#B42318] select-none',
          SIZE_CLASSES[size],
          SHAPE_CLASSES[shape],
          ring && 'ring-2 ring-white dark:ring-[#151B2C]',
        )}
      >
        {showImage ? (
          <img src={src} alt={resolvedAlt} className="size-full object-cover" onError={() => setImageError(true)} />
        ) : initials ? (
          <span>{initials}</span>
        ) : icon ? (
          icon
        ) : (
          <FallbackIcon />
        )}
      </span>
      {statusKind && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#151B2C]',
            STATUS_SIZE_CLASSES[size],
            STATUS_COLOR_CLASSES[statusKind],
          )}
          aria-label={typeof status === 'string' ? `status: ${status}` : 'status indicator'}
          role="img"
        />
      )}
    </span>
  )
}

export interface AvatarGroupProps {
  children: ReactNode
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ children, max, size = 'md', className }: AvatarGroupProps) {
  const items = Children.toArray(children)
  const visible = max ? items.slice(0, max) : items
  const overflow = max && items.length > max ? items.length - max : 0

  return (
    <div className={cn('flex items-center -space-x-[8px]', className)}>
      {visible.map((child, index) =>
        isValidElement<AvatarProps>(child) && child.type === Avatar
          ? cloneElement(child, { key: index, size, ring: true })
          : child,
      )}
      {overflow > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-[#F2F4F7] font-medium text-[#344054] ring-2 ring-white dark:bg-[#1F2937] dark:text-[#D0D5DD] dark:ring-[#151B2C]',
            SIZE_CLASSES[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
