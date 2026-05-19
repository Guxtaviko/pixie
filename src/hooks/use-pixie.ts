import { useCallback } from 'react'
import { ColorContext } from '@/contexts/color-context'
import { GridContext } from '@/contexts/grid-context'
import { HistoryContext } from '@/contexts/history-context'
import { LayerContext } from '@/contexts/layer-context'
import { ToolContext } from '@/contexts/tool-context'
import { useBrushTool } from '@/hooks/tools/use-brush-tool'
import { useFillTool } from '@/hooks/tools/use-fill-tool'
import { usePickerTool } from '@/hooks/tools/use-picker-tool'
import { useShapeTool } from '@/hooks/tools/use-shape-tool'
import { useSafeContext } from '@/hooks/use-safe-context'
import type { Coordinates, Layer } from '@/types'
import { getToolBehavior, isShapeTool } from '@/utils/tools'

type CommitDrawingOptions = {
	start?: Coordinates
	end?: Coordinates
	shiftKey?: boolean
}

export function usePixie() {
	const {
		tool,
		brushSize,
		brushShape,
		shapeMode,
		shapeType,
		useSecondaryFill,
	} = useSafeContext(ToolContext)
	const { primary, secondary, setColor, addToPalette } =
		useSafeContext(ColorContext)
	const { width, height } = useSafeContext(GridContext)
	const { layers, currentLayerId, updateLayer } = useSafeContext(LayerContext)
	const { saveToHistory } = useSafeContext(HistoryContext)

	const layer = layers.find((l) => l.id === currentLayerId)
	const isLayerDrawable = layer && !layer.isLocked

	const getLayerData = useCallback(() => {
		return layer?.data.map((row) => row?.slice()) || []
	}, [layer])

	const validateCoordinates = useCallback(
		(x: number, y: number) => {
			return x >= 0 && x < width && y >= 0 && y < height
		},
		[width, height],
	)

	const buildLayerHistorySnapshot = useCallback(
		(nextLayerData: string[][]): Layer[] => {
			return layers.map((l) =>
				l.id === layer?.id ? { ...l, data: nextLayerData } : l,
			)
		},
		[layers, layer],
	)

	const shouldCommitHistory = useCallback(() => {
		return getToolBehavior(tool) === 'continuous' && Boolean(isLayerDrawable)
	}, [tool, isLayerDrawable])

	const commitContinuousDrawing = useCallback(() => {
		if (!shouldCommitHistory()) return

		const nextLayerData = getLayerData()
		saveToHistory(buildLayerHistorySnapshot(nextLayerData))
	}, [
		buildLayerHistorySnapshot,
		getLayerData,
		saveToHistory,
		shouldCommitHistory,
	])

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

	const { drawShape, getShapePreviewPixels } = useShapeTool({
		layer,
		layers,
		isLayerDrawable: isLayerDrawable || false,
		primary,
		secondary,
		useSecondaryFill,
		shapeMode,
		getLayerData,
		updateLayer,
		saveToHistory,
		validateCoordinates,
	})

	const getShapePreview = useCallback(
		(start: Coordinates, end: Coordinates, shiftKey: boolean) => {
			if (!isShapeTool(tool)) return { border: [], fill: [] }

			const shape = tool === 'line' ? 'line' : shapeType

			return getShapePreviewPixels(shape, start, end, shiftKey)
		},
		[tool, shapeType, getShapePreviewPixels],
	)

	const applyPointInteraction = useCallback(
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

	const applyInterpolatedInteraction = useCallback(
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

	const commitShapeDrawing = useCallback(
		(start: Coordinates, end: Coordinates, shiftKey = false) => {
			if (!isShapeTool(tool)) return

			const shape = tool === 'line' ? 'line' : shapeType
			drawShape(shape, start, end, shiftKey)
		},
		[tool, drawShape, shapeType],
	)

	const commitDrawing = useCallback(
		(options: CommitDrawingOptions = {}) => {
			const { start, end, shiftKey = false } = options

			if (start && end && isShapeTool(tool)) {
				commitShapeDrawing(start, end, shiftKey)
				return
			}

			commitContinuousDrawing()
		},
		[tool, commitShapeDrawing, commitContinuousDrawing],
	)

	return {
		applyPointInteraction,
		applyInterpolatedInteraction,
		commitDrawing,
		getShapePreview,
	}
}
