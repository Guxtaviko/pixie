import { useCallback } from 'react'
import { ColorContext } from '../contexts/color-context'
import { GridContext } from '../contexts/grid-context'
import { LayerContext } from '../contexts/layer-context'
import { ToolContext } from '../contexts/tool-context'
import { useSafeContext } from './use-safe-context'

export function UsePixie() {
	const { tool } = useSafeContext(ToolContext)
	const { primary } = useSafeContext(ColorContext)
	const { width, height } = useSafeContext(GridContext)
	const { layers, currentLayerId, updateLayer } = useSafeContext(LayerContext)

	const layer = layers.find((l) => l.id === currentLayerId)

	const drawPixel = useCallback(
		(x: number, y: number, color = primary) => {
			if (x < 0 || x >= width || y < 0 || y >= height) return
			if (!layer || layer?.isLocked) return

			const newData = layer?.data.map((row) => row.slice()) || []
			if (!newData[y]) newData[y] = []

			newData[y][x] = color
			updateLayer(layer.id, { data: newData })
		},
		[layer, primary, width, height, updateLayer],
	)

	const handleInteraction = useCallback(
		(x: number, y: number) => {
			switch (tool) {
				case 'brush':
					drawPixel(x, y)
					break
				case 'eraser':
					drawPixel(x, y, '')
					break
			}
		},
		[tool, drawPixel],
	)

	const clearCanvas = () => {
		layers.forEach((layer) => {
			updateLayer(layer.id, { data: [[]] })
		})
	}

	return { handleInteraction, clearCanvas }
}
