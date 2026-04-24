import { describe, expect, it } from 'vitest'
import { colorBrightness } from '../color-brightness'

describe('color-brightness', () => {
	it('classifies bright colors as light', () => {
		expect(colorBrightness('#ffffff')).toBe('light')
		expect(colorBrightness('#f5f5f5')).toBe('light')
	})

	it('classifies dark colors as dark', () => {
		expect(colorBrightness('#000000')).toBe('dark')
		expect(colorBrightness('#1a1a1a')).toBe('dark')
	})
})
