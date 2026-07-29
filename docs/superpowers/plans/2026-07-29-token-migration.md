# Migração de Tokens nos Componentes Existentes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** eliminar todo hardcode de cor/radius/sombra dos 33 arquivos `.tsx` de implementação de componentes, substituindo por utilitários Tailwind gerados do `@theme` em `src/styles/globals.css`.

**Architecture:** troca mecânica de className, arquivo por arquivo, guiada por uma tabela old→new exata por task (nenhuma decisão de mapeamento fica pro implementador — já foi resolvida no spec e nas tabelas abaixo). Sem mudança de props/tipos/comportamento.

**Tech Stack:** Tailwind CSS v4, sem lib nova.

## Global Constraints

- Spec de referência: `docs/superpowers/specs/2026-07-29-token-migration-design.md`.
- Escopo: só `.tsx` de implementação. Nunca tocar `.stories.tsx`/`.test.tsx` além das linhas específicas listadas em cada task (asserções que checavam a classe antiga).
- Nenhuma mudança de prop, tipo, comportamento ou export. Só className.
- Entradas marcadas "KEEP hardcoded" na tabela de cada task NÃO mudam — deixar a classe exatamente como está, é débito técnico documentado no spec, não bug desta migração.
- Depois de cada task: `pnpm lint && pnpm typecheck && pnpm test -- <ComponentName>` (ou `pnpm test` completo se rodar rápido) precisam passar limpo antes de commitar.
- Commit por task, mensagem `refactor(<component>): migrate to design tokens`.

---

### Task 1: Accordion

**Files:**
- Modify: `src/components/Accordion/Accordion.tsx`

| Old | New |
|---|---|
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `text-[#101828]` | `text-ink-900` |
| `text-[#FF5100]` | `text-primary-base` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `rounded-[4px]` | `rounded-xs` |
| `text-[#475467]` | `text-ink-600` |
| `text-[#98A2B3]` | `text-neutral-400` |

- [ ] **Step 1:** Confirmar baseline: `pnpm test -- Accordion` passa.
- [ ] **Step 2:** Aplicar cada substituição da tabela acima em `Accordion.tsx` (find-replace exato de string).
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Accordion` — deve continuar passando (nenhuma asserção de classe hardcoded neste componente).
- [ ] **Step 5:** Commit: `git add src/components/Accordion/Accordion.tsx && git commit -m "refactor(accordion): migrate to design tokens"`.

---

### Task 2: Alert

**Files:**
- Modify: `src/components/Alert/Alert.tsx`

| Old | New |
|---|---|
| `bg-[#DBEAFE]` | `bg-secondary-lightest` |
| `text-[#1E40AF]` | `text-secondary-darker` |
| `bg-[#D4F4DD]` | `bg-success-lightest` |
| `text-[#166534]` | `text-success-darker` |
| `bg-[#FEF3C7]` | `bg-warning-lightest` |
| `text-[#92400E]` | `text-warning-darkest` |
| `bg-[#FFE1E1]` | `bg-error-lightest` |
| `text-[#B42318]` | `text-error-darker` |
| `rounded-[12px]` | `rounded-md` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Alert` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Alert.tsx`.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Alert` passa.
- [ ] **Step 5:** Commit: `refactor(alert): migrate to design tokens`.

---

### Task 3: Avatar

**Files:**
- Modify: `src/components/Avatar/Avatar.tsx`

| Old | New |
|---|---|
| `bg-[#12B76A]` | `bg-success-base` |
| `bg-[#98A2B3]` | `bg-neutral-400` |
| `bg-[#F79009]` | `bg-warning-base` |
| `rounded-[12px]` | `rounded-md` |
| `bg-[#FFD4BF]` | `bg-warning-lighter` |
| `text-[#B42318]` | `text-error-darker` |
| `ring-[#151B2C]` | `ring-ink-900` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `text-[#344054]` | `text-ink-700` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#D0D5DD]` | `text-ink-300` |

- [ ] **Step 1:** Baseline: `pnpm test -- Avatar` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Avatar.tsx`.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Avatar` passa.
- [ ] **Step 5:** Commit: `refactor(avatar): migrate to design tokens`.

---

### Task 4: Badge

**Files:**
- Modify: `src/components/Badge/Badge.tsx`
- Modify: `src/components/Badge/Badge.test.tsx:85`

| Old | New |
|---|---|
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `text-[#344054]` | `text-ink-700` |
| `bg-[#374151]` | `bg-ink-700` |
| `text-[#D1D5DB]` | `text-ink-300` |
| `bg-[#F3E9FC]` | `bg-secondary-lightest` |
| `text-[#461FAE]` | `text-secondary-darker` |
| `bg-[#FFF1E0]` | `bg-primary-lightest` |
| `text-[#A31B00]` | `text-primary-darker` |
| `bg-[#D4F4DD]` | `bg-success-lightest` |
| `text-[#166534]` | `text-success-darker` |
| `bg-[#FEF3C7]` | `bg-warning-lightest` |
| `text-[#92400E]` | `text-warning-darkest` |
| `bg-[#FFE1E1]` | `bg-error-lightest` |
| `text-[#B42318]` | `text-error-darker` |
| `bg-[#7F56D9]` | `bg-secondary-base` |
| `bg-[#DBEAFE]` | `bg-secondary-lightest` |
| `text-[#1E40AF]` | `text-secondary-darker` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Badge` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Badge.tsx`.
- [ ] **Step 3:** Em `Badge.test.tsx:85`, trocar `expect(screen.getByText('Solid')).toHaveClass('bg-[#7F56D9]')` por `expect(screen.getByText('Solid')).toHaveClass('bg-secondary-base')`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Badge` passa.
- [ ] **Step 6:** Commit: `refactor(badge): migrate to design tokens`.

---

### Task 5: Breadcrumb

**Files:**
- Modify: `src/components/Breadcrumb/Breadcrumb.tsx`

| Old | New |
|---|---|
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `text-[#344054]` | `text-ink-700` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `text-[#101828]` | `text-ink-900` |

- [ ] **Step 1:** Baseline: `pnpm test -- Breadcrumb` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Breadcrumb` passa.
- [ ] **Step 5:** Commit: `refactor(breadcrumb): migrate to design tokens`.

---

### Task 6: Button

**Files:**
- Modify: `src/components/Button/Button.tsx`

| Old | New |
|---|---|
| `bg-[#FF5100]` | `bg-primary-base` |
| `border-[#FF5100]` | `border-primary-base` |
| `text-[#F7F7F7]` | `text-neutral-25` |
| `shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]` | `shadow-elevation-01` |
| `text-[#FF5100]` | `text-primary-base` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `text-[#393939]` | `text-neutral-800` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#374151]` | `border-ink-700` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `bg-[#E2E2E2]` | `bg-neutral-100` |
| `text-[#808080]` | `text-neutral-500` |
| `bg-[#374151]` | `bg-ink-700` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `bg-[#FF4242]` | `bg-error-base` |
| `border-[#FF4242]` | `border-error-base` |
| `text-[#D03700]` | `text-primary-dark` |
| `bg-[#FFF1E0]` | `bg-primary-lightest` |
| `text-[#9C9C9C]` | `text-neutral-400` |
| `text-[#A31B00]` | `text-primary-darker` |
| `shadow-[0_4px_18px_-6px_rgba(16,24,40,0.28)]` | `shadow-elevation-03` (hover state, opacity mismatch aceito) |
| `shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)]` | KEEP hardcoded — preto puro, sem elevação DS |
| `shadow-[0_6px_20px_-8px_rgba(208,55,0,0.5)]` | KEEP hardcoded — glow laranja de marca, sem elevação colorida |
| `rounded-[16px]` | `rounded-lg` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Button` passa.
- [ ] **Step 2:** Aplicar tabela acima (as duas entradas "KEEP hardcoded" ficam intocadas).
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Button` passa.
- [ ] **Step 5:** Commit: `refactor(button): migrate to design tokens`.

---

### Task 7: Calendar

**Files:**
- Modify: `src/components/Calendar/Calendar.tsx`
- Modify: `src/components/Calendar/Calendar.test.tsx:44`

| Old | New |
|---|---|
| `rounded-[16px]` | `rounded-lg` |
| `border-[#EAECF0]` | `border-ink-200` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#1F2937]` | `border-neutral-900` |
| `text-[#344054]` | `text-ink-700` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#101828]` | `text-ink-900` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `rounded-[8px]` | `rounded-sm` |

- [ ] **Step 1:** Baseline: `pnpm test -- Calendar` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Calendar.tsx`.
- [ ] **Step 3:** Em `Calendar.test.tsx:44`, trocar `.toHaveClass('bg-[#FF5100]')` por `.toHaveClass('bg-primary-base')`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Calendar` passa.
- [ ] **Step 6:** Commit: `refactor(calendar): migrate to design tokens`.

---

### Task 8: Card

**Files:**
- Modify: `src/components/Card/Card.tsx`

| Old | New |
|---|---|
| `border-[#EAECF0]` | `border-ink-200` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#1F2937]` | `border-neutral-900` |
| `border-[#D0D5DD]` | `border-ink-300` |
| `border-[#374151]` | `border-ink-700` |
| `shadow-[0px_4px_12px_0px_rgba(16,24,40,0.08)]` | `shadow-elevation-04` |
| `rounded-[12px]` | `rounded-md` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Card` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Card` passa.
- [ ] **Step 5:** Commit: `refactor(card): migrate to design tokens`.

---

### Task 9: Checkbox

**Files:**
- Modify: `src/components/Checkbox/Checkbox.tsx`
- Modify: `src/components/Checkbox/Checkbox.test.tsx:104,109,119,124`

| Old | New |
|---|---|
| `rounded-[4px]` | `rounded-xs` |
| `rounded-[6px]` | `rounded-sm` (aproximação, sem token exato — ver spec) |
| `rounded-[8px]` | `rounded-sm` |
| `rounded-[12px]` | `rounded-md` |
| `border-[#FF5100]` | `border-primary-base` |
| `border-[#1FBA5D]` | `border-success-base` |
| `border-[#ED2E98]` | `border-terciary-base` |
| `border-[#FF4242]` | `border-error-base` |
| `text-[#FF5100]` | `text-primary-base` |
| `text-[#1FBA5D]` | `text-success-base` |
| `text-[#ED2E98]` | `text-terciary-base` |
| `text-[#FF4242]` | `text-error-base` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#E2E2E2]` | `bg-neutral-100` |
| `border-[#CFCFCF]` | `border-neutral-200` |
| `bg-[#374151]` | `bg-ink-700` |
| `border-[#2A3441]` | `border-neutral-800` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)]` | KEEP hardcoded — glow âmbar de foco, sem elevação equivalente |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `text-[#CFCFCF]` | `text-neutral-200` |
| `text-[#4B5563]` | `text-ink-600` |
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `border-[#E2E2E2]` | `border-neutral-100` |

- [ ] **Step 1:** Baseline: `pnpm test -- Checkbox` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Checkbox.tsx` (KEEP hardcoded intocado).
- [ ] **Step 3:** Em `Checkbox.test.tsx`: linha 104 `.toHaveClass('border-[#1FBA5D]')` → `.toHaveClass('border-success-base')`; linha 109 `border-[#ED2E98]` → `border-terciary-base`; linhas 119 e 124 `border-[#FF4242]` → `border-error-base`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Checkbox` passa.
- [ ] **Step 6:** Commit: `refactor(checkbox): migrate to design tokens`.

---

### Task 10: DateInput

**Files:**
- Modify: `src/components/DateInput/DateInput.tsx`

| Old | New |
|---|---|
| `border-[#D0D5DD]` | `border-ink-300` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#374151]` | `border-ink-700` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#344054]` | `text-ink-700` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `text-[#FF4242]` | `text-error-base` |
| `rounded-[12px]` | `rounded-md` |
| `text-[#101828]` | `text-ink-900` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `border-[#FF4242]` | `border-error-base` |
| `border-[#1FBA5D]` | `border-success-base` |
| `text-[#667085]` | `text-ink-500` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `text-[#1FBA5D]` | `text-success-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- DateInput` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- DateInput` passa.
- [ ] **Step 5:** Commit: `refactor(dateinput): migrate to design tokens`.

---

### Task 11: Divider

**Files:**
- Modify: `src/components/Divider/Divider.tsx`

| Old | New |
|---|---|
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |

- [ ] **Step 1:** Baseline: `pnpm test -- Divider` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Divider` passa.
- [ ] **Step 5:** Commit: `refactor(divider): migrate to design tokens`.

---

### Task 12: Drawer

**Files:**
- Modify: `src/components/Drawer/Drawer.tsx`

| Old | New |
|---|---|
| `shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)]` | `shadow-elevation-05` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `text-[#101828]` | `text-ink-900` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Drawer` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Drawer` passa.
- [ ] **Step 5:** Commit: `refactor(drawer): migrate to design tokens`.

---

### Task 13: DropdownMenu

**Files:**
- Modify: `src/components/DropdownMenu/DropdownMenu.tsx`

| Old | New |
|---|---|
| `rounded-[6px]` | `rounded-sm` (aproximação, sem token exato — ver spec) |
| `text-[#101828]` | `text-ink-900` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `bg-[#EAECF0]` | `bg-ink-200` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `rounded-[12px]` | `rounded-md` |
| `shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)]` | `shadow-elevation-05` |
| `bg-[#151B2C]` | `bg-ink-900` |

- [ ] **Step 1:** Baseline: `pnpm test -- DropdownMenu` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- DropdownMenu` passa.
- [ ] **Step 5:** Commit: `refactor(dropdownmenu): migrate to design tokens`.

---

### Task 14: EmptyState

**Files:**
- Modify: `src/components/EmptyState/EmptyState.tsx`

| Old | New |
|---|---|
| `bg-[#F0F0F0]` | `bg-neutral-50` |
| `text-[#808080]` | `text-neutral-500` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `text-[#252525]` | `text-neutral-1000` |
| `text-[#626262]` | `text-neutral-600` |

- [ ] **Step 1:** Baseline: `pnpm test -- EmptyState` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- EmptyState` passa.
- [ ] **Step 5:** Commit: `refactor(emptystate): migrate to design tokens`.

---

### Task 15: FormField

**Files:**
- Modify: `src/components/FormField/FormField.tsx`

| Old | New |
|---|---|
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#FF4242]` | `text-error-base` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |

- [ ] **Step 1:** Baseline: `pnpm test -- FormField` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- FormField` passa.
- [ ] **Step 5:** Commit: `refactor(formfield): migrate to design tokens`.

---

### Task 16: Input

**Files:**
- Modify: `src/components/Input/Input.tsx`

| Old | New |
|---|---|
| `rounded-[16px]` | `rounded-lg` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#EFEFEF]` | `bg-neutral-50` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#374151]` | `border-ink-700` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `border-[#FF4242]` | `border-error-base` |
| `shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]` | `shadow-elevation-01` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `text-[#9C9C9C]` | `text-neutral-400` |
| `text-[#6B7280]` | `text-ink-500` |
| `text-[#B6B6B6]` | `text-neutral-300` |
| `text-[#4B5563]` | `text-ink-600` |
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#FF4242]` | `text-error-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Input` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Input` passa.
- [ ] **Step 5:** Commit: `refactor(input): migrate to design tokens`.

---

### Task 17: Message

**Files:**
- Modify: `src/components/Message/Message.tsx`

| Old | New |
|---|---|
| `text-[#FF5100]` | `text-primary-base` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `text-[#667085]` | `text-ink-500` |
| `rounded-[16px]` | `rounded-lg` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `text-[#101828]` | `text-ink-900` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `rounded-[8px]` | `rounded-sm` |
| `bg-[#98A2B3]` | `bg-neutral-400` |

- [ ] **Step 1:** Baseline: `pnpm test -- Message` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Message` passa.
- [ ] **Step 5:** Commit: `refactor(message): migrate to design tokens`.

---

### Task 18: Modal

**Files:**
- Modify: `src/components/Modal/Modal.tsx`

| Old | New |
|---|---|
| `bg-[#E3F6EF]` | `bg-success-lightest` |
| `text-[#1FBA5D]` | `text-success-base` |
| `bg-[#FFEDE7]` | `bg-error-lightest` |
| `text-[#FF4242]` | `text-error-base` |
| `bg-[#FEF8E9]` | `bg-warning-lightest` |
| `text-[#CE7734]` | `text-warning-dark` |
| `bg-[#F3E9FC]` | `bg-secondary-lightest` |
| `text-[#7F56D9]` | `text-secondary-base` |
| `rounded-[12px]` | `rounded-md` |
| `bg-[#F9FAFB]` | `bg-ink-50` |
| `text-[#475467]` | `text-ink-600` |
| `shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)]` | `shadow-elevation-05` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `text-[#101828]` | `text-ink-900` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Modal` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Modal` passa.
- [ ] **Step 5:** Commit: `refactor(modal): migrate to design tokens`.

---

### Task 19: Pagination

**Files:**
- Modify: `src/components/Pagination/Pagination.tsx`

| Old | New |
|---|---|
| `rounded-[8px]` | `rounded-sm` |
| `text-[#101828]` | `text-ink-900` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `text-[#344054]` | `text-ink-700` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `text-[#667085]` | `text-ink-500` |

- [ ] **Step 1:** Baseline: `pnpm test -- Pagination` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Pagination` passa.
- [ ] **Step 5:** Commit: `refactor(pagination): migrate to design tokens`.

---

### Task 20: Popover

**Files:**
- Modify: `src/components/Popover/Popover.tsx`

| Old | New |
|---|---|
| `rounded-[12px]` | `rounded-md` |
| `shadow-[0px_20px_25px_-5px_rgba(16,24,40,0.1)]` | `shadow-elevation-05` |
| `text-[#101828]` | `text-ink-900` |
| `bg-[#151B2C]` | `bg-ink-900` |

- [ ] **Step 1:** Baseline: `pnpm test -- Popover` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Popover` passa.
- [ ] **Step 5:** Commit: `refactor(popover): migrate to design tokens`.

---

### Task 21: Radio

**Files:**
- Modify: `src/components/Radio/Radio.tsx`
- Modify: `src/components/Radio/Radio.test.tsx:127,132,142,147`

| Old | New |
|---|---|
| `border-[#FF5100]` | `border-primary-base` |
| `border-[#1FBA5D]` | `border-success-base` |
| `border-[#ED2E98]` | `border-terciary-base` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `bg-[#1FBA5D]` | `bg-success-base` |
| `bg-[#ED2E98]` | `bg-terciary-base` |
| `border-[#FF4242]` | `border-error-base` |
| `bg-[#FF4242]` | `bg-error-base` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#E2E2E2]` | `bg-neutral-100` |
| `border-[#CFCFCF]` | `border-neutral-200` |
| `bg-[#374151]` | `bg-ink-700` |
| `border-[#2A3441]` | `border-neutral-800` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `shadow-[0px_0px_12px_0px_rgba(255,169,71,0.4)]` | KEEP hardcoded — glow âmbar de foco, sem elevação equivalente |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `bg-[#CFCFCF]` | `bg-neutral-200` |
| `bg-[#4B5563]` | `bg-ink-600` |
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#FF4242]` | `text-error-base` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `rounded-[12px]` | `rounded-md` |
| `border-[#E2E2E2]` | `border-neutral-100` |

- [ ] **Step 1:** Baseline: `pnpm test -- Radio` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Radio.tsx` (KEEP hardcoded intocado).
- [ ] **Step 3:** Em `Radio.test.tsx`: linha 127 `border-[#1FBA5D]` → `border-success-base`; linha 132 `border-[#ED2E98]` → `border-terciary-base`; linhas 142 e 147 `border-[#FF4242]` → `border-error-base`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Radio` passa.
- [ ] **Step 6:** Commit: `refactor(radio): migrate to design tokens`.

---

### Task 22: Schedule

**Files:**
- Modify: `src/components/Schedule/Schedule.tsx`

| Old | New |
|---|---|
| `rounded-[8px]` | `rounded-sm` |
| `text-[#101828]` | `text-ink-900` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#FF5100]` | `text-primary-base` |
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `rounded-[16px]` | `rounded-lg` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `bg-[#FF5100]` | `bg-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Schedule` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Schedule` passa.
- [ ] **Step 5:** Commit: `refactor(schedule): migrate to design tokens`.

---

### Task 23: Select

**Files:**
- Modify: `src/components/Select/Select.tsx`

| Old | New |
|---|---|
| `text-[#9C9C9C]` | `text-neutral-400` |
| `text-[#6B7280]` | `text-ink-500` |
| `rounded-[16px]` | `rounded-lg` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#EFEFEF]` | `bg-neutral-50` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#374151]` | `border-ink-700` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `border-[#FF4242]` | `border-error-base` |
| `shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]` | `shadow-elevation-01` |
| `border-[#D1B4F6]` | `border-secondary-lighter` |
| `text-[#B6B6B6]` | `text-neutral-300` |
| `text-[#4B5563]` | `text-ink-600` |
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `border-[#E2E2E2]` | `border-neutral-100` |
| `shadow-[0px_4px_16px_2px_rgba(70,31,174,0.10)]` | KEEP hardcoded — glow roxo de foco, sem elevação equivalente |
| `bg-[#374151]` | `bg-ink-700` |
| `text-[#FF4242]` | `text-error-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Select` passa.
- [ ] **Step 2:** Aplicar tabela acima (KEEP hardcoded intocado).
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Select` passa.
- [ ] **Step 5:** Commit: `refactor(select): migrate to design tokens`.

---

### Task 24: Sidebar (Sidebar.tsx + NavItem.tsx)

**Files:**
- Modify: `src/components/Sidebar/Sidebar.tsx`
- Modify: `src/components/Sidebar/NavItem.tsx`

`Sidebar.tsx`:

| Old | New |
|---|---|
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `bg-[#151B2C]` | `bg-ink-900` |

`NavItem.tsx`:

| Old | New |
|---|---|
| `rounded-[8px]` | `rounded-sm` |
| `text-[#344054]` | `text-ink-700` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `bg-[#FFF1EB]` | `bg-primary-lightest` (exceção documentada no spec — nav ativo, semântica primary, não error) |
| `text-[#FF5100]` | `text-primary-base` |
| `bg-[#3A2418]` | `bg-neutral-1000` |
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |

- [ ] **Step 1:** Baseline: `pnpm test -- Sidebar` passa.
- [ ] **Step 2:** Aplicar tabela de `Sidebar.tsx`.
- [ ] **Step 3:** Aplicar tabela de `NavItem.tsx`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Sidebar` passa.
- [ ] **Step 6:** Commit: `refactor(sidebar): migrate to design tokens`.

---

### Task 25: Skeleton

**Files:**
- Modify: `src/components/Skeleton/Skeleton.tsx`

| Old | New |
|---|---|
| `rounded-[4px]` | `rounded-xs` |
| `rounded-[8px]` | `rounded-sm` |
| `rounded-[16px]` | `rounded-lg` |
| `bg-[#E8E8E8]` | `bg-ink-200` |
| `bg-[#374151]` | `bg-ink-700` |

- [ ] **Step 1:** Baseline: `pnpm test -- Skeleton` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Skeleton` passa.
- [ ] **Step 5:** Commit: `refactor(skeleton): migrate to design tokens`.

---

### Task 26: Spinner

**Files:**
- Modify: `src/components/Spinner/Spinner.tsx`
- Modify: `src/components/Spinner/Spinner.test.tsx:34`

| Old | New |
|---|---|
| `border-[#FF5100]` | `border-primary-base` |
| `border-[#9C9C9C]` | `border-neutral-400` |
| `border-[#6B7280]` | `border-ink-500` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `bg-[#9C9C9C]` | `bg-neutral-400` |
| `bg-[#9CA3AF]` | `bg-neutral-400` |
| `border-t-[#FF5100]` | `border-t-primary-base` |
| `border-t-[#9C9C9C]` | `border-t-neutral-400` |
| `border-t-[#9CA3AF]` | `border-t-neutral-400` |

- [ ] **Step 1:** Baseline: `pnpm test -- Spinner` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Spinner.tsx`.
- [ ] **Step 3:** Em `Spinner.test.tsx:34`, trocar `.toHaveClass('border-t-[#FF5100]')` por `.toHaveClass('border-t-primary-base')`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Spinner` passa.
- [ ] **Step 6:** Commit: `refactor(spinner): migrate to design tokens`.

---

### Task 27: Table

**Files:**
- Modify: `src/components/Table/Table.tsx`

| Old | New |
|---|---|
| `rounded-[12px]` | `rounded-md` |
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `bg-[#F9FAFB]` | `bg-ink-50` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#344054]` | `text-ink-700` |
| `text-[#D0D5DD]` | `text-ink-300` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `rounded-[4px]` | `rounded-xs` |
| `bg-[#FFF1EB]` | `bg-primary-lightest` (mesma exceção do NavItem — linha ativa) |
| `bg-[#3A2418]` | `bg-neutral-1000` |

- [ ] **Step 1:** Baseline: `pnpm test -- Table` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Table` passa.
- [ ] **Step 5:** Commit: `refactor(table): migrate to design tokens`.

---

### Task 28: Tabs

**Files:**
- Modify: `src/components/Tabs/Tabs.tsx`
- Modify: `src/components/Tabs/Tabs.test.tsx` (verificar linha com `shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]` ou classe de cor hardcoded, se houver — atualizar pro token correspondente listado abaixo)

| Old | New |
|---|---|
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `rounded-[10px]` | `rounded-md` |
| `bg-[#F2F4F7]` | `bg-ink-100` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#FF5100]` | `text-primary-base` |
| `border-[#FF5100]` | `border-primary-base` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `rounded-[8px]` | `rounded-sm` |
| `text-[#101828]` | `text-ink-900` |
| `shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]` | `shadow-elevation-01` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#D0D5DD]` | `border-ink-300` |
| `bg-[#F9FAFB]` | `bg-ink-50` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `border-[#374151]` | `border-ink-700` |
| `bg-[#374151]` | `bg-ink-700` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Tabs` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Tabs.tsx`.
- [ ] **Step 3:** Rodar `grep -n "#[0-9A-Fa-f]\{6\}" src/components/Tabs/Tabs.test.tsx` — se aparecer alguma asserção de classe hardcoded, atualizar pro token correspondente da tabela acima.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Tabs` passa.
- [ ] **Step 6:** Commit: `refactor(tabs): migrate to design tokens`.

---

### Task 29: Textarea

**Files:**
- Modify: `src/components/Textarea/Textarea.tsx`

| Old | New |
|---|---|
| `rounded-[16px]` | `rounded-lg` |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#EFEFEF]` | `bg-neutral-50` |
| `border-[#B6B6B6]` | `border-neutral-300` |
| `bg-[#1F2937]` | `bg-neutral-900` |
| `border-[#374151]` | `border-ink-700` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `border-[#FF867E]` | `border-error-light` |
| `shadow-[0px_1px_2px_0px_rgba(12,17,29,0.10)]` | `shadow-elevation-01` |
| `text-[#9C9C9C]` | `text-neutral-400` |
| `text-[#6B7280]` | `text-ink-500` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#393939]` | `text-neutral-800` |
| `text-[#F2F4F7]` | `text-ink-100` |
| `text-[#9CA3AF]` | `text-neutral-400` |
| `text-[#FF4242]` | `text-error-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Textarea` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Textarea` passa.
- [ ] **Step 5:** Commit: `refactor(textarea): migrate to design tokens`.

---

### Task 30: Toast

**Files:**
- Modify: `src/components/Toast/Toast.tsx`

| Old | New |
|---|---|
| `bg-[#DBEAFE]` | `bg-secondary-lightest` |
| `text-[#1E40AF]` | `text-secondary-darker` |
| `bg-[#D4F4DD]` | `bg-success-lightest` |
| `text-[#166534]` | `text-success-darker` |
| `bg-[#FEF3C7]` | `bg-warning-lightest` |
| `text-[#92400E]` | `text-warning-darkest` |
| `bg-[#FFE1E1]` | `bg-error-lightest` |
| `text-[#B42318]` | `text-error-darker` |
| `rounded-[12px]` | `rounded-md` |
| `shadow-[0px_4px_12px_0px_rgba(16,24,40,0.12)]` | `shadow-elevation-04` |
| `ring-[#FF5100]` | `ring-primary-base` |

- [ ] **Step 1:** Baseline: `pnpm test -- Toast` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Toast` passa.
- [ ] **Step 5:** Commit: `refactor(toast): migrate to design tokens`.

---

### Task 31: Toggle

**Files:**
- Modify: `src/components/Toggle/Toggle.tsx`

| Old | New |
|---|---|
| `shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06),0px_1px_3px_0px_rgba(16,24,40,0.10)]` | `shadow-elevation-02` (match estrutural exato) |
| `ring-[#FF5100]` | `ring-primary-base` |
| `bg-[#461FAE]` | `bg-secondary-darker` |
| `bg-[#E2E2E2]` | `bg-neutral-100` |
| `bg-[#374151]` | `bg-ink-700` |
| `bg-[#F7F7F7]` | `bg-neutral-25` |
| `text-[#4D4D4D]` | `text-neutral-700` |
| `text-[#D1D5DB]` | `text-ink-300` |
| `text-[#808080]` | `text-neutral-500` |
| `text-[#9CA3AF]` | `text-neutral-400` |

- [ ] **Step 1:** Baseline: `pnpm test -- Toggle` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- Toggle` passa.
- [ ] **Step 5:** Commit: `refactor(toggle): migrate to design tokens`.

---

### Task 32: Tooltip

**Files:**
- Modify: `src/components/Tooltip/Tooltip.tsx`
- Modify: `src/components/Tooltip/Tooltip.test.tsx:116`

| Old | New |
|---|---|
| `bg-[#101828]` | `bg-ink-900` |
| `text-[#101828]` | `text-ink-900` |
| `border-[#EAECF0]` | `border-ink-200` |
| `shadow-[0px_4px_12px_0px_rgba(16,24,40,0.10)]` | `shadow-elevation-04` |
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#1F2937]` | `border-neutral-900` |
| `bg-[#FF5100]` | `bg-primary-base` |
| `rounded-[8px]` | `rounded-sm` |
| `shadow-[0px_4px_12px_0px_rgba(16,24,40,0.16)]` | `shadow-elevation-04` (variante dark-mode, opacidade aproximada aceita) |

- [ ] **Step 1:** Baseline: `pnpm test -- Tooltip` passa.
- [ ] **Step 2:** Aplicar tabela acima em `Tooltip.tsx`.
- [ ] **Step 3:** Em `Tooltip.test.tsx:116`, trocar `.toHaveClass('bg-[#FF5100]')` por `.toHaveClass('bg-primary-base')`.
- [ ] **Step 4:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 5:** `pnpm test -- Tooltip` passa.
- [ ] **Step 6:** Commit: `refactor(tooltip): migrate to design tokens`.

---

### Task 33: TopBar

**Files:**
- Modify: `src/components/TopBar/TopBar.tsx`

| Old | New |
|---|---|
| `bg-[#151B2C]` | `bg-ink-900` |
| `border-[#EAECF0]` | `border-ink-200` |
| `border-[#1F2937]` | `border-neutral-900` |
| `shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)]` | `shadow-elevation-01` |

- [ ] **Step 1:** Baseline: `pnpm test -- TopBar` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- TopBar` passa.
- [ ] **Step 5:** Commit: `refactor(topbar): migrate to design tokens`.

---

### Task 34: VideoCall

**Files:**
- Modify: `src/components/VideoCall/VideoCall.tsx`

| Old | New |
|---|---|
| `bg-[#1C1B1F]` | `bg-ink-800` |
| `rounded-[16px]` | `rounded-lg` |
| `text-[#667085]` | `text-ink-500` |
| `text-[#98A2B3]` | `text-neutral-400` |
| `bg-[#FF4242]` | `bg-error-base` |
| `rounded-[8px]` | `rounded-sm` |
| `text-[#101828]` | `text-ink-900` |

- [ ] **Step 1:** Baseline: `pnpm test -- VideoCall` passa.
- [ ] **Step 2:** Aplicar tabela acima.
- [ ] **Step 3:** `pnpm lint && pnpm typecheck`.
- [ ] **Step 4:** `pnpm test -- VideoCall` passa.
- [ ] **Step 5:** Commit: `refactor(videocall): migrate to design tokens`.

---

### Task 35: Final sweep — build, changeset, docs-site visual check

**Files:**
- Create: `.changeset/token-migration.md`

- [ ] **Step 1:** `grep -rn "bg-\[#\|text-\[#\|border-\[#\|border-t-\[#\|border-b-\[#\|ring-\[#\|shadow-\[\|rounded-\[" src/components --include="*.tsx" | grep -v ".stories.tsx\|.test.tsx"` — deve retornar só as entradas "KEEP hardcoded" documentadas (Button ×2, Checkbox/Radio glow âmbar, Select glow roxo). Qualquer outra linha é uma migração esquecida — corrigir antes de prosseguir.
- [ ] **Step 2:** `pnpm build` — deve compilar limpo.
- [ ] **Step 3:** `pnpm test` — 424 testes (ou mais, se algum teste foi ajustado), 0 falhas.
- [ ] **Step 4:** Criar `.changeset/token-migration.md`:

```markdown
---
"@starbemtech/react-starsystem": patch
---

Migrate all existing components from hardcoded hex/px/shadow values to design tokens defined in the `@theme` block (colors, radius, elevation shadows). No API or behavior change — visual-only, aligning components with the corrected Starbem Design System tokens (secondary color, radius scale, shadow elevations) from the earlier token-correction release. A handful of values with no DS equivalent (two Button glass-variant glows, the Checkbox/Radio focus glow, the Select focus glow) remain hardcoded and are tracked as known technical debt.
```

- [ ] **Step 5:** `pnpm docs:dev` — abrir localhost:5173, navegar pelos componentes visualmente pra confirmar que nada quebrou (cor secundária deve aparecer roxa `#7F56D9` onde antes era outra cor; nenhum componente deve ficar sem estilo). Não bloqueante — só validação manual.
- [ ] **Step 6:** Commit: `git add .changeset/token-migration.md && git commit -m "chore: add changeset for token migration"`.
