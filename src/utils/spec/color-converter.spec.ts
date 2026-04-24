import { describe, expect, it } from 'vitest'
import { hexToHSB, hsbToHex } from '../color-converter'

describe('color-converter', () => {
	it('converts hex to HSB for primary colors', () => {
		expect(hexToHSB('#ff0000')).toEqual({ h: 0, s: 100, b: 100 })
		expect(hexToHSB('#00ff00')).toEqual({ h: 120, s: 100, b: 100 })
		expect(hexToHSB('#0000ff')).toEqual({ h: 240, s: 100, b: 100 })
	})

	it('converts HSB to hex', () => {
		expect(hsbToHex({ h: 0, s: 100, b: 100 })).toBe('#ff0000')
		expect(hsbToHex({ h: 120, s: 100, b: 100 })).toBe('#00ff00')
		expect(hsbToHex({ h: 240, s: 100, b: 100 })).toBe('#0000ff')
	})

	it('supports round-trip conversion', () => {
		const baseHex = '#33aaff'
		const hsb = hexToHSB(baseHex)
		expect(hsbToHex(hsb)).toBe(baseHex)
	})
})
