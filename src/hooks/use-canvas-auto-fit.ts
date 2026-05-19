import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
import { calculatePixelSize } from '@/utils/calculate-pixel-size'

type UseCanvasAutoFitProps = {
	containerRef: RefObject<HTMLDivElement | null>
	width: number
	height: number
	setAutoPixelSize: (pixelSize: number) => void
}

export function useCanvasAutoFit({
	containerRef,
	width,
	height,
	setAutoPixelSize,
}: UseCanvasAutoFitProps) {
	const [availableSize, setAvailableSize] = useState({ width: 0, height: 0 })

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
	}, [containerRef])

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
}
