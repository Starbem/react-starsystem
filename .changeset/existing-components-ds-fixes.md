---
"@starbemtech/react-starsystem": major
---

Fix 11 existing components to match the Starbem Design System reference kit's public API. This is a breaking release — see the full list below before upgrading.

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
