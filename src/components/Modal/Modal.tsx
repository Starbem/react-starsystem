import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalPresent = 'auto' | 'center' | 'sheet'
export type ModalTone = 'default' | 'success' | 'error' | 'warning' | 'info'
export type ModalAlign = 'start' | 'center'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: string
  footer?: ReactNode
  size?: ModalSize
  present?: ModalPresent
  tone?: ModalTone
  icon?: ReactNode
  align?: ModalAlign
  closeOnOverlayClick?: boolean
  children?: ReactNode
  className?: string
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[960px]',
  full: 'max-w-[calc(100vw-32px)] h-[calc(100vh-32px)]',
}

// `present="auto"` renders full-width below the `sm:` breakpoint (bottom sheet) and only
// caps to the size preset once the layout switches to the centered dialog at `sm:` and up.
// These MUST stay static literal strings — see the `sm:` note on `layoutClasses` below.
const SIZE_CLASSES_SM: Record<ModalSize, string> = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[560px]',
  lg: 'sm:max-w-[720px]',
  xl: 'sm:max-w-[960px]',
  full: 'sm:max-w-[calc(100vw-32px)] sm:h-[calc(100vh-32px)]',
}

const TONE_BADGE_CLASSES: Record<Exclude<ModalTone, 'default'>, string> = {
  success: 'bg-success-lightest text-success-base',
  error: 'bg-error-lightest text-error-base',
  warning: 'bg-warning-lightest text-warning-dark',
  info: 'bg-secondary-lightest text-secondary-base',
}

const CENTER_LAYOUT =
  'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md max-h-[calc(100vh-32px)]'

const SHEET_LAYOUT =
  'left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-[16px] rounded-b-none max-h-[92vh] w-full max-w-full'

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  present = 'auto',
  tone = 'default',
  icon,
  align = 'start',
  closeOnOverlayClick = true,
  children,
  className,
}: ModalProps) {
  const layoutClasses =
    present === 'sheet'
      ? SHEET_LAYOUT
      : present === 'center'
        ? CENTER_LAYOUT
        : cn(
            'left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-[16px] rounded-b-none max-h-[92vh] w-full max-w-full',
            'sm:left-1/2 sm:top-1/2 sm:right-auto sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:rounded-t-md sm:max-h-[calc(100vh-32px)] sm:w-full',
          )

  const sizeClasses =
    present === 'sheet'
      ? undefined
      : present === 'center'
        ? SIZE_CLASSES[size]
        : SIZE_CLASSES_SM[size]

  const showBadge = tone !== 'default' || Boolean(icon)
  const badgeClasses = tone !== 'default' ? TONE_BADGE_CLASSES[tone] : 'bg-ink-50 text-ink-600'

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200',
            'data-[state=closed]:opacity-0',
          )}
        />
        <Dialog.Content
          onPointerDownOutside={(event) => {
            if (!closeOnOverlayClick) event.preventDefault()
          }}
          onInteractOutside={(event) => {
            if (!closeOnOverlayClick) event.preventDefault()
          }}
          className={cn(
            'fixed z-[101] flex w-full flex-col',
            'bg-white p-[24px] shadow-elevation-05 outline-none',
            'dark:bg-ink-900',
            'transition-opacity duration-200 data-[state=closed]:opacity-0',
            layoutClasses,
            sizeClasses,
            className,
          )}
        >
          {(title || showBadge) && (
            <div
              className={cn(
                'flex items-center gap-[12px]',
                align === 'center' && 'flex-col justify-center text-center',
              )}
            >
              {showBadge && (
                <span
                  className={cn(
                    'flex size-[36px] shrink-0 items-center justify-center rounded-full',
                    badgeClasses,
                  )}
                >
                  {icon}
                </span>
              )}
              {title ? (
                <Dialog.Title
                  className={cn(
                    'flex-1 text-[18px] font-medium leading-[24px] pr-[32px] text-ink-900 dark:text-white',
                    align === 'center' && 'flex-none text-center pr-0',
                  )}
                >
                  {title}
                </Dialog.Title>
              ) : (
                <Dialog.Title className="sr-only">Modal</Dialog.Title>
              )}
            </div>
          )}
          {!title && !showBadge && <Dialog.Title className="sr-only">Modal</Dialog.Title>}
          {description && (
            <Dialog.Description
              className={cn(
                'mt-[4px] text-[14px] leading-[20px] text-ink-500 dark:text-neutral-400',
                align === 'center' && 'text-center',
              )}
            >
              {description}
            </Dialog.Description>
          )}
          <div className="mt-[16px] flex-1 overflow-y-auto text-ink-900 dark:text-white">
            {children}
          </div>
          {footer && <div className="mt-[24px] flex justify-end gap-[8px]">{footer}</div>}
          <Dialog.Close
            aria-label="Fechar modal"
            className={cn(
              'absolute right-[16px] top-[16px] inline-flex size-[24px] items-center justify-center rounded-full outline-none',
              'text-ink-900 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
              'dark:text-white',
            )}
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-[14px]"
            >
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
