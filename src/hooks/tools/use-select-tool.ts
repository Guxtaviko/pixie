import type { PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { UseHotkey } from '@/hooks/use-hotkey'
import type { Coordinates, Layer, SelectionState } from '@/types'

type UseSelectToolProps = {
	tool: string
	layer?: Layer
	isLayerDrawable: boolean
	width: number
	height: number
	getLayerData: () => string[][]
	updateLayer: (id: string, data: Partial<Layer>) => void
	saveToHistory: (layers: Layer[]) => void
	layers: Layer[]
}

export function useSelectTool({
	tool,
	layer,
	isLayerDrawable,
	width,
	height,
	getLayerData,
	updateLayer,
	saveToHistory,
	layers,
}: UseSelectToolProps) {
	const [selectionState, setSelectionState] = useState<SelectionState | null>(
		null,
	)

	const [marqueeStart, setMarqueeStart] = useState<Coordinates | null>(null)
	const [dragStart, setDragStart] = useState<Coordinates | null>(null)
	const [dragInitialTransform, setDragInitialTransform] = useState<{
		dx: number
		dy: number
	} | null>(null)

	const commitSelection = useCallback(() => {
		if (!selectionState) return

		if (selectionState.pixels.length > 0 && layer && isLayerDrawable) {
			const newData = getLayerData()
			let hasChanges = false

			for (const p of selectionState.pixels) {
				const finalX =
					selectionState.x + p.relativeX + selectionState.transform.dx
				const finalY =
					selectionState.y + p.relativeY + selectionState.transform.dy

				if (finalX >= 0 && finalX < width && finalY >= 0 && finalY < height) {
					if (!newData[finalY]) newData[finalY] = []
					newData[finalY][finalX] = p.color
					hasChanges = true
				}
			}

			if (hasChanges) {
				updateLayer(layer.id, { data: newData })

				const newLayers = layers.map((l) =>
					l.id === layer.id ? { ...l, data: newData } : l,
				)
				saveToHistory(newLayers)
			}
		}

		setSelectionState(null)
	}, [
		selectionState,
		layer,
		isLayerDrawable,
		getLayerData,
		width,
		height,
		updateLayer,
		layers,
		saveToHistory,
	])

	// Commit if the user switches tools or layers
	useEffect(() => {
		if (tool !== 'select' && selectionState) {
			commitSelection()
		}
	}, [tool, selectionState, commitSelection])

	useEffect(() => {
		if (layer && selectionState && selectionState.pixels.length > 0) {
			// Actually we can't easily detect layer switch if `layer` reference changes
			// every time it's updated, so we need to be careful.
			// Let's just expose commitSelection and let usePixie handle side-effects if needed,
			// or handle it by comparing layer ID.
		}
	}, [layer, selectionState])

	UseHotkey('Escape', () => {
		if (selectionState) commitSelection()
	})

	const handlePointerDown = useCallback(
		(_e: ReactPointerEvent, coords: Coordinates) => {
			const isInsideSelection = (x: number, y: number, sel: SelectionState) => {
				const bx = sel.x + sel.transform.dx
				const by = sel.y + sel.transform.dy
				return x >= bx && x < bx + sel.width && y >= by && y < by + sel.height
			}

			if (tool !== 'select') return

			const clickedInside =
				selectionState && isInsideSelection(coords.x, coords.y, selectionState)

			if (!clickedInside) {
				if (selectionState) commitSelection()

				setMarqueeStart(coords)
				setSelectionState({
					x: coords.x,
					y: coords.y,
					width: 1,
					height: 1,
					pixels: [],
					transform: { dx: 0, dy: 0, scaleX: 1, scaleY: 1, rotation: 0 },
				})

				return
			}

			// Prepare to drag
			if (selectionState.pixels.length === 0 && layer && isLayerDrawable) {
				const newData = getLayerData()
				const extractedPixels: Array<{
					relativeX: number
					relativeY: number
					color: string
				}> = []
				let hasChanges = false

				for (let dy = 0; dy < selectionState.height; dy++) {
					for (let dx = 0; dx < selectionState.width; dx++) {
						const px = selectionState.x + dx
						const py = selectionState.y + dy

						if (px >= 0 && px < width && py >= 0 && py < height) {
							const color = newData[py]?.[px]
							if (color && color !== 'transparent') {
								extractedPixels.push({ relativeX: dx, relativeY: dy, color })
								newData[py][px] = 'transparent'
								hasChanges = true
							}
						}
					}
				}

				if (hasChanges) updateLayer(layer.id, { data: newData })

				setSelectionState((prev) =>
					prev ? { ...prev, pixels: extractedPixels } : null,
				)
			}

			setDragStart(coords)
			setDragInitialTransform({
				dx: selectionState.transform.dx,
				dy: selectionState.transform.dy,
			})
		},
		[
			tool,
			selectionState,
			commitSelection,
			layer,
			isLayerDrawable,
			getLayerData,
			width,
			height,
			updateLayer,
		],
	)

	const handlePointerMove = useCallback(
		(_e: ReactPointerEvent, coords: Coordinates | null) => {
			if (tool !== 'select' || !coords || !selectionState) return

			if (dragStart && dragInitialTransform) {
				// Dragging selection
				const diffX = coords.x - dragStart.x
				const diffY = coords.y - dragStart.y

				setSelectionState((prev) => {
					if (!prev) return prev
					return {
						...prev,
						transform: {
							...prev.transform,
							dx: dragInitialTransform.dx + diffX,
							dy: dragInitialTransform.dy + diffY,
						},
					}
				})
			} else if (marqueeStart) {
				// Dragging marquee
				const minX = Math.min(marqueeStart.x, coords.x)
				const minY = Math.min(marqueeStart.y, coords.y)
				const maxX = Math.max(marqueeStart.x, coords.x)
				const maxY = Math.max(marqueeStart.y, coords.y)

				setSelectionState((prev) => {
					if (!prev) return prev
					return {
						...prev,
						x: Math.max(0, minX),
						y: Math.max(0, minY),
						width: Math.min(width - minX, maxX - minX + 1),
						height: Math.min(height - minY, maxY - minY + 1),
					}
				})
			}
		},
		[
			tool,
			selectionState,
			dragStart,
			dragInitialTransform,
			marqueeStart,
			width,
			height,
		],
	)

	const handlePointerUp = useCallback(() => {
		if (tool !== 'select') return

		if (marqueeStart && selectionState && layer && isLayerDrawable) {
			const newData = getLayerData()

			let minX = width
			let minY = height
			let maxX = -1
			let maxY = -1

			for (let dy = 0; dy < selectionState.height; dy++) {
				for (let dx = 0; dx < selectionState.width; dx++) {
					const px = selectionState.x + dx
					const py = selectionState.y + dy

					if (px >= 0 && px < width && py >= 0 && py < height) {
						const color = newData[py]?.[px]
						if (color && color !== 'transparent') {
							minX = Math.min(minX, px)
							minY = Math.min(minY, py)
							maxX = Math.max(maxX, px)
							maxY = Math.max(maxY, py)
						}
					}
				}
			}

			if (maxX === -1) {
				// No pixels found in selection, clear it entirely
				setSelectionState(null)
			} else {
				// Shrink wrap to the actual pixels
				setSelectionState((prev) => {
					if (!prev) return prev
					return {
						...prev,
						x: minX,
						y: minY,
						width: maxX - minX + 1,
						height: maxY - minY + 1,
					}
				})
			}
		}

		setDragStart(null)
		setDragInitialTransform(null)
		setMarqueeStart(null)
	}, [
		tool,
		marqueeStart,
		selectionState,
		layer,
		isLayerDrawable,
		getLayerData,
		width,
		height,
	])

	return {
		selectionState,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		commitSelection,
	}
}
