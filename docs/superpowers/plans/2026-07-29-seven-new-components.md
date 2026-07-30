# 7 Componentes Novos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** implementar Progress, Tag, IconButton, FilterBar, FileUploader, ListItem e Chart em `react-starsystem`, portando de `~/Downloads/Starbem Design System/components/**` para o padrão TypeScript + Tailwind tokens do projeto.

**Architecture:** um componente por task, cada um em `src/components/<Nome>/` com `.tsx` + `.stories.tsx` + `.test.tsx` + `index.ts`, seguido de um barrel export em `src/index.ts` no mesmo task. Task final adiciona o changeset.

**Tech Stack:** React 18+, TypeScript strict, Tailwind v4 (`@theme` tokens já existentes em `src/styles/globals.css`), `cn()` (`src/utils/cn.ts`), `vitest` + `@testing-library/react` + `vitest-axe`.

## Global Constraints

- Só `.tsx` de implementação recebe classe nova — nenhum hex/px hardcoded (usar tokens: `primary-base`, `secondary-base`, `success-base`, `warning-base`, `error-base`, `ink-*`, `neutral-*`, `terciary-base` — nome exato no projeto é `terciary`, não `tertiary`).
- Ícones: sempre via `<Icon name="..." />` de `src/components/Icon` (Material Symbols Rounded, ligature name, ex: `close`, `check`, `upload`, `cloud_upload`, `picture_as_pdf`, `description`, `image`, `draft`, `chevron_right`, `keyboard_arrow_down`, `error`, `check_circle`).
- SVG `stroke`/`fill` de gráficos: usar `style={{ stroke: color }}` com `var(--color-<tone>-base)`, nunca classe Tailwind (atributo SVG não aceita classe pra cor computada).
- Testes: `vitest` + `vitest-axe` (`axe(container)` + `// @ts-expect-error -- axe() is not typed in the default vitest-axe module` + `toHaveNoViolations()`), mesmo padrão de `Badge.test.tsx`.
- Stories: `import type { Meta, StoryObj } from '../../docs-types'`, mesmo padrão de `Badge.stories.tsx`. `docs-site` descobre via glob — nenhuma ação manual.
- Animações custom (`indeterminate` do Progress): `@keyframes` em `src/styles/globals.css`, aplicado via `style={{ animation: '...' }}` inline — mesma técnica de `Skeleton.tsx:51` (`skeleton-wave`) e `Toast.tsx:151` (`toast-progress`). Não usar `animate-pulse`/`animate-spin` do Tailwind quando o efeito visual pedido for "slide" (só o `ring` circular do Progress usa `animate-spin`, que já existe no Tailwind core).
- Cada task termina com `pnpm lint && pnpm typecheck && pnpm build` verde e o barrel export em `src/index.ts` atualizado.

---

### Task 1: Progress + ProgressCircle

**Files:**
- Create: `src/components/Progress/Progress.tsx`
- Create: `src/components/Progress/Progress.stories.tsx`
- Create: `src/components/Progress/Progress.test.tsx`
- Create: `src/components/Progress/index.ts`
- Modify: `src/styles/globals.css` (novo `@keyframes progress-indeterminate`, logo após o bloco `@keyframes skeleton-wave` em torno da linha 200)
- Modify: `src/index.ts` (barrel export)

**Interfaces:**
- Produces: `Progress(props: ProgressProps)`, `ProgressCircle(props: ProgressCircleProps)`, `ProgressProps`, `ProgressCircleProps`, `ProgressTone = 'primary' | 'success' | 'warning' | 'error'`.

- [ ] **Step 1: Add the indeterminate keyframe**

Add to `src/styles/globals.css`, immediately after the `@keyframes skeleton-wave` block (around line 200):

```css
/* Progress linear bar — indeterminate slide */
@keyframes progress-indeterminate {
  0%   { transform: translateX(-60%) scaleX(0.4); }
  50%  { transform: translateX(20%) scaleX(0.6); }
  100% { transform: translateX(100%) scaleX(0.4); }
}
```

- [ ] **Step 2: Write the failing test**

```tsx
// src/components/Progress/Progress.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Progress, ProgressCircle } from './Progress'

describe('Progress', () => {
  it('renders a progressbar with the right aria attributes', () => {
    render(<Progress value={64} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '64')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps the fill width between 0 and 100 percent', () => {
    const { container } = render(<Progress value={150} />)
    const fill = container.querySelector('[data-progress-fill]')
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('shows the label and rounded percentage when showValue is set', () => {
    render(<Progress value={64.6} label="Perfil completo" showValue />)
    expect(screen.getByText('Perfil completo')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate label="Enviando…" />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('applies the success tone class', () => {
    const { container } = render(<Progress value={40} tone="success" />)
    expect(container.querySelector('[data-progress-fill]')).toHaveClass('bg-success-base')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Progress value={64} label="Perfil completo" showValue />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ProgressCircle', () => {
  it('renders a progressbar with the rounded percentage in aria-valuenow', () => {
    render(<ProgressCircle value={72} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72')
  })

  it('shows the percentage label by default', () => {
    render(<ProgressCircle value={72} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders custom center children instead of the percentage', () => {
    render(<ProgressCircle value={72}>2/3</ProgressCircle>)
    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(screen.queryByText('72%')).not.toBeInTheDocument()
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<ProgressCircle indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ProgressCircle value={30} tone="warning" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test Progress.test.tsx`
Expected: FAIL — `./Progress` module not found.

- [ ] **Step 4: Write the implementation**

```tsx
// src/components/Progress/Progress.tsx
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ProgressTone = 'primary' | 'success' | 'warning' | 'error'

const TONE_FILL: Record<ProgressTone, string> = {
  primary: 'bg-primary-base',
  success: 'bg-success-base',
  warning: 'bg-warning-base',
  error: 'bg-error-base',
}

const TONE_STROKE: Record<ProgressTone, string> = {
  primary: 'stroke-primary-base',
  success: 'stroke-success-base',
  warning: 'stroke-warning-base',
  error: 'stroke-error-base',
}

const SIZE_TRACK: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-[4px]',
  md: 'h-[8px]',
  lg: 'h-[12px]',
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
  tone?: ProgressTone
  size?: 'sm' | 'md' | 'lg'
  indeterminate?: boolean
}

export function Progress({
  value = 0,
  max = 100,
  label,
  showValue = false,
  tone = 'primary',
  size = 'md',
  indeterminate = false,
  className,
  ...rest
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn('w-full', className)} {...rest}>
      <div
        className={cn('w-full overflow-hidden rounded-full bg-ink-100', SIZE_TRACK[size])}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemax={max}
        aria-valuemin={0}
      >
        <div
          data-progress-fill
          className={cn('h-full rounded-full transition-[width]', TONE_FILL[tone])}
          style={
            indeterminate
              ? { width: '40%', animation: 'progress-indeterminate 1.4s ease-in-out infinite' }
              : { width: `${pct}%` }
          }
        />
      </div>
      {(label || showValue) && (
        <div className="mt-[6px] flex items-center justify-between text-[14px] leading-[20px] text-ink-600">
          <span>{label}</span>
          {showValue && !indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
    </div>
  )
}

export interface ProgressCircleProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number
  max?: number
  size?: number
  thickness?: number
  tone?: ProgressTone
  showValue?: boolean
  indeterminate?: boolean
  children?: ReactNode
}

export function ProgressCircle({
  value = 0,
  max = 100,
  size = 56,
  thickness = 6,
  tone = 'primary',
  showValue = true,
  indeterminate = false,
  className,
  children,
  ...rest
}: ProgressCircleProps) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const offset = indeterminate ? circ * 0.7 : circ * (1 - pct / 100)
  return (
    <span
      className={cn('relative inline-flex items-center justify-center', indeterminate && 'animate-spin', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-valuemax={max}
      aria-valuemin={0}
      {...rest}
    >
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-ink-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={TONE_STROKE[tone]}
        />
      </svg>
      {(showValue || children) && !indeterminate && (
        <span
          className="absolute inline-flex items-center justify-center font-medium text-ink-900"
          style={{ fontSize: Math.max(11, size * 0.26) }}
        >
          {children ?? `${Math.round(pct)}%`}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test Progress.test.tsx`
Expected: PASS (11 tests)

- [ ] **Step 6: Write stories**

```tsx
// src/components/Progress/Progress.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { Progress, ProgressCircle } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 64 },
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {}

export const WithLabelAndValue: Story = {
  args: { value: 64, label: 'Perfil completo', showValue: true },
}

export const Success: Story = {
  args: { value: 40, tone: 'success', label: 'Exame processado', showValue: true },
}

export const Warning: Story = {
  args: { value: 80, tone: 'warning' },
}

export const Error: Story = {
  args: { value: 20, tone: 'error' },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Enviando exame…' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[280px]">
      <Progress value={64} size="sm" />
      <Progress value={64} size="md" />
      <Progress value={64} size="lg" />
    </div>
  ),
}

export const Circle: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <ProgressCircle value={72} />
      <ProgressCircle value={30} tone="warning" size={72} />
      <ProgressCircle indeterminate size={40} showValue={false} />
      <ProgressCircle value={66} size={72}>
        2/3
      </ProgressCircle>
    </div>
  ),
}
```

- [ ] **Step 7: Add index.ts**

```ts
// src/components/Progress/index.ts
export { Progress, ProgressCircle } from './Progress'
export type { ProgressProps, ProgressCircleProps, ProgressTone } from './Progress'
```

- [ ] **Step 8: Add to src/index.ts**

Insert after the `VideoCall` export block (end of the components section, before `// Design tokens`):

```ts
export { Progress, ProgressCircle } from './components/Progress'
export type { ProgressProps, ProgressCircleProps, ProgressTone } from './components/Progress'
```

- [ ] **Step 9: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 10: Commit**

```bash
git add src/components/Progress src/index.ts src/styles/globals.css
git commit -m "feat(progress): add Progress and ProgressCircle components"
```

---

### Task 2: Tag

**Files:**
- Create: `src/components/Tag/Tag.tsx`
- Create: `src/components/Tag/Tag.stories.tsx`
- Create: `src/components/Tag/Tag.test.tsx`
- Create: `src/components/Tag/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../../components/Icon` (`IconProps` — `name: string`).
- Produces: `Tag(props: TagProps)`, `TagProps`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Tag/Tag.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>Dermatologia</Tag>)
    expect(screen.getByText('Dermatologia')).toBeInTheDocument()
  })

  it('does not render a remove button by default', () => {
    render(<Tag>Somente online</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a remove button when onRemove is passed', () => {
    render(<Tag onRemove={() => {}}>Dermatologia</Tag>)
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<Tag onRemove={handleRemove}>Dermatologia</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('spreads extra HTML attributes onto the root element', () => {
    render(<Tag data-testid="custom-tag">Filtro</Tag>)
    expect(screen.getByTestId('custom-tag')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Tag>Dermatologia</Tag>)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no a11y violations when removable', async () => {
    const { container } = render(<Tag onRemove={() => {}}>Dermatologia</Tag>)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Tag.test.tsx`
Expected: FAIL — `./Tag` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/Tag/Tag.tsx
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  onRemove?: () => void
}

export function Tag({ children, onRemove, className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] rounded-full bg-ink-100 px-[10px] py-[4px] text-[14px] leading-[20px] text-ink-700 dark:bg-ink-700 dark:text-ink-300',
        className,
      )}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover"
          className="inline-flex shrink-0 items-center justify-center rounded-full outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Tag.test.tsx`
Expected: PASS (7 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/Tag/Tag.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { Tag } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Dermatologia' },
}
export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {}

export const Removable: Story = {
  args: { children: 'Dermatologia', onRemove: () => alert('removed') },
}

export const Group: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Tag onRemove={() => {}}>Dermatologia</Tag>
      <Tag onRemove={() => {}}>Somente online</Tag>
      <Tag>Hoje</Tag>
    </div>
  ),
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/Tag/index.ts
export { Tag } from './Tag'
export type { TagProps } from './Tag'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { Tag } from './components/Tag'
export type { TagProps } from './components/Tag'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/Tag src/index.ts
git commit -m "feat(tag): add Tag component"
```

---

### Task 3: IconButton

**Files:**
- Create: `src/components/IconButton/IconButton.tsx`
- Create: `src/components/IconButton/IconButton.stories.tsx`
- Create: `src/components/IconButton/IconButton.test.tsx`
- Create: `src/components/IconButton/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../../components/Icon`.
- Produces: `IconButton(props: IconButtonProps)`, `IconButtonProps`, `IconButtonVariant = 'ghost' | 'solid' | 'outline'`, `IconButtonSize = 'sm' | 'md' | 'lg'`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/IconButton/IconButton.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders a button with the accessible label', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('sets title to the label as well', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Fechar')
  })

  it('applies the ghost variant by default', () => {
    render(<IconButton icon="close" label="Fechar" />)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies the solid variant', () => {
    render(<IconButton icon="videocam" variant="solid" label="Iniciar vídeo" />)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-base')
  })

  it('applies the outline variant', () => {
    render(<IconButton icon="more_vert" variant="outline" label="Mais opções" />)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('applies the pill class when pill is true', () => {
    render(<IconButton icon="close" label="Fechar" pill />)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<IconButton icon="close" label="Fechar" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<IconButton icon="close" label="Fechar" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test IconButton.test.tsx`
Expected: FAIL — `./IconButton` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/IconButton/IconButton.tsx
import { type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export type IconButtonVariant = 'ghost' | 'solid' | 'outline'
export type IconButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700',
  solid: 'bg-secondary-base text-white hover:bg-secondary-dark',
  outline:
    'bg-neutral-25 border border-neutral-300 text-neutral-800 shadow-elevation-01 dark:bg-neutral-900 dark:border-ink-700 dark:text-ink-100',
}

const SIZE_CLASSES: Record<IconButtonSize, { padding: string; icon: number }> = {
  sm: { padding: 'p-[6px]', icon: 18 },
  md: { padding: 'p-[8px]', icon: 20 },
  lg: { padding: 'p-[10px]', icon: 24 },
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  pill?: boolean
  fill?: boolean
  label?: string
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  pill = false,
  fill = false,
  label,
  className,
  ...rest
}: IconButtonProps) {
  const { padding, icon: iconSize } = SIZE_CLASSES[size]
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        padding,
        pill && 'rounded-full',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize} fill={fill} />
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test IconButton.test.tsx`
Expected: PASS (8 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/IconButton/IconButton.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: 'close', label: 'Fechar' },
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

export const Solid: Story = {
  args: { icon: 'videocam', variant: 'solid', label: 'Iniciar vídeo' },
}

export const Outline: Story = {
  args: { icon: 'more_vert', variant: 'outline', label: 'Mais opções' },
}

export const Pill: Story = {
  args: { icon: 'close', pill: true, label: 'Fechar' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <IconButton icon="close" size="sm" label="Fechar" />
      <IconButton icon="close" size="md" label="Fechar" />
      <IconButton icon="close" size="lg" label="Fechar" />
    </div>
  ),
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/IconButton/index.ts
export { IconButton } from './IconButton'
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { IconButton } from './components/IconButton'
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './components/IconButton'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/IconButton src/index.ts
git commit -m "feat(iconbutton): add IconButton component"
```

---

### Task 4: FilterBar + FilterChip

**Files:**
- Create: `src/components/FilterBar/FilterBar.tsx`
- Create: `src/components/FilterBar/FilterBar.stories.tsx`
- Create: `src/components/FilterBar/FilterBar.test.tsx`
- Create: `src/components/FilterBar/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../../components/Icon`.
- Produces: `FilterChip(props: FilterChipProps)`, `FilterBar(props: FilterBarProps)`, `FilterChipProps`, `FilterBarProps`, `FilterOption = { id: string; label: string; icon?: string; count?: number; disabled?: boolean }`, `FilterTone = 'primary' | 'success' | 'accent'`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/FilterBar/FilterBar.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { FilterBar, FilterChip } from './FilterBar'

const OPTIONS = [
  { id: 'online', label: 'Online', count: 12 },
  { id: 'hoje', label: 'Hoje', count: 4 },
  { id: 'derma', label: 'Dermatologia' },
]

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="Online" />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('reflects selected via aria-pressed', () => {
    render(<FilterChip label="Online" selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the count badge', () => {
    render(<FilterChip label="Online" count={12} />)
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('calls onRemove without toggling selection when removable', async () => {
    const handleRemove = vi.fn()
    render(<FilterChip label="Dermatologia" removable onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FilterChip label="Online" selected />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('FilterBar', () => {
  it('renders a chip per option', () => {
    render(<FilterBar options={OPTIONS} />)
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByText('Hoje')).toBeInTheDocument()
    expect(screen.getByText('Dermatologia')).toBeInTheDocument()
  })

  it('toggles multi-select values on click (uncontrolled)', async () => {
    const handleChange = vi.fn()
    render(<FilterBar options={OPTIONS} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith(['online'])
    await userEvent.click(screen.getByText('Hoje'))
    expect(handleChange).toHaveBeenCalledWith(['online', 'hoje'])
  })

  it('respects a controlled value', () => {
    render(<FilterBar options={OPTIONS} value={['online']} onChange={() => {}} />)
    expect(screen.getByText('Online').closest('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Hoje').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('behaves as single-select radio-like in segmented variant', async () => {
    const handleChange = vi.fn()
    render(<FilterBar variant="segmented" options={OPTIONS} onChange={handleChange} />)
    await userEvent.click(screen.getByText('Online'))
    expect(handleChange).toHaveBeenCalledWith('online')
    await userEvent.click(screen.getByText('Hoje'))
    expect(handleChange).toHaveBeenCalledWith('hoje')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FilterBar options={OPTIONS} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test FilterBar.test.tsx`
Expected: FAIL — `./FilterBar` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/FilterBar/FilterBar.tsx
import { useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export type FilterTone = 'primary' | 'success' | 'accent'

const TONE_SELECTED: Record<FilterTone, string> = {
  primary: 'bg-primary-lightest border-primary-base text-primary-darker',
  success: 'bg-success-lightest border-success-base text-success-darker',
  accent: 'bg-terciary-lightest border-terciary-base text-terciary-darker',
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-[10px] py-[4px] text-[12px] leading-[16px] gap-[4px]',
  md: 'px-[12px] py-[6px] text-[14px] leading-[20px] gap-[6px]',
  lg: 'px-[16px] py-[8px] text-[16px] leading-[24px] gap-[8px]',
}

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label?: string
  icon?: string
  count?: number
  selected?: boolean
  variant?: 'outline' | 'solid'
  tone?: FilterTone
  size?: 'sm' | 'md' | 'lg'
  dropdown?: boolean
  open?: boolean
  removable?: boolean
  onRemove?: () => void
  disabled?: boolean
  children?: ReactNode
}

export function FilterChip({
  label,
  icon,
  count,
  selected = false,
  variant = 'outline',
  tone = 'primary',
  size = 'md',
  dropdown = false,
  open = false,
  removable = false,
  onRemove,
  disabled = false,
  className,
  children,
  ...rest
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        SIZE_CLASSES[size],
        selected
          ? cn(TONE_SELECTED[tone], variant === 'solid' && 'border-transparent')
          : 'bg-neutral-25 border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-ink-700 dark:text-ink-100',
        className,
      )}
      {...rest}
    >
      {selected && !icon && !dropdown && <Icon name="check" size={18} />}
      {icon && <Icon name={icon} size={18} />}
      <span>{label || children}</span>
      {count != null && (
        <span className="inline-flex items-center justify-center rounded-full bg-ink-100 px-[6px] text-[12px] leading-[16px] text-ink-700">
          {count}
        </span>
      )}
      {dropdown && (
        <Icon name="keyboard_arrow_down" size={18} className={cn('transition-transform', open && 'rotate-180')} />
      )}
      {removable && (
        <span
          role="button"
          aria-label="Remover filtro"
          className="inline-flex shrink-0 items-center justify-center rounded-full hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
        >
          <Icon name="close" size={16} />
        </span>
      )}
    </button>
  )
}

export interface FilterOption {
  id: string
  label: string
  icon?: string
  count?: number
  disabled?: boolean
}

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: FilterOption[]
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
  mode?: 'multi' | 'single'
  variant?: 'outline' | 'solid' | 'segmented'
  tone?: FilterTone
  size?: 'sm' | 'md' | 'lg'
  scroll?: boolean
}

export function FilterBar({
  options = [],
  value,
  defaultValue,
  onChange,
  mode = 'multi',
  variant = 'outline',
  tone = 'primary',
  size = 'md',
  scroll = false,
  className,
  ...rest
}: FilterBarProps) {
  const isSeg = variant === 'segmented'
  const effMode = isSeg ? 'single' : mode
  const init = defaultValue !== undefined ? defaultValue : effMode === 'single' ? null : []
  const [internal, setInternal] = useState<string | string[] | null>(init)
  const sel = value !== undefined ? value : internal

  const isOn = (id: string) => (effMode === 'single' ? sel === id : Array.isArray(sel) && sel.includes(id))

  const toggle = (id: string) => {
    let next: string | string[] | null
    if (effMode === 'single') {
      next = sel === id ? null : id
    } else {
      const arr = Array.isArray(sel) ? sel : []
      next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    }
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  return (
    <div
      className={cn('flex items-center gap-2', scroll ? 'overflow-x-auto flex-nowrap' : 'flex-wrap', className)}
      role="group"
      {...rest}
    >
      {options.map((opt) => (
        <FilterChip
          key={opt.id}
          label={opt.label}
          icon={opt.icon}
          count={opt.count}
          disabled={opt.disabled}
          selected={isOn(opt.id)}
          variant={isSeg ? 'outline' : variant}
          tone={tone}
          size={size}
          onClick={() => toggle(opt.id)}
        />
      ))}
    </div>
  )
}
```

**Note:** the `accent` tone uses `terciary` tokens (`--color-terciary-base`, `--color-terciary-lightest` — confirmed exact names in `src/styles/globals.css:71-77`, project spells it "terciary" not "tertiary" throughout). Use `bg-terciary-lightest`/`border-terciary-base`/`text-terciary-darker` verbatim — no "tertiary" spelling anywhere in this task's code.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test FilterBar.test.tsx`
Expected: PASS (10 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/FilterBar/FilterBar.stories.tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { FilterBar, FilterChip } from './FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Components/FilterBar',
  component: FilterBar,
  args: {
    options: [
      { id: 'online', label: 'Online', icon: 'videocam', count: 12 },
      { id: 'hoje', label: 'Hoje', count: 4 },
      { id: 'derma', label: 'Dermatologia' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {}

export const Segmented: Story = {
  args: {
    variant: 'segmented',
    defaultValue: 'hoje',
    options: [
      { id: 'hoje', label: 'Hoje' },
      { id: 'semana', label: 'Semana' },
      { id: 'mes', label: 'Mês' },
    ],
  },
}

export const Controlled: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>(['online'])
    return (
      <FilterBar
        value={sel}
        onChange={(v) => setSel(v as string[])}
        options={[
          { id: 'online', label: 'Online', icon: 'videocam', count: 12 },
          { id: 'hoje', label: 'Hoje', count: 4 },
          { id: 'derma', label: 'Dermatologia' },
        ]}
      />
    )
  },
}

export const StandaloneChips: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <FilterChip label="Especialidade" dropdown />
      <FilterChip label="Online" icon="videocam" selected />
      <FilterChip label="Dermatologia" removable onRemove={() => {}} />
    </div>
  ),
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/FilterBar/index.ts
export { FilterBar, FilterChip } from './FilterBar'
export type { FilterBarProps, FilterChipProps, FilterOption, FilterTone } from './FilterBar'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { FilterBar, FilterChip } from './components/FilterBar'
export type { FilterBarProps, FilterChipProps, FilterOption, FilterTone } from './components/FilterBar'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/FilterBar src/index.ts
git commit -m "feat(filterbar): add FilterBar and FilterChip components"
```

---

### Task 5: FileUploader + FileItem

**Files:**
- Create: `src/components/FileUploader/FileUploader.tsx`
- Create: `src/components/FileUploader/FileUploader.stories.tsx`
- Create: `src/components/FileUploader/FileUploader.test.tsx`
- Create: `src/components/FileUploader/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../../components/Icon`; `Button` from `../../components/Button` (`variant="secondary"`, `iconLeft`).
- Produces: `FileItem(props: FileItemProps)`, `FileUploader(props: FileUploaderProps)`, `FileItemProps`, `FileUploaderProps`, `UploadFile = { id?: string | number; name: string; size?: number; progress?: number; done?: boolean; error?: string; thumb?: string }`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/FileUploader/FileUploader.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { FileItem, FileUploader } from './FileUploader'

describe('FileItem', () => {
  it('renders the file name and formatted size', () => {
    render(<FileItem name="exame.pdf" size={248000} />)
    expect(screen.getByText('exame.pdf')).toBeInTheDocument()
    expect(screen.getByText('242 KB')).toBeInTheDocument()
  })

  it('shows "Enviado" when done', () => {
    render(<FileItem name="exame.pdf" size={248000} done />)
    expect(screen.getByText('Enviado')).toBeInTheDocument()
  })

  it('shows the error message when error is set', () => {
    render(<FileItem name="exame.pdf" error="Falha no envio" />)
    expect(screen.getByText('Falha no envio')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<FileItem name="exame.pdf" onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })
})

describe('FileUploader', () => {
  it('renders the dropzone prompt by default', () => {
    render(<FileUploader />)
    expect(screen.getByText('Clique para enviar', { exact: false })).toBeInTheDocument()
  })

  it('renders the compact button when variant is compact', () => {
    render(<FileUploader variant="compact" />)
    expect(screen.getByRole('button', { name: 'Escolher arquivo' })).toBeInTheDocument()
  })

  it('renders the hint text', () => {
    render(<FileUploader hint="PNG, JPG ou PDF · até 10 MB" />)
    expect(screen.getByText('PNG, JPG ou PDF · até 10 MB')).toBeInTheDocument()
  })

  it('renders a file list entry per file', () => {
    render(<FileUploader files={[{ name: 'a.pdf', size: 1000, done: true }]} />)
    expect(screen.getByText('a.pdf')).toBeInTheDocument()
  })

  it('renders the zone-level error message', () => {
    render(<FileUploader error="Arquivo muito grande" />)
    expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<FileUploader files={[{ name: 'a.pdf', size: 1000, done: true }]} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test FileUploader.test.tsx`
Expected: FAIL — `./FileUploader` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/FileUploader/FileUploader.tsx
import { useRef, useState, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../Button'
import { Icon } from '../Icon'

function fmtSize(bytes?: number) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const EXT_ICON: Record<string, string> = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
}
const DEFAULT_ICON = 'draft'

export interface UploadFile {
  id?: string | number
  name: string
  size?: number
  progress?: number
  done?: boolean
  error?: string
  thumb?: string
}

export interface FileItemProps extends UploadFile {
  onRemove?: () => void
}

export function FileItem({ name, size, progress, done, error, thumb, onRemove }: FileItemProps) {
  const ext = (name || '').split('.').pop()?.toLowerCase() ?? ''
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-ink-200 p-3', error && 'border-error-base')}>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-ink-100">
        {thumb ? (
          <img src={thumb} alt="" className="size-full rounded-md object-cover" />
        ) : (
          <Icon name={EXT_ICON[ext] ?? DEFAULT_ICON} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900">{name}</p>
        <p className="flex items-center gap-1 text-[12px] leading-[16px] text-ink-600">
          {error ? (
            <span className="text-error-base">{error}</span>
          ) : done ? (
            <>
              <span>{fmtSize(size)}</span>
              <span className="inline-flex items-center gap-1 text-success-base">
                <Icon name="check_circle" size={14} />
                Enviado
              </span>
            </>
          ) : (
            <span>{fmtSize(size)}</span>
          )}
        </p>
        {progress != null && !done && !error && (
          <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-primary-base" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label="Remover"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center justify-center rounded-full p-1 text-ink-500 hover:bg-ink-100"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  )
}

export interface FileUploaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: 'dropzone' | 'compact'
  accept?: string
  multiple?: boolean
  title?: string
  hint?: string
  files?: UploadFile[]
  onFiles?: (files: FileList) => void
  onRemove?: (file: UploadFile, index: number) => void
  error?: string
}

export function FileUploader({
  variant = 'dropzone',
  accept,
  multiple = false,
  title = 'Arraste um arquivo ou clique para enviar',
  hint = 'PNG, JPG ou PDF · até 10 MB',
  files = [],
  onFiles,
  onRemove,
  error,
  className,
  ...rest
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const open = () => inputRef.current?.click()
  const handle = (list: FileList | null) => {
    if (list && list.length) onFiles?.(list)
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      hidden
      onChange={(e) => handle(e.target.files)}
    />
  )

  return (
    <div className={cn('w-full', className)} {...rest}>
      {variant === 'compact' ? (
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" iconLeft={<Icon name="upload" />} onClick={open}>
            Escolher arquivo
          </Button>
          <span className="text-[13px] leading-[18px] text-ink-500">{hint}</span>
          {input}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              open()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            handle(e.dataTransfer.files)
          }}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-300 p-8 text-center outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            drag && 'border-primary-base bg-primary-lightest',
            error && 'border-error-base',
          )}
        >
          <Icon name="cloud_upload" size={32} className="text-ink-400" />
          <span className="text-[14px] leading-[20px] text-ink-700">
            <b className="font-semibold">Clique para enviar</b> ou arraste aqui
          </span>
          <span className="text-[13px] leading-[18px] text-ink-500">{hint}</span>
          {input}
        </div>
      )}

      {error && (
        <span className="mt-2 flex items-center gap-1 text-[13px] leading-[18px] text-error-base">
          <Icon name="error" size={16} />
          {error}
        </span>
      )}

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((f, i) => (
            <FileItem key={f.id ?? i} {...f} onRemove={onRemove ? () => onRemove(f, i) : undefined} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test FileUploader.test.tsx`
Expected: PASS (10 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/FileUploader/FileUploader.stories.tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '../../docs-types'
import { FileUploader, type UploadFile } from './FileUploader'

const meta: Meta<typeof FileUploader> = {
  title: 'Components/FileUploader',
  component: FileUploader,
}
export default meta
type Story = StoryObj<typeof FileUploader>

export const Default: Story = {}

export const Compact: Story = {
  args: { variant: 'compact', hint: 'Anexe seu documento' },
}

export const WithFiles: Story = {
  args: {
    files: [
      { name: 'exame-sangue.pdf', size: 248000, done: true },
      { name: 'foto-pele.jpg', size: 1200000, progress: 60 },
    ] satisfies UploadFile[],
  },
}

export const WithError: Story = {
  args: { error: 'Arquivo excede o tamanho máximo de 10 MB' },
}

export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadFile[]>([{ name: 'exame-sangue.pdf', size: 248000, done: true }])
    return (
      <FileUploader
        files={files}
        onFiles={(list) => setFiles((prev) => [...prev, ...Array.from(list).map((f) => ({ name: f.name, size: f.size, done: true }))])}
        onRemove={(_, i) => setFiles((prev) => prev.filter((_, x) => x !== i))}
      />
    )
  },
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/FileUploader/index.ts
export { FileItem, FileUploader } from './FileUploader'
export type { FileItemProps, FileUploaderProps, UploadFile } from './FileUploader'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { FileItem, FileUploader } from './components/FileUploader'
export type { FileItemProps, FileUploaderProps, UploadFile } from './components/FileUploader'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/FileUploader src/index.ts
git commit -m "feat(fileuploader): add FileUploader and FileItem components"
```

---

### Task 6: ListItem

**Files:**
- Create: `src/components/ListItem/ListItem.tsx`
- Create: `src/components/ListItem/ListItem.stories.tsx`
- Create: `src/components/ListItem/ListItem.test.tsx`
- Create: `src/components/ListItem/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `Icon` from `../../components/Icon`; `Avatar` and `Badge` only inside stories (not a runtime dependency of `ListItem` itself).
- Produces: `ListItem(props: ListItemProps)`, `ListItemProps`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ListItem/ListItem.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { ListItem } from './ListItem'

describe('ListItem', () => {
  it('renders as a button by default', () => {
    render(<ListItem title="Dra. Ana Lima" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders title and subtitle', () => {
    render(<ListItem title="Dra. Ana Lima" subtitle="Dermatologia · Hoje 14:30" />)
    expect(screen.getByText('Dra. Ana Lima')).toBeInTheDocument()
    expect(screen.getByText('Dermatologia · Hoje 14:30')).toBeInTheDocument()
  })

  it('renders the leading node', () => {
    render(<ListItem leading={<span data-testid="leading" />} title="Dra. Ana Lima" />)
    expect(screen.getByTestId('leading')).toBeInTheDocument()
  })

  it('renders trailing content and trailing icon', () => {
    render(<ListItem title="Dra. Ana Lima" trailing={<span>Confirmada</span>} trailingIcon="chevron_right" />)
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
  })

  it('renders as an anchor when as="a"', () => {
    render(
      <ListItem as="a" href="/patients/1" title="Dra. Ana Lima" />,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/patients/1')
  })

  it('applies the active class', () => {
    render(<ListItem title="Dra. Ana Lima" active />)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-lightest')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<ListItem title="Dra. Ana Lima" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<ListItem title="Dra. Ana Lima" subtitle="Dermatologia" />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test ListItem.test.tsx`
Expected: FAIL — `./ListItem` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/ListItem/ListItem.tsx
import { type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../Icon'

export interface ListItemProps extends HTMLAttributes<HTMLElement> {
  leading?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  trailingIcon?: string
  active?: boolean
  as?: 'button' | 'a' | 'div' | 'li'
  href?: string
}

export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  trailingIcon,
  active = false,
  as = 'button',
  className,
  ...rest
}: ListItemProps) {
  const Component = as as ElementType
  const extraProps = as === 'button' ? { type: 'button' } : {}
  return (
    <Component
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        'hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-1',
        active && 'bg-primary-lightest',
        className,
      )}
      {...extraProps}
      {...rest}
    >
      {leading}
      <span className="min-w-0 flex-1">
        {title && <p className="truncate text-[14px] leading-[20px] font-medium text-ink-900">{title}</p>}
        {subtitle && <p className="truncate text-[13px] leading-[18px] text-ink-500">{subtitle}</p>}
      </span>
      {(trailing || trailingIcon) && (
        <span className="flex shrink-0 items-center gap-2">
          {trailing}
          {trailingIcon && <Icon name={trailingIcon} className="text-ink-400" />}
        </span>
      )}
    </Component>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test ListItem.test.tsx`
Expected: PASS (8 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/ListItem/ListItem.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { ListItem } from './ListItem'

const meta: Meta<typeof ListItem> = {
  title: 'Components/ListItem',
  component: ListItem,
  args: { title: 'Dra. Ana Lima', subtitle: 'Dermatologia · Hoje 14:30' },
}
export default meta
type Story = StoryObj<typeof ListItem>

export const Default: Story = {}

export const WithAvatarAndBadge: Story = {
  args: {
    leading: <Avatar name="Dra. Ana Lima" />,
    trailing: (
      <Badge variant="success" dot>
        Confirmada
      </Badge>
    ),
    trailingIcon: 'chevron_right',
  },
}

export const Active: Story = {
  args: { active: true },
}

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-1 w-[360px]">
      <ListItem
        leading={<Avatar name="Dra. Ana Lima" />}
        title="Dra. Ana Lima"
        subtitle="Dermatologia · Hoje 14:30"
        trailingIcon="chevron_right"
      />
      <ListItem
        leading={<Avatar name="Dr. João Souza" />}
        title="Dr. João Souza"
        subtitle="Cardiologia · Amanhã 09:00"
        active
        trailingIcon="chevron_right"
      />
    </div>
  ),
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/ListItem/index.ts
export { ListItem } from './ListItem'
export type { ListItemProps } from './ListItem'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { ListItem } from './components/ListItem'
export type { ListItemProps } from './components/ListItem'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/ListItem src/index.ts
git commit -m "feat(listitem): add ListItem component"
```

---

### Task 7: Chart (+ Sparkline, LineChart, BarChart, DonutChart)

**Files:**
- Create: `src/components/Chart/Chart.tsx`
- Create: `src/components/Chart/Chart.stories.tsx`
- Create: `src/components/Chart/Chart.test.tsx`
- Create: `src/components/Chart/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Chart(props: ChartProps)`, `Sparkline(props: SparklineProps)`, `LineChart(props: LineChartProps)`, `BarChart(props: BarChartProps)`, `DonutChart(props: DonutChartProps)`, plus their prop types and `BarDatum = { label: string; value: number; color?: string }`, `DonutSegment = { label: string; value: number; color?: string }`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Chart/Chart.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { BarChart, Chart, DonutChart, LineChart, Sparkline } from './Chart'

describe('Sparkline', () => {
  it('renders an svg path for the data', () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 6]} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })
})

describe('LineChart', () => {
  it('renders one dot per data point', () => {
    const { container } = render(<LineChart data={[12, 18, 15, 22]} />)
    expect(container.querySelectorAll('circle').length).toBe(4)
  })

  it('renders x-axis labels when provided', () => {
    render(<LineChart data={[1, 2, 3]} labels={['Seg', 'Ter', 'Qua']} />)
    expect(screen.getByText('Seg')).toBeInTheDocument()
  })
})

describe('BarChart', () => {
  it('renders one bar rect per datum', () => {
    const { container } = render(
      <BarChart data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />,
    )
    expect(container.querySelectorAll('rect').length).toBe(2)
  })

  it('renders each bar label', () => {
    render(<BarChart data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />)
    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('Fev')).toBeInTheDocument()
  })
})

describe('DonutChart', () => {
  it('renders one arc circle per segment plus the background circle', () => {
    const { container } = render(
      <DonutChart segments={[{ label: 'Concluídas', value: 78 }, { label: 'Pendentes', value: 22 }]} />,
    )
    expect(container.querySelectorAll('circle').length).toBe(3)
  })

  it('renders the center value and label', () => {
    render(<DonutChart segments={[{ label: 'A', value: 1 }]} centerValue="78%" centerLabel="Adesão" />)
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('Adesão')).toBeInTheDocument()
  })

  it('renders the legend with percentages', () => {
    render(<DonutChart segments={[{ label: 'Concluídas', value: 78 }, { label: 'Pendentes', value: 22 }]} />)
    expect(screen.getByText('78%')).toBeInTheDocument()
  })
})

describe('Chart', () => {
  it('dispatches to LineChart by default', () => {
    const { container } = render(<Chart data={[1, 2, 3]} />)
    expect(container.querySelectorAll('circle').length).toBe(3)
  })

  it('dispatches to BarChart when type="bar"', () => {
    const { container } = render(<Chart type="bar" data={[{ label: 'Jan', value: 8 }]} />)
    expect(container.querySelectorAll('rect').length).toBe(1)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<LineChart data={[1, 2, 3]} labels={['Seg', 'Ter', 'Qua']} />)
    // @ts-expect-error -- axe() is not typed in the default vitest-axe module
    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test Chart.test.tsx`
Expected: FAIL — `./Chart` module not found.

- [ ] **Step 3: Write the implementation**

```tsx
// src/components/Chart/Chart.tsx
import { useState, type HTMLAttributes, type SpanHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

const PALETTE = [
  'var(--color-primary-base)',
  'var(--color-secondary-base)',
  'var(--color-terciary-base)',
  'var(--color-success-base)',
  'var(--color-warning-base)',
]

function buildPath(data: number[], w: number, h: number, pad: number, min?: number, max?: number) {
  const effMax = max ?? Math.max(...data, 1)
  const effMin = min ?? Math.min(...data, 0)
  const span = effMax - effMin || 1
  const step = (w - pad * 2) / (data.length - 1 || 1)
  return data.map((v, i) => {
    const x = pad + i * step
    const y = h - pad - ((v - effMin) / span) * (h - pad * 2)
    return { x, y }
  })
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / pow
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return step * pow
}

const fmtTick = (v: number) => {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

function YAxis({
  min,
  max,
  rows,
  pad,
  format = fmtTick,
}: {
  min: number
  max: number
  rows: number
  pad: number
  format?: (value: number) => string
}) {
  const ticks = Array.from({ length: rows + 1 }, (_, i) => max - ((max - min) * i) / rows)
  return (
    <div className="flex flex-col justify-between text-[11px] leading-none text-ink-500" style={{ paddingTop: pad, paddingBottom: pad }}>
      {ticks.map((t, i) => (
        <span key={i}>{format(t)}</span>
      ))}
    </div>
  )
}

export interface SparklineProps extends SpanHTMLAttributes<HTMLSpanElement> {
  data: number[]
  width?: number
  height?: number
  color?: string
  area?: boolean
}

export function Sparkline({ data = [], width = 96, height = 28, color = 'var(--color-primary-base)', area = true, className, ...rest }: SparklineProps) {
  const pts = buildPath(data, width, height, 3)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const fill = `${line} L${(width - 3).toFixed(1)} ${height - 3} L3 ${height - 3} Z`
  return (
    <span className={cn('inline-block', className)} {...rest}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {area && <path d={fill} fill={color} opacity="0.14" />}
        <path d={line} fill="none" style={{ stroke: color }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  height?: number
  color?: string
  area?: boolean
  showDots?: boolean
  grid?: boolean
  yAxis?: boolean
  yTickFormat?: (value: number) => string
  tooltip?: boolean
}

export function LineChart({
  data = [],
  labels = [],
  height = 200,
  color = 'var(--color-primary-base)',
  area = true,
  showDots = true,
  grid = true,
  yAxis = true,
  yTickFormat,
  tooltip = true,
  className,
  ...rest
}: LineChartProps) {
  const W = 360
  const H = height
  const pad = 28
  const rows = 4
  const [hover, setHover] = useState<number | null>(null)
  const dMax = Math.max(...data, 1)
  const dMin = Math.min(...data, 0)
  const max = niceMax(dMax)
  const min = dMin < 0 ? -niceMax(-dMin) : 0
  const pts = buildPath(data, W, H, pad, min, max)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const fill = `${line} L${W - pad} ${H - pad} L${pad} ${H - pad} Z`

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltip || data.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const f = (e.clientX - rect.left) / rect.width
    const t = (f - pad / W) / ((W - pad * 2) / W)
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(t * (data.length - 1)))))
  }
  const hp = hover != null ? pts[hover] : null

  return (
    <div className={cn('w-full', className)} {...rest}>
      <div className="flex gap-2">
        {yAxis && <YAxis min={min} max={max} rows={rows} pad={pad} format={yTickFormat} />}
        <div className="relative flex-1" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }}>
            {grid &&
              Array.from({ length: rows + 1 }).map((_, i) => {
                const y = pad + (i * (H - pad * 2)) / rows
                return <line key={i} x1={pad} y1={y} x2={W - pad} y2={y} className="stroke-ink-100" />
              })}
            {area && (
              <>
                <defs>
                  <linearGradient id="sbLineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={color} stopOpacity="0.28" />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={fill} fill="url(#sbLineFill)" />
              </>
            )}
            <path d={line} fill="none" style={{ stroke: color }} strokeWidth="2" />
            {showDots &&
              pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" strokeWidth="2" style={{ stroke: color }} />
              ))}
          </svg>
          {hp && (
            <div
              className="pointer-events-none absolute top-0 rounded-md bg-ink-900 px-2 py-1 text-[11px] text-white"
              style={{ left: `${(hp.x / W) * 100}%`, top: hp.y }}
            >
              <span>{data[hover as number]}</span>
              {labels[hover as number] && <span className="ml-1 opacity-70">{labels[hover as number]}</span>}
            </div>
          )}
        </div>
      </div>
      {labels.length > 0 && (
        <div className="flex justify-between text-[11px] text-ink-500" style={{ paddingLeft: yAxis ? 44 : 0 }}>
          {labels.map((l, i) => (
            <span key={i} className={hover === i ? 'font-medium text-ink-900' : undefined}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export interface BarDatum {
  label: string
  value: number
  color?: string
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: BarDatum[]
  height?: number
  showValues?: boolean
  grid?: boolean
  yAxis?: boolean
  yTickFormat?: (value: number) => string
  tooltip?: boolean
}

export function BarChart({
  data = [],
  height = 200,
  showValues = true,
  grid = true,
  yAxis = true,
  yTickFormat,
  className,
  ...rest
}: BarChartProps) {
  const W = 360
  const H = height
  const pad = 28
  const gap = 12
  const botPad = 36
  const rows = 4
  const max = niceMax(Math.max(...data.map((d) => d.value), 1))
  const plotH = H - pad - botPad
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length
  const colW = bw + gap

  return (
    <div className={cn('w-full', className)} {...rest}>
      <div className="flex gap-2">
        {yAxis && (
          <div className="flex flex-col justify-between text-[11px] leading-none text-ink-500" style={{ paddingTop: pad, paddingBottom: botPad }}>
            {Array.from({ length: rows + 1 }, (_, i) => (
              <span key={i}>{(yTickFormat ?? fmtTick)(max - (max * i) / rows)}</span>
            ))}
          </div>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }}>
          {grid &&
            Array.from({ length: rows + 1 }).map((_, i) => {
              const y = pad + (i * plotH) / rows
              return <line key={i} x1={pad} y1={y} x2={W - pad} y2={y} className="stroke-ink-100" />
            })}
          {data.map((d, i) => {
            const bh = (d.value / max) * plotH
            const x = pad + i * colW
            const y = H - botPad - bh
            return (
              <g key={i}>
                <rect x={x} y={y} width={bw} height={bh} rx="6" style={{ fill: d.color ?? PALETTE[i % PALETTE.length] }} />
                {showValues && (
                  <text x={x + bw / 2} y={y - 6} textAnchor="middle" className="fill-ink-900 text-[11px]">
                    {d.value}
                  </text>
                )}
                <text x={x + bw / 2} y={H - botPad + 18} textAnchor="middle" className="fill-ink-500 text-[11px]">
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export interface DonutSegment {
  label: string
  value: number
  color?: string
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerValue?: React.ReactNode
  centerLabel?: string
  legend?: boolean
}

export function DonutChart({
  segments = [],
  size = 160,
  thickness = 26,
  centerValue,
  centerLabel,
  legend = true,
  className,
  ...rest
}: DonutChartProps) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let acc = 0
  return (
    <div className={cn('flex items-center gap-5 flex-wrap', className)} {...rest}>
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-ink-100" />
          {segments.map((s, i) => {
            const len = (s.value / total) * circ
            const dash = `${len} ${circ - len}`
            const off = -acc
            acc += len
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={thickness}
                style={{ stroke: s.color ?? PALETTE[i % PALETTE.length] }}
                strokeDasharray={dash}
                strokeDashoffset={off}
                strokeLinecap="butt"
              />
            )
          })}
        </svg>
        {(centerValue != null || centerLabel) && (
          <span className="absolute inline-flex flex-col items-center">
            {centerValue != null && (
              <span className="font-semibold text-ink-900" style={{ fontSize: size * 0.22 }}>
                {centerValue}
              </span>
            )}
            {centerLabel && <span className="text-[12px] text-ink-500">{centerLabel}</span>}
          </span>
        )}
      </span>
      {legend && (
        <div className="flex flex-col gap-1.5">
          {segments.map((s, i) => (
            <span key={i} className="flex items-center gap-2 text-[13px] text-ink-700">
              <i
                className="inline-block size-2.5 rounded-full"
                style={{ background: s.color ?? PALETTE[i % PALETTE.length] }}
              />
              {s.label}
              <b className="font-medium">{Math.round((s.value / total) * 100)}%</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export interface ChartProps {
  type?: 'line' | 'bar' | 'donut' | 'sparkline'
  [key: string]: unknown
}

export function Chart({ type = 'line', ...props }: ChartProps) {
  if (type === 'bar') return <BarChart {...(props as BarChartProps)} />
  if (type === 'donut') return <DonutChart {...(props as DonutChartProps)} />
  if (type === 'sparkline') return <Sparkline {...(props as SparklineProps)} />
  return <LineChart {...(props as LineChartProps)} />
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test Chart.test.tsx`
Expected: PASS (12 tests)

- [ ] **Step 5: Write stories**

```tsx
// src/components/Chart/Chart.stories.tsx
import type { Meta, StoryObj } from '../../docs-types'
import { BarChart, Chart, DonutChart, LineChart, Sparkline } from './Chart'

const meta: Meta<typeof Chart> = {
  title: 'Components/Chart',
  component: Chart,
}
export default meta
type Story = StoryObj<typeof Chart>

export const LineChartDefault: Story = {
  render: () => (
    <LineChart data={[12, 18, 15, 22, 19, 26, 24]} labels={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']} />
  ),
}

export const BarChartDefault: Story = {
  render: () => (
    <BarChart
      data={[
        { label: 'Jan', value: 8 },
        { label: 'Fev', value: 14 },
        { label: 'Mar', value: 11, color: 'var(--color-secondary-base)' },
      ]}
    />
  ),
}

export const DonutChartDefault: Story = {
  render: () => (
    <DonutChart
      centerValue="78%"
      centerLabel="Adesão"
      segments={[
        { label: 'Concluídas', value: 78 },
        { label: 'Pendentes', value: 22 },
      ]}
    />
  ),
}

export const SparklineDefault: Story = {
  render: () => <Sparkline data={[3, 5, 4, 8, 6, 9, 7]} />,
}

export const UnifiedEntry: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Chart type="line" data={[12, 18, 15, 22]} />
      <Chart type="bar" data={[{ label: 'Jan', value: 8 }, { label: 'Fev', value: 14 }]} />
      <Chart type="donut" segments={[{ label: 'A', value: 60 }, { label: 'B', value: 40 }]} />
    </div>
  ),
}
```

- [ ] **Step 6: Add index.ts**

```ts
// src/components/Chart/index.ts
export { BarChart, Chart, DonutChart, LineChart, Sparkline } from './Chart'
export type {
  BarChartProps,
  BarDatum,
  ChartProps,
  DonutChartProps,
  DonutSegment,
  LineChartProps,
  SparklineProps,
} from './Chart'
```

- [ ] **Step 7: Add to src/index.ts**

```ts
export { BarChart, Chart, DonutChart, LineChart, Sparkline } from './components/Chart'
export type {
  BarChartProps,
  BarDatum,
  ChartProps,
  DonutChartProps,
  DonutSegment,
  LineChartProps,
  SparklineProps,
} from './components/Chart'
```

- [ ] **Step 8: Verify lint, typecheck, build**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all green.

- [ ] **Step 9: Commit**

```bash
git add src/components/Chart src/index.ts
git commit -m "feat(chart): add Chart, Sparkline, LineChart, BarChart and DonutChart components"
```

---

### Task 8: Changeset

**Files:**
- Create: `.changeset/seven-new-components.md`

- [ ] **Step 1: Write the changeset**

```md
---
"@starbemtech/react-starsystem": minor
---

Add 7 new components: Progress/ProgressCircle, Tag, IconButton, FilterBar/FilterChip, FileUploader/FileItem, ListItem, and Chart (Sparkline/LineChart/BarChart/DonutChart). All built directly against existing design tokens — no hardcoded colors.
```

- [ ] **Step 2: Verify the full suite one more time**

Run: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
Expected: all green, test count = previous 424 + new tests across the 7 tasks.

- [ ] **Step 3: Commit**

```bash
git add .changeset/seven-new-components.md
git commit -m "chore: add changeset for 7 new components"
```
