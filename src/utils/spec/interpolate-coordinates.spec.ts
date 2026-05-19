import { describe, expect, it } from 'vitest'
import { interpolateCoordinates } from '@/utils/interpolate-coordinates'

describe('interpolateCoordinates', () => {
	it('includes intermediate coordinates between two points', () => {
		expect(interpolateCoordinates({ x: 1, y: 1 }, { x: 4, y: 1 })).toEqual([
			{ x: 2, y: 1 },
			{ x: 3, y: 1 },
			{ x: 4, y: 1 },
		])
	})
})
