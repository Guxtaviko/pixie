import type { Coordinates } from '@/types'

export function interpolateCoordinates(
	from: Coordinates,
	to: Coordinates,
): Coordinates[] {
	const dx = Math.abs(to.x - from.x)
	const dy = Math.abs(to.y - from.y)
	const steps = Math.max(dx, dy)

	const interpolatedCoords: Coordinates[] = []
	for (let i = 1; i <= steps; i++) {
		const x = Math.round(from.x + ((to.x - from.x) * i) / steps)
		const y = Math.round(from.y + ((to.y - from.y) * i) / steps)
		interpolatedCoords.push({ x, y })
	}

	return interpolatedCoords
}
