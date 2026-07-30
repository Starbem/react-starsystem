---
"@starbemtech/react-starsystem": minor
---

`Input`: move the `label` above the field instead of floating it inside the bordered box (matches `Select`/`FormField`'s existing label position — visual change for consumers using `<Input label="..."/>` standalone without a `FormField` wrapper, no type-level breaking change). Add `variant` (`outline` default, `filled`, `underline`), `size` (`sm`, `md` default, `lg`), a `success` state (parallel to `error`, mutually exclusive — `error` wins if both are set), and `prefix`/`suffix` add-ons. Also fixes the `md` size's padding/radius, which previously used `16px/8px` padding and a 16px radius instead of the design system's `14px/10px` padding and 12px radius.
