import type { Locale } from './i18n'
import { cn } from '../../src/utils/cn'

export interface LocaleToggleProps {
  locale: Locale
  onToggle: () => void
  className?: string
  toPtLabel?: string
  toEnLabel?: string
}

function UsFlagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <clipPath id="us-flag-circle">
        <circle cx="9" cy="9" r="8.5" />
      </clipPath>
      <g clipPath="url(#us-flag-circle)">
        <rect width="18" height="18" fill="#B22234" />
        <g fill="#FFFFFF">
          <rect y="1.38" width="18" height="1.38" />
          <rect y="4.15" width="18" height="1.38" />
          <rect y="6.92" width="18" height="1.38" />
          <rect y="9.69" width="18" height="1.38" />
          <rect y="12.46" width="18" height="1.38" />
          <rect y="15.23" width="18" height="1.38" />
        </g>
        <rect width="9" height="9.69" fill="#3C3B6E" />
      </g>
    </svg>
  )
}

function BrFlagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <clipPath id="br-flag-circle">
        <circle cx="9" cy="9" r="8.5" />
      </clipPath>
      <g clipPath="url(#br-flag-circle)">
        <rect width="18" height="18" fill="#009B3A" />
        <path d="M9 2 16.5 9 9 16 1.5 9Z" fill="#FEDF00" />
        <circle cx="9" cy="9" r="3.4" fill="#002776" />
      </g>
    </svg>
  )
}

export function LocaleToggle({
  locale,
  onToggle,
  className,
  toPtLabel = 'Switch to Portuguese',
  toEnLabel = 'Switch to English',
}: LocaleToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={locale === 'en' ? toPtLabel : toEnLabel}
      className={cn(
        'inline-flex size-[32px] items-center justify-center rounded-[8px] outline-none transition-colors',
        'hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'dark:hover:bg-[#1F2937]',
        className,
      )}
    >
      {locale === 'en' ? <UsFlagIcon /> : <BrFlagIcon />}
    </button>
  )
}
