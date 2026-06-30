import { describe, expect, it } from 'vitest'
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography'

describe('typography', () => {
  it('exports fontFamily with display and body', () => {
    expect(fontFamily.display).toContain('Funnel Display')
    expect(fontFamily.body).toContain('Inter')
  })

  it('exports fontSize scale with heading and body sizes', () => {
    expect(fontSize.h1).toMatch(/^\d+(\.\d+)?rem$/)
    expect(fontSize.h2).toMatch(/^\d+(\.\d+)?rem$/)
    expect(fontSize.h3).toBe('1.5rem')
    expect(fontSize.h4).toMatch(/^\d+(\.\d+)?rem$/)
    expect(fontSize.body).toBeDefined()
    expect(fontSize.displayLg).toBe('3.25rem')
  })

  it('exports fontWeight with regular/medium/semibold/bold/extraBold', () => {
    expect(fontWeight.regular).toBe('400')
    expect(fontWeight.medium).toBe('500')
    expect(fontWeight.semibold).toBe('600')
    expect(fontWeight.bold).toBe('700')
    expect(fontWeight.extraBold).toBe('800')
  })

  it('exports lineHeight scale', () => {
    expect(lineHeight.tight).toBeDefined()
    expect(lineHeight.snug).toBeDefined()
    expect(lineHeight.base).toBeDefined()
    expect(lineHeight.relaxed).toBeDefined()
  })
})
