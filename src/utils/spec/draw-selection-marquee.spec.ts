import { describe, expect, it, vi } from 'vitest'
import { drawSelectionMarquee } from '@/utils/draw-selection-marquee'

const createCanvasMock = () => {
	const strokeRect = vi.fn()
	const clearRect = vi.fn()
	const setLineDash = vi.fn()
	const context = {
		clearRect,
		setLineDash,
		strokeRect,
		fillRect: vi.fn(),
		beginPath: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		fillText: vi.fn(),
		get lineWidth() {
			return 0
		},
		set lineWidth(_value: number) {},
		get lineDashOffset() {
			return 0
		},
		set lineDashOffset(_value: number) {},
		get strokeStyle() {
			return ''
		},
		set strokeStyle(_value: string) {},
	} as unknown as CanvasRenderingContext2D

	const canvas = {
		width: 64,
		height: 64,
		getContext: vi.fn(() => context),
	} as unknown as HTMLCanvasElement

	return { canvas, clearRect, setLineDash, strokeRect }
}

describe('drawSelectionMarquee', () => {
	it('clears the overlay and draws the marquee boundary', () => {
		const { canvas, clearRect, setLineDash, strokeRect } = createCanvasMock()

		drawSelectionMarquee({
			canvas,
			pixelSize: 8,
			theme: 'dark',
			selectionState: {
				x: 1,
				y: 2,
				width: 3,
				height: 4,
				pixels: [],
				transform: { dx: 1, dy: 2, scaleX: 1, scaleY: 1, rotation: 0 },
			},
			timeMs: 100,
		})

		expect(clearRect).toHaveBeenCalledWith(0, 0, 64, 64)
		expect(setLineDash).toHaveBeenCalledWith([4, 4])
		expect(strokeRect).toHaveBeenCalledTimes(2)
	})

	it('clears the overlay when there is no selection', () => {
		const { canvas, clearRect, strokeRect } = createCanvasMock()

		drawSelectionMarquee({
			canvas,
			pixelSize: 8,
			theme: 'light',
			selectionState: null,
		})

		expect(clearRect).toHaveBeenCalledWith(0, 0, 64, 64)
		expect(strokeRect).not.toHaveBeenCalled()
	})
})
