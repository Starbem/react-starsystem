# Contributing to @starbemtech/react-starsystem

Thanks for considering a contribution. This library is maintained by Starbem and follows the conventions below.

## Development setup

```bash
pnpm install          # install dependencies
pnpm build             # compile library → dist/
pnpm docs:dev          # start the component docs site (localhost:5173)
pnpm test              # run the test suite
pnpm typecheck          # tsc --noEmit
pnpm lint               # ESLint
```

Before opening a PR, all of these must pass locally:

```bash
pnpm lint && pnpm typecheck && pnpm build && pnpm test
```

## Adding or changing a component

1. Create `src/components/<ComponentName>/` with `<ComponentName>.tsx`, `<ComponentName>.stories.tsx`, `<ComponentName>.test.tsx`, and `index.ts`.
2. Export the component (and its prop types) from `src/index.ts`.
3. Every component must have a `vitest-axe` test asserting zero WCAG 2.1 AA violations, alongside behavior tests using `@testing-library/react`.
4. Preview it locally via `pnpm docs:dev` — the docs site auto-discovers any `.stories.tsx` file, no manual registration needed.

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets). Every PR that changes published behavior needs one:

```bash
pnpm changeset
```

Pick the appropriate bump (patch/minor/major), write a clear summary of the change, and commit the generated file under `.changeset/`. Maintainers run `pnpm changeset version` to consume pending changesets into a release; publishing happens automatically in CI when a `v*` tag is pushed.

## Pull requests

- Keep PRs focused — one component or fix per PR where practical.
- Follow the existing code style (TypeScript strict, no `any`, Tailwind CSS v4 utility classes, `cn()` for conditional class merging).
- Include tests for new behavior; don't rely on manual/visual verification alone.

## Reporting bugs or requesting features

Open a [GitHub issue](https://github.com/Starbem/react-starsystem/issues) with a clear description, reproduction steps (for bugs), and — for UI issues — a screenshot or recording if possible.

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.
