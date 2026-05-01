import { describe, expect, it, vi } from 'vitest'

vi.mock('../../config/settings', async () => {
	const actual = await vi.importActual('../../config/settings')
	return {
		...actual,
		GRID_FIT_MULTIPLIER: 0.8,
	}
})

import { calculatePixelSize } from '../calculate-pixel-size'

describe('calculate-pixel-size', () => {
	it('returns default pixel size for invalid grid sizes', () => {
		expect(
			calculatePixelSize({
				availableWidth: 800,
				availableHeight: 600,
				gridWidth: 0,
				gridHeight: 10,
			}),
		).toBe(24)
		expect(
			calculatePixelSize({
				availableWidth: 800,
				availableHeight: 600,
				gridWidth: 10,
				gridHeight: 0,
			}),
		).toBe(24)
	})

	it('applies default fit multiplier before calculating the size', () => {
		expect(
			calculatePixelSize({
				availableWidth: 800,
				availableHeight: 600,
				gridWidth: 10,
				gridHeight: 10,
			}),
		).toBe(48)
	})

	it('uses custom fit multiplier when provided', () => {
		expect(
			calculatePixelSize({
				availableWidth: 800,
				availableHeight: 600,
				gridWidth: 10,
				gridHeight: 10,
				fitMultiplier: 0.5,
			}),
		).toBe(30)
	})

	it('rounds down the computed fit size', () => {
		expect(
			calculatePixelSize({
				availableWidth: 100,
				availableHeight: 100,
				gridWidth: 9,
				gridHeight: 9,
				fitMultiplier: 1,
			}),
		).toBe(11)
	})

	it('never returns less than the minimum pixel size', () => {
		expect(
			calculatePixelSize({
				availableWidth: 1,
				availableHeight: 1,
				gridWidth: 10,
				gridHeight: 10,
			}),
		).toBe(1)
	})
})
