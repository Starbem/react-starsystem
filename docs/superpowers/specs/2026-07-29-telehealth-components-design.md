# Telehealth Components (Calendar, DateInput, Schedule, Message, VideoCall) — Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 5 new components to `@starbemtech/react-starsystem` — `Calendar`, `DateInput`, `Schedule`, `Message` (+ siblings), `VideoCall` — closing the highest-priority gap found when auditing the lib against the Starbem Design System reference kit (`/Users/juliosousa/Downloads/Starbem Design System/`). These 5 are the telemedicine/scheduling domain components: the DS treats them as central to the Starbem product (video consultation, chat with care team, appointment booking), and today the lib has zero equivalent.

**Architecture:** Same structure as all 30 existing components — one folder per component under `src/components/<Name>/` with `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts`, re-exported from `src/index.ts`. No new runtime dependency: native `Date`, plain SVG/CSS, no date-picker or video/chat library. Reuses existing lib components (`Icon`, `Avatar`, `Spinner`) exactly as the DS reference does.

**Tech Stack:** React 18+, TypeScript strict, Tailwind CSS v4 (`cn()` utility for class merging), vitest + `vitest-axe` for tests, no Storybook (stories use `src/docs-types.ts` `Meta`/`StoryObj`).

## Global Constraints

- Icon props on these components are `ReactNode` (consumer renders `<Icon name="..."/>` and passes it in), matching every existing component in the lib (Badge, Alert, DropdownMenu, etc.) — NOT the DS reference's `icon: string` contract. Internal fixed icons (e.g. VideoCall's mic/camera/hang-up glyphs, Calendar's chevrons) render `<Icon>` directly in the component's own JSX and are not exposed as configurable icon-name props.
- Dates use native `Date` objects everywhere, except `Schedule`'s `date` prop and `ScheduleEvent.date` field, which are `"YYYY-MM-DD"` strings — matching the DS reference exactly. No date library dependency (no date-fns, dayjs, etc).
- No WebRTC/real video or chat transport logic. `VideoCall` and `Message` are presentational surfaces only — `remoteSrc`/`selfSrc` are plain media sources (`<video>`/`<img>`), same as the DS reference.
- Every component: TypeScript strict, no `any`, exported `<Name>Props` type, `cn()` for class merging, WCAG 2.1 AA (semantic HTML/ARIA, `vitest-axe` in tests).
- Build/lint/typecheck must stay green throughout (`pnpm lint && pnpm typecheck && pnpm build`, `pnpm test`).
- A `pnpm changeset` (minor bump) is added once all 5 components are done, following this repo's existing Changesets workflow — no manual version bump.

---

## Task order and dependency

`DateInput` renders `Calendar` inside a popover, so `Calendar` must exist first. The other three (`Schedule`, `Message`, `VideoCall`) have no cross-dependency and can be built in any order:

1. **Calendar** (base — no dependency on the others)
2. **DateInput** (depends on Calendar)
3. **Schedule** (independent)
4. **Message** + `TypingMessage` + `MessageDay` + `SystemMessage` + `MessageList` (independent)
5. **VideoCall** (independent — uses `Icon`, `Avatar`, `Spinner`, all already in the lib)

---

## Component 1: Calendar

**Purpose:** Material-style month date picker. Days rendered as circles; selected day is a filled primary circle, today gets an outline ring, marked days show a dot. Self-contained month/year navigation — clicking the header title cycles through a `days → months → years` picker, same as the DS reference.

**Props (`CalendarProps`):**
- `initialMonth?: number` (0–11, default: current month)
- `initialYear?: number` (default: current year)
- `selected?: Date` (controlled selected day)
- `markedDays?: Date[]` (default `[]`) — days that render a dot indicator
- `onSelect?: (date: Date) => void`
- Rest: spreads onto the root `<div>` (standard HTML div attributes)

**Internal state:** `mode: 'days' | 'months' | 'years'` (starts at `'days'`), `viewMonth`/`viewYear` (starts at `initialMonth`/`initialYear` or current date). Clicking the header title toggles `days → months`; clicking a month in month-view sets `viewMonth` and returns to `days`; long-press/alt path to `years` mirrors the DS reference's three-mode picker.

**Rendering:**
- Header: `chevron_left` / `chevron_right` icons (prev/next month in `days` mode; prev/next year-block in `months`/`years` mode) + clickable month/year title with `arrow_drop_down`/`arrow_drop_up` icon indicating current mode.
- Day grid: 7-column grid, weekday abbreviations row (localized `Dom Seg Ter Qua Qui Sex Sáb`), days as circular buttons. Today: outline ring. Selected: filled primary circle. Marked (matches any `markedDays` by Y/M/D): small dot under the number.
- Month grid (`months` mode): 12 month names in a 3-column grid, click sets `viewMonth` and switches back to `days`.
- Year grid (`years` mode): decade block of years, click sets `viewYear` and switches to `months`.

**Testing:** render default month; navigate to next/prev month via chevron click and assert header title changes; click a day and assert `onSelect` fires with the correct `Date`; assert marked day renders a dot; assert today gets the ring class; `axe(container)` no violations.

---

## Component 2: DateInput

**Purpose:** Text field for a date (`dd/mm/aaaa` by default), with a calendar-icon button that opens `Calendar` in a popover; typing and calendar selection stay in sync.

**Props (`DateInputProps`):**
- `label?: string`
- `required?: boolean` (default `false`)
- `hint?: string`
- `error?: string`
- `success?: string`
- `variant?: 'outline' | 'filled'` (default `'outline'`)
- `size?: 'sm' | 'md' | 'lg'` (default `'md'`)
- `format?: 'short' | 'long' | 'iso'` (default `'short'`) — display format when not focused (`dd/mm/aaaa`, `d de Mês de aaaa`, `aaaa-mm-dd`)
- `placeholder?: string` (default `'dd/mm/aaaa'`)
- `value?: Date | null` (controlled)
- `defaultValue?: Date | null` (uncontrolled)
- `onChange?: (date: Date | null) => void`
- `markedDays?: Date[]` (default `[]`) — forwarded to the internal `Calendar`
- `disabled?: boolean` (default `false`)
- `id?: string`

**Behavior:**
- Typed text is parsed accepting `dd/mm/aaaa`, `dd-mm-aaaa`, `aaaa-mm-dd`. On blur/Enter, an unparseable non-empty value sets a local "Data inválida" error state (visually identical to the `error` prop styling) without calling `onChange`.
- Calendar-icon button (leading or trailing, matching the DS reference's field layout) opens a popover with `<Calendar selected={value} markedDays={markedDays} onSelect={...}/>`; picking a day sets the field text (formatted per `format`) and calls `onChange`, then closes the popover.
- Popover closes on: day pick, click outside (document `mousedown` listener while open, cleaned up on unmount/close), `Escape` key.
- `error`/`success` render the same as `Input`'s existing error/hint pattern (icon + colored text under the field) for visual consistency with the rest of the form components — reusing the same Tailwind classes `Input.tsx` already defines for those states rather than re-deriving new ones.
- Controlled vs uncontrolled: if `value` prop is passed, the field is controlled (external state is the source of truth, internal text always re-derives from it); otherwise internal state seeded from `defaultValue` drives it, same convention as `Input`/`Select` elsewhere in the lib.

**Testing:** type a valid `dd/mm/aaaa` string and blur, assert `onChange` fires with the correct `Date`; type garbage and blur, assert "Data inválida" shows and `onChange` does NOT fire; open calendar via icon click, pick a day, assert field text updates and popover closes; click outside while open, assert popover closes; `Escape` closes it; `axe(container)` no violations.

---

## Component 3: Schedule

**Purpose:** Day/week/month agenda view (Google Calendar/Meet style) with an hour grid, positioned events, and a "join video" chip for consultation events.

**Props (`ScheduleProps`):**
- `view?: 'day' | 'week' | 'month'` (default `'day'`)
- `date?: string` (`"YYYY-MM-DD"`, default: today)
- `events?: ScheduleEvent[]` (default `[]`)
- `startHour?: number` (default `8`)
- `endHour?: number` (default `19`)
- `hourHeight?: number` (default `60`, px per hour row in day/week views)
- `weekStartsOn?: 0 | 1` (default `0`, Sunday or Monday)
- `nowAt?: string` (`"HH:mm"`, override for the "now" line — testing hook, defaults to real current time)
- `title?: string` (overrides the auto-generated header title)
- `onEventClick?: (event: ScheduleEvent) => void`
- `onViewChange?: (view: 'day' | 'week' | 'month') => void`
- `onDateChange?: (date: string) => void`

**`ScheduleEvent` type:**
```ts
export interface ScheduleEvent {
  id: string
  date?: string       // "YYYY-MM-DD", required in week/month views; optional in day view (assumes `date` prop)
  start: string        // "HH:mm"
  end: string          // "HH:mm"
  title: string
  subtitle?: string
  color?: string
  bg?: string
  meet?: boolean        // renders a "Entrar com vídeo" chip on the event
}
```

**Rendering:**
- Header: prev/next chevrons (day/week/month depending on `view`) + title (auto-formatted per view, e.g. "29 de julho de 2026" in day view, "23–29 jul" in week view, "Julho 2026" in month view) + `schedule` icon.
- Day/week view: vertical hour grid from `startHour` to `endHour`, row height `hourHeight`; events positioned absolutely by pixel offset computed from `start`/`end` minus `startHour`; a horizontal "now" line at the current (or `nowAt`) time if it falls within the visible range and the visible date includes today.
- Month view: standard month grid, each day cell shows up to N event chips (color dot + title truncated) plus a "+N" overflow indicator.
- Event with `meet: true`: renders a `videocam` icon + "Entrar com vídeo" chip inside the event block; clicking the event (anywhere, including the chip) calls `onEventClick` with the full event — no separate "join" callback, matching the DS reference (join semantics are the consuming app's responsibility via `onEventClick`).
- Responsive: header stacks on narrow containers, week view scrolls horizontally, month view collapses event chips to dots below a container-query breakpoint (mirrors the DS reference's own responsive behavior).

**Testing:** render day view with an event inside/outside the visible hour range (assert position/visibility); click an event, assert `onEventClick` fires with the right event; click next/prev, assert `onDateChange`/header title update; switch `view` prop, assert `onViewChange` callback path and that month view renders a full month grid; `axe(container)` no violations.

---

## Component 4: Message (+ siblings)

**Purpose:** Chat bubble set for patient/care-team messaging: incoming/outgoing bubbles, delivery ticks, attachments, reactions, plus list-level helpers (day divider, typing indicator, system message, list container).

**Exports from `Message/Message.tsx`:** `Message`, `TypingMessage`, `MessageDay`, `SystemMessage`, `MessageList` (all re-exported from `Message/index.ts`).

**`MessageProps`:**
- `side?: 'in' | 'out'` (default `'in'`)
- `children: ReactNode` (message text/body)
- `time?: string` (e.g. `"14:32"`)
- `status?: 'sent' | 'delivered' | 'read'` (only rendered when `side === 'out'`; renders `check`/`done_all` tick icons, `read` colors the ticks primary)
- `author?: string` (shown above the bubble — group-chat case)
- `avatarSrc?: string`
- `avatarName?: string` (passed to `Avatar` as fallback initials)
- `reactions?: { emoji: string; count?: number }[]`
- `attachment?: 'image' | 'file' | 'voice'`
- `imageSrc?: string` (when `attachment === 'image'`)
- `fileName?: string`, `fileSize?: string` (when `attachment === 'file'`, with a `description`/`download` icon pair)
- Voice attachment renders a static waveform bar + `play_arrow` icon (no real playback logic — presentational only, matching the DS reference)

**`TypingMessage({ avatarSrc?, avatarName?, className? })`** — three-dot animated typing bubble with optional avatar, `side: 'in'` only.

**`MessageDay({ children: ReactNode })`** — centered date-divider row (e.g. "Hoje", "12 de julho").

**`SystemMessage({ children: ReactNode })`** — centered system note (e.g. "Consulta agendada para 14:00").

**`MessageList({ children: ReactNode, className? })`** — flex-column container with the vertical gap/scroll styling for a list of the above.

**Testing:** render `side="in"` and `side="out"`, assert bubble alignment/color class differs; render each `status` value and assert the correct tick icon; render each `attachment` type and assert its distinctive content renders; render `reactions` and assert chip count text; `TypingMessage`/`MessageDay`/`SystemMessage`/`MessageList` each get a basic render + a11y test; `axe(container)` no violations on a `MessageList` with a mixed set of children.

---

## Component 5: VideoCall

**Purpose:** Telehealth video-consultation surface (fills its container — the consuming app gives it a sized parent). Two layouts, three call statuses, optional controlled mic/camera.

**Props (`VideoCallProps`):**
- `name?: string` (default `"Dra. Luciana Martins"`)
- `specialty?: string` (default `"Dermatologia"`)
- `remoteSrc?: string` (remote party's video/image source)
- `selfSrc?: string` (local self-view PiP source)
- `layout?: 'spotlight' | 'grid'` (default `'spotlight'`) — spotlight: remote full-bleed + self picture-in-picture; grid: two equal tiles
- `status?: 'live' | 'connecting' | 'ended'` (default `'live'`)
- `timer?: string` (default `"12:04"`, elapsed-call display — consumer supplies the formatted string, no internal clock)
- `connection?: string` (default `"Conexão estável"`, connection-quality caption)
- `caption?: string` (optional live-caption/subtitle line overlay)
- `mic?: boolean` (controlled; uncontrolled internal state if omitted)
- `camera?: boolean` (controlled; uncontrolled internal state if omitted)
- `onToggleMic?: (next: boolean) => void`
- `onToggleCamera?: (next: boolean) => void`
- `onEnd?: () => void`
- `onChat?: () => void` (chat-toggle button renders ONLY if this is passed)
- `onMore?: () => void` (overflow-menu button renders ONLY if this is passed)

**Rendering per `status`:**
- `'live'`: renders `remoteSrc`/`selfSrc` per `layout`, control bar (mic toggle `mic`/`mic_off` icon, camera toggle `videocam`/`videocam_off` icon, `call_end` red hang-up button, optional chat/more buttons), connection chip (`signal_cellular_alt` icon + `connection` text), `timer` display, optional `caption` overlay line.
- `'connecting'`: shows `Avatar` (name/specialty) + `Spinner` + "Conectando..." copy; if `onEnd` is passed, an optional cancel button appears.
- `'ended'`: shows `Avatar` + "Consulta encerrada" message, no control bar.

**Testing:** render each `status` value and assert the distinctive content (spinner in connecting, control bar in live, end message in ended); render each `layout` and assert tile structure differs; click mic/camera toggle (uncontrolled) and assert internal icon state flips + callback fires with the right boolean; pass `mic`/`camera` as controlled props and assert the component reflects the prop rather than internal toggling; `onChat`/`onMore` buttons absent when their callback is omitted, present when passed; `axe(container)` no violations in the `'live'` state.

---

## File structure

```
src/components/
  Calendar/
    Calendar.tsx
    Calendar.test.tsx
    Calendar.stories.tsx
    index.ts
  DateInput/
    DateInput.tsx
    DateInput.test.tsx
    DateInput.stories.tsx
    index.ts
  Schedule/
    Schedule.tsx
    Schedule.test.tsx
    Schedule.stories.tsx
    index.ts
  Message/
    Message.tsx          # Message, TypingMessage, MessageDay, SystemMessage, MessageList
    Message.test.tsx
    Message.stories.tsx
    index.ts
  VideoCall/
    VideoCall.tsx
    VideoCall.test.tsx
    VideoCall.stories.tsx
    index.ts
```

`src/index.ts` gets 5 new export blocks (one per component, following the existing pattern for all other components).

## Error handling

None of these components perform network I/O or async work internally — all data (events, messages, media sources, dates) comes in via props, and all side effects are reported outward via callbacks. There is therefore no error-boundary or retry logic to design: an invalid `DateInput` string surfaces as a local "Data inválida" validation state (covered above), and everything else is pure rendering of whatever props are passed. Consuming apps own network/WebRTC/chat-transport error handling entirely.

## Testing

Every component: vitest render tests per variant/prop documented above, callback-firing assertions, and one `vitest-axe` `axe(container)` + `toHaveNoViolations()` check per component (matching the existing 30 components' test pattern exactly). No new test tooling needed.

## Out of scope

- Real WebRTC/video transport, real chat transport/websocket — these are presentational surfaces only, exactly like the DS reference.
- `Progress`, `Tag`, `IconButton`, `FilterBar`, `FileUploader`, `ListItem`, `Chart` — tracked as a separate, lower-priority spec (Spec B).
- Migrating the 30 existing components to consume the corrected design tokens (colors/radius/shadows) instead of hardcoded Tailwind arbitrary values — tracked separately, per the token-audit conversation.
