import { useEffect, useMemo, useRef } from 'react'
import { CanvasZoom } from '@/components/ui/canvas-zoom'
import { DEFAULT_ZOOM } from '@/config/settings'
import { ColorContext } from '@/contexts/color-context'
import { GridContext } from '@/contexts/grid-context'
import { LayerContext } from '@/contexts/layer-context'
import { ThemeContext } from '@/contexts/theme-context'
import { ToolContext } from '@/contexts/tool-context'
import { useLocalStorage, useSafeContext } from '@/hooks'
import { useCanvasAutoFit } from '@/hooks/use-canvas-auto-fit'
import { useCanvasPointerDrawing } from '@/hooks/use-canvas-pointer-drawing'
import { usePixie } from '@/hooks/use-pixie'
import { drawCanvasScene } from '@/utils/draw-canvas-scene'
import { isShapeTool } from '@/utils/tools'

export const Canvas = () => {
	const { width, height, showGrid, pixelSize, setAutoPixelSize } =
		useSafeContext(GridContext)
	const { theme } = useSafeContext(ThemeContext)
	const { layers } = useSafeContext(LayerContext)
	const { primary, secondary } = useSafeContext(ColorContext)
	const { tool, brushSize, brushShape, useSecondaryFill } =
		useSafeContext(ToolContext)
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', DEFAULT_ZOOM)
	const containerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const {
		applyPointInteraction,
		applyInterpolatedInteraction,
		commitDrawing,
		getShapePreview,
	} = usePixie()

	useCanvasAutoFit({
		containerRef,
		width,
		height,
		setAutoPixelSize,
	})

	const { hoverCoord, startCoord, isShiftPressed, pointerHandlers } =
		useCanvasPointerDrawing({
			canvasRef,
			pixelSize,
			tool,
			applyPointInteraction,
			applyInterpolatedInteraction,
			commitDrawing,
		})

	const canvasWidth = width * pixelSize
	const canvasHeight = height * pixelSize

	const shapePreview = useMemo(() => {
		const isValidShape = isShapeTool(tool) && startCoord && hoverCoord
		if (!isValidShape) return null

		return getShapePreview(startCoord, hoverCoord, isShiftPressed)
	}, [tool, startCoord, hoverCoord, isShiftPressed, getShapePreview])

	useEffect(() => {
		drawCanvasScene({
			canvas: canvasRef.current,
			width,
			height,
			pixelSize,
			showGrid,
			theme,
			layers,
			hoverCoord,
			tool,
			brushSize,
			brushShape,
			shapePreview,
			primary,
			secondary,
			useSecondaryFill,
		})
	}, [
		width,
		height,
		showGrid,
		theme,
		pixelSize,
		layers,
		hoverCoord,
		tool,
		brushSize,
		brushShape,
		shapePreview,
		primary,
		secondary,
		useSecondaryFill,
	])

	return (
		<div
			ref={containerRef}
			className='flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8 cursor-crosshair touch-none bg-radial-[at_50%_50%] from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-950'
		>
			<div
				className='relative transition-transform duration-200'
				style={{ transform: `scale(${zoom})`, imageRendering: 'pixelated' }}
			>
				<canvas
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
					{...pointerHandlers}
					className='block bg-slate-950'
				/>
			</div>
			<CanvasZoom zoom={zoom} setZoom={setZoom} />
		</div>
	)
}
