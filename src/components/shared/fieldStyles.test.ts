import { describe, expect, it } from 'vitest'
import {
  FIELD_SIZE_TEXT_CLASSES,
  FIELD_SIZE_PADDING_Y_CLASSES,
  FIELD_SIZE_PADDING_X_CLASSES,
  FIELD_SIZE_RADIUS_CLASSES,
  getFieldColorClasses,
  type FieldSize,
  type FieldVariant,
} from './fieldStyles'

const SIZES: FieldSize[] = ['sm', 'md', 'lg']
const VARIANTS: FieldVariant[] = ['outline', 'filled', 'underline']

describe('fieldStyles size maps', () => {
  it.each(SIZES)('%s has an entry in every size map', (size) => {
    expect(FIELD_SIZE_TEXT_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_PADDING_Y_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_PADDING_X_CLASSES[size]).toBeTruthy()
    expect(FIELD_SIZE_RADIUS_CLASSES[size]).toBeTruthy()
  })
})

describe('getFieldColorClasses', () => {
  it('disabled short-circuits regardless of variant', () => {
    for (const variant of VARIANTS) {
      const classes = getFieldColorClasses(variant, true, null)
      expect(classes).toContain('bg-neutral-50')
      expect(classes).toContain('dark:bg-neutral-900')
    }
  })

  it('outline default state uses white background, not the gray bug', () => {
    const classes = getFieldColorClasses('outline', false, null)
    expect(classes).toContain('bg-white')
    expect(classes).not.toContain('bg-neutral-25')
    expect(classes).toContain('dark:bg-ink-900')
  })

  it('outline error state adds error border classes', () => {
    const classes = getFieldColorClasses('outline', false, 'error')
    expect(classes).toContain('border-error-base')
  })

  it('outline success state adds success border classes', () => {
    const classes = getFieldColorClasses('outline', false, 'success')
    expect(classes).toContain('border-success-base')
  })

  it('filled default state uses ink-100 background', () => {
    const classes = getFieldColorClasses('filled', false, null)
    expect(classes).toContain('bg-ink-100')
  })

  it('filled focus-within uses white background, not the gray bug', () => {
    const classes = getFieldColorClasses('filled', false, null)
    expect(classes).toContain('focus-within:bg-white')
    expect(classes).toContain('dark:focus-within:bg-ink-900')
  })

  it('underline has no side borders', () => {
    const classes = getFieldColorClasses('underline', false, null)
    expect(classes).toContain('border-0')
    expect(classes).toContain('border-b')
  })

  it('underline error state adds error border-b classes', () => {
    const classes = getFieldColorClasses('underline', false, 'error')
    expect(classes).toContain('border-b-error-base')
  })

  it('underline success state adds success border-b classes', () => {
    const classes = getFieldColorClasses('underline', false, 'success')
    expect(classes).toContain('border-b-success-base')
  })

  it('null state adds no error/success classes for any variant', () => {
    for (const variant of VARIANTS) {
      const classes = getFieldColorClasses(variant, false, null)
      expect(classes).not.toContain('error-base')
      expect(classes).not.toContain('success-base')
    }
  })
})
