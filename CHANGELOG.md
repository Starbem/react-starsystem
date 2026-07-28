# @starbemtech/react-starsystem

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
