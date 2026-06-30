# Conventions

## Code Style

- **No comments** unless the WHY is non-obvious. The code should be self-explanatory.
- **Named exports only** — no default exports anywhere in the library.
- **`cn()` for all className merging** — never concatenate strings or use conditional template literals directly on `className`.
- **No `any` types** — all parameters and return values have explicit TypeScript types.

## Component Structure

Each component exports its implementation and its Props type together:

```ts
// Button.tsx
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        { 'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary' },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

The component's `index.ts` re-exports both:

```ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

## Formatter (Prettier)

Config in `.prettierrc`:
- `semi: false`
- `singleQuote: true`
- `trailingComma: 'all'`
- `printWidth: 100`
- `tabWidth: 2`

## Linter (ESLint)

ESLint 9 flat config in `eslint.config.js`. Runs against `src/` only (`eslint src`). `eslint-config-prettier` must be the last entry in `tseslint.config()` to override all formatting rules from upstream plugins.

## Storybook Stories

Stories use `Meta` + `StoryObj` format with the `autodocs` tag:

```ts
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
}
```

- `title` follows the pattern `'Components/<ComponentName>'`
- Each variant gets its own named Story export
- Composite renders (multiple variants together) use the `render` property

## Tests

Tests use `describe` + `it` blocks with `@testing-library/react`:

```ts
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Test</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

- Import vitest's `describe`, `expect`, `it` explicitly (even though `globals: true` is set — for clarity)
- Use role-based queries (`getByRole`) over test-id queries wherever possible
- Test rendering, prop behavior, and accessibility states (disabled, aria-*)

## Barrel Export

`src/index.ts` is the library's public API. Every public component and type must be explicitly re-exported here:

```ts
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'
```

Never export internals (utilities, helpers) unless they are genuinely part of the public API.

## Tailwind Classes

- All Tailwind classes applied via `cn()` from `src/utils/cn.ts`
- Class objects `{ 'class': condition }` preferred over ternaries for readability
- Responsive and state variants go in the same `cn()` call as base classes
- No inline `style={}` props — all styling through Tailwind classes

## Versioning

Uses Changesets (`@changesets/cli`). Do not manually bump `version` in `package.json` — Changesets handles this on release. The `version` field stays at `0.0.0` on feature branches.

## Before Committing

All three must pass:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

Tests are also expected to pass:

```bash
pnpm test
```
