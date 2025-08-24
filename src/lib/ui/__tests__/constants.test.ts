import {
  DESKTOP_MIN_WIDTH_PX,
  FONT_DM_SANS_VAR,
  BACKDROP_RGBA,
  BACKDROP_BLUR,
} from '../constants'

describe('UI Constants', () => {
  test('DESKTOP_MIN_WIDTH_PX should be a number', () => {
    expect(typeof DESKTOP_MIN_WIDTH_PX).toBe('number')
    expect(DESKTOP_MIN_WIDTH_PX).toBe(1024)
  })

  test('FONT_DM_SANS_VAR should be a valid CSS variable reference', () => {
    expect(typeof FONT_DM_SANS_VAR).toBe('string')
    expect(FONT_DM_SANS_VAR).toBe('var(--font-dm-sans)')
  })

  test('BACKDROP_RGBA should be a valid rgba color', () => {
    expect(typeof BACKDROP_RGBA).toBe('string')
    expect(BACKDROP_RGBA).toMatch(/^rgba\(\d+,\d+,\d+,[\d.]+\)$/)
  })

  test('BACKDROP_BLUR should be a valid CSS filter', () => {
    expect(typeof BACKDROP_BLUR).toBe('string')
    expect(BACKDROP_BLUR).toContain('blur(')
    expect(BACKDROP_BLUR).toContain('brightness(')
  })

  test('all constants should be exported', () => {
    expect(DESKTOP_MIN_WIDTH_PX).toBeDefined()
    expect(FONT_DM_SANS_VAR).toBeDefined()
    expect(BACKDROP_RGBA).toBeDefined()
    expect(BACKDROP_BLUR).toBeDefined()
  })
})
