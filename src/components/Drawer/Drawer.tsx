import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type DrawerPosition = 'left' | 'right' | 'bottom'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  position?: DrawerPosition
  size?: DrawerSize
  closeOnOverlayClick?: boolean
  children?: ReactNode
  className?: string
}

const SIDE_SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: 'w-[320px]',
  md: 'w-[420px]',
  lg: 'w-[560px]',
  full: 'w-screen',
}

const BOTTOM_SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: 'h-[240px]',
  md: 'h-[400px]',
  lg: 'h-[560px]',
  full: 'h-screen',
}

const POSITION_CLASSES: Record<DrawerPosition, string> = {
  left: 'inset-y-0 left-0 h-screen data-[state=closed]:-translate-x-full',
  right: 'inset-y-0 right-0 h-screen data-[state=closed]:translate-x-full',
  bottom: 'inset-x-0 bottom-0 w-screen data-[state=closed]:translate-y-full',
}

export function Drawer({
  open,
  onClose,
  title,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  children,
  className,
}: DrawerProps) {
  const sizeClass = position === 'bottom' ? BOTTOM_SIZE_CLASSES[size] : SIDE_SIZE_CLASSES[size]

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
            'fixed z-[101] flex flex-col bg-white p-[24px] shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)] outline-none',
            'transition-transform duration-300 ease-out',
            POSITION_CLASSES[position],
            sizeClass,
            className,
          )}
        >
          {title ? (
            <Dialog.Title className="text-[18px] font-medium leading-[24px] pr-[32px]">{title}</Dialog.Title>
          ) : (
            <Dialog.Title className="sr-only">Drawer</Dialog.Title>
          )}
          <div className={cn('flex-1 overflow-y-auto', title && 'mt-[16px]')}>{children}</div>
          <Dialog.Close
            aria-label="Fechar"
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
