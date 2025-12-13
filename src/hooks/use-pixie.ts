import { useCallback } from 'react'
import { ColorContext } from '../contexts/color-context'
import { GridContext } from '../contexts/grid-context'
import { HistoryContext } from '../contexts/history-context'
import { LayerContext } from '../contexts/layer-context'
import { ToolContext } from '../contexts/tool-context'
import type { Coordinates } from '../types'
import { useSafeContext } from './use-safe-context'

export function UsePixie() {
	const { tool } = useSafeContext(ToolContext)
	const { primary, setColor } = useSafeContext(ColorContext)
	const { width, height } = useSafeContext(GridContext)
	const { layers, currentLayerId, updateLayer } = useSafeContext(LayerContext)
	const { saveToHistory } = useSafeContext(HistoryContext)

	const layer = layers.find((l) => l.id === currentLayerId)
	const isLayerDrawable = layer && !layer.isLocked

	const getLayerData = useCallback(() => {
		// Return a deep copy of the layer data to avoid direct mutations
		return layer?.data.map((row) => row?.slice()) || []
	}, [layer])

	const validateCoordinates = useCallback(
		(x: number, y: number) => {
			return x >= 0 && x < width && y >= 0 && y < height
		},
		[width, height],
	)

	const drawPixel = useCallback(
		(x: number, y: number, color = primary) => {
			if (!validateCoordinates(x, y)) return
			if (!isLayerDrawable) return

			const newData = getLayerData()
			if (!newData[y]) newData[y] = []

			if (newData[y][x] === color) return // No change

			newData[y][x] = color
			updateLayer(layer.id, { data: newData })
		},
		[
			layer,
			primary,
			updateLayer,
			getLayerData,
			validateCoordinates,
			isLayerDrawable,
		],
	)

	const drawPixels = useCallback(
		(coords: Coordinates[], color = primary) => {
			if (!isLayerDrawable) return

			const newData = getLayerData()
			let hasChanges = false

			coords.forEach(({ x, y }) => {
				if (!validateCoordinates(x, y)) return

				if (!newData[y]) newData[y] = []
				if (newData[y][x] === color) return // No change

				newData[y][x] = color
				hasChanges = true
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
		],
	)

	const floodFill = useCallback(
		(x: number, y: number) => {
			if (!validateCoordinates(x, y)) return
			if (!isLayerDrawable) return

			const layerData = getLayerData()
			const target = layerData[y]?.[x] || 'transparent'
			if (target === primary) return

			const stack: number[][] = [[x, y]]
			const visited = new Set<string>()

			while (stack.length) {
				const [currX, currY] = stack.pop() || []
				if (currX === undefined || currY === undefined) continue

				const key = `${currX},${currY}`
				const keyColor = layerData[currY]?.[currX] || 'transparent'

				if (
					!validateCoordinates(currX, currY) ||
					visited.has(key) ||
					keyColor !== target
				) {
					continue
				}

				if (!layerData[currY]) layerData[currY] = []
				layerData[currY][currX] = primary

				visited.add(key)

				stack.push(
					[currX + 1, currY],
					[currX - 1, currY],
					[currX, currY + 1],
					[currX, currY - 1],
				)
			}

			const newLayers = layers.map((l) =>
				l.id === layer.id ? { ...l, data: layerData } : l,
			)
			updateLayer(layer.id, { data: layerData })
			saveToHistory(newLayers)
		},
		[
			layers,
			layer,
			isLayerDrawable,
			primary,
			saveToHistory,
			validateCoordinates,
			getLayerData,
			updateLayer,
		],
	)

	const pickColor = useCallback(
		(x: number, y: number) => {
			if (!validateCoordinates(x, y)) return null

			for (let i = 0; i < layers.length; i++) {
				const layer = layers[i]
				if (!layer.isVisible) continue

				const color = layer.data[y]?.[x]
				if (color && color !== 'transparent') setColor(color)
			}

			return null
		},
		[validateCoordinates, layers, setColor],
	)

	const handleInteraction = useCallback(
		({ x, y }: Coordinates) => {
			switch (tool) {
				case 'brush':
					drawPixel(x, y)
					break
				case 'eraser':
					drawPixel(x, y, 'transparent')
					break
				case 'fill':
					floodFill(x, y)
					break
				case 'picker':
					pickColor(x, y)
					break
				default:
					break
			}
		},
		[tool, drawPixel, floodFill, pickColor],
	)

	const handleInterpolatedInteraction = useCallback(
		(coords: Coordinates[]) => {
			switch (tool) {
				case 'brush':
					drawPixels(coords)
					break
				case 'eraser':
					drawPixels(coords, 'transparent')
					break
				default:
					break
			}
		},
		[tool, drawPixels],
	)

	const endDrawing = useCallback(() => {
		if (!['brush', 'eraser'].includes(tool)) return

		const newLayers = layers.map((l) =>
			l.id === layer?.id ? { ...l, data: getLayerData() } : l,
		)
		saveToHistory(newLayers)
	}, [layers, layer, getLayerData, saveToHistory, tool])

	return { handleInteraction, handleInterpolatedInteraction, endDrawing }
}
