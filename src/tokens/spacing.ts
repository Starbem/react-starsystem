export const spacing = {
  0:  '0px',
  1:  '4px',   // PLACEHOLDER — standard 4px base unit
  2:  '8px',   // [VERIFIED] — gap-[8px] in header section title
  3:  '12px',
  4:  '16px',  // [VERIFIED] — gap-[16px] in logo+title group
  5:  '20px',  // [VERIFIED] — gap-[20px] in heading group
  6:  '24px',
  8:  '32px',  // [VERIFIED] — gap-[32px] in Cover subtitle
  10: '40px',  // [VERIFIED] — gap-[40px], p-[40px] in Card containers
  12: '48px',
  16: '64px',  // [VERIFIED] — pt-[64px] in _Design system header
  20: '80px',  // [VERIFIED] — px-[80px] in _Design system header content
  24: '96px',  // [VERIFIED] — pb-[96px] in _Design system header content
  32: '128px', // [VERIFIED] — gap-[128px] in _Design system header sections
} as const

export const borderRadius = {
  none: '0',
  sm:   '9px',    // [VERIFIED] — logo card containers (rounded-[9px])
  md:   '16px',   // [VERIFIED] — _Design system header (rounded-tl-[16px])
  lg:   '32px',   // [VERIFIED] — _Design system header (rounded-tl-[32px], rounded-bl-[32px])
  xl:   '40px',   // PLACEHOLDER — verify in Figma (extrapolated from lg=32px)
  '2xl': '48px',  // PLACEHOLDER — verify in Figma
  full: '9999px', // PLACEHOLDER — standard convention
} as const

export const shadows = {
  elevation00: 'none',                                        // [VERIFIED] — Elevation/00 = no shadow
  elevation01: '0 1px 2px rgba(0,0,0,0.08)',                  // PLACEHOLDER — verify in Figma Elevation/01
  elevation02: '0 2px 4px rgba(0,0,0,0.12)',                  // PLACEHOLDER — verify in Figma Elevation/02
  elevation03: '0 4px 8px rgba(0,0,0,0.12)',                  // PLACEHOLDER — verify in Figma Elevation/03
  elevation04: '0 8px 16px rgba(0,0,0,0.12)',                 // PLACEHOLDER — verify in Figma Elevation/04
  elevation05: '0 16px 24px rgba(0,0,0,0.12)',                // PLACEHOLDER — verify in Figma Elevation/05
  elevation06: '0 24px 40px rgba(0,0,0,0.16)',                // PLACEHOLDER — verify in Figma Elevation/06
  elevationSecondary: '0 4px 16px rgba(237,46,152,0.32)',     // PLACEHOLDER — verify in Figma Elevation/Secondary (Terciary/Base: #ED2E98)
  elevationHoverSecondary: '0 4px 24px rgba(237,46,152,0.48)', // PLACEHOLDER — verify in Figma Elevation/Hover/Secondary
} as const

export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
