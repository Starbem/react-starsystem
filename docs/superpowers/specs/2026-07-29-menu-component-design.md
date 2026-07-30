# Componente Menu — Design

**Goal:** implementar `Menu`, navegação responsiva única (sidebar em telas largas, bottom tab bar em estreitas, mais variantes rail/drawer), resolvendo a divergência arquitetural identificada entre a referência de design (`~/Downloads/Starbem Design System/components/navigation/Menu.jsx` — um componente polimórfico) e o estado atual do `react-starsystem` (`Sidebar`+`NavItem`+`TopBar`, três componentes fixos e não-responsivos).

**Architecture:** um componente novo `src/components/Menu/Menu.tsx`, aditivo — não altera `Sidebar`, `NavItem` ou `TopBar` existentes. Render de item é próprio (não reusa `NavItem`, que carrega features não aplicáveis aqui — submenu aninhado, tooltip de colapso). Reusa `Icon` e `Avatar` já existentes no projeto.

**Tech Stack:** React + TypeScript + Tailwind v4 (`@container` nativo, sem plugin — confirmado `tailwindcss@4.3.2` em `package.json`).

## Props

```ts
export interface MenuItem {
  id: string
  label: string
  icon: string          // Material Symbols ligature name, via <Icon name={icon} />
  badge?: number | string
  section?: string       // agrupa itens sob um label (sidebar/drawer only)
}

export interface MenuUser {
  name: string
  sub?: string
  avatarSrc?: string
}

export interface MenuProps {
  items: MenuItem[]
  value?: string
  onChange?: (id: string) => void
  present?: 'auto' | 'sidebar' | 'rail' | 'bottom' | 'drawer'  // default 'auto'
  brand?: boolean | ReactNode   // default true → wordmark de texto "starbem"; false omite; ReactNode customiza
  user?: MenuUser
  footerItems?: MenuItem[]
  title?: string   // título do drawer quando nenhum item está ativo, default "Menu"
}
```

**Nota sobre `brand`:** a referência usa `<img src="../../assets/logo/starbem-star.svg">`, mas esse asset não existe neste repo. `brand` vira `boolean | ReactNode`: `true` (default) renderiza um wordmark de texto simples (`<span>starbem</span>`, estilizado com token de cor da marca), `false` omite completamente, e um `ReactNode` customiza (consumidor passa seu próprio `<img>`/logo).

## Modos (`present`)

- **`sidebar`** — nav vertical completa: brand no topo (se `present !== 'bottom'` e `brand`), itens agrupados por `section` (label acima do grupo, só quando `section` existe), rodapé com `footerItems` + `user` (via `Avatar` `size="sm"`).
- **`rail`** — mesma estrutura do sidebar, colapsada: sem `label`/`section`/brand — só ícones, largura fixa menor (`w-[72px]`, mesmo valor já usado pelo `Sidebar` colapsado, para consistência dimensional).
- **`bottom`** — barra fixa inferior, cada item com `flex-1` (largura igual), sem seções/brand/rodapé — só ícone + label pequeno abaixo (padrão de tab bar mobile).
- **`drawer`** — top bar fixa (altura igual ao `TopBar` existente, `h-16`, pra consistência visual caso usados juntos) com botão hamburger (`Icon name="menu"`) + título (item ativo ou `title` prop) → abre painel lateral deslizante com o mesmo conteúdo do `sidebar`, sobre um scrim (`bg-black/40`) que fecha ao clicar fora; botão de fechar (`Icon name="close"`) no topo do painel.
- **`auto`** (default) — alterna `sidebar` ↔ `bottom` via `@container` do Tailwind v4: o elemento raiz do `Menu` recebe `@container` (registra query container), e o layout interno usa a variante `@[640px]:` para aplicar o modo sidebar a partir de 640px de largura do container pai; abaixo disso, renderiza bottom. Não inclui `rail`/`drawer` no `auto` — apenas explícitos via `present`, igual à referência.

## Comportamento

- Controlado via `value`/`onChange` (sem estado interno de seleção — diferente do `open` do drawer, que é estado interno próprio do `Menu`).
- `aria-current="page"` no item ativo, `<nav aria-label="Navegação">` em todos os modos exceto quando o `drawer` está fechado (nesse caso o `<nav>` interno tem `aria-hidden` quando fechado — igual à referência).
- Selecionar um item no modo `drawer` fecha o painel automaticamente (`select()` chama `onChange` e depois `setOpen(false)`).
- Hamburger: `aria-label="Abrir menu"`, `aria-expanded={open}`. Botão fechar: `aria-label="Fechar menu"`. Scrim: `aria-hidden="true"`, clicável, fecha o painel.

## Testes

vitest + vitest-axe por modo:
- `sidebar`: renderiza seções agrupadas, brand, footer+user.
- `rail`: sem labels/seções visíveis (só ícone).
- `bottom`: distribui itens com largura igual, sem footer/brand.
- `drawer`: fechado por padrão (`aria-hidden` no nav), abre ao clicar hamburger, fecha ao selecionar item ou clicar no scrim.
- a11y check em `sidebar` e `drawer` (aberto).
- `auto`: não testável de forma confiável via jsdom (não executa layout real de container query) — cobrir apenas que a classe/estrutura de `@container` está presente no elemento raiz, sem asserir o breakpoint visual (fica pra validação manual via `pnpm docs:dev`).

## Docs-site

Nenhuma ação manual — `.stories.tsx` descoberto via glob, conforme convenção do projeto.

## Versionamento

Changeset novo, bump `minor` (API nova aditiva).

## Riscos

- `@container` é suportado nativamente pelo Tailwind v4.3.2 instalado, mas não há precedente de uso no projeto (nenhum componente existente usa container queries) — primeira vez que a técnica entra na lib; documentar como novo padrão se funcionar bem.
- `brand` como `boolean | ReactNode` é uma adaptação da referência (que hardcoda um asset de logo inexistente neste repo) — decisão registrada aqui para não ser confundida com desvio do implementador.
- `auto` não é testável em jsdom (sem layout real) — risco de regressão silenciosa no breakpoint só seria pego em validação visual manual, não pela suíte automatizada.
