import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
	DARK_CHECKER,
	LAYER_PREVIEW_PADDING,
	LAYER_PREVIEW_SIZE,
	LIGHT_CHECKER,
	PIXEL_PERFECT_PREVIEW,
} from '@/config/settings'
import { GridContext } from '@/contexts/grid-context'
import { ThemeContext } from '@/contexts/theme-context'
import { useSafeContext } from '@/hooks'
import type { Coordinates, Layer } from '@/types'

interface LayerPreviewProps {
	data: Layer['data']
	pos: Coordinates | null
}

export const LayerPreview = ({ data, pos }: LayerPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { theme } = useSafeContext(ThemeContext)
	const { width: gridWidth, height: gridHeight } = useSafeContext(GridContext)

	useEffect(() => {
		if (!pos) return

		const canvas = canvasRef.current
		const ctx = canvas?.getContext('2d')
		if (!canvas || !ctx) return

		const expectedPixelSize =
			LAYER_PREVIEW_SIZE / Math.max(gridWidth, gridHeight)
		const pixelSize = PIXEL_PERFECT_PREVIEW
			? Math.floor(expectedPixelSize)
			: expectedPixelSize

		const isPixelPerfect = expectedPixelSize === Math.floor(expectedPixelSize)
		const canvasWidth = gridWidth * pixelSize
		const canvasHeight = gridHeight * pixelSize

		canvas.width = canvasWidth
		canvas.height = canvasHeight
		canvas.style.width = `${canvasWidth}px`
		canvas.style.height = `${canvasHeight}px`

		const checkerColors = theme === 'dark' ? DARK_CHECKER : LIGHT_CHECKER

		ctx.clearRect(0, 0, canvasWidth, canvasHeight)

		for (let y = 0; y < gridHeight; y++) {
			for (let x = 0; x < gridWidth; x++) {
				const color = data[y]?.[x]
				// Checker pattern without pixel perfect decreases visibility of preview
				const bgColor = isPixelPerfect
					? checkerColors[(x + y) % 2]
					: checkerColors[0]

				if (!color) ctx.fillStyle = bgColor
				else ctx.fillStyle = color

				ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
			}
		}
	}, [data, gridWidth, gridHeight, theme, pos])

	if (!pos) return null

	return createPortal(
		<div
			className='fixed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-lg overflow-hidden flex items-center justify-center z-50 pointer-events-none'
			style={{
				left: pos.x,
				top: pos.y,
				width: LAYER_PREVIEW_SIZE + LAYER_PREVIEW_PADDING,
				height: LAYER_PREVIEW_SIZE + LAYER_PREVIEW_PADDING,
			}}
		>
			<canvas ref={canvasRef} className='block' />
		</div>,
		document.body,
	)
}
