# Example Dashboard — Design Spec

Date: 2026-07-29

## Purpose

Demonstrate how to assemble a real application using `@starbemtech/react-starsystem`
(published on npm) as an external consumer would. Lives in `/example` at the repo
root, separate from the library source and from `docs-site`. Domain: corporate HR
dashboard (aligned with Starbem's B2B product), using mock data only — no backend.

## Stack

- Vite + React + TypeScript
- `react-router-dom` for multi-route navigation
- `@starbemtech/react-starsystem` installed from npm (real dependency, not a
  workspace link) to mirror actual consumer setup
- Tailwind CSS v4 (required by the lib's compiled `style.css` + consumer app shell)

## Structure

```
example/
  src/
    layouts/
      DashboardLayout.tsx   # Sidebar + TopBar + <Outlet/>, owns dark-mode & collapse state
    pages/
      Overview.tsx
      Employees.tsx
      Benefits.tsx
      Settings.tsx
    mocks/
      employees.ts          # mock HR data (name, role, department, status)
      benefits.ts
    App.tsx                 # route definitions
    main.tsx
  index.html
  vite.config.ts
  package.json
  tsconfig.json
```

## Routes

| Path         | Page      |
|--------------|-----------|
| `/`          | Overview  |
| `/employees` | Employees |
| `/benefits`  | Benefits  |
| `/settings`  | Settings  |

## Layout (`DashboardLayout`)

- `Sidebar`: nav items for the 4 routes, `header` slot (logo/wordmark), `footer`
  slot (`Avatar` + user name). `collapsed` state toggled from a button in the
  sidebar footer, persisted to `localStorage`.
- `TopBar`: `start` slot = `Breadcrumb` (current route), `end` slot = dark-mode
  `Toggle`, notification `Badge`, profile `DropdownMenu` (avatar trigger).
- Dark mode: boolean state toggled via the `TopBar` toggle, applied as `dark`
  class on `<html>`, persisted to `localStorage`, read on mount.
- Responsive: below `md` breakpoint, `Sidebar` collapses into a `Drawer`
  (left position) triggered by a hamburger `Button` in `TopBar`; `TopBar` search
  affordance hidden below `md`.

## Pages

**Overview**
- Row of `Card`s with headline metrics (headcount, active benefits, pending
  requests) using `Badge` for trend indicators.
- `Skeleton` shown for ~600ms on mount to demonstrate loading state, then
  replaced by a summary `Table` (5 most recent employee changes).
- `EmptyState` demonstrated when a mock "no pending requests" filter is active.

**Employees**
- `Table` of mock employees: columns name (`Avatar` + name), department, role,
  status (`Badge`), actions.
- Sortable columns + `Pagination` (client-side over mock array).
- Row action opens `Drawer` (right, size `md`) with employee detail form:
  `FormField` + `Input` + `Select` (department) — edit is local state only.
- Saving in the drawer fires a `Toast` (success variant).
- Delete action opens a `Modal` confirmation before removing the row from
  local state.

**Benefits**
- Grid of `Card`s per benefit plan, `Tooltip` on plan detail icon, `Popover`
  for "compare plans" quick info.
- `Tabs` to switch between "Health", "Wellness", "Financial" benefit
  categories.
- `Accordion` FAQ section below the grid.

**Settings**
- `Breadcrumb` context, form sections separated by `Divider`.
- `FormField` + `Textarea` (company bio), `Toggle` (email notifications),
  `Radio` (notification frequency), `Checkbox` (feature opt-ins).
- `Button` (primary) to "save" triggers a `Toast`.

## Component coverage

All 29 exported components are used at least once across layout + 4 pages:
Accordion, Alert (shown in Settings as a save-confirmation banner variant),
Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Divider, Drawer,
DropdownMenu, EmptyState, FormField, Input, Modal, Pagination, Popover, Radio,
Select, Sidebar, Skeleton, Spinner (button loading state on Save), Table,
Tabs, Textarea, Toast, Toggle, TokenShowcase (dedicated `/tokens` demo route,
optional bonus page), Tooltip, TopBar.

## Error handling

No real backend, so no network error states. Local-state mutations (edit/
delete) are synchronous; the only "error" path demonstrated is basic client-side
required-field validation on the Employee edit form (`FormField` error prop),
since it's the one write path with a form.

## Testing

No automated tests for `/example` — it's a demo/reference app, not a shipped
package. Manual verification: `pnpm --filter example dev`, click through all 4
routes, toggle dark mode, collapse sidebar, resize to mobile width, exercise
Employees edit/delete flow.

## Out of scope

- Real authentication, API calls, or persistence beyond `localStorage` (theme/
  collapse state only)
- Publishing `/example` as an npm package
- i18n
