import type { Coordinates } from '@/types'

export type ShapeOptions = {
	filled?: boolean
	shiftKey?: boolean
	useSecondaryFill?: boolean
}

export type ShapePixels = {
	border: Coordinates[]
	fill: Coordinates[]
}

export function getConstrainedEnd(
	start: Coordinates,
	end: Coordinates,
	shape: 'line' | 'rectangle' | 'circle',
	shiftKey = false,
): Coordinates {
	if (!shiftKey) return end

	const dx = end.x - start.x
	const dy = end.y - start.y
	const absDx = Math.abs(dx)
	const absDy = Math.abs(dy)

	if (shape === 'rectangle' || shape === 'circle') {
		// Constrain to 1:1 ratio
		const maxDist = Math.max(absDx, absDy)
		return {
			x: start.x + Math.sign(dx) * maxDist,
			y: start.y + Math.sign(dy) * maxDist,
		}
	}

	if (shape === 'line') {
		// Constrain to 0, 45, or 90 degrees
		if (absDx > absDy * 2) {
			// Horizontal
			return { x: end.x, y: start.y }
		} else if (absDy > absDx * 2) {
			// Vertical
			return { x: start.x, y: end.y }
		} else {
			// 45 degrees
			const dist = Math.min(absDx, absDy)
			return {
				x: start.x + Math.sign(dx) * dist,
				y: start.y + Math.sign(dy) * dist,
			}
		}
	}

	return end
}

export function getShapeBounds(
	start: Coordinates,
	end: Coordinates,
	shape: 'line' | 'rectangle' | 'circle',
	shiftKey = false,
) {
	const cEnd = getConstrainedEnd(start, end, shape, shiftKey)
	return {
		minX: Math.min(start.x, cEnd.x),
		maxX: Math.max(start.x, cEnd.x),
		minY: Math.min(start.y, cEnd.y),
		maxY: Math.max(start.y, cEnd.y),
		cEnd,
	}
}

export function getLinePixels(
	start: Coordinates,
	end: Coordinates,
	options: ShapeOptions = {},
): ShapePixels {
	const { cEnd } = getShapeBounds(start, end, 'line', options.shiftKey)
	const border: Coordinates[] = []

	let x0 = start.x
	let y0 = start.y
	const x1 = cEnd.x
	const y1 = cEnd.y

	// Bresenham's line algorithm
	const dx = Math.abs(x1 - x0)
	const dy = Math.abs(y1 - y0)
	const sx = x0 < x1 ? 1 : -1
	const sy = y0 < y1 ? 1 : -1
	let err = dx - dy

	while (true) {
		border.push({ x: x0, y: y0 })
		const isLastPixel = x0 === x1 && y0 === y1
		if (isLastPixel) break

		const e2 = 2 * err
		const moveX = e2 > -dy
		const moveY = e2 < dx
		if (moveX) {
			err -= dy
			x0 += sx
		}
		if (moveY) {
			err += dx
			y0 += sy
		}
	}

	return { border, fill: [] }
}

export function getRectanglePixels(
	start: Coordinates,
	end: Coordinates,
	options: ShapeOptions = {},
): ShapePixels {
	const { minX, maxX, minY, maxY } = getShapeBounds(
		start,
		end,
		'rectangle',
		options.shiftKey,
	)
	const border: Coordinates[] = []
	const fill: Coordinates[] = []

	// Border
	for (let x = minX; x <= maxX; x++) {
		border.push({ x, y: minY })
		if (minY !== maxY) border.push({ x, y: maxY })
	}
	for (let y = minY + 1; y < maxY; y++) {
		border.push({ x: minX, y })
		if (minX !== maxX) border.push({ x: maxX, y })
	}

	// Fill
	if (options.filled) {
		for (let y = minY + 1; y < maxY; y++) {
			for (let x = minX + 1; x < maxX; x++) {
				fill.push({ x, y })
			}
		}
		// If useSecondaryFill is true, the fill remains separate.
		// If useSecondaryFill is false, we combine them into border or leave them to be drawn with the same color.
		// Actually, separating them is fine regardless. The tool hook will use primary for both if useSecondaryFill is false.
	}

	return { border, fill }
}

export function getCirclePixels(
	start: Coordinates,
	end: Coordinates,
	options: ShapeOptions = {},
): ShapePixels {
	const { minX, maxX, minY, maxY } = getShapeBounds(
		start,
		end,
		'circle',
		options.shiftKey,
	)

	const width = maxX - minX
	const height = maxY - minY

	if (width === 0) {
		const border: Coordinates[] = []
		for (let y = minY; y <= maxY; y++) {
			border.push({ x: start.x, y })
		}
		return { border, fill: [] }
	}

	if (height === 0) {
		const border: Coordinates[] = []
		for (let x = minX; x <= maxX; x++) {
			border.push({ x, y: start.y })
		}
		return { border, fill: [] }
	}

	const border: Coordinates[] = []

	const centerX = minX + width / 2
	const centerY = minY + height / 2
	const radiusX = width / 2
	const radiusY = height / 2
	const radiusX2 = radiusX * radiusX
	const radiusY2 = radiusY * radiusY

	// Midpoint Ellipse Algorithm for Outline
	let x = 0
	let y = radiusY
	let dx = 2 * radiusY2 * x
	let dy = 2 * radiusX2 * y
	let err1 = radiusY2 - radiusX2 * radiusY + 0.25 * radiusX2

	const addSymmetry = (px: number, py: number) => {
		const rx = Math.floor(px)
		const ry = Math.floor(py)

		const bottom = Math.ceil(centerY + ry)
		const top = Math.floor(centerY - ry)
		const right = Math.ceil(centerX + rx)
		const left = Math.floor(centerX - rx)

		border.push({ x: right, y: bottom })
		border.push({ x: left, y: bottom })
		border.push({ x: right, y: top })
		border.push({ x: left, y: top })
	}

	// Region 1
	while (dx < dy) {
		addSymmetry(x, y)
		x++
		dx += 2 * radiusY2
		if (err1 < 0) {
			err1 += radiusY2 + dx
		} else {
			y--
			dy -= 2 * radiusX2
			err1 += radiusY2 + dx - dy
		}
	}

	// Region 2
	let err2 =
		radiusY2 * ((x + 0.5) * (x + 0.5)) +
		radiusX2 * ((y - 1) * (y - 1)) -
		radiusX2 * radiusY2
	while (y >= 0) {
		addSymmetry(x, y)
		y--
		dy -= 2 * radiusX2
		if (err2 > 0) {
			err2 += radiusX2 - dy
		} else {
			x++
			dx += 2 * radiusY2
			err2 += radiusX2 - dy + dx
		}
	}

	// Remove duplicates for outlines
	const uniqueBorder = new Map<string, Coordinates>()
	for (const p of border) {
		uniqueBorder.set(`${p.x},${p.y}`, p)
	}
	const finalBorder = Array.from(uniqueBorder.values())

	if (!options.filled) return { border: finalBorder, fill: [] }

	const fill: Coordinates[] = []
	const rows = new Map<number, number[]>()

	for (const p of finalBorder) {
		const row = rows.get(p.y) ?? []
		if (!rows.has(p.y)) rows.set(p.y, row)

		row.push(p.x)
	}

	for (const [y, xs] of rows) {
		xs.sort((a, b) => a - b)

		const min = xs[0]
		const max = xs[xs.length - 1]

		for (let x = min + 1; x < max; x++) {
			if (uniqueBorder.has(`${x},${y}`)) continue

			fill.push({ x, y })
		}
	}

	return { border: finalBorder, fill }
}
