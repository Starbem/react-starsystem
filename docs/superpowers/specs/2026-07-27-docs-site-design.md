# Doc site próprio (substituição do Storybook)

## Contexto e motivação

Storybook (`^8.6.18`) é hoje o único meio de visualizar componentes, com `addon-a11y` cobrindo acessibilidade e `addon-interactions` cobrindo testes de interação. Build do Storybook está lento e o time quer um site próprio, leve, publicável no GitHub Pages, sem depender do motor Storybook.

## Objetivo

Substituir Storybook por:
1. Um app estático próprio (`docs-site/`) que lê os `.stories.tsx` já existentes e renderiza cada componente com controles de prop simples.
2. Testes de a11y e interação migrados para `vitest` (`.test.tsx`), desacoplados do doc site.
3. Publicação automática no GitHub Pages a cada push em `main`.

## Fora de escopo

- Não inclui build de novos componentes da lib (Textarea, Select, etc. seguem seu próprio fluxo/Jira).
- Não introduz pnpm workspaces — `docs-site/` é uma pasta isolada com seu próprio `vite.config.ts`/`tsconfig.json`, sem virar pacote publicável.
- Não muda o pipeline de publish do pacote npm (`publish.yml`).

## Arquitetura

```
react-starsystem/
├── src/
│   ├── docs-types.ts         # NOVO: Meta<T>/StoryObj<T> leves (substituem @storybook/react)
│   └── components/           # inalterado, exceto import em cada .stories.tsx
├── docs-site/                # NOVO: app Vite+React só para visualização
│   ├── src/
│   │   ├── App.tsx           # nav lateral + lista de componentes/stories
│   │   ├── StoryRenderer.tsx # renderiza 1 story + painel de controles
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
└── .github/workflows/docs.yml # NOVO: build + deploy Pages
```

`docs-site` importa os componentes e `.stories.tsx` diretamente de `../src/components/**`, e reaproveita `../src/docs-types.ts`. Dependência corre só numa direção (`docs-site` → `src`): `src/docs-types.ts` mora do lado da lib porque é o `.stories.tsx` (dentro de `src`) quem importa o tipo primeiro — evita o `tsconfig`/`pnpm typecheck` da lib passar a depender de arquivos dentro de `docs-site/`. `docs-site` não depende do `dist/` nem do build da lib.

## Formato dos stories (migração)

Tipos hoje vêm de `@storybook/react`:

```ts
import type { Meta, StoryObj } from '@storybook/react'
```

Passam a vir de `src/docs-types.ts`, com shape equivalente reduzido:

```ts
// src/docs-types.ts
export type ArgType =
  | { control: 'boolean' }
  | { control: 'select'; options: readonly string[] }
  | { control: 'text' }

export type Meta<T> = {
  title: string
  component: T
  args?: Partial<React.ComponentProps<T>>
  argTypes?: Partial<Record<keyof React.ComponentProps<T>, ArgType>>
}

export type StoryObj<T> = {
  args?: Partial<React.ComponentProps<T>>
}
```

Cada `<Component>.stories.tsx` existente troca só a linha de import (`@storybook/react` → `../../docs-types` — caminho relativo de `src/components/<Component>/` até `src/docs-types.ts`). Estrutura de `meta`/`export default`/named exports não muda. Arquivos afetados: `Button`, `Checkbox`, `Input`, `Radio`, `Select`, `Textarea`, `Toggle`, `TokenShowcase`.

`tags: ['autodocs']` some (sem sentido fora do Storybook) — remover das stories durante a migração.

## Carregamento e renderização

`App.tsx` usa `import.meta.glob('../../src/components/**/*.stories.tsx', { eager: true })` para descobrir todos os módulos de story em build time. Para cada módulo:
- `title` do `default export` vira o item de navegação (agrupado por `/` se houver, ex. `Components/Button` → grupo "Components", item "Button").
- Cada named export (`Primary`, `Secondary`, ...) vira uma story renderizada dentro da página do componente.

`StoryRenderer` recebe `meta` + `story.args`, mantém estado local dos args (inicializado com `{ ...meta.args, ...story.args }`), renderiza `<meta.component {...args} />` e, ao lado, um painel de controles gerado a partir de `meta.argTypes`:
- `control: 'boolean'` → checkbox
- `control: 'select'` → `<select>` com `options`
- `control: 'text'` → `<input type="text">`

Alterar um controle atualiza o estado local e re-renderiza só aquela story (sem afetar as demais).

Navegação: single-page com sidebar fixa listando todos os componentes (sem react-router, por decisão do design).

## A11y e testes de interação (desacoplado)

Cada `.test.tsx` ganha (quando ainda não tiver equivalente):
- Um teste de a11y via `vitest-axe`:
  ```ts
  import { axe } from 'vitest-axe'
  import 'vitest-axe/extend-expect'

  it('has no a11y violations', async () => {
    const { container } = render(<Component />)
    expect(await axe(container)).toHaveNoViolations()
  })
  ```
- Testes de interação (clique, navegação por teclado, roving tabindex) continuam com `@testing-library/react` + `user-event`, já presentes na maioria dos `.test.tsx` — formaliza-se como a substituição direta do `addon-interactions`, sem mudança de padrão.

Isso roda em `pnpm test` / `ci.yml`, nunca no build do `docs-site`.

## Deploy (GitHub Pages)

Novo `.github/workflows/docs.yml`:

```yaml
name: Docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs-site/dist
      - uses: actions/deploy-pages@v4
```

Pré-requisito manual (fora do escopo de código): habilitar Pages no repo — Settings → Pages → Source: GitHub Actions. Alguém com admin do repo faz uma vez antes do primeiro deploy funcionar.

## Scripts (`package.json`)

Remove:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

Adiciona:
```json
"docs:dev": "vite --config docs-site/vite.config.ts",
"docs:build": "vite build --config docs-site/vite.config.ts"
```

Remove devDependencies: `@storybook/addon-a11y`, `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/react`, `@storybook/react-vite`, `eslint-plugin-storybook`, `storybook`.

Adiciona devDependencies: `vitest-axe`.

Remove `.storybook/` (diretório inteiro).

## Impacto no CI existente

`ci.yml` roda `pnpm lint && pnpm typecheck && pnpm build && pnpm test` — nenhum desses comandos toca `docs-site/`, então nada muda ali. `docs-site` tem seu próprio `tsconfig.json`, fora do `tsconfig.json` da lib, para não afetar `pnpm typecheck` nem o `vite-plugin-dts` do build da lib.

## Atualização do CLAUDE.md

Seção "Commands": troca `pnpm storybook` / `pnpm build-storybook` por `pnpm docs:dev` / `pnpm docs:build`.

Seção "Adding a Component", item "Stories": troca referência a "Storybook Meta + Story format" e `tags: ['autodocs']` pela convenção nova (import de `docs-site/types`, sem tags).

## Testes do próprio design

- `docs-site` builda sem erro (`pnpm docs:build`) e gera `docs-site/dist/index.html` navegável localmente.
- Todas as stories migradas renderizam sem erro no doc site (checagem visual manual, não automatizada — doc site não tem suite de teste própria).
- `pnpm test` cobre a11y (novo teste por componente) e segue verde.
- Workflow `docs.yml` roda em push de teste numa branch e publica com sucesso (validado após merge, já que Pages só dispara em `main`).
