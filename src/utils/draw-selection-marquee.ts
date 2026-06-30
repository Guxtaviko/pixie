import type { SelectionState } from '@/types'

type DrawSelectionMarqueeOptions = {
	canvas: HTMLCanvasElement | null
	pixelSize: number
	theme: 'light' | 'dark'
	selectionState: SelectionState | null
	timeMs?: number
}

export function drawSelectionMarquee({
	canvas,
	pixelSize,
	theme,
	selectionState,
	timeMs = performance.now(),
}: DrawSelectionMarqueeOptions) {
	const ctx = canvas?.getContext('2d')
	if (!canvas || !ctx) return

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	if (!selectionState) return

	const bx = (selectionState.x + selectionState.transform.dx) * pixelSize
	const by = (selectionState.y + selectionState.transform.dy) * pixelSize
	const bw = selectionState.width * pixelSize
	const bh = selectionState.height * pixelSize

	ctx.lineWidth = Math.max(1, pixelSize / 8)
	ctx.setLineDash([4, 4])

	const offset = (timeMs / 50) % 8
	const isDark = theme === 'dark'
	const color1 = isDark ? '#22d3ee' : '#06b6d4'
	const color2 = isDark ? 'rgba(34, 211, 238, 0.5)' : 'rgba(6, 182, 212, 0.5)'

	ctx.lineDashOffset = -offset
	ctx.strokeStyle = color1
	ctx.strokeRect(bx, by, bw, bh)

	ctx.lineDashOffset = -offset + 4
	ctx.strokeStyle = color2
	ctx.strokeRect(bx, by, bw, bh)

	ctx.setLineDash([])
	ctx.lineDashOffset = 0
}
