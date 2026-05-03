import { describe, expect, it } from 'vitest'
import { getBrushFootprint } from '@/utils/brush'

describe('getBrushFootprint', () => {
	it('should return a single pixel for size 1', () => {
		const footprint = getBrushFootprint(1, 'square')
		expect(footprint).toEqual([{ x: 0, y: 0 }])
	})

	it('should return a 2x2 grid for size 2 square', () => {
		const footprint = getBrushFootprint(2, 'square')
		expect(footprint.length).toBe(4)
		expect(footprint).toEqual(
			expect.arrayContaining([
				{ x: -1, y: -1 },
				{ x: 0, y: -1 },
				{ x: -1, y: 0 },
				{ x: 0, y: 0 },
			]),
		)
	})

	it('should return a 3x3 grid for size 3 square', () => {
		const footprint = getBrushFootprint(3, 'square')
		expect(footprint.length).toBe(9)
	})

	it('should filter corners for circle shape', () => {
		const square = getBrushFootprint(4, 'square')
		const circle = getBrushFootprint(4, 'circle')
		expect(circle.length).toBeLessThan(square.length)
	})
})
