import { useCallback } from 'react'
import type { Layer } from '@/types'

type UseFillToolProps = {
	layer?: Layer
	layers: Layer[]
	isLayerDrawable: boolean
	primary: string
	getLayerData: () => string[][]
	updateLayer: (id: string, data: Partial<Layer>) => void
	saveToHistory: (layers: Layer[]) => void
	validateCoordinates: (x: number, y: number) => boolean
}

export function useFillTool({
	layer,
	layers,
	isLayerDrawable,
	primary,
	getLayerData,
	updateLayer,
	saveToHistory,
	validateCoordinates,
}: UseFillToolProps) {
	const floodFill = useCallback(
		(x: number, y: number) => {
			if (!validateCoordinates(x, y)) return
			if (!isLayerDrawable || !layer) return

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

	return { floodFill }
}
