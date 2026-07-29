import * as RadixToast from '@radix-ui/react-toast'
import { useSyncExternalStore } from 'react'
import { cn } from '../../utils/cn'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  showProgress?: boolean
}

interface ToastItem extends ToastOptions {
  id: string
  variant: ToastVariant
  duration: number
}

const DEFAULT_DURATION = 5000

let toasts: ToastItem[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function addToast(variant: ToastVariant, input: string | ToastOptions) {
  const options = typeof input === 'string' ? { description: input } : input
  const id = `toast-${Math.random().toString(36).slice(2)}-${toasts.length}`
  toasts = [...toasts, { id, variant, duration: DEFAULT_DURATION, ...options }]
  emit()
  return id
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export const toast = {
  info: (input: string | ToastOptions) => addToast('info', input),
  success: (input: string | ToastOptions) => addToast('success', input),
  warning: (input: string | ToastOptions) => addToast('warning', input),
  error: (input: string | ToastOptions) => addToast('error', input),
  dismiss,
}

/** Test-only reset of the module-level toast store; not part of the public API. */
export function __clearToastsForTests() {
  toasts = []
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return toasts
}

function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  info: 'bg-secondary-lightest text-secondary-darker',
  success: 'bg-success-lightest text-success-darker',
  warning: 'bg-warning-lightest text-warning-darkest',
  error: 'bg-error-lightest text-error-darker',
}

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-right': 'top-0 right-0 items-end',
  'top-left': 'top-0 left-0 items-start',
  'bottom-right': 'bottom-0 right-0 items-end',
  'bottom-left': 'bottom-0 left-0 items-start',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
}

export interface ToastProviderProps {
  position?: ToastPosition
}

export function ToastProvider({ position = 'top-right' }: ToastProviderProps) {
  const items = useToasts()

  return (
    <RadixToast.Provider swipeDirection="right">
      {items.map((item) => (
        <ToastRoot key={item.id} item={item} />
      ))}
      <RadixToast.Viewport
        className={cn(
          'fixed z-[100] flex flex-col gap-[8px] p-[16px] w-full max-w-[380px] list-none outline-none',
          POSITION_CLASSES[position],
        )}
      />
    </RadixToast.Provider>
  )
}

function ToastRoot({ item }: { item: ToastItem }) {
  const { id, variant, title, description, duration, showProgress } = item

  return (
    <RadixToast.Root
      duration={duration}
      onOpenChange={(open) => {
        if (!open) dismiss(id)
      }}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'relative overflow-hidden rounded-md p-[16px] pr-[36px] shadow-elevation-04',
        'transition-opacity duration-200 data-[state=closed]:opacity-0',
        VARIANT_CLASSES[variant],
      )}
    >
      <div className="flex flex-col gap-[4px]">
        {title && <RadixToast.Title className="font-medium text-[14px] leading-[20px]">{title}</RadixToast.Title>}
        {description && (
          <RadixToast.Description className="text-[14px] leading-[20px]">{description}</RadixToast.Description>
        )}
      </div>
      <RadixToast.Close
        aria-label="Fechar notificação"
        className={cn(
          'absolute top-[8px] right-[8px] size-[20px] inline-flex items-center justify-center rounded-full outline-none',
          'hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
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
      </RadixToast.Close>
      {showProgress && (
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-current/20 overflow-hidden">
          <div
            className="h-full bg-current origin-left"
            style={{ animation: `toast-progress ${duration}ms linear forwards` }}
          />
        </div>
      )}
    </RadixToast.Root>
  )
}
