import { useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  description?: ReactNode
  icon?: ReactNode
  onClose?: () => void
  action?: ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'bg-secondary-lightest text-secondary-darker',
  success: 'bg-success-lightest text-success-darker',
  warning: 'bg-warning-lightest text-warning-darkest',
  error: 'bg-error-lightest text-error-darker',
}

export function Alert({
  variant = 'info',
  title,
  description,
  icon,
  onClose,
  action,
  className,
}: AlertProps) {
  const [closing, setClosing] = useState(false)
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  function handleClose() {
    setClosing(true)
  }

  function handleTransitionEnd() {
    if (!closing) return
    setHidden(true)
    onClose?.()
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        'flex items-start gap-[12px] rounded-md p-[16px] transition-all duration-200 ease-in',
        closing ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        {title && <p className="font-medium text-[14px] leading-[20px]">{title}</p>}
        {description && <p className="text-[14px] leading-[20px]">{description}</p>}
        {action && <div className="mt-[8px]">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar alerta"
          className={cn(
            'shrink-0 inline-flex items-center justify-center size-[20px] rounded-full outline-none',
            'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
          )}
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
