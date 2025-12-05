import { useCallback, useEffect, useRef } from 'react'
import {
	DARK_CHECKER,
	DEFAULT_PIXEL_SIZE,
	DEFAULT_ZOOM,
	LIGHT_CHECKER,
} from '../config/settings'
import { ThemeContext } from '../contexts'
import { GridContext } from '../contexts/grid-context'
import { useLocalStorage, useSafeContext } from '../hooks'
import { CanvasZoom } from './ui/canvas-zoom'

export const Canvas = () => {
	const { width, height, showGrid } = useSafeContext(GridContext)
	const { theme } = useSafeContext(ThemeContext)
	const [zoom, setZoom] = useLocalStorage<number>('canvas-zoom', DEFAULT_ZOOM)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const pixelSize = DEFAULT_PIXEL_SIZE

	const canvasWidth = width * pixelSize
	const canvasHeight = height * pixelSize

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
	}, [width, height, showGrid, theme, pixelSize])

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
					className='block bg-slate-950'
				/>
			</div>
			<CanvasZoom zoom={zoom} setZoom={setZoom} />
		</div>
	)
}
