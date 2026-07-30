---
"@starbemtech/react-starsystem": patch
---

Tech debt cleanup: Progress track now has a dark-mode background color; Menu's drawer panel content stays mounted while closed so the close animation actually slides, and the closed panel is now marked `inert` to prevent keyboard focus on hidden controls; AvatarGroup now respects an explicit `ring` prop on child Avatars instead of always forcing it to `true`; Checkbox's hover shadow is now tone-aware and dark-mode-aware (previously a single hardcoded amber color regardless of tone). Also added test coverage for FilterChip's disabled propagation, Tabs' mixed-content rendering, and Spinner's combined size+thickness behavior. No public API changes.
