import { describe, expect, it } from 'vitest'
import { getCanvasCoordinates } from '@/utils/canvas-coordinates'

describe('getCanvasCoordinates', () => {
	it('accounts for canvas CSS scaling and pixel size', () => {
		const canvas = document.createElement('canvas')
		canvas.width = 320
		canvas.height = 160
		canvas.getBoundingClientRect = () =>
			({
				left: 10,
				top: 20,
				width: 160,
				height: 80,
			}) as DOMRect

		const coords = getCanvasCoordinates(
			canvas,
			{ clientX: 50, clientY: 40 } as PointerEvent,
			10,
		)

		expect(coords).toEqual({ x: 8, y: 4 })
	})
})
