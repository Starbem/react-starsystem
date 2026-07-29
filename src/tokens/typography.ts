// Source of truth: Starbem Design System reference kit (tokens/typography.css,
// tokens/fonts.css). ONE typeface across the whole system — Funnel Display —
// for display, headings, UI, body, labels and captions.
export const fontFamily = {
  display: '"Funnel Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  body:    '"Funnel Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
} as const

export const fontSize = {
  displayLg: '3.25rem',  // 52px
  h1:        '2.25rem',  // 36px
  h2:        '1.875rem', // 30px
  h3:        '1.5rem',   // 24px
  h4:        '1.375rem', // 22px
  bodyLg:    '1.125rem', // 18px — DS "subtitle-lg"
  body:      '1rem',     // 16px — DS "subtitle-md"
  bodySm:    '0.875rem', // 14px — DS "subtitle-sm"
  caption:   '0.75rem',  // 12px
  overline:  '0.625rem', // 10px
} as const

export const fontWeight = {
  light:     '300',
  regular:   '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extraBold: '800',
} as const

export const lineHeight = {
  tight:   '1.2',
  snug:    '1.35',
  base:    '1.5',
  relaxed: '1.75',
} as const

// Line-height and letter-spacing paired to each type-scale step (DS type scale).
export const typeScale = {
  displayLg: { fontSize: '3.25rem',  lineHeight: '4rem',      letterSpacing: '-1.04px' },
  h1:        { fontSize: '2.25rem',  lineHeight: '2.75rem',   letterSpacing: '0px' },
  h2:        { fontSize: '1.875rem', lineHeight: '2.375rem',  letterSpacing: '0px' },
  h3:        { fontSize: '1.5rem',   lineHeight: '2rem',      letterSpacing: '0.5px' },
  h4:        { fontSize: '1.375rem', lineHeight: '1.75rem',   letterSpacing: '0.5px' },
  bodyLg:    { fontSize: '1.125rem', lineHeight: '1.5rem',    letterSpacing: '0.25px' },
  body:      { fontSize: '1rem',     lineHeight: '1.5rem',    letterSpacing: '0.5px' },
  bodySm:    { fontSize: '0.875rem', lineHeight: '1.25rem',   letterSpacing: '0.1px' },
  caption:   { fontSize: '0.75rem',  lineHeight: '1rem',      letterSpacing: '0.5px' },
  overline:  { fontSize: '0.625rem', lineHeight: '1rem',      letterSpacing: '0.5px' },
} as const

export type FontFamily = typeof fontFamily
export type FontSize = typeof fontSize
export type FontWeight = typeof fontWeight
export type LineHeight = typeof lineHeight
export type TypeScale = typeof typeScale
