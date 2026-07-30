# 7 Componentes Novos (Progress, Tag, IconButton, FilterBar, FileUploader, ListItem, Chart) — Design

**Goal:** implementar os 7 componentes que faltam em `react-starsystem` (listados como pendentes desde sessões anteriores), usando `~/Downloads/Starbem Design System/components/**` como fonte de verdade de design/API — não o Figma (lib oficial Figma não tem match confiável pra 4 destes 7).

**Architecture:** portar cada componente de referência (`.jsx` + `.d.ts` + `.prompt.md`) 1:1 para o padrão do projeto: função React + TypeScript, `cn()` para merge de classe, Tailwind utilitário usando os tokens já existentes em `src/styles/globals.css` (nenhum hex novo, nenhum token novo). Sem lib nova (drag-and-drop e SVG charts são nativos na própria referência).

**Tech Stack:** React + TypeScript + Tailwind v4, igual ao resto do projeto. `Icon` (já existente, `src/components/Icon`) reusado em todos que precisam de ícone.

## Fonte de referência

`/Users/juliosousa/Downloads/Starbem Design System/components/`:
- `feedback/Progress.{jsx,d.ts,prompt.md}`
- `feedback/Tag.{jsx,d.ts,prompt.md}`
- `forms/IconButton.{jsx,d.ts,prompt.md}`
- `forms/FilterBar.{jsx,d.ts,prompt.md}`
- `forms/FileUploader.{jsx,d.ts,prompt.md}`
- `display/ListItem.{jsx,d.ts,prompt.md}`
- `charts/Chart.{jsx,d.ts,prompt.md}`

## Escopo de arquivos (novos)

```
src/components/Progress/{Progress.tsx,Progress.stories.tsx,Progress.test.tsx,index.ts}
src/components/Tag/{Tag.tsx,Tag.stories.tsx,Tag.test.tsx,index.ts}
src/components/IconButton/{IconButton.tsx,IconButton.stories.tsx,IconButton.test.tsx,index.ts}
src/components/FilterBar/{FilterBar.tsx,FilterBar.stories.tsx,FilterBar.test.tsx,index.ts}
src/components/FileUploader/{FileUploader.tsx,FileUploader.stories.tsx,FileUploader.test.tsx,index.ts}
src/components/ListItem/{ListItem.tsx,ListItem.stories.tsx,ListItem.test.tsx,index.ts}
src/components/Chart/{Chart.tsx,Chart.stories.tsx,Chart.test.tsx,index.ts}
```

Modificado: `src/index.ts` (adiciona os 7 barrel exports).

## Componente 1 — Progress

Dois exports no mesmo arquivo: `Progress` (barra linear) e `ProgressCircle` (anel SVG).

- `Progress`: props `value`, `max=100`, `label`, `showValue`, `tone` (`primary`|`success`|`warning`|`error`), `size` (`sm`|`md`|`lg`), `indeterminate`. `role="progressbar"` com `aria-valuenow`/`aria-valuemax` (omite `aria-valuenow` se `indeterminate`).
- `ProgressCircle`: props `value`, `max=100`, `size=56` (diâmetro px), `thickness=6`, `tone`, `showValue=true`, `indeterminate`, `children` (conteúdo central customizado, sobrepõe `%`).
- Tones mapeiam pra `bg-{tone}-base`/`stroke-{tone}-base`: `primary`→`primary-base`, `success`→`success-base`, `warning`→`warning-base`, `error`→`error-base`. Track de fundo: `bg-ink-100` (linear) / `stroke-ink-100` (ring).
- `indeterminate`: barra linear ganha animação de slide (`animate-pulse` não serve — usar keyframe customizado via classe utilitária existente no projeto se houver, senão `@keyframes` local em `globals.css` sob comentário "usado por Progress/ProgressCircle indeterminate", nome `sb-progress-slide`); ring ganha `animate-spin`.

## Componente 2 — Tag

Chip removível simples, sem variantes de tom (sempre neutro — distinto do `Badge`, que já cobre variantes coloridas de status).

- Props: `children`, `onRemove?` (renderiza botão × com `Icon name="close"` e `aria-label="Remover"` quando presente).
- Classes: `bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-300 rounded-full`, mesmo padrão de pill do `Badge`.

## Componente 3 — IconButton

Botão só-ícone, componente próprio (não deriva de `Button` — taxonomia de variant diferente).

- Props: `icon` (nome do Material Symbol), `variant` (`ghost` default | `solid` | `outline`), `size` (`sm`|`md`|`lg`), `pill`, `fill` (glifo preenchido), `label` (`aria-label` + `title`).
- Variant classes: `ghost` → `bg-transparent hover:bg-ink-100 text-ink-600`; `solid` → `bg-secondary-base text-white hover:bg-secondary-dark` (roxo, igual `Button` variant `primary` do Figma antigo mapeava secondary); `outline` → `bg-neutral-25 border border-neutral-300 text-neutral-800`.
- `<Icon name={icon} fill={fill} />` interno.

## Componente 4 — FilterBar

Dois exports: `FilterChip` (chip solto) e `FilterBar` (grupo com estado controlado/não-controlado).

- `FilterChip`: props `label`, `icon?`, `count?`, `selected`, `variant` (`outline` default|`solid`), `tone` (`primary`|`success`|`accent`), `size`, `dropdown`+`open` (chevron pra trigger de menu), `removable`+`onRemove`, `disabled`. `aria-pressed={selected}`.
- `FilterBar`: props `options: {id,label,icon?,count?,disabled?}[]`, `value`/`defaultValue`/`onChange` (controlado se `value` presente), `mode` (`multi` default|`single`), `variant` (`outline`|`solid`|`segmented` — segmented força `mode="single"` e conecta os chips visualmente), `tone`, `size`, `scroll` (scroll horizontal em vez de wrap). `role="group"`.
- Tone `accent` mapeia pro token `accent`/`terciary` já existente em `globals.css` (`--color-accent`/`--terciary-base`), não confundir com o `accent` do `Badge` (que usa `primary-lightest` — decisão já tomada em sessão anterior pro Badge; aqui é componente novo, livre pra usar o token `terciary` correto).

## Componente 5 — FileUploader

Dois exports: `FileItem` (linha da lista) e `FileUploader` (dropzone/compact + lista).

- `FileItem`: props `name`, `size?` (bytes, formatado via helper local `fmtSize`), `progress?`, `done?`, `error?`, `thumb?`, `onRemove?`. Ícone por extensão (`pdf`→`picture_as_pdf`, `doc`/`docx`→`description`, `jpg`/`jpeg`/`png`→`image`, default→`draft`).
- `FileUploader`: props `variant` (`dropzone` default|`compact`), `accept`, `multiple`, `title`, `hint`, `files: UploadFile[]`, `onFiles(FileList)`, `onRemove(file, index)`, `error?`. Drag state interno (`onDragOver`/`onDragLeave`/`onDrop`), `<input type="file" hidden>` com `ref` + click programático. Variant `compact` renderiza `<Button variant="secondary" size="md" iconLeft={<Icon name="upload"/>}>Escolher arquivo</Button>` — reusa `Button` em vez de duplicar estilo (diferente da referência, que tem `sb-btn` próprio).
- Acessibilidade: dropzone com `role="button"` `tabIndex={0}` e handler de teclado (`Enter`/`Space`), igual referência.

## Componente 6 — ListItem

Row polimórfica.

- Props: `leading?`, `title?`, `subtitle?`, `trailing?`, `trailingIcon?`, `active`, `as` (`button`|`a`|`div`|`li`, default `button`) — mesmo padrão polimórfico já usado no `Button` (prop `as`).
- Classes: `active` → `bg-primary-lightest`; hover/focus states padrão dos componentes clicáveis existentes.

## Componente 7 — Chart

Uma pasta, um arquivo, 5 exports: `Chart` (dispatcher por `type`), `Sparkline`, `LineChart`, `BarChart`, `DonutChart`. SVG puro, sem lib de charting.

- `Chart`: prop `type` (`line` default|`bar`|`donut`|`sparkline`) + spread do resto pro componente escolhido.
- `Sparkline`: `data: number[]`, `width=96`, `height=28`, `color`, `area=true`. Inline trend, sem eixo.
- `LineChart`: `data: number[]`, `labels?`, `height=200`, `color`, `area`, `showDots`, `grid`, `yAxis`, `yTickFormat?`, `tooltip` (hover revela valor). Escala de eixo Y arredondada via helper `niceMax`.
- `BarChart`: `data: {label,value,color?}[]`, mesmas props de eixo/grid/tooltip do LineChart.
- `DonutChart`: `segments: {label,value,color?}[]`, `size=160`, `thickness=26`, `centerValue?`, `centerLabel?`, `legend=true`.
- Paleta default por série/segmento (quando sem `color` custom): `var(--color-primary-base)`, `var(--color-secondary-base)`, `var(--color-terciary-base)`, `var(--color-success-base)`, `var(--color-warning-base)` — nomes exatos confirmados em `globals.css:53,62,71,110,118,126`. Usados via `style={{ stroke: color }}`/`style={{ fill: color }}`, nunca classe Tailwind (atributo SVG `stroke`/`fill` exige valor CSS real, não nome de classe).
- Grid/eixo: `stroke`/`color` via `var(--color-ink-100)` etc, mesma técnica.

## Testes

Cada componente: vitest (render, props, interação) + `vitest-axe` (`axe(container)` + `toHaveNoViolations()`), igual aos 33 componentes existentes. `LineChart`/`BarChart`/`DonutChart`: testar que SVG renderiza com número certo de elementos (`circle`/`rect`/`path`) pros dados dados, sem snapshot de pixel.

## Docs-site

Nenhuma ação manual — `docs-site/` descobre `.stories.tsx` via glob no build, conforme `CLAUDE.md` do projeto.

## Versionamento

Changeset novo, bump `minor` (API pública nova, aditiva — sem breaking change nos 33 componentes existentes).

## Riscos

- `FilterBar` tone `accent` usa token `terciary` (não `primary-lightest` como o `Badge` faz pro seu próprio `accent`) — nomenclatura de tone comparável mas mapeamento de cor diferente entre os dois componentes; documentado aqui pra não confundir revisor.
- Chart SVG não é responsivo por `viewBox` sozinho pra largura — `LineChart`/`BarChart` usam `width` fixo (`360`) no viewBox com `preserveAspectRatio="none"` e `height` customizável; funciona bem em containers com `width: 100%` (SVG escala), mas não foi testado em containers muito estreitos (<200px) — fora de escopo validar breakpoints extremos nesta primeira versão.
- `FileUploader` compact variant reusa `Button` — pequena divergência da referência (que tem `sb-btn` próprio); decisão deliberada pra não duplicar estilo de botão já tokenizado.
