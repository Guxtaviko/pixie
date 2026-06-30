import { act, renderHook } from '@testing-library/react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { LayerContext } from '@/contexts/layer-context'
import { useSelectTool } from '@/hooks/tools/use-select-tool'
import { PixieTestProviders } from '@/spec/test-providers'
import type { Layer } from '@/types'

describe('useSelectTool', () => {
	const setup = () => {
		let layersRef: Layer[] = []
		let getLayerData: () => string[][] = () => []
		let updateLayer: (id: string, data: Partial<Layer>) => void = () => {}
		let saveToHistory: (layers: Layer[]) => void = () => {}

		const { result } = renderHook(
			() => {
				const layerContext = useContext(LayerContext)

				layersRef = layerContext.layers
				const activeLayer = layerContext.layers.find(
					(l) => l.id === layerContext.currentLayerId,
				)

				getLayerData = () => activeLayer?.data.map((row) => [...row]) || []
				updateLayer = layerContext.updateLayer

				// Mock saveToHistory
				saveToHistory = () => {}

				return {
					selectTool: useSelectTool({
						tool: 'select',
						layer: activeLayer,
						isLayerDrawable: true,
						width: 10,
						height: 10,
						getLayerData,
						updateLayer,
						saveToHistory,
						layers: layerContext.layers,
					}),
					layerContext,
					activeLayer,
				}
			},
			{ wrapper: PixieTestProviders },
		)

		return { result, layersRef, getLayerData, updateLayer }
	}

	it('creates a marquee bounding box on pointer drag', () => {
		const { result } = setup()

		// Simulate dragging to create selection box
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 2, y: 2 },
			)
		})

		expect(result.current.selectTool.selectionState).toEqual(
			expect.objectContaining({
				x: 2,
				y: 2,
				width: 1,
				height: 1,
				pixels: [],
				transform: { dx: 0, dy: 0, scaleX: 1, scaleY: 1, rotation: 0 },
			}),
		)

		act(() => {
			result.current.selectTool.handlePointerMove(
				{} as unknown as ReactPointerEvent,
				{ x: 5, y: 4 },
			)
		})

		expect(result.current.selectTool.selectionState).toEqual(
			expect.objectContaining({
				x: 2,
				y: 2,
				width: 4, // 5 - 2 + 1
				height: 3, // 4 - 2 + 1
			}),
		)
	})

	it('extracts pixels when clicking inside an existing selection', () => {
		const { result, getLayerData } = setup()

		// Pre-fill the layer with some data
		act(() => {
			const newData = getLayerData()
			if (!newData[2]) newData[2] = []
			newData[2][2] = '#ff0000'
			// biome-ignore lint/style/noNonNullAssertion: Test ensures activeLayer is not null
			result.current.layerContext.updateLayer(result.current.activeLayer!.id, {
				data: newData,
			})
		})

		// Create a marquee covering the pixel
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 1, y: 1 },
			)
		})
		act(() => {
			result.current.selectTool.handlePointerMove(
				{} as unknown as ReactPointerEvent,
				{ x: 3, y: 3 },
			)
		})
		act(() => {
			result.current.selectTool.handlePointerUp()
		})

		// Click inside the marquee to extract pixels
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 2, y: 2 },
			)
		})

		// biome-ignore lint/style/noNonNullAssertion: Test ensures selectionState is not null
		const selState = result.current.selectTool.selectionState!
		expect(selState.pixels.length).toBe(1)
		expect(selState.pixels[0]).toEqual({
			relativeX: 0, // shrink-wrapped directly to 2,2
			relativeY: 0, // shrink-wrapped directly to 2,2
			color: '#ff0000',
		})

		// Check layer data: pixel should be removed (transparent)
		const currentLayerData = result.current.layerContext.layers.find(
			(l) => l.id === result.current.activeLayer?.id,
		)?.data
		expect(currentLayerData?.[2][2]).toBe('transparent')
	})

	it('translates extracted pixels and commits them on outside click', () => {
		const { result, getLayerData } = setup()

		// Pre-fill the layer with some data
		act(() => {
			const newData = getLayerData()
			if (!newData[2]) newData[2] = []
			newData[2][2] = '#ff0000'
			// biome-ignore lint/style/noNonNullAssertion: Test ensures activeLayer is not null
			result.current.layerContext.updateLayer(result.current.activeLayer!.id, {
				data: newData,
			})
		})

		// Create marquee
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 1, y: 1 },
			)
		})
		act(() => {
			result.current.selectTool.handlePointerMove(
				{} as unknown as ReactPointerEvent,
				{ x: 3, y: 3 },
			)
		})
		act(() => {
			result.current.selectTool.handlePointerUp()
		})

		// Click inside to lift
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 2, y: 2 },
			)
		})

		// Drag the selection
		act(() => {
			result.current.selectTool.handlePointerMove(
				{} as unknown as ReactPointerEvent,
				{ x: 4, y: 4 },
			)
		})

		// Transform should reflect the drag dx=2, dy=2
		// biome-ignore lint/style/noNonNullAssertion: Test ensures selectionState is not null
		const selState = result.current.selectTool.selectionState!
		expect(selState.transform).toEqual({
			dx: 2,
			dy: 2,
			scaleX: 1,
			scaleY: 1,
			rotation: 0,
		})

		// Click outside to drop (commit)
		act(() => {
			result.current.selectTool.handlePointerDown(
				{} as unknown as ReactPointerEvent,
				{ x: 8, y: 8 },
			)
		})

		// The pixel should now be at the new translated location (2+2 = 4, 2+2 = 4)
		const currentLayerData = result.current.layerContext.layers.find(
			(l) => l.id === result.current.activeLayer?.id,
		)?.data
		expect(currentLayerData?.[4][4]).toBe('#ff0000')
	})
})
