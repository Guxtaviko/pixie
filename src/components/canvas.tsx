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
import { drawSelectionMarquee } from '@/utils/draw-selection-marquee'
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
	const marqueeCanvasRef = useRef<HTMLCanvasElement>(null)

	const {
		applyPointInteraction,
		applyInterpolatedInteraction,
		commitDrawing,
		getShapePreview,
		selectionState,
		pointerHandlers: customPointerHandlers,
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
			onPointerDown: customPointerHandlers.onPointerDown,
			onPointerMove: customPointerHandlers.onPointerMove,
			onPointerUp: customPointerHandlers.onPointerUp,
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
			selectionState,
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
		selectionState,
	])

	useEffect(() => {
		let frameId = 0

		const renderSelectionMarquee = () => {
			drawSelectionMarquee({
				canvas: marqueeCanvasRef.current,
				pixelSize,
				theme,
				selectionState,
			})

			if (!selectionState) return

			frameId = window.requestAnimationFrame(renderSelectionMarquee)
		}

		renderSelectionMarquee()

		return () => window.cancelAnimationFrame(frameId)
	}, [pixelSize, theme, selectionState])

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
					id='drawing-canvas'
					width={canvasWidth}
					height={canvasHeight}
					{...pointerHandlers}
					className='block bg-slate-950'
				/>
				<canvas
					ref={marqueeCanvasRef}
					width={canvasWidth}
					height={canvasHeight}
					className='pointer-events-none absolute inset-0 block'
				/>
			</div>
			<CanvasZoom zoom={zoom} setZoom={setZoom} />
		</div>
	)
}
