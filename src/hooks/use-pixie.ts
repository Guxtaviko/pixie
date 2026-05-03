import { useCallback } from 'react'
import { ColorContext } from '@/contexts/color-context'
import { GridContext } from '@/contexts/grid-context'
import { HistoryContext } from '@/contexts/history-context'
import { LayerContext } from '@/contexts/layer-context'
import { ToolContext } from '@/contexts/tool-context'
import { useBrushTool } from '@/hooks/tools/use-brush-tool'
import { useFillTool } from '@/hooks/tools/use-fill-tool'
import { usePickerTool } from '@/hooks/tools/use-picker-tool'
import { useSafeContext } from '@/hooks/use-safe-context'
import type { Coordinates } from '@/types'

export function UsePixie() {
	const { tool, brushSize, brushShape } = useSafeContext(ToolContext)
	const { primary, setColor, addToPalette } = useSafeContext(ColorContext)
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

	const { drawPixel, drawPixels } = useBrushTool({
		layer,
		isLayerDrawable: isLayerDrawable || false,
		width,
		height,
		primary,
		brushSize,
		brushShape,
		getLayerData,
		updateLayer,
		validateCoordinates,
	})

	const { floodFill } = useFillTool({
		layer,
		layers,
		isLayerDrawable: isLayerDrawable || false,
		primary,
		getLayerData,
		updateLayer,
		saveToHistory,
		validateCoordinates,
	})

	const { pickColor } = usePickerTool({
		layers,
		setColor,
		addToPalette,
		validateCoordinates,
	})

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
