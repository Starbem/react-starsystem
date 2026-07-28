import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  footer?: ReactNode
  size?: ModalSize
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

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  children,
  className,
}: ModalProps) {
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
            'fixed left-1/2 top-1/2 z-[101] flex w-full -translate-x-1/2 -translate-y-1/2 flex-col',
            'rounded-[12px] bg-white p-[24px] shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)] outline-none',
            'max-h-[calc(100vh-32px)] transition-opacity duration-200 data-[state=closed]:opacity-0',
            SIZE_CLASSES[size],
            className,
          )}
        >
          {title ? (
            <Dialog.Title className="text-[18px] font-medium leading-[24px] pr-[32px]">{title}</Dialog.Title>
          ) : (
            <Dialog.Title className="sr-only">Modal</Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="mt-[4px] text-[14px] leading-[20px] text-[#667085]">
              {description}
            </Dialog.Description>
          )}
          <div className="mt-[16px] flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="mt-[24px] flex justify-end gap-[8px]">{footer}</div>}
          <Dialog.Close
            aria-label="Fechar modal"
            className={cn(
              'absolute right-[16px] top-[16px] inline-flex size-[24px] items-center justify-center rounded-full outline-none',
              'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-1',
            )}
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
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
