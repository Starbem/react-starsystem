import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import type { RadioProps } from './Radio'
import { cn } from '../../utils/cn'

export interface RadioGroupProps {
  children: ReactNode
  value?: string
  onChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  label?: string
  name?: string
  className?: string
}

export function RadioGroup({
  children,
  value,
  onChange,
  orientation = 'vertical',
  disabled,
  label,
  name,
  className,
}: RadioGroupProps) {
  const groupId = useId()
  const groupName = name ?? groupId

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<RadioProps>[]
  const checkedIndex = items.findIndex((item) => item.props.value === value)
  const activeIndex = checkedIndex >= 0 ? checkedIndex : 0

  function selectByIndex(index: number) {
    const item = items[index]
    if (!item || item.props.disabled || disabled) return
    onChange?.(item.props.value)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const enabledIndexes = items.map((_, i) => i).filter((i) => !items[i].props.disabled)
    if (enabledIndexes.length === 0) return
    const currentPos = enabledIndexes.indexOf(activeIndex)

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = enabledIndexes[(currentPos + 1) % enabledIndexes.length]
      selectByIndex(next)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = enabledIndexes[(currentPos - 1 + enabledIndexes.length) % enabledIndexes.length]
      selectByIndex(prev)
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      selectByIndex(activeIndex)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('flex', orientation === 'vertical' ? 'flex-col gap-[12px]' : 'flex-row gap-[24px]', className)}
    >
      {items.map((item, index) =>
        cloneElement(item, {
          key: item.props.value,
          id: item.props.id ?? `${groupId}-${item.props.value}`,
          name: groupName,
          checked: item.props.value === value,
          disabled: disabled || item.props.disabled,
          tabIndex: index === activeIndex ? 0 : -1,
          onSelect: () => selectByIndex(index),
        }),
      )}
    </div>
  )
}
