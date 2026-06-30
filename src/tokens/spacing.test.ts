import { describe, expect, it } from 'vitest'
import { spacing, borderRadius, shadows } from './spacing'

describe('spacing', () => {
  it('exports spacing scale with px string values', () => {
    expect(spacing[0]).toBe('0px')
    expect(spacing[4]).toBe('16px')
    expect(spacing[8]).toBe('32px')
  })

  it('exports full spacing scale keys', () => {
    expect(spacing[1]).toBe('4px')
    expect(spacing[2]).toBe('8px')
    expect(spacing[3]).toBe('12px')
    expect(spacing[5]).toBe('20px')
    expect(spacing[6]).toBe('24px')
    expect(spacing[10]).toBe('40px')
    expect(spacing[12]).toBe('48px')
    expect(spacing[16]).toBe('64px')
    expect(spacing[20]).toBe('80px')
    expect(spacing[24]).toBe('96px')
    expect(spacing[32]).toBe('128px')
  })
})

describe('borderRadius', () => {
  it('exports borderRadius with Figma-verified values', () => {
    expect(borderRadius.none).toBe('0')
    expect(borderRadius.sm).toBe('9px')    // [VERIFIED] — logo card containers rounded-[9px]
    expect(borderRadius.md).toBe('16px')   // [VERIFIED] — design system header rounded-tl-[16px]
    expect(borderRadius.lg).toBe('32px')   // [VERIFIED] — design system header rounded-tl-[32px]
    expect(borderRadius.full).toBe('9999px')
  })

  it('exports borderRadius with xl and 2xl', () => {
    expect(borderRadius.xl).toMatch(/^\d+px$/)
    expect(borderRadius['2xl']).toMatch(/^\d+px$/)
  })
})

describe('shadows', () => {
  it('exports elevation00 as none', () => {
    expect(shadows.elevation00).toBe('none')
  })

  it('exports elevation01 through elevation06 as defined placeholder values', () => {
    expect(shadows.elevation01).toBeDefined()
    expect(shadows.elevation02).toBeDefined()
    expect(shadows.elevation03).toBeDefined()
    expect(shadows.elevation04).toBeDefined()
    expect(shadows.elevation05).toBeDefined()
    expect(shadows.elevation06).toBeDefined()
    expect(shadows.elevationSecondary).toBeDefined()
    expect(shadows.elevationHoverSecondary).toBeDefined()
  })
})
