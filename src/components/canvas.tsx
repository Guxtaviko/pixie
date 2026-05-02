import { useCallback, useEffect, useRef, useState } from 'react'
import {
	COORDS_DEBUG,
	DARK_CHECKER,
	DEFAULT_ZOOM,
	LIGHT_CHECKER,
} from '../config/settings'
import { ColorContext } from '../contexts/color-context'
import { GridContext } from '../contexts/grid-context'
import { LayerContext } from '../contexts/layer-context'
import { ThemeContext } from '../contexts/theme-context'
import { ToolContext } from '../contexts/tool-context'
import { useLocalStorage, useSafeContext } from '../hooks'
import { UsePixie } from '../hooks/use-pixie'
import type { Coordinates } from '../types'
import { getBrushFootprint } from '../utils/brush'
import { calculatePixelSize } from '../utils/calculate-pixel-size'
import { CanvasZoom } from './ui/canvas-zoom'

export const Canvas = () => {
	const { width, height, showGrid, pixelSize, setAutoPixelSize } =
		useSafeContext(GridContext)
	const { theme } = useSafeContext(ThemeContext)
	const { layers } = useSafeContext(LayerContext)
	const { tool, brushSize, brushShape } = useSafeContext(ToolContext)
	const { primary } = useSafeContext(ColorContext)
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', DEFAULT_ZOOM)
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const [coordsBuffer, setCoordsBuffer] = useState<Coordinates[]>([])
	const [hoverCoord, setHoverCoord] = useState<Coordinates | null>(null)
	const activePointerId = useRef<number | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 })

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { handleInteraction, handleInterpolatedInteraction, endDrawing } =
		UsePixie()

	const canvasWidth = width * pixelSize
	const canvasHeight = height * pixelSize

	const getCoordinates = useCallback(
		(e: React.PointerEvent | PointerEvent): Coordinates | null => {
			const canvas = canvasRef.current
			if (!canvas) return null

			const position: Coordinates = { x: e?.clientX, y: e?.clientY }
			if (!position.x || !position.y) return null

			const rect = canvas.getBoundingClientRect()
			const scaleX = canvas.width / rect.width
			const scaleY = canvas.height / rect.height

			const x = Math.floor(((position.x - rect.left) * scaleX) / pixelSize)
			const y = Math.floor(((position.y - rect.top) * scaleY) / pixelSize)

			return { x, y }
		},
		[pixelSize],
	)

	useEffect(() => {
		const container = containerRef.current
		if (!container || typeof ResizeObserver === 'undefined') return

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0]
			if (!entry) return

			const nextSize = {
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			}

			setAvailableSize((prev) =>
				prev.width === nextSize.width && prev.height === nextSize.height
					? prev
					: nextSize,
			)
		})

		observer.observe(container)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (availableSize.width <= 0 || availableSize.height <= 0) return

		const nextAutoPixelSize = calculatePixelSize({
			availableWidth: availableSize.width,
			availableHeight: availableSize.height,
			gridWidth: width,
			gridHeight: height,
		})

		setAutoPixelSize(nextAutoPixelSize)
	}, [availableSize, width, height, setAutoPixelSize])

	const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
		e.preventDefault()
		e.currentTarget.setPointerCapture(e.pointerId)
		activePointerId.current = e.pointerId

		setIsDrawing(true)
		const coords = getCoordinates(e)
		if (!coords) return
		setHoverCoord(coords)
		handleInteraction(coords)
	}

	const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const coords = getCoordinates(e)
		setHoverCoord(coords)

		if (!isDrawing) return

		const isActivePointer =
			activePointerId.current === null ||
			e.pointerId === activePointerId.current
		if (!isActivePointer) return

		e.preventDefault()

		if (!coords) return
		setCoordsBuffer((prev) =>
			prev.find((c) => c.x === coords.x && c.y === coords.y)
				? prev
				: [...prev, coords],
		)
		handleInteraction(coords)
	}

	const handleEnd = (e?: React.PointerEvent<HTMLCanvasElement>) => {
		// Only end drawing if the pointer event belongs to the active pointer
		if (e) {
			const isActivePointer =
				activePointerId.current === null ||
				e.pointerId === activePointerId.current
			if (!isActivePointer) return

			e.preventDefault()
			// Release pointer capture if it's still captured
			if (e.currentTarget.hasPointerCapture(e.pointerId)) {
				e.currentTarget.releasePointerCapture(e.pointerId)
			}
		}

		activePointerId.current = null

		setIsDrawing(false)
		if (!isDrawing) return

		if (coordsBuffer.length) setCoordsBuffer([])
		endDrawing()
	}

	const handleLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
		setHoverCoord(null)
		handleEnd(e)
	}

	const draw = useCallback(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		if (!canvas || !ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Checkerboard background
		const checkerColors = theme === 'dark' ? DARK_CHECKER : LIGHT_CHECKER
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				ctx.fillStyle = checkerColors[(x + y) % 2]
				ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
			}
		}

		// Layers
		layers.forEach((layer) => {
			if (!layer.isVisible) return

			ctx.globalAlpha = layer.opacity
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const color = layer.data[y]?.[x]
					if (color) {
						ctx.fillStyle = color
						ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
					}
				}
			}
		})

		// Grid overlay
		if (showGrid) {
			const gridColor =
				theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'

			ctx.strokeStyle = gridColor
			ctx.lineWidth = 1

			// Vertical lines
			for (let x = 0; x <= width; x++) {
				ctx.beginPath()
				ctx.moveTo(x * pixelSize, 0)
				ctx.lineTo(x * pixelSize, height * pixelSize)
				ctx.stroke()
			}

			// Horizontal lines
			for (let y = 0; y <= height; y++) {
				ctx.beginPath()
				ctx.moveTo(0, y * pixelSize)
				ctx.lineTo(width * pixelSize, y * pixelSize)
				ctx.stroke()
			}
		}

		// Footprint preview
		if (hoverCoord && (tool === 'brush' || tool === 'eraser')) {
			const footprint = getBrushFootprint(brushSize, brushShape)
			const isEraser = tool === 'eraser'
			ctx.fillStyle = isEraser ? 'rgba(255, 255, 255, 0.4)' : primary
			ctx.strokeStyle = isEraser
				? 'rgba(255, 255, 255, 0.8)'
				: theme === 'dark'
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0, 0, 0, 0.5)'
			ctx.lineWidth = 1
			if (!isEraser) {
				ctx.globalAlpha = 0.5
			}

			for (const offset of footprint) {
				const nx = hoverCoord.x + offset.x
				const ny = hoverCoord.y + offset.y
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					ctx.fillRect(nx * pixelSize, ny * pixelSize, pixelSize, pixelSize)
					ctx.strokeRect(nx * pixelSize, ny * pixelSize, pixelSize, pixelSize)
				}
			}
			ctx.globalAlpha = 1.0 // reset
		}

		// Writes coordinates for debugging
		if (COORDS_DEBUG) {
			const fill = theme === 'dark' ? '#ffffff' : '#000000'
			const fontSize = Math.max(pixelSize / 4, 8)

			ctx.fillStyle = fill
			ctx.font = `${fontSize}px monospace`
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const baseX = x * pixelSize + fontSize / 3
					const baseY = y * pixelSize + fontSize

					ctx.fillText(`${x},${y}`, baseX, baseY)
				}
			}
		}
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
		primary,
	])

	useEffect(() => {
		draw()
	}, [draw])

	useEffect(() => {
		if (coordsBuffer.length < 2) return

		const [from, to, ...rest] = coordsBuffer
		const dx = Math.abs(to.x - from.x)
		const dy = Math.abs(to.y - from.y)
		const steps = Math.max(dx, dy)

		const interpolatedCoords: Coordinates[] = []
		for (let i = 1; i <= steps; i++) {
			const x = Math.round(from.x + ((to.x - from.x) * i) / steps)
			const y = Math.round(from.y + ((to.y - from.y) * i) / steps)
			interpolatedCoords.push({ x, y })
		}

		if (interpolatedCoords.length >= 2) {
			handleInterpolatedInteraction(interpolatedCoords)
		}

		setCoordsBuffer([to, ...rest])
	}, [coordsBuffer, handleInterpolatedInteraction])

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
					onPointerDown={handleStart}
					onPointerMove={handleMove}
					onPointerUp={handleEnd}
					onPointerCancel={handleEnd}
					onPointerLeave={handleLeave}
					className='block bg-slate-950'
				/>
			</div>
			<CanvasZoom zoom={zoom} setZoom={setZoom} />
		</div>
	)
}
