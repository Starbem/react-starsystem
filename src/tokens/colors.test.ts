import { describe, expect, it } from 'vitest'
import { colors } from './colors'

const hexPattern = /^#[0-9a-fA-F]{6}$/

describe('colors', () => {
  it('exports primary palette (orange) with verified base', () => {
    expect(colors.primary.base).toBe('#FF5100')
    expect(colors.primary.light).toMatch(hexPattern)
    expect(colors.primary.lighter).toMatch(hexPattern)
    expect(colors.primary.lightest).toMatch(hexPattern)
    expect(colors.primary.dark).toMatch(hexPattern)
    expect(colors.primary.darker).toMatch(hexPattern)
    expect(colors.primary.darkest).toMatch(hexPattern)
  })
  it('exports secondary palette (purple) with verified base and darker', () => {
    expect(colors.secondary.base).toBe('#8660EC')
    expect(colors.secondary.darker).toBe('#461FAE')
    expect(colors.secondary.light).toMatch(hexPattern)
    expect(colors.secondary.darkest).toMatch(hexPattern)
  })
  it('exports terciary palette (pink) with verified base', () => {
    expect(colors.terciary.base).toBe('#ED2E98')
    expect(colors.terciary.light).toMatch(hexPattern)
    expect(colors.terciary.darkest).toMatch(hexPattern)
  })
  it('exports neutral palette with verified stops', () => {
    expect(colors.neutral.white).toBe('#FFFFFF')
    expect(colors.neutral[25]).toBe('#F7F7F7')
    expect(colors.neutral[300]).toBe('#B6B6B6')
    expect(colors.neutral[800]).toBe('#393939')
    expect(colors.neutral[1000]).toBe('#101828')
    expect(colors.neutral.black).toBe('#000000')
  })
})
