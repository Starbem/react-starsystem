---
"@starbemtech/react-starsystem": minor
---

Correct design tokens against the Starbem Design System reference kit: fix secondary color (`#7F56D9`), fix neutral-1000 (`#272727`), add `ink` color ramp, add `error`/`warning`/`success` semantic color scales, add semantic color aliases, switch body font from Inter to Funnel Display (single-typeface system), fix h1/h2/h4 font sizes, add `overline` size and per-size `typeScale` (line-height + letter-spacing), add `space-40`, rescale border-radius (`sm` 8px, `md` 12px, `lg` 16px, `xl` 24px, `2xl` 32px), fix elevation shadow values to multi-layer DS values, add `shadowBrand` and `ringFocus` tokens, and load the missing Funnel Display `@import`.

Note: these are token corrections only — component implementations still use hardcoded Tailwind arbitrary values (hex/px) instead of consuming these tokens, so no visual change ships in this release. Component migration is tracked separately.
