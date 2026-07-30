// Source of truth: Starbem Design System reference kit (tokens/colors.css).
export const colors = {
  brand: {
    orange: '#FF5100', // the star, marketing, hero accents
    purple: '#7F56D9', // product UI primary — buttons, links
    pink: '#ED2E98', // star accent points, playful highlights
    yellow: '#FFDA44', // warm accent, highlights
  },
  primary: {
    base: '#FF5100',
    light: '#FF9353',
    lighter: '#FFC992',
    lightest: '#FFF1E0',
    dark: '#D03700',
    darker: '#A31B00',
    darkest: '#900700',
  },
  secondary: {
    base: '#7F56D9',
    light: '#AE8EF1',
    lighter: '#D1B4F6',
    lightest: '#F3E9FC',
    dark: '#5A40B5',
    darker: '#461FAE',
    darkest: '#18176B',
  },
  terciary: {
    base: '#ED2E98',
    light: '#F263A6',
    lighter: '#F68FAF',
    lightest: '#FFF3E3',
    dark: '#C01857',
    darker: '#930620',
    darkest: '#7C0008',
  },
  neutral: {
    white: '#FFFFFF',
    25: '#F7F7F7',
    50: '#EFEFEF',
    100: '#E2E2E2',
    200: '#CFCFCF',
    300: '#B6B6B6',
    400: '#9C9C9C',
    500: '#808080',
    600: '#656565',
    700: '#4D4D4D',
    800: '#393939',
    900: '#2C2C2C',
    1000: '#272727',
    black: '#000000',
  },
  // Cool near-blacks used for text & UI chrome.
  ink: {
    900: '#101828',
    800: '#1C1B1F',
    700: '#344054',
    600: '#475467',
    500: '#667085',
    300: '#D0D5DD',
    200: '#EAECF0',
    100: '#F2F4F7',
    50: '#F9FAFB',
  },
  error: {
    lightest: '#FFEDE7',
    lighter: '#FFBDAE',
    light: '#FF867E',
    base: '#FF4242',
    dark: '#CE2329',
    darker: '#9A0912',
    darkest: '#7E0108',
  },
  warning: {
    lightest: '#FEF8E9',
    lighter: '#FBE3B3',
    light: '#F9C486',
    base: '#F8A04D',
    dark: '#CE7734',
    darker: '#A2491A',
    darkest: '#8D2B0E',
  },
  success: {
    lightest: '#E3F6EF',
    lighter: '#9FE1C5',
    light: '#67D097',
    base: '#1FBA5D',
    dark: '#189443',
    darker: '#116D28',
    darkest: '#0E5A19',
  },
} as const

// Semantic aliases — use these in product UI instead of raw scale steps.
export const semanticColors = {
  colorPrimary: colors.primary.base,
  colorPrimaryHover: colors.primary.dark,
  colorPrimaryPress: colors.primary.darker,
  colorPrimarySubtle: colors.primary.lightest,

  colorSecondary: colors.secondary.base,
  colorSecondaryHover: colors.secondary.dark,
  colorSecondaryPress: colors.secondary.darker,
  colorSecondarySubtle: colors.secondary.lightest,

  colorAccent: colors.brand.pink,
  colorAccentSubtle: colors.terciary.lightest,

  textPrimary: colors.ink[900],
  textSecondary: colors.ink[600],
  textTertiary: colors.ink[500],
  textOnBrand: '#FFFFFF',
  textDisabled: colors.neutral[400],
  textLink: colors.secondary.base,

  surfacePage: colors.ink[50],
  surfaceCard: '#FFFFFF',
  surfaceSunken: colors.ink[100],
  surfaceInverse: colors.ink[800],

  borderSubtle: colors.ink[200],
  borderDefault: colors.ink[300],
  borderStrong: colors.neutral[400],
  borderFocus: colors.primary.base,
} as const

export type Colors = typeof colors
export type SemanticColors = typeof semanticColors
