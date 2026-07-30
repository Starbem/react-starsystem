---
"@starbemtech/react-starsystem": minor
---

`Textarea`: move the `label` above the field instead of floating it inside the bordered box (matches `Input`/`Select`/`FormField`'s label position — visual change for consumers using `<Textarea label="..."/>` standalone, no type-level breaking change). Add `variant` (`outline` default, `filled`, `underline`), `size` (`sm`, `md` default, `lg`), a `success` state (parallel to `error`, mutually exclusive — `error` wins if both are set), and an opt-in character counter (`showCount`, requires `maxLength`).

`Select`: add `variant`, `size`, and `success`, matching `Input`/`Textarea`. Fixes the trigger's fixed `56px` height and `16px/8px` padding (now organic height with `14px/10px` padding on the `md` default, matching the design system), and fixes the trigger and popover menu background, which used an incorrect gray (`#F7F7F7`) instead of white.

Internal: extracted the `variant`/`size` color and sizing logic shared by `Input`, `Textarea`, and `Select` into `src/components/shared/fieldStyles.ts` — not part of the public API, but public type aliases (`InputVariant`, `InputSize`, `TextareaVariant`, `TextareaSize`, `SelectVariant`, `SelectSize`) are preserved for existing imports.
