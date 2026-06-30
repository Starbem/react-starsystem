export const colors = {
  primary: {
    base:     '#FF5100', // [VERIFIED]
    light:    '#FF7A40', // PLACEHOLDER — verify in Figma Primary/Light
    lighter:  '#FFA880', // PLACEHOLDER — verify in Figma Primary/Lighter
    lightest: '#FFD4BF', // PLACEHOLDER — verify in Figma Primary/Lightest
    dark:     '#CC4100', // PLACEHOLDER — verify in Figma Primary/Dark
    darker:   '#993100', // PLACEHOLDER — verify in Figma Primary/Darker
    darkest:  '#662000', // PLACEHOLDER — verify in Figma Primary/Darkest
  },
  secondary: {
    base:     '#8660EC', // [VERIFIED]
    light:    '#A888F2', // PLACEHOLDER — verify in Figma Secondary/Light
    lighter:  '#C9B0F7', // PLACEHOLDER — verify in Figma Secondary/Lighter
    lightest: '#E4D8FB', // PLACEHOLDER — verify in Figma Secondary/Lightest
    dark:     '#6B48D4', // PLACEHOLDER — verify in Figma Secondary/Dark
    darker:   '#461FAE', // [VERIFIED]
    darkest:  '#2D1070', // PLACEHOLDER — verify in Figma Secondary/Darkest
  },
  terciary: {
    base:     '#ED2E98', // [VERIFIED]
    light:    '#F268B6', // PLACEHOLDER — verify in Figma Terciary/Light
    lighter:  '#F7A2D0', // PLACEHOLDER — verify in Figma Terciary/Lighter
    lightest: '#FBCFE6', // PLACEHOLDER — verify in Figma Terciary/Lightest
    dark:     '#C4207C', // PLACEHOLDER — verify in Figma Terciary/Dark
    darker:   '#9B1562', // PLACEHOLDER — verify in Figma Terciary/Darker
    darkest:  '#6B0D44', // PLACEHOLDER — verify in Figma Terciary/Darkest
  },
  neutral: {
    white:  '#FFFFFF', // [VERIFIED]
    25:     '#F7F7F7', // [VERIFIED]
    50:     '#F0F0F0', // PLACEHOLDER — verify in Figma Neutral/50
    100:    '#E8E8E8', // PLACEHOLDER — verify in Figma Neutral/100
    200:    '#D0D0D0', // PLACEHOLDER — verify in Figma Neutral/200
    300:    '#B6B6B6', // [VERIFIED]
    400:    '#9C9C9C', // PLACEHOLDER — verify in Figma Neutral/400
    500:    '#808080', // PLACEHOLDER — verify in Figma Neutral/500
    600:    '#626262', // PLACEHOLDER — verify in Figma Neutral/600
    700:    '#4E4E4E', // PLACEHOLDER — verify in Figma Neutral/700
    800:    '#393939', // [VERIFIED]
    900:    '#252525', // PLACEHOLDER — verify in Figma Neutral/900
    1000:   '#101828', // [VERIFIED]
    black:  '#000000', // [VERIFIED]
  },
} as const

export type Colors = typeof colors
