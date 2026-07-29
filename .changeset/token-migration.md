---
"@starbemtech/react-starsystem": patch
---

Migrate all existing components from hardcoded hex/px/shadow values to design tokens defined in the `@theme` block (colors, radius, elevation shadows). No API or behavior change — visual-only, aligning components with the corrected Starbem Design System tokens (secondary color, radius scale, shadow elevations) from the earlier token-correction release. A handful of values with no DS equivalent (two Button glass-variant glows, the Checkbox/Radio focus glow, the Select focus glow) remain hardcoded and are tracked as known technical debt.
