# Redesign visual do docs-site + Home page

## Contexto e motivação

O docs-site (bootstrap em [[2026-07-27-docs-site-design.md]]) hoje é funcional mas puramente utilitário: `App.tsx` renderiza tudo com `style={{...}}` inline, sem marca, sem página inicial — abre direto na lista de componentes com o primeiro item já selecionado. Objetivo: dar uma cara elegante e com identidade Starbem, com uma home explicativa e um sidebar com a logo, sem alterar a arquitetura de carregamento de stories (`loadStories.ts`, `import.meta.glob`) nem o `StoryRenderer` (controles de prop), que seguem como estão.

## Fora de escopo

- Não muda `loadStories.ts` (descoberta de stories) nem `StoryRenderer.tsx` (painel de controles) — só o wrapper visual em volta.
- Não introduz react-router nem URLs deep-linkable por componente — navegação continua via estado em memória (decisão já tomada no spec de bootstrap, mantida aqui).
- Não publica o pacote npm nem mexe no deploy do GitHub Pages (ID-3198/ID-3199 são tickets separados).
- Não reestiliza o `StoryRenderer` (painel de controles de prop) além do necessário pra caber no novo layout — fica com a aparência utilitária atual.

## Assets de marca

Nenhum asset de logo existia no repo `react-starsystem`. Localizados em outros projetos Starbem (mesmo workspace, cores confirmadas batendo com os tokens já usados na lib — `#FF5100` é o mesmo laranja usado em focus rings de `Tooltip`/`Modal`/etc):

- **Logo completa** (ícone + wordmark, 92×56): `frontend/star-portal/public/login/logos_starbem.svg`
- **Ícone isolado** (estrela, 33×32): `frontend/star-portal/public/dashboard/logo-star.svg`

Ambos copiados para `docs-site/public/brand/` (pasta nova):
- `docs-site/public/brand/starbem-logo.svg` (completa)
- `docs-site/public/brand/starbem-mark.svg` (ícone)

Vite serve `docs-site/public/**` como raiz estática (`/brand/starbem-logo.svg` em runtime); `vite.config.ts` já usa `base: './'`, então as referências no código usam caminho relativo `./brand/starbem-logo.svg` para funcionar tanto em dev quanto no build publicado no GitHub Pages (sub-path).

## Arquitetura

```
docs-site/src/
├── App.tsx          # MODIFICADO: estado `view: 'home' | 'docs'`, roteia entre Home e DocsLayout
├── Home.tsx          # NOVO: landing page (hero + destaques)
├── DocsLayout.tsx     # NOVO: TopBar + sidebar + área de conteúdo (extraído do App.tsx atual)
├── StoryRenderer.tsx  # inalterado
├── loadStories.ts     # inalterado
└── main.tsx           # inalterado
```

`App.tsx` fica fino — só decide qual tela mostrar:

```tsx
export function App() {
  const [view, setView] = useState<'home' | 'docs'>('home')
  return view === 'home'
    ? <Home onGetStarted={() => setView('docs')} />
    : <DocsLayout onBackToHome={() => setView('home')} />
}
```

## Home (`Home.tsx`)

Tela cheia, sem sidebar. Composição, de cima pra baixo:

1. **Hero**: logo completa (`starbem-logo.svg`, ~180px de largura) centralizada, título "Star System", subtítulo curto (1-2 frases: design system da Starbem, componentes React acessíveis e prontos pra produção), botão **"Getting Started"** (`Button` do próprio design system, `size="lg"`) que chama `onGetStarted`.
2. **Grid de destaques**: 4 `Card` (`variant="elevated"`), lado a lado em desktop (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]`), cada um com ícone simples inline (SVG, mesmo padrão usado em `Tooltip.stories.tsx`/`EmptyState.stories.tsx`), título curto e descrição de 1 frase:
   - "Baseado em Radix UI" — primitivas acessíveis por baixo dos panos.
   - "Acessível (WCAG 2.1 AA)" — testado com `vitest-axe` em cada componente.
   - "Tailwind v4" — estilização via tokens do design system.
   - "TypeScript strict" — todo componente com props tipadas, sem `any`.

Sem footer, sem seção de stack/links técnicos (decidido fora de escopo nesta iteração — pode virar ticket próprio depois).

## DocsLayout (`DocsLayout.tsx`)

Extrai o conteúdo atual de `App.tsx` (nav + main) pra este arquivo, com dois ajustes:

1. **TopBar** (componente `TopBar` já existente na lib, `bordered`): slot `start` com o ícone isolado (`starbem-mark.svg`, 28px) dentro de um `<button onClick={onBackToHome}>` (sem estilo de botão visível, só cursor pointer — leva de volta pra Home), slot `center` com o texto "Star System".
2. **Sidebar**: mantém a estrutura de grupos + botões de `App.tsx` atual (não usa o componente `Sidebar/NavItem` da lib — ver seção "Decisão: por que não reaproveitar Sidebar/NavItem" abaixo), mas com reskin visual:
   - Largura fixa 240px, fundo branco, borda direita `#EAECF0` (mesmo tom usado em `TopBar`/`Card`).
   - Título de grupo: uppercase, `12px`, `#667085`, mesmo estilo já usado hoje (mantido).
   - Item ativo: fundo `#FFF1EB` + texto `#FF5100` (mesmo padrão de estado ativo usado em `NavItem`/`Tabs`), em vez do cinza neutro atual.
   - Item hover: fundo `#F2F4F7` (mesmo tom usado em `DropdownMenu`/`Card` clicável).

Área de conteúdo (`main`) mantém `StoryRenderer` como está — sem mudança.

### Decisão: por que não reaproveitar `Sidebar`/`NavItem` da lib

O componente `Sidebar` (ID-3190) foi desenhado pra nav de app-shell: itens com `href`, 1 nível de submenu colapsável, modo `collapsed` com tooltip. O índice do docs-site é uma lista alfabética agrupada por categoria (grupo = `title.split('/')[0]`, ex. "Components"), sem links reais, sem necessidade de collapse/submenu. Forçar o componente aqui significa adaptar sua API pra um caso que ele não cobre bem — o reskin do markup atual (que já existe e funciona) é mais direto e não introduz acoplamento artificial. Confidence: stated (decisão de design, não limitação técnica do componente).

## Testes do próprio design

- `pnpm docs:dev` sobe local, Home renderiza sem erro, botão Getting Started troca pra DocsLayout, logo no TopBar volta pra Home.
- `pnpm docs:build` gera `docs-site/dist/` sem erro, assets de `public/brand/` aparecem em `dist/brand/`.
- Checagem visual manual (docs-site não tem suite de teste própria — mesma decisão do spec de bootstrap).
- `pnpm typecheck`/`pnpm lint`/`pnpm test`/`pnpm build` da lib principal continuam verdes (docs-site é isolado, mas os componentes reaproveitados — `Button`, `Card`, `TopBar` — já têm suas próprias suítes).
