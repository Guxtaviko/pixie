import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Coordinates } from '@/types'

type CanvasPointerPosition = Pick<
	PointerEvent | ReactPointerEvent,
	'clientX' | 'clientY'
>

export function getCanvasCoordinates(
	canvas: HTMLCanvasElement | null,
	event: CanvasPointerPosition,
	pixelSize: number,
): Coordinates | null {
	if (!canvas) return null

	const rect = canvas.getBoundingClientRect()
	const scaleX = canvas.width / rect.width
	const scaleY = canvas.height / rect.height

	const x = Math.floor(((event.clientX - rect.left) * scaleX) / pixelSize)
	const y = Math.floor(((event.clientY - rect.top) * scaleY) / pixelSize)

	if (!Number.isFinite(x) || !Number.isFinite(y)) return null

	return { x, y }
}
