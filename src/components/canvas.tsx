import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DARK_CHECKER, DEFAULT_ZOOM, LIGHT_CHECKER } from '../config/settings'
import { ThemeContext } from '../contexts'
import { GridContext } from '../contexts/grid-context'
import { LayerContext } from '../contexts/layer-context'
import { useLocalStorage, useSafeContext } from '../hooks'
import { UsePixie } from '../hooks/use-pixie'
import { CanvasZoom } from './ui/canvas-zoom'

export const Canvas = () => {
	const { width, height, showGrid, pixelSize } = useSafeContext(GridContext)
	const { theme } = useSafeContext(ThemeContext)
	const { layers } = useSafeContext(LayerContext)
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', DEFAULT_ZOOM)
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { handleInteraction, endDrawing } = UsePixie()

	const canvasWidth = width * pixelSize
	const canvasHeight = height * pixelSize

	const getCoordinates = useCallback(
		(e: React.MouseEvent | MouseEvent) => {
			const canvas = canvasRef.current
			if (!canvas) return null

			const rect = canvas.getBoundingClientRect()
			const scaleX = canvas.width / rect.width
			const scaleY = canvas.height / rect.height

			const x = Math.floor(((e.clientX - rect.left) * scaleX) / pixelSize)
			const y = Math.floor(((e.clientY - rect.top) * scaleY) / pixelSize)

			return { x, y }
		},
		[pixelSize],
	)

	const handleStart = (e: React.MouseEvent) => {
		e.preventDefault()

		setIsDrawing(true)
		const coords = getCoordinates(e)
		if (!coords) return
		handleInteraction(coords.x, coords.y)
	}

	const handleMove = (e: React.MouseEvent) => {
		if (!isDrawing) return
		e.preventDefault()

		const coords = getCoordinates(e)
		if (!coords) return
		handleInteraction(coords.x, coords.y)
	}

	const handleEnd = () => {
		setIsDrawing(false)
		if (!isDrawing) return

		endDrawing()
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
	}, [width, height, showGrid, theme, pixelSize, layers])

	useEffect(() => {
		draw()
	}, [draw])

	return (
		<div className='flex-1 relative overflow-hidden flex items-center justify-center p-8 cursor-crosshair touch-none bg-radial-[at_50%_50%] from-slate-200 to-slate-50 dark:from-slate-800 dark:to-slate-950 '>
			<div
				className='relative transition-transform duration-200'
				style={{ transform: `scale(${zoom})`, imageRendering: 'pixelated' }}
			>
				<canvas
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
					onMouseDown={handleStart}
					onMouseMove={handleMove}
					onMouseUp={handleEnd}
					onMouseLeave={handleEnd}
					className='block bg-slate-950'
				/>
			</div>
			<CanvasZoom zoom={zoom} setZoom={setZoom} />
		</div>
	)
}
