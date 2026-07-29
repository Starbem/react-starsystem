# Migração de Tokens nos Componentes Existentes — Design

**Goal:** eliminar hardcode de cor/radius/sombra (`bg-[#HEX]`, `text-[#HEX]`, `border-[#HEX]`, `shadow-[...]`, `rounded-[Npx]`, `ring-[#HEX]`) dos ~30 componentes de implementação de `react-starsystem`, substituindo por utilitários Tailwind gerados a partir do bloco `@theme` em `src/styles/globals.css` (corrigido no commit `94472b0`, ainda não consumido por nenhum componente).

**Architecture:** troca mecânica de classe por classe, arquivo por arquivo. Sem mudança de props, tipos ou API pública — puro swap de className. Prioridade: alias semântico (`bg-primary`, `text-secondary`, `surface-card`, `border-default`) quando existir para o propósito visual da classe; escala crua (`bg-primary-base`, `text-ink-600`) quando não houver alias que capture o significado.

**Tech Stack:** Tailwind CSS v4 (`@theme` gera utilitários automaticamente a partir de `--color-*`, `--radius-*`, `--shadow-elevation-*`), sem lib nova.

## Escopo de arquivos

Só `.tsx` de implementação (exclui `.stories.tsx` e `.test.tsx`). Lista completa (33 arquivos, do grep de `bg-[#`/`text-[#`/`border-[#`/`shadow-[`/`rounded-[`/`ring-[`):

Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Checkbox, DateInput, Divider, Drawer, DropdownMenu, EmptyState, FormField, Input, Message, Modal, Pagination, Popover, Radio, Schedule, Select, Sidebar (+ NavItem), Skeleton, Spinner, Table, Tabs, Textarea, Toast, Toggle, Tooltip, TopBar, VideoCall.

## Tabela de mapeamento — valores neutros/chrome de UI

Bordas, fundos dark-mode, texto secundário/desabilitado. Match por menor distância RGB contra a escala `neutral-*`/`ink-*` (confiável para cinzas puros, sem componente semântico de cor):

| Hex hardcoded | Token |
|---|---|
| `#101828` | `ink-900` (exato) |
| `#1C1B1F` | `ink-800` (exato) |
| `#344054` | `ink-700` (exato) |
| `#475467` | `ink-600` (exato) |
| `#667085` | `ink-500` (exato) |
| `#D0D5DD` | `ink-300` (exato) |
| `#EAECF0` | `ink-200` (exato) |
| `#F2F4F7` | `ink-100` (exato) |
| `#F9FAFB` | `ink-50` (exato) |
| `#393939` | `neutral-800` (exato) |
| `#808080` | `neutral-500` (exato) |
| `#9C9C9C` | `neutral-400` (exato) |
| `#B6B6B6` | `neutral-300` (exato) |
| `#CFCFCF` | `neutral-200` (exato) |
| `#E2E2E2` | `neutral-100` (exato) |
| `#F7F7F7` | `neutral-25` (exato) |
| `#EFEFEF` | `neutral-50` (exato) |
| `#374151` | `ink-700` (dist 19) |
| `#4B5563` | `ink-600` (dist 33) |
| `#6B7280` | `ink-500` (dist 54) |
| `#D1D5DB` | `ink-300` (dist 5) |
| `#E8E8E8` | `ink-200` (dist 84) |
| `#F0F0F0` | `neutral-50` (dist 3) |
| `#151B2C` | `ink-900` (dist 50) — fundo dark-mode escuro |
| `#252525` | `neutral-1000` (dist 12) |
| `#626262` | `neutral-600` (dist 27) |
| `#2A3441` | `neutral-800` (dist 314) — sem match melhor; DS não define escala dark-surface própria |
| `#1F2937` | `neutral-900` (dist 299) — mesma ressalva |
| `#3A2418` | `neutral-1000` (dist 595) — mesma ressalva, usado só em nav-item ativo dark-mode |
| `#98A2B3` / `#9CA3AF` | `neutral-400` |

**Nota sobre dark-mode surfaces** (`#151B2C`, `#1F2937`, `#2A3441`, `#3A2418`): o DS de referência não define uma escala própria pra superfícies dark-mode — esses hex vieram da sessão de dark mode (`47ea71a`), não do kit de design. O mapeamento pra `neutral-900`/`neutral-1000`/`ink-900` é o mais próximo disponível, mas é uma aproximação squarely fora do escopo do DS. Registrar como débito técnico: se o DS ganhar uma escala dark-surface oficial no futuro, esses tokens trocam de novo.

## Tabela de mapeamento — cores semânticas de status (não por distância RGB)

Fundos/textos de variantes success/warning/error/info em `Alert`, `Badge`, `Toast`, e status dots do `Avatar`. Aqui a família semântica governa, não a menor distância de cor — RGB puro erra feio nessa categoria (ex: `#D4F4DD`, verde-claro de fundo "success", fica matematicamente mais perto de `neutral-100` cinza do que de `success-lightest`, o que seria errado trocar).

| Hex hardcoded | Família | Token |
|---|---|---|
| `#D4F4DD` | success bg | `success-lightest` (`#E3F6EF`) |
| `#166534` | success text | `success-darker` (`#116D28`) |
| `#12B76A` | success dot (Avatar online) | `success-base` (`#1FBA5D`) |
| `#FEF3C7` | warning bg | `warning-lightest` (`#FEF8E9`) |
| `#92400E` | warning text | `warning-darkest` (`#8D2B0E`) |
| `#F79009` | warning dot (Avatar away) | `warning-base` (`#F8A04D`) |
| `#FFD4BF` | warning acento | `warning-lighter` (`#FBE3B3`) |
| `#FFE1E1` | error bg | `error-lightest` (`#FFEDE7`) |
| `#B42318` | error text | `error-darker` (`#9A0912`) |
| `#DBEAFE` | info bg | `secondary-lightest` (`#F3E9FC`) — DS não tem família "info" separada; colapsa pra secondary/roxo, mesmo precedente já usado no `Modal` (tone `info` → `#7F56D9`) |
| `#1E40AF` | info text | `secondary-darker` (`#461FAE`) |
| `#7F56D9` | info/secondary (já usado no Modal) | `secondary-base` (exato) |

**Exceção pontual — `Sidebar/NavItem.tsx`:** `bg-[#FFF1EB]` é o fundo do item de navegação ativo, sempre acompanhado de `text-[#FF5100]` (laranja primário) e, no dark mode, `bg-[#3A2418]`. Por proximidade RGB pura isso cairia em `error-lightest`, mas semanticamente é claramente uma variante clara da cor primária (mesma família do texto que acompanha). Mapear para `primary-lightest` (`#FFF1E0`), não para a família error.

## Radius e sombras

Radius: `rounded-[4px]`→`rounded-xs`, `[8px]`→`rounded-sm`, `[10px]`/`[12px]`→`rounded-md`, `[16px]`→`rounded-lg`, `[24px]`→`rounded-xl`, `[32px]`→`rounded-2xl`. (`10px` não tem token exato — cai em `rounded-md`, 2px de diferença visualmente imperceptível; registrar como aproximação.)

Sombras: cada `shadow-[valor arbitrário]` compara com as 8 elevações (`shadow-elevation-00`..`07`) e o `shadow-brand`/`shadow-elevation-secondary`/`shadow-elevation-hover-secondary` (extensões só-da-lib, já existentes, mantidas como estão). Onde a sombra hardcoded não bater com nenhuma elevação (ex: `shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)]` em Checkbox/Radio — glow amarelo-alaranjado de foco, sem equivalente nas elevações neutras), manter hardcoded e sinalizar como débito técnico — não inventar uma elevação nova fora do que a sessão 2 já corrigiu.

## Ring de foco

`ring-[#FF5100]` (cor do ring do Tailwind, mecanismo diferente do `--ring-focus` que é um `box-shadow` completo) vira `ring-primary-base` — troca só o valor da cor, mantém o mesmo mecanismo de ring já usado no componente. Não migra pro token `--ring-focus` (que é uma sombra composta, não uma cor de ring) — isso mudaria a técnica de implementação do foco, fora do escopo desta migração.

## Versionamento

Sem breaking de API — muda só aparência visual, não contrato de props/tipos. Changeset novo, bump `patch` (ajuste de conformidade visual). Nenhuma versão publicada além de `0.3.0`; este muda junto com os 3 changesets já pendentes no próximo release.

## Testes

`pnpm lint && pnpm typecheck && pnpm build` verdes em todo task. Suíte de testes existente (424 testes) não deve quebrar — testes checam estrutura/comportamento/acessibilidade, não classe CSS literal; qualquer teste que hoje asserte uma classe hardcoded (ex: `border-[#FF4242]` recém-adicionado na sessão 3 pra Checkbox/Radio `variant=card`+`error`) precisa ser atualizado junto no mesmo task pra apontar pro novo token. Validação visual manual via `pnpm docs:dev` recomendada ao final, não bloqueante por task.

## Riscos

- Correção de cor secundária (`#7F56D9` certo desde a sessão 2) só toma efeito visual real quando os componentes migrarem — esperado, é o próprio objetivo.
- Dark-mode surfaces (`#151B2C` etc.) não têm origem no DS — mapeamento é aproximação, não fidelidade 1:1.
- Sombra de foco amber do Checkbox/Radio não tem elevação equivalente — fica hardcoded por enquanto.
