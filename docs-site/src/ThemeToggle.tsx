import type { Theme } from './useTheme'
import { cn } from '../../src/utils/cn'

export interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  className?: string
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 1.5v2M9 14.5v2M16.5 9h-2M3.5 9h-2M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4M14.3 14.3l-1.4-1.4M5.1 5.1 3.7 3.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M15.5 10.4A6.5 6.5 0 1 1 7.6 2.5a5 5 0 0 0 7.9 7.9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle({ theme, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className={cn(
        'inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#344054] outline-none transition-colors',
        'hover:bg-[#F2F4F7] focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
        'dark:text-[#D0D5DD] dark:hover:bg-[#1F2937]',
        className,
      )}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
