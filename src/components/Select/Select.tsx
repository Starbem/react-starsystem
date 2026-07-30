import { useEffect, useRef, useState, useCallback, useId, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'
import {
  type FieldVariant,
  type FieldSize,
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
} from '../shared/fieldStyles'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export type SelectVariant = FieldVariant
export type SelectSize = FieldSize

export interface SelectProps {
  options: SelectOption[]
  value?: string
  /**
   * Called with the newly selected option's value. This is a value
   * callback, not a native change event handler — Select is an ARIA
   * combobox widget, not a wrapped <select>, so there is no ChangeEvent
   * to forward.
   */
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  success?: string
  variant?: SelectVariant
  size?: SelectSize
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  hint,
  error,
  success,
  variant = 'outline',
  size = 'md',
  disabled,
  id,
  name,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const reactId = useId()
  const resolvedId = id ?? reactId
  const listboxId = `${resolvedId}-listbox`
  const labelId = label ? `${resolvedId}-label` : undefined

  const isError = Boolean(error)
  const isSuccess = !isError && Boolean(success)
  const state: 'error' | 'success' | null = isError ? 'error' : isSuccess ? 'success' : null
  const hintText = error ?? success ?? hint
  const hintId = hintText ? `${resolvedId}-hint` : undefined
  const isUnderlineShape = variant === 'underline' && !disabled
  const selectedOption = options.find((o) => o.value === value)
  const enabledOptions = options.filter((o) => !o.disabled)

  const openMenu = useCallback(() => {
    const enabledOptions = options.filter((o) => !o.disabled)
    const selectedIdx = enabledOptions.findIndex((o) => o.value === value)
    setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0)
    setIsOpen(true)
    setTimeout(() => listboxRef.current?.focus(), 0)
  }, [options, value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen) {
        setIsOpen(false)
      } else {
        openMenu()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) openMenu()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) openMenu()
    }
  }

  function handleListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const enabledOptions = options.filter((o) => !o.disabled)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) => (i + 1) % enabledOptions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) => (i - 1 + enabledOptions.length) % enabledOptions.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = enabledOptions[focusedIndex]
      if (opt) selectOption(opt.value)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  function selectOption(val: string) {
    onChange?.(val)
    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={cn('flex flex-col gap-[6px] items-start w-full relative', className)}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={resolvedId}
          className="font-['Funnel_Display'] text-[12px] leading-[16px] text-neutral-400 select-none dark:text-ink-500"
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <div className="relative w-full">
        <button
          id={resolvedId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-invalid={isError || undefined}
          aria-describedby={hintId}
          disabled={disabled}
          onClick={() => {
            if (disabled) return
            if (isOpen) {
              setIsOpen(false)
            } else {
              openMenu()
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'flex gap-[8px] items-center w-full text-left',
            'outline-none transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            !isUnderlineShape && FIELD_SIZE_RADIUS_CLASSES[size],
            !isUnderlineShape && FIELD_SIZE_PADDING_X_CLASSES[size],
            FIELD_SIZE_PADDING_Y_CLASSES[size],
            getFieldColorClasses(variant, Boolean(disabled), state),
          )}
        >
          <span className="flex flex-col flex-1 min-w-0 justify-center">
            <span
              className={cn(
                "font-['Funnel_Display'] truncate",
                FIELD_SIZE_TEXT_CLASSES[size],
                disabled
                  ? 'text-neutral-300 dark:text-ink-600'
                  : selectedOption
                    ? 'text-neutral-800 font-medium dark:text-ink-100'
                    : 'text-neutral-400 dark:text-ink-500',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span
            className={cn(
              'shrink-0 text-neutral-500 dark:text-neutral-400',
              disabled && 'text-neutral-300 dark:text-ink-600',
            )}
          >
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </span>
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            role="listbox"
            id={listboxId}
            aria-label={label}
            aria-activedescendant={
              focusedIndex >= 0 && enabledOptions[focusedIndex]
                ? `${listboxId}-opt-${enabledOptions[focusedIndex].value}`
                : undefined
            }
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="absolute top-full left-0 w-full mt-[8px] bg-white border border-neutral-100 rounded-lg shadow-[0px_4px_16px_2px_rgba(70,31,174,0.10)] py-[4px] max-h-[320px] overflow-y-auto z-50 outline-none dark:bg-ink-900 dark:border-ink-700"
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value
              const isDisabled = Boolean(option.disabled)
              const isFocused = enabledOptions.indexOf(option) === focusedIndex
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-opt-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || undefined}
                  data-index={idx}
                  onMouseEnter={() => {
                    if (!isDisabled) {
                      const enabledIdx = enabledOptions.indexOf(option)
                      setFocusedIndex(enabledIdx)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    if (!isDisabled) selectOption(option.value)
                  }}
                  className={cn(
                    "flex items-center gap-[8px] px-[16px] py-[8px] font-['Funnel_Display'] text-[16px] font-medium leading-[24px]",
                    isDisabled
                      ? 'text-neutral-300 cursor-not-allowed dark:text-ink-600'
                      : isSelected || isFocused
                        ? 'bg-neutral-50 text-neutral-800 cursor-pointer dark:bg-ink-700 dark:text-ink-100'
                        : 'text-neutral-800 cursor-pointer hover:bg-neutral-50 dark:text-ink-100 dark:hover:bg-ink-700',
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <span className="shrink-0 text-neutral-800 dark:text-ink-100">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {hintText && (
        <p
          id={hintId}
          className={cn(
            "font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] w-full flex items-center gap-[4px]",
            isError
              ? 'text-error-base'
              : isSuccess
                ? 'text-success-dark dark:text-success-light'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {isError && <Icon name="error" size={15} />}
          {isSuccess && <Icon name="check_circle" size={15} />}
          {hintText}
        </p>
      )}
    </div>
  )
}
