// Source of truth: Starbem Design System reference kit (tokens/spacing.css,
// tokens/shadows.css).
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
} as const

export const borderRadius = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px', // default button/control radius
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const

export const shadows = {
  elevation00: 'none',
  elevation01: '0px 1px 2px 0px rgba(16,24,40,0.05)',
  elevation02: '0px 1px 3px 0px rgba(16,24,40,0.10), 0px 1px 2px 0px rgba(16,24,40,0.06)',
  elevation03: '0px 4px 8px -2px rgba(16,24,40,0.10), 0px 2px 4px -2px rgba(16,24,40,0.06)',
  elevation04: '0px 12px 16px -4px rgba(16,24,40,0.08), 0px 4px 6px -2px rgba(16,24,40,0.03)',
  elevation05: '0px 20px 24px -4px rgba(16,24,40,0.08), 0px 8px 8px -4px rgba(16,24,40,0.03)',
  elevation06: '0px 24px 48px -12px rgba(12,17,29,0.18)',
  elevation07: '0px 32px 64px -12px rgba(12,17,29,0.14)',
  // Lib-only extensions — no DS equivalent, kept as-is (may already be in use).
  elevationSecondary: '0 4px 16px rgba(237,46,152,0.32)',
  elevationHoverSecondary: '0 4px 24px rgba(237,46,152,0.48)',
  // Soft brand glow — highlighted/focused surfaces.
  shadowBrand: '0px 1px 8px 0px rgba(21,55,96,0.10)',
  // Focus ring — orange, matches the principal interactive color.
  ringFocus: '0px 0px 0px 4px rgba(255,81,0,0.20)',
} as const

export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
