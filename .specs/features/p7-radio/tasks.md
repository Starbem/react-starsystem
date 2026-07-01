# Radio — Tasks (ID-3173)

**Spec:** `.specs/features/p7-radio/spec.md`
**Branch:** `feat/ID-3173-radio`
**Reference:** `src/components/Checkbox/Checkbox.tsx` (row anatomy, custom role-based control, label click pattern)

---

## Task 1 — Branch + Jira setup

- [x] Transition Jira ID-3173 → In Progress (transition id `"3"`)
- [ ] Create branch: `git checkout -b feat/ID-3173-radio` (from up-to-date `main`, after ID-3172 merge)

---

## Task 2 — Component implementation

**Files:**
- Create: `src/components/Radio/Radio.tsx`
- Create: `src/components/Radio/RadioGroup.tsx`

**Radio.tsx** — presentation component, `checked`/`disabled`/`tabIndex` normally injected by `RadioGroup` via `cloneElement`, but usable standalone with explicit `checked`:

```tsx
import { cn } from '../../utils/cn'

export interface RadioProps {
  value: string
  checked?: boolean
  disabled?: boolean
  label?: string
  supportingText?: string
  size?: 'sm' | 'md'
  id?: string
  name?: string
  tabIndex?: number
  onSelect?: (value: string) => void
  className?: string
}

const BOX_SIZE = {
  sm: 'size-[16px]',
  md: 'size-[24px]',
}

const DOT_SIZE = {
  sm: 'size-[8px]',
  md: 'size-[12px]',
}

export function Radio({
  value,
  checked = false,
  disabled,
  label,
  supportingText,
  size = 'md',
  id,
  name,
  tabIndex = 0,
  onSelect,
  className,
}: RadioProps) {
  const labelId = label ? `${id}-label` : undefined
  const descId = supportingText ? `${id}-desc` : undefined

  function select() {
    if (disabled) return
    onSelect?.(value)
  }

  return (
    <div className={cn('flex items-start gap-[12px]', className)}>
      <span className="flex items-center justify-center pt-[2px] shrink-0">
        <span
          id={id}
          role="radio"
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          aria-labelledby={labelId}
          aria-describedby={descId}
          tabIndex={disabled ? -1 : tabIndex}
          onClick={select}
          data-value={value}
          data-radio-name={name}
          className={cn(
            'relative flex items-center justify-center rounded-full border outline-none transition-colors',
            'focus-visible:ring-2 focus-visible:ring-[#FF5100] focus-visible:ring-offset-2',
            BOX_SIZE[size],
            disabled
              ? 'bg-[#E2E2E2] border-[#CFCFCF] cursor-not-allowed'
              : checked
                ? 'bg-[#F7F7F7] border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer'
                : 'bg-[#F7F7F7] border-[#B6B6B6] hover:border-[#FF5100] hover:shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)] cursor-pointer',
          )}
        >
          {checked && (
            <span className={cn('rounded-full', DOT_SIZE[size], disabled ? 'bg-[#CFCFCF]' : 'bg-[#FF5100]')} />
          )}
        </span>
      </span>
      {(label || supportingText) && (
        <span className="flex flex-col gap-[2px] flex-1 min-w-0">
          {label && (
            <span
              id={labelId}
              onClick={select}
              className={cn(
                "font-['Funnel_Display'] text-[16px] leading-[24px] text-[#393939] select-none",
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                checked ? 'font-medium' : 'font-normal',
              )}
            >
              {label}
            </span>
          )}
          {supportingText && (
            <p
              id={descId}
              className="font-['Funnel_Display'] text-[14px] leading-[20px] tracking-[0.1px] text-[#808080]"
            >
              {supportingText}
            </p>
          )}
        </span>
      )}
    </div>
  )
}
```

**RadioGroup.tsx** — owns `role="radiogroup"`, roving tabindex, arrow-key navigation, injects `checked`/`disabled`/`tabIndex`/`onSelect`/`name`/`id` into each `Radio` child via `cloneElement`:

```tsx
import { Children, cloneElement, isValidElement, useId, type KeyboardEvent, type ReactElement, type ReactNode } from 'react'
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
    const enabledIndexes = items.map((item, i) => i).filter((i) => !items[i].props.disabled)
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
```

**Notes:**
- Roving tabindex: only `activeIndex` (checked item, or index 0 if nothing checked) gets `tabIndex=0` — Tab enters/exits the group at one stop, matching native radio group behavior
- Arrow keys both move focus AND select (per Jira: "setas navegam entre opções... Enter/Space seleciona" — arrow-select is the dominant native radio pattern; Space/Enter is kept too since Jira lists it explicitly, functions as a no-op re-select on the already-focused item)
- `Radio` remains independently usable outside a group (explicit `checked`, no `onSelect` wiring needed) for edge cases, but `RadioGroup` is the primary documented usage per spec R-04
- Dot size 50% of box — flagged `[Provável]` in spec.md, not pixel-verified (Figma renders checked radio as a flattened image)

- [ ] Create `src/components/Radio/Radio.tsx` with code above
- [ ] Create `src/components/Radio/RadioGroup.tsx` with code above
- [ ] Run `pnpm typecheck` — must pass

---

## Task 3 — Barrel export + library export

- [ ] Create `src/components/Radio/index.ts`:
  ```ts
  export { Radio } from './Radio'
  export type { RadioProps } from './Radio'
  export { RadioGroup } from './RadioGroup'
  export type { RadioGroupProps } from './RadioGroup'
  ```
- [ ] Add to `src/index.ts` after Checkbox exports:
  ```ts
  export { Radio, RadioGroup } from './components/Radio'
  export type { RadioProps, RadioGroupProps } from './components/Radio'
  ```
- [ ] Run `pnpm build` — must produce dist/ without errors

---

## Task 4 — Unit tests

**File:** `src/components/Radio/Radio.test.tsx`

Tests (RadioGroup-driven, since that's the primary use case):
- renders all radios with `role="radio"` inside `role="radiogroup"`
- marks the radio matching `value` as `aria-checked=true`, others `false`
- calls `onChange` with clicked radio's value
- only active radio (checked, or first if none checked) has `tabIndex=0`; rest `-1`
- `ArrowDown`/`ArrowRight` selects next enabled radio (wraps at end)
- `ArrowUp`/`ArrowLeft` selects previous enabled radio (wraps at start)
- skips disabled radios during arrow navigation
- `disabled` on `RadioGroup` cascades to all children — clicking any radio does not call `onChange`
- individual `Radio`'s own `disabled` wins even if group is enabled
- renders label + supporting text
- horizontal orientation applies row layout class
- clicking label text selects the radio

- [ ] Create `src/components/Radio/Radio.test.tsx` with tests above (~12 tests)
- [ ] Run `pnpm test` — all must pass

---

## Task 5 — Storybook stories

**File:** `src/components/Radio/Radio.stories.tsx`

Stories: `Default` (RadioGroup, 3 options), `WithSupportingText`, `Horizontal`, `Disabled` (whole group), `DisabledOption` (one option only), `Small`, `AllStates`.

- [ ] Create `src/components/Radio/Radio.stories.tsx`
- [ ] Verify visually (headless screenshot or `pnpm storybook`) against Figma node `3228:15912` Radio column

---

## Task 6 — Commit + finish branch

- [ ] `git add src/components/Radio/ src/index.ts .specs/features/p7-radio/`
- [ ] `git commit -m "feat(radio): Radio + RadioGroup with roving tabindex, arrow-key navigation, orientations"`
- [ ] `pnpm lint && pnpm test && pnpm build` — final gate, all pass
- [ ] Push branch, open PR, add PR link as Jira comment, transition ID-3173 → QA - Testing
