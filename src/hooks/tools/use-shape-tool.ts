import { useCallback } from 'react'
import type { Coordinates, Layer } from '@/types'
import {
	getCirclePixels,
	getLinePixels,
	getRectanglePixels,
} from '@/utils/geometry'

type UseShapeToolProps = {
	layer: Layer | undefined
	isLayerDrawable: boolean
	primary: string
	secondary: string
	useSecondaryFill: boolean
	shapeMode: 'outline' | 'filled'
	getLayerData: () => string[][]
	updateLayer: (id: string, data: Partial<Layer>) => void
	validateCoordinates: (x: number, y: number) => boolean
	saveToHistory: (layers: Layer[]) => void
	layers: Layer[]
}

export function useShapeTool({
	layer,
	isLayerDrawable,
	primary,
	secondary,
	useSecondaryFill,
	shapeMode,
	getLayerData,
	updateLayer,
	validateCoordinates,
	saveToHistory,
	layers,
}: UseShapeToolProps) {
	const getShapePreviewPixels = useCallback(
		(
			shape: 'line' | 'rectangle' | 'circle',
			start: Coordinates,
			end: Coordinates,
			shiftKey: boolean,
		) => {
			const filled = shapeMode === 'filled'
			const options = { shiftKey, filled }

			switch (shape) {
				case 'line':
					return getLinePixels(start, end, options)
				case 'rectangle':
					return getRectanglePixels(start, end, options)
				case 'circle':
					return getCirclePixels(start, end, options)
				default:
					return { border: [], fill: [] }
			}
		},
		[shapeMode],
	)

	const drawShape = useCallback(
		(
			shape: 'line' | 'rectangle' | 'circle',
			start: Coordinates,
			end: Coordinates,
			shiftKey: boolean,
		) => {
			if (!layer || !isLayerDrawable) return

			const { border, fill } = getShapePreviewPixels(
				shape,
				start,
				end,
				shiftKey,
			)

			const newData = getLayerData()
			let changed = false

			const drawPoints = (points: Coordinates[], color: string) => {
				for (const p of points) {
					if (validateCoordinates(p.x, p.y)) {
						if (newData[p.y] === undefined) newData[p.y] = []
						newData[p.y][p.x] = color
						changed = true
					}
				}
			}

			// Draw fill first so border goes on top
			if (fill.length > 0) {
				const fillColor = useSecondaryFill ? secondary : primary
				drawPoints(fill, fillColor)
			}

			if (border.length > 0) {
				drawPoints(border, primary)
			}

			if (changed) {
				updateLayer(layer.id, { data: newData })
				const newLayers = layers.map((l) =>
					l.id === layer.id ? { ...l, data: newData } : l,
				)
				saveToHistory(newLayers)
			}
		},
		[
			layer,
			isLayerDrawable,
			primary,
			secondary,
			useSecondaryFill,
			getShapePreviewPixels,
			getLayerData,
			updateLayer,
			validateCoordinates,
			saveToHistory,
			layers,
		],
	)

	return { drawShape, getShapePreviewPixels }
}
