import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Coordinates, Tool } from '@/types'
import { getCanvasCoordinates } from '@/utils/canvas-coordinates'
import { interpolateCoordinates } from '@/utils/interpolate-coordinates'
import { getToolBehavior, isShapeTool } from '@/utils/tools'

type CommitDrawingOptions = {
	start?: Coordinates
	end?: Coordinates
	shiftKey?: boolean
}

type UseCanvasPointerDrawingProps = {
	canvasRef: RefObject<HTMLCanvasElement | null>
	pixelSize: number
	tool: Tool
	applyPointInteraction: (coords: Coordinates) => void
	applyInterpolatedInteraction: (coords: Coordinates[]) => void
	commitDrawing: (options?: CommitDrawingOptions) => void
	onPointerDown?: (e: ReactPointerEvent, coords: Coordinates) => void
	onPointerMove?: (e: ReactPointerEvent, coords: Coordinates | null) => void
	onPointerUp?: (e?: ReactPointerEvent) => void
}

export function useCanvasPointerDrawing({
	canvasRef,
	pixelSize,
	tool,
	applyPointInteraction,
	applyInterpolatedInteraction,
	commitDrawing,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}: UseCanvasPointerDrawingProps) {
	const [isDrawing, setIsDrawing] = useState<boolean>(false)
	const [coordsBuffer, setCoordsBuffer] = useState<Coordinates[]>([])
	const [hoverCoord, setHoverCoord] = useState<Coordinates | null>(null)
	const [startCoord, setStartCoord] = useState<Coordinates | null>(null)
	const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false)
	const activePointerId = useRef<number | null>(null)

	const getCoordinates = useCallback(
		(e: ReactPointerEvent | PointerEvent): Coordinates | null =>
			getCanvasCoordinates(canvasRef.current, e, pixelSize),
		[canvasRef, pixelSize],
	)

	const handleStart = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		e.preventDefault()
		e.currentTarget.setPointerCapture(e.pointerId)
		activePointerId.current = e.pointerId

		setIsShiftPressed(e.shiftKey)
		setIsDrawing(true)

		const coords = getCoordinates(e)
		if (!coords) return
		setHoverCoord(coords)
		setStartCoord(coords)

		if (onPointerDown) onPointerDown(e, coords)

		if (isShapeTool(tool) || getToolBehavior(tool) === 'custom') return

		applyPointInteraction(coords)
	}

	const handleMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		const coords = getCoordinates(e)
		setHoverCoord(coords)

		if (onPointerMove) onPointerMove(e, coords)

		if (!isDrawing) return

		const isActivePointer =
			activePointerId.current === null ||
			e.pointerId === activePointerId.current
		if (!isActivePointer) return

		e.preventDefault()
		setIsShiftPressed(e.shiftKey)

		if (!coords) return
		if (isShapeTool(tool) || getToolBehavior(tool) === 'custom') return

		setCoordsBuffer((prev) =>
			prev.find((c) => c.x === coords.x && c.y === coords.y)
				? prev
				: [...prev, coords],
		)
		applyPointInteraction(coords)
	}

	const handleEnd = (e?: ReactPointerEvent<HTMLCanvasElement>) => {
		if (e) {
			const isActivePointer =
				activePointerId.current === null ||
				e.pointerId === activePointerId.current
			if (!isActivePointer) return

			e.preventDefault()
			if (e.currentTarget.hasPointerCapture(e.pointerId)) {
				e.currentTarget.releasePointerCapture(e.pointerId)
			}
		}

		activePointerId.current = null

		setIsDrawing(false)

		if (onPointerUp) onPointerUp(e)

		if (!isDrawing) return

		if (coordsBuffer.length) setCoordsBuffer([])

		if (getToolBehavior(tool) === 'custom') return

		const isValidShape = isShapeTool(tool) && startCoord && hoverCoord
		commitDrawing(
			isValidShape
				? {
						start: startCoord,
						end: hoverCoord,
						shiftKey: isShiftPressed,
					}
				: undefined,
		)

		setStartCoord(null)
	}

	const handleLeave = (e: ReactPointerEvent<HTMLCanvasElement>) => {
		setHoverCoord(null)
		handleEnd(e)
	}

	useEffect(() => {
		if (coordsBuffer.length < 2) return

		const [from, to, ...rest] = coordsBuffer
		const interpolatedCoords = interpolateCoordinates(from, to)

		if (interpolatedCoords.length >= 2) {
			applyInterpolatedInteraction(interpolatedCoords)
		}

		setCoordsBuffer([to, ...rest])
	}, [coordsBuffer, applyInterpolatedInteraction])

	return {
		hoverCoord,
		startCoord,
		isShiftPressed,
		pointerHandlers: {
			onPointerDown: handleStart,
			onPointerMove: handleMove,
			onPointerUp: handleEnd,
			onPointerCancel: handleEnd,
			onPointerLeave: handleLeave,
		},
	}
}
