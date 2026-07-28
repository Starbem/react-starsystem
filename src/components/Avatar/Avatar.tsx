import { useState } from 'react'
import { cn } from '../../utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'away'

interface AvatarBaseProps {
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  className?: string
}

export type AvatarProps = AvatarBaseProps & ({ src: string; alt: string } | { src?: undefined; alt?: undefined })

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[20px] text-[10px]',
  sm: 'size-[28px] text-[12px]',
  md: 'size-[36px] text-[14px]',
  lg: 'size-[48px] text-[16px]',
  xl: 'size-[64px] text-[20px]',
}

const STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'size-[6px]',
  sm: 'size-[8px]',
  md: 'size-[10px]',
  lg: 'size-[12px]',
  xl: 'size-[14px]',
}

const STATUS_COLOR_CLASSES: Record<AvatarStatus, string> = {
  online: 'bg-[#12B76A]',
  offline: 'bg-[#98A2B3]',
  away: 'bg-[#F79009]',
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

export function Avatar({ src, alt, name, size = 'md', status, className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const initials = name ? getInitials(name) : ''
  const showImage = Boolean(src) && !imageError

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden rounded-full bg-[#FFD4BF] font-medium text-[#B42318] select-none',
          SIZE_CLASSES[size],
        )}
      >
        {showImage ? (
          <img src={src} alt={alt} className="size-full object-cover" onError={() => setImageError(true)} />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <FallbackIcon />
        )}
      </span>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#151B2C]',
            STATUS_SIZE_CLASSES[size],
            STATUS_COLOR_CLASSES[status],
          )}
          aria-label={`status: ${status}`}
          role="img"
        />
      )}
    </span>
  )
}

export interface AvatarGroupItem {
  src?: string
  alt?: string
  name?: string
}

export interface AvatarGroupProps {
  avatars: AvatarGroupItem[]
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ avatars, max, size = 'md', className }: AvatarGroupProps) {
  const visible = max ? avatars.slice(0, max) : avatars
  const overflow = max && avatars.length > max ? avatars.length - max : 0

  return (
    <div className={cn('flex items-center -space-x-[8px]', className)}>
      {visible.map((item, index) =>
        item.src ? (
          <Avatar key={index} src={item.src} alt={item.alt ?? item.name ?? ''} size={size} className="ring-2 ring-white rounded-full dark:ring-[#151B2C]" />
        ) : (
          <Avatar key={index} name={item.name} size={size} className="ring-2 ring-white rounded-full dark:ring-[#151B2C]" />
        ),
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
