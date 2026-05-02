import type { Coordinates } from '../types'

export type BrushShape = 'square' | 'circle'

export function getBrushFootprint(
	size: number,
	shape: BrushShape,
): Coordinates[] {
	if (size <= 1) return [{ x: 0, y: 0 }]

	const footprint: Coordinates[] = []
	const radius = Math.floor(size / 2)
	const isEven = size % 2 === 0

	const offset = isEven ? 0.5 : 0

	for (let y = -radius; y <= radius; y++) {
		for (let x = -radius; x <= radius; x++) {
			if (isEven && (x === radius || y === radius)) continue

			if (shape === 'circle') {
				const centerX = x + offset
				const centerY = y + offset
				const distance = Math.sqrt(centerX * centerX + centerY * centerY)

				if (distance <= size / 2) {
					footprint.push({ x, y })
				}
			} else {
				footprint.push({ x, y })
			}
		}
	}

	return footprint
}
