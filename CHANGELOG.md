# @starbemtech/react-starsystem

## 1.0.0

### Major Changes

- 22c6d8f: Fix 11 existing components to match the Starbem Design System reference kit's public API. This is a breaking release — see the full list below before upgrading.

  **Button**: added variants `tertiary`, `link`, `glass`, `glass-dark`, `glass-brand` (9 total); added `size="xl"`; added `pill` and `block` props; added polymorphic `as="a"` rendering (disabled semantics become `aria-disabled` for the anchor branch).

  **Checkbox** / **Radio**: added `tone` ("primary" | "success" | "accent"), `variant="card"` (tile layout), `error`, and `size="lg"`.

  **Select**: no prop changes — `onChange`'s value-callback contract is now documented via JSDoc to avoid confusion with a native change event handler.

  **Avatar**: added `size="2xl"`; `status` is now `boolean | "online" | "offline" | "away"` instead of a closed enum; `alt` is no longer required when `src` is set (falls back to `name`); added `shape`, `icon` fallback, and `ring` props. **AvatarGroup** now takes `children` (`<Avatar>` elements) instead of an `avatars` array — the `AvatarGroupItem` type is removed.

  **Modal**: `title` type changed from `string` to `ReactNode`; added `present` ("auto" | "center" | "sheet" — responsive bottom-sheet layout), `tone`, `icon`, and `align`.

  **Tabs**: `TabItem.content` is now optional (Tabs can be used as a pure tab-bar with no panel, matching the DS — existing usage with content on every item is unaffected); added `TabItem.icon`, `TabItem.count`, `variant="enclosed"`, `size`, and `block`.

  **Badge**: variant `"default"` is renamed to `"neutral"`; added variants `"primary"`, `"accent"`, `"solid"`; added `dot`; now spreads extra HTML attributes (`onClick`, `data-*`, `aria-*`, etc.) onto the root element.

  **Spinner**: `size` now also accepts a `number` (pixel diameter) in addition to `"sm" | "md" | "lg"`; added `thickness`; `label` is no longer a required prop (defaults to `"Carregando"`). Added a new `Dots` component (three-dot inline loader).

  **Tooltip**: added `tone` ("dark" | "light" | "brand") and a "rich" layout via the new `title` prop (renders `title` + `content` as two lines).

  **Pagination**: renamed `currentPage` → `page`, `totalPages` → `total`, `onPageChange` → `onChange` to match the DS; added `pill`; now spreads extra HTML attributes onto the root `<nav>`.

  Migration: update every `Pagination` and `AvatarGroup` usage per the renames above (`Table`'s `pagination` prop follows automatically via its `PaginationProps` type). Every other change is additive — no other call site changes are required to keep compiling.

### Minor Changes

- 94472b0: Correct design tokens against the Starbem Design System reference kit: fix secondary color (`#7F56D9`), fix neutral-1000 (`#272727`), add `ink` color ramp, add `error`/`warning`/`success` semantic color scales, add semantic color aliases, switch body font from Inter to Funnel Display (single-typeface system), fix h1/h2/h4 font sizes, add `overline` size and per-size `typeScale` (line-height + letter-spacing), add `space-40`, rescale border-radius (`sm` 8px, `md` 12px, `lg` 16px, `xl` 24px, `2xl` 32px), fix elevation shadow values to multi-layer DS values, add `shadowBrand` and `ringFocus` tokens, and load the missing Funnel Display `@import`.

  Note: these are token corrections only — component implementations still use hardcoded Tailwind arbitrary values (hex/px) instead of consuming these tokens, so no visual change ships in this release. Component migration is tracked separately.

- f2416f8: Add responsive `Menu` navigation component (sidebar/rail/bottom/drawer/auto, container-query driven). Also fixes: ProgressCircle now accepts a `label` prop wired to `aria-label`; IconButton's `label` prop is now required (was optional but functionally mandatory); FilterChip's remove control is now a real sibling button instead of nested inside the chip's own button; FileUploader's inline upload progress bar now reuses the `Progress` component (adds proper ARIA progressbar semantics).
- 41fac7d: Add 7 new components: Progress/ProgressCircle, Tag, IconButton, FilterBar/FilterChip, FileUploader/FileItem, ListItem, and Chart (Sparkline/LineChart/BarChart/DonutChart). All built directly against existing design tokens — no hardcoded colors.
- c7c4adc: Add 5 new telehealth-domain components: `Calendar` (month date picker), `DateInput` (text field + calendar popover), `Schedule` (day/week/month agenda with video-consultation chips), `Message` (chat bubbles + `TypingMessage`/`MessageDay`/`SystemMessage`/`MessageList`), and `VideoCall` (video-consultation surface with spotlight/grid layout and live/connecting/ended states).

### Patch Changes

- dc6b276: Tech debt cleanup: Progress track now has a dark-mode background color; Menu's drawer panel content stays mounted while closed so the close animation actually slides, and the closed panel is now marked `inert` to prevent keyboard focus on hidden controls; AvatarGroup now respects an explicit `ring` prop on child Avatars instead of always forcing it to `true`; Checkbox's hover shadow is now tone-aware and dark-mode-aware (previously a single hardcoded amber color regardless of tone). Also added test coverage for FilterChip's disabled propagation, Tabs' mixed-content rendering, and Spinner's combined size+thickness behavior. No public API changes.
- 75d5ac8: Migrate all existing components from hardcoded hex/px/shadow values to design tokens defined in the `@theme` block (colors, radius, elevation shadows). No API or behavior change — visual-only, aligning components with the corrected Starbem Design System tokens (secondary color, radius scale, shadow elevations) from the earlier token-correction release. A handful of values with no DS equivalent (two Button glass-variant glows, the Checkbox/Radio focus glow, the Select focus glow) remain hardcoded and are tracked as known technical debt.

## 0.3.0

### Minor Changes

- eff4b68: Add `Icon` component rendering Material Symbols Rounded, always at weight 200. Adds `material-symbols` as a required peer dependency — consumers must import the font CSS themselves (e.g. `import 'material-symbols/rounded.css'`).

## 0.2.0

### Minor Changes

- 47ea71a: Adiciona suporte real a dark mode em todos os 26 componentes da lib (bordas, backgrounds, textos e estados de foco/hover), via `dark:` do Tailwind. Opt-in: consumidores ativam adicionando a classe `.dark` em qualquer ancestral (tipicamente `<html>`), independente de preferência do sistema. Cores de marca e cores semânticas de status (Alert, Badge, Toast) permanecem invariantes ao tema.

## 0.1.2

### Patch Changes

- Link the live docs-site (https://starbem.github.io/react-starsystem/) from the README and set it as the package's `homepage` field.

## 0.1.1

### Patch Changes

- Add standard open-source project files: `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), and `SECURITY.md`. Enrich `package.json` with `license`, `author`, `repository`, `homepage`, `bugs`, and `keywords` fields for the npm package page.

## 0.1.0

### Minor Changes

- 565f3cc: Add Tabs component (ID-3188) built on @radix-ui/react-tabs, with `line` (underline) and `filled` (pill) variants, `horizontal`/`vertical` orientation, `items` (label + content), controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) modes, disabled tabs, and full keyboard navigation (arrows).

  New runtime dependency: `@radix-ui/react-tabs`.

- 02f40e3: Add Divider/Separator component (ID-3197) built on @radix-ui/react-separator, with `horizontal`/`vertical` orientation, `solid`/`dashed` variants, and a centered `label` (e.g. "ou") for the horizontal case.

  New runtime dependency: `@radix-ui/react-separator`.

- 6bd27ae: Add Popover component (ID-3185) built on @radix-ui/react-popover, with configurable `trigger`, `content` (slot), `side`, `align`, and `onOpenChange`. Supports rich content (forms, lists, etc.), automatic focus trap, and closes on Escape or an outside click.

  New runtime dependency: `@radix-ui/react-popover`.

- 9c703fd: Add DropdownMenu component (ID-3186) built on @radix-ui/react-dropdown-menu, with `item`/`separator`/`label`/`checkbox-item`/`sub-menu` entry types, icon and badge support per item, configurable `trigger`/`align`, an `onSelect` callback, and full keyboard navigation (arrows, Enter, Escape).

  New runtime dependency: `@radix-ui/react-dropdown-menu`.

- 848d863: Add Table component (ID-3193), with typed `columns` (custom `render`, `sortable`), client-side sorting, optional row selection (checkbox column, controlled or uncontrolled), `loading` state with skeleton rows, an integrated empty state (default or custom), horizontal scroll on small viewports, and an optional built-in `Pagination` footer.

  `Checkbox` gains an `aria-label` prop for cases without a visible label (used by Table's selection checkboxes).

- ce159af: Add Tooltip component (ID-3184) built on @radix-ui/react-tooltip, with `top`/`bottom`/`left`/`right` sides, configurable `delay`, a `disabled` escape hatch, and support for rich (non-text) content.

  New runtime dependency: `@radix-ui/react-tooltip`.

- d1bfd77: Add Sidebar and NavItem components (ID-3190), with 1-level nested sub-menus (collapsible), a `collapsed` compact mode (icons only, label shown via `Tooltip` on hover), `header`/`footer` slots, and `aria-current="page"` on the active item.
- 74733f5: Add generic Card component (ID-3194), composable via `Card.Header`/`Card.Body`/`Card.Footer`, with `default`/`outlined`/`elevated` variants, `padding` sizes, an accessible clickable mode (`onClick`, keyboard-operable, focus ring), and a `loading` state that swaps content for an internal skeleton.
- fca9367: Add Toast/Notification component (ID-3178) built on @radix-ui/react-toast, with a `ToastProvider` + imperative `toast.success/error/warning/info` ToastManager API, configurable position, stacking, auto-dismiss with optional progress bar, and per-variant aria-live.

  New runtime dependency: `@radix-ui/react-toast`.

- 61c208b: Add TopBar/Header component (ID-3189), with `start`/`center`/`end` slots, `sticky` (with scroll shadow) and `bordered` props, and a responsive layout (title hidden/truncated on narrow screens, actions never shrink).
- cd64344: Add Drawer/Sheet component (ID-3183) built on @radix-ui/react-dialog, with `left`/`right`/`bottom` positions, `sm`/`md`/`lg`/`full` sizes, optional `title`, `onClose` callback, focus trap, Escape-to-close, and a dark overlay.
- b37fd2c: Add Alert/Banner component (ID-3177) with info/success/warning/error variants, optional title/description/icon/action, and dismissible state with exit transition and accessible close button.
- 5b53723: Add Breadcrumb component (ID-3191), with `items` (label + href), a customizable `separator`, automatic ellipsis truncation via `maxItems`, and `aria-current="page"` on the last item.
- 1a4045e: Add Pagination component (ID-3192), with `currentPage`/`totalPages`/`onPageChange`, configurable `siblingCount`, optional `showFirstLast` controls, automatic ellipsis for long page ranges, `aria-current="page"` on the active page, and a compact prev/next + indicator layout for mobile.
- 78e47b6: Add Modal/Dialog component (ID-3182) built on @radix-ui/react-dialog, with `sm`/`md`/`lg`/`xl`/`full` sizes, optional title/description/footer slot, `onClose` callback, `closeOnOverlayClick` toggle, automatic focus trap, Escape-to-close, and internal scroll for overflowing content.

  New runtime dependency: `@radix-ui/react-dialog`.

- f319098: Add Avatar and AvatarGroup components (ID-3195), with `xs`/`sm`/`md`/`lg`/`xl` sizes, automatic fallback chain (image → initials from `name` → generic icon), an optional `online`/`offline`/`away` `status` indicator, and `AvatarGroup` for a horizontal stack with `+N` overflow. `alt` is required by the type whenever `src` is provided.
- 06be1ab: Add Accordion component (ID-3196) built on @radix-ui/react-accordion, with `single`/`multiple` types, `defaultValue`, per-item `disabled`, keyboard navigation, `aria-expanded`/`aria-controls`, and a smooth CSS-driven expand/collapse animation.
- 3f9150b: Add Badge/Tag component (ID-3176) with default/success/warning/error/info variants, sm/md sizes, optional prefix icon, and removable state with accessible remove button.
