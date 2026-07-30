import { cn } from '../../utils/cn'

export type FieldVariant = 'outline' | 'filled' | 'underline'
export type FieldSize = 'sm' | 'md' | 'lg'

export const FIELD_SIZE_TEXT_CLASSES: Record<FieldSize, string> = {
  sm: 'text-[14px] leading-[20px]',
  md: 'text-[16px] leading-[24px]',
  lg: 'text-[17px] leading-[26px]',
}

export const FIELD_SIZE_PADDING_Y_CLASSES: Record<FieldSize, string> = {
  sm: 'py-[7px]',
  md: 'py-[10px]',
  lg: 'py-[13px]',
}

export const FIELD_SIZE_PADDING_X_CLASSES: Record<FieldSize, string> = {
  sm: 'px-[12px]',
  md: 'px-[14px]',
  lg: 'px-[16px]',
}

export const FIELD_SIZE_RADIUS_CLASSES: Record<FieldSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
}

export function getFieldColorClasses(
  variant: FieldVariant,
  disabled: boolean,
  state: 'error' | 'success' | null,
) {
  if (disabled) {
    return 'border bg-neutral-50 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-ink-700'
  }

  if (variant === 'underline') {
    return cn(
      'border-0 border-b bg-transparent',
      'border-b-neutral-300 hover:border-b-neutral-400 dark:border-b-ink-700 dark:hover:border-b-ink-600',
      'focus-within:border-b-primary-base',
      state === 'error' && 'border-b-error-base focus-within:border-b-error-base',
      state === 'success' && 'border-b-success-base focus-within:border-b-success-base',
    )
  }

  if (variant === 'filled') {
    return cn(
      'border border-transparent bg-ink-100 hover:bg-ink-50 dark:bg-ink-700 dark:hover:bg-ink-600',
      'focus-within:bg-white focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)] dark:focus-within:bg-ink-900',
      state === 'error' &&
        'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
      state === 'success' &&
        'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
    )
  }

  return cn(
    'border bg-white border-neutral-300 hover:border-neutral-400 shadow-elevation-01 dark:bg-ink-900 dark:border-ink-700 dark:hover:border-ink-600',
    'focus-within:border-primary-base focus-within:shadow-[0_0_0_4px_rgba(255,81,0,0.2)]',
    state === 'error' &&
      'border-error-base focus-within:border-error-base focus-within:shadow-[0_0_0_4px_rgba(255,66,66,0.2)]',
    state === 'success' &&
      'border-success-base focus-within:border-success-base focus-within:shadow-[0_0_0_4px_rgba(31,186,93,0.2)]',
  )
}
