import { useCallback, useMemo } from 'react'
import type { BrushShape, Coordinates, Layer } from '../../types'
import { getBrushFootprint } from '../../utils/brush'

type UseBrushToolProps = {
	layer?: Layer
	isLayerDrawable: boolean
	width: number
	height: number
	primary: string
	brushSize: number
	brushShape: BrushShape
	getLayerData: () => string[][]
	updateLayer: (id: string, data: Partial<Layer>) => void
	validateCoordinates: (x: number, y: number) => boolean
}

export function useBrushTool({
	layer,
	isLayerDrawable,
	primary,
	brushSize,
	brushShape,
	getLayerData,
	updateLayer,
	validateCoordinates,
}: UseBrushToolProps) {
	const brushFootprint = useMemo(
		() => getBrushFootprint(brushSize, brushShape),
		[brushSize, brushShape],
	)

	const drawPixel = useCallback(
		(x: number, y: number, color = primary) => {
			if (!validateCoordinates(x, y)) return
			if (!isLayerDrawable || !layer) return

			const newData = getLayerData()
			let hasChanges = false

			for (const offset of brushFootprint) {
				const nx = x + offset.x
				const ny = y + offset.y

				if (!validateCoordinates(nx, ny)) continue
				if (!newData[ny]) newData[ny] = []
				if (newData[ny][nx] === color) continue

				newData[ny][nx] = color
				hasChanges = true
			}

			if (hasChanges) updateLayer(layer.id, { data: newData })
		},
		[
			layer,
			primary,
			updateLayer,
			getLayerData,
			validateCoordinates,
			isLayerDrawable,
			brushFootprint,
		],
	)

	const drawPixels = useCallback(
		(coords: Coordinates[], color = primary) => {
			if (!isLayerDrawable || !layer) return

			const newData = getLayerData()
			let hasChanges = false

			coords.forEach(({ x, y }) => {
				for (const offset of brushFootprint) {
					const nx = x + offset.x
					const ny = y + offset.y

					if (!validateCoordinates(nx, ny)) continue
					if (!newData[ny]) newData[ny] = []
					if (newData[ny][nx] === color) continue

					newData[ny][nx] = color
					hasChanges = true
				}
			})

			if (hasChanges) updateLayer(layer.id, { data: newData })
		},
		[
			layer,
			primary,
			updateLayer,
			getLayerData,
			validateCoordinates,
			isLayerDrawable,
			brushFootprint,
		],
	)

	return { drawPixel, drawPixels }
}
