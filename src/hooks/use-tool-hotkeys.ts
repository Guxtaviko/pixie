import type { SetStateAction } from 'react'
import { useEffect } from 'react'
import { MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from '@/config/settings'
import type { Tool } from '@/types'
import { TOOL_CONFIG } from '@/utils/tools'

type UseToolHotkeysProps = {
	tool: Tool
	setBrushSize: (size: SetStateAction<number>) => void
}

export function useToolHotkeys({ tool, setBrushSize }: UseToolHotkeysProps) {
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (!e.ctrlKey) return
			if (!TOOL_CONFIG[tool]?.usesBrushSize) return

			// Avoid conflicting with zoom or page scroll
			e.preventDefault()

			if (e.deltaY < 0) {
				setBrushSize((prev) => Math.min(prev + 1, MAX_BRUSH_SIZE))
			} else if (e.deltaY > 0) {
				setBrushSize((prev) => Math.max(prev - 1, MIN_BRUSH_SIZE))
			}
		}

		window.addEventListener('wheel', handleWheel, { passive: false })
		return () => {
			window.removeEventListener('wheel', handleWheel)
		}
	}, [tool, setBrushSize])
}
