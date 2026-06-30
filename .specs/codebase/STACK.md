# Tech Stack

## Runtime

| Role | Package | Version |
|---|---|---|
| UI framework | react | ^19.2.7 |
| UI framework | react-dom | ^19.2.7 |
| Class merging | clsx | ^2.1.1 |
| Tailwind merge | tailwind-merge | ^3.6.0 |

## Build

| Role | Package | Version |
|---|---|---|
| Bundler | vite | ^8.1.1 (Rolldown) |
| Language | typescript | ^6.0.3 |
| CSS engine | @tailwindcss/vite | ^4.3.2 |
| CSS engine | tailwindcss | ^4.3.2 |
| Type declarations | vite-plugin-dts | ^5.0.3 |
| JSX transform | @vitejs/plugin-react | ^6.0.3 |

## Testing

| Role | Package | Version |
|---|---|---|
| Test runner | vitest | ^2.0.0 |
| DOM environment | jsdom | ^29.1.1 |
| Component testing | @testing-library/react | ^16.0.0 |
| Jest matchers | @testing-library/jest-dom | ^6.0.0 |
| Coverage | @vitest/coverage-v8 | ^2.0.0 |

## Storybook

| Role | Package | Version |
|---|---|---|
| Storybook core | storybook | ^8.6.18 |
| React integration | @storybook/react | ^8.6.18 |
| Vite integration | @storybook/react-vite | ^8.6.18 |
| Accessibility addon | @storybook/addon-a11y | ^8.6.18 |
| Essentials | @storybook/addon-essentials | ^8.6.14 |
| Interactions | @storybook/addon-interactions | ^8.6.14 |

## Code Quality

| Role | Package | Version |
|---|---|---|
| Linter | eslint | ^10.6.0 |
| ESLint JS base | @eslint/js | ^10.0.1 |
| TypeScript ESLint | typescript-eslint | ^8.62.1 |
| React hooks lint | eslint-plugin-react-hooks | ^7.1.1 |
| React refresh lint | eslint-plugin-react-refresh | ^0.5.3 |
| Storybook lint | eslint-plugin-storybook | ^10.4.6 |
| Prettier compat | eslint-config-prettier | ^10.1.8 |
| Formatter | prettier | ^3.9.4 |

## Publishing

| Role | Package | Version |
|---|---|---|
| Versioning | @changesets/cli | ^2.31.0 |

## Types

| Role | Package | Version |
|---|---|---|
| React types | @types/react | ^19.2.17 |
| React DOM types | @types/react-dom | ^19.2.3 |
| jsdom types | @types/jsdom | ^28.0.3 |

## Package Manager

- **pnpm** (required — never use npm or yarn)

## Peer Dependencies

- react: >=18
- react-dom: >=18

## Node Output

- `dist/index.js` — ESM bundle
- `dist/index.d.ts` — TypeScript declarations
- `dist/style.css` — compiled Tailwind stylesheet
