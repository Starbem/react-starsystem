export const fontFamily = {
  display: '"Funnel Display", sans-serif', // [VERIFIED] — Starbem brand font
  body: '"Inter", sans-serif',             // [VERIFIED] — from Figma _Design system header
} as const

export const fontSize = {
  displayLg: '3.25rem', // [VERIFIED] — 52px from Figma Display/LG
  h1:        '2.5rem',  // PLACEHOLDER — verify Figma Heading/H1 (40px assumed)
  h2:        '2rem',    // PLACEHOLDER — verify Figma Heading/H2 (32px assumed)
  h3:        '1.5rem',  // [VERIFIED] — 24px from Figma Heading/H3
  h4:        '1.25rem', // PLACEHOLDER — verify Figma Heading/H4 (20px assumed)
  bodyLg:    '1.125rem',
  body:      '1rem',
  bodySm:    '0.875rem',
  caption:   '0.75rem',
} as const

export const fontWeight = {
  regular:   '400', // [VERIFIED] — Regular
  medium:    '500', // PLACEHOLDER — Medium (name confirmed, numeric weight assumed)
  semibold:  '600', // [VERIFIED] — Semibold
  bold:      '700', // PLACEHOLDER — Bold (name confirmed, numeric weight assumed)
  extraBold: '800', // [VERIFIED] — ExtraBold
} as const

export const lineHeight = {
  tight:   '1.2',
  snug:    '1.35',
  base:    '1.5',
  relaxed: '1.75',
} as const

export type FontFamily = typeof fontFamily
export type FontSize = typeof fontSize
export type FontWeight = typeof fontWeight
export type LineHeight = typeof lineHeight
