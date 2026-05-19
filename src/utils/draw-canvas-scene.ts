import { COORDS_DEBUG, DARK_CHECKER, LIGHT_CHECKER } from '@/config/settings'
import type { BrushShape, Coordinates, Layer } from '@/types'
import { getBrushFootprint } from '@/utils/brush'
import { colorBrightness } from '@/utils/color-brightness'
import type { ShapePixels } from '@/utils/geometry'

type DrawCanvasSceneOptions = {
	canvas: HTMLCanvasElement | null
	width: number
	height: number
	pixelSize: number
	showGrid: boolean
	theme: 'light' | 'dark'
	layers: Layer[]
	hoverCoord: Coordinates | null
	tool: string
	brushSize: number
	brushShape: BrushShape
	shapePreview: ShapePixels | null
	primary: string
	secondary: string
	useSecondaryFill: boolean
}

export function drawCanvasScene({
	canvas,
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
}: DrawCanvasSceneOptions) {
	const ctx = canvas?.getContext('2d')
	if (!canvas || !ctx) return

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const checkerColors = theme === 'dark' ? DARK_CHECKER : LIGHT_CHECKER
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			ctx.fillStyle = checkerColors[(x + y) % 2]
			ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
		}
	}

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

	if (showGrid) {
		const gridColor =
			theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'

		ctx.strokeStyle = gridColor
		ctx.lineWidth = 1

		for (let x = 0; x <= width; x++) {
			ctx.beginPath()
			ctx.moveTo(x * pixelSize, 0)
			ctx.lineTo(x * pixelSize, height * pixelSize)
			ctx.stroke()
		}

		for (let y = 0; y <= height; y++) {
			ctx.beginPath()
			ctx.moveTo(0, y * pixelSize)
			ctx.lineTo(width * pixelSize, y * pixelSize)
			ctx.stroke()
		}
	}

	if (shapePreview) {
		ctx.globalAlpha = 0.85

		const drawPreviewPixels = (pts: Coordinates[], color: string) => {
			ctx.fillStyle = color
			for (const p of pts) {
				const isXOutOfBounds = p.x < 0 || p.x >= width
				const isYOutOfBounds = p.y < 0 || p.y >= height
				if (isXOutOfBounds || isYOutOfBounds) continue

				ctx.fillRect(p.x * pixelSize, p.y * pixelSize, pixelSize, pixelSize)
			}
		}

		drawPreviewPixels(shapePreview.border, primary)
		drawPreviewPixels(shapePreview.fill, useSecondaryFill ? secondary : primary)

		ctx.globalAlpha = 1
	}

	if (hoverCoord && (tool === 'brush' || tool === 'eraser')) {
		const footprint = getBrushFootprint(brushSize, brushShape)
		ctx.lineWidth = 1

		for (const offset of footprint) {
			const nx = hoverCoord.x + offset.x
			const ny = hoverCoord.y + offset.y

			const isOutOfBounds = nx < 0 || nx >= width || ny < 0 || ny >= height
			if (isOutOfBounds) continue

			let topColor = 'transparent'
			for (let i = layers.length - 1; i >= 0; i--) {
				if (layers[i].isVisible && layers[i].data[ny]?.[nx]) {
					topColor = layers[i].data[ny][nx]
					if (topColor !== 'transparent') break
				}
			}

			if (topColor === 'transparent') topColor = checkerColors[(nx + ny) % 2]

			const isLight = colorBrightness(topColor) === 'light'
			ctx.strokeStyle = isLight
				? 'rgba(0, 0, 0, 0.7)'
				: 'rgba(255, 255, 255, 0.7)'

			ctx.strokeRect(nx * pixelSize, ny * pixelSize, pixelSize, pixelSize)
		}
	}

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
}
