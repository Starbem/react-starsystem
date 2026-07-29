import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface TopBarProps {
  start?: ReactNode
  center?: ReactNode
  end?: ReactNode
  sticky?: boolean
  bordered?: boolean
  className?: string
}

export function TopBar({ start, center, end, sticky = false, bordered = false, className }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!sticky) return

    function handleScroll() {
      setScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  return (
    <header
      className={cn(
        'flex h-[64px] w-full items-center gap-[16px] bg-white px-[16px] sm:px-[24px] transition-shadow duration-200 dark:bg-ink-900',
        sticky && 'sticky top-0 z-[50]',
        bordered && 'border-b border-ink-200 dark:border-neutral-900',
        sticky && scrolled && 'shadow-elevation-01',
        className,
      )}
    >
      {start && <div className="flex items-center gap-[8px] min-w-0">{start}</div>}
      {center && (
        <div className="flex-1 min-w-0 flex items-center justify-center sm:justify-start text-[16px] font-medium truncate">
          {center}
        </div>
      )}
      {!center && <div className="flex-1" />}
      {end && <div className="flex items-center gap-[8px] shrink-0">{end}</div>}
    </header>
  )
}
