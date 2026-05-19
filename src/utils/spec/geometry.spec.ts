import { describe, expect, it } from 'vitest'
import {
	getCirclePixels,
	getConstrainedEnd,
	getLinePixels,
	getRectanglePixels,
} from '../geometry'

describe('Geometry Utils', () => {
	describe('getConstrainedEnd', () => {
		it('returns original end if shiftKey is false', () => {
			const start = { x: 0, y: 0 }
			const end = { x: 10, y: 5 }
			expect(getConstrainedEnd(start, end, 'line', false)).toEqual(end)
		})

		it('constrains rectangle to a perfect square', () => {
			const start = { x: 0, y: 0 }
			const end = { x: 10, y: 5 }
			expect(getConstrainedEnd(start, end, 'rectangle', true)).toEqual({
				x: 10,
				y: 10,
			})
		})

		it('constrains line to 45 degrees', () => {
			const start = { x: 0, y: 0 }
			const end = { x: 10, y: 8 }
			expect(getConstrainedEnd(start, end, 'line', true)).toEqual({
				x: 8,
				y: 8,
			})
		})

		it('constrains line to horizontal', () => {
			const start = { x: 0, y: 0 }
			const end = { x: 10, y: 2 }
			expect(getConstrainedEnd(start, end, 'line', true)).toEqual({
				x: 10,
				y: 0,
			})
		})

		it('constrains line to vertical', () => {
			const start = { x: 0, y: 0 }
			const end = { x: 2, y: 10 }
			expect(getConstrainedEnd(start, end, 'line', true)).toEqual({
				x: 0,
				y: 10,
			})
		})
	})

	describe('getLinePixels', () => {
		it('returns correct pixels for a horizontal line', () => {
			const pixels = getLinePixels({ x: 0, y: 0 }, { x: 2, y: 0 })
			expect(pixels.border).toEqual([
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
			])
			expect(pixels.fill).toEqual([])
		})
	})

	describe('getRectanglePixels', () => {
		it('returns outline pixels for a rectangle', () => {
			const pixels = getRectanglePixels({ x: 0, y: 0 }, { x: 2, y: 2 })
			expect(pixels.border).toContainEqual({ x: 0, y: 0 })
			expect(pixels.border).toContainEqual({ x: 2, y: 2 })
			expect(pixels.border).not.toContainEqual({ x: 1, y: 1 })
			expect(pixels.fill).toEqual([])
		})

		it('returns filled pixels for a rectangle', () => {
			const pixels = getRectanglePixels(
				{ x: 0, y: 0 },
				{ x: 2, y: 2 },
				{ filled: true },
			)
			expect(pixels.fill).toContainEqual({ x: 1, y: 1 })
			expect(pixels.border.length + pixels.fill.length).toBe(9)
		})
	})

	describe('getCirclePixels', () => {
		it('returns a single pixel for radius 0', () => {
			const pixels = getCirclePixels({ x: 5, y: 5 }, { x: 5, y: 5 })
			expect(pixels.border).toEqual([{ x: 5, y: 5 }])
			expect(pixels.fill).toEqual([])
		})

		it('returns outline pixels for a circle', () => {
			const pixels = getCirclePixels({ x: 0, y: 0 }, { x: 10, y: 10 })
			expect(pixels.border).not.toContainEqual({ x: 5, y: 5 })
			expect(pixels.border.length).toBeGreaterThan(0)
		})

		it('returns filled pixels for a circle', () => {
			const pixels = getCirclePixels(
				{ x: 0, y: 0 },
				{ x: 10, y: 10 },
				{ filled: true },
			)
			expect(pixels.fill.length).toBeGreaterThan(0)
			expect(pixels.fill).toContainEqual({ x: 5, y: 5 })
		})
	})
})
