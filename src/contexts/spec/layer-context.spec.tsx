import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { HistoryContext, HistoryProvider } from '../history-context'
import { LayerContext, LayerProvider } from '../layer-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<HistoryProvider>
		<LayerProvider>{children}</LayerProvider>
	</HistoryProvider>
)

describe('LayerContext', () => {
	it('initializes history snapshot on first mount', () => {
		const { result } = renderHook(
			() => ({
				layer: useContext(LayerContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper },
		)

		expect(result.current.layer.layers).toHaveLength(1)
		expect(result.current.history.history.length).toBe(1)
	})

	it('adds and removes layers', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })

		expect(result.current.layers).toHaveLength(1)

		act(() => {
			result.current.addLayer()
		})

		expect(result.current.layers).toHaveLength(2)

		const removableId = result.current.layers[0]?.id
		if (!removableId) throw new Error('Expected a removable layer id')

		act(() => {
			result.current.removeLayer(removableId)
		})

		expect(result.current.layers).toHaveLength(1)
	})

	it('does not remove when there is only one layer', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })
		const onlyLayerId = result.current.layers[0]?.id
		if (!onlyLayerId) throw new Error('Expected initial layer id')

		act(() => {
			result.current.removeLayer(onlyLayerId)
		})

		expect(result.current.layers).toHaveLength(1)
	})

	it('toggles visibility and lock status', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })
		const layerId = result.current.layers[0]?.id
		if (!layerId) throw new Error('Expected an initial layer id')
		const before = result.current.layers[0]
		if (!before) throw new Error('Expected initial layer state')

		act(() => {
			result.current.toggleLayerVisibility(layerId)
		})

		expect(result.current.layers[0]?.isVisible).toBe(!before.isVisible)

		act(() => {
			result.current.toggleLayerLock(layerId)
		})

		expect(result.current.layers[0]?.isLocked).toBe(!before.isLocked)
	})

	it('updates layer attributes', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })
		const layerId = result.current.layers[0]?.id
		if (!layerId) throw new Error('Expected initial layer id')

		act(() => {
			result.current.updateLayer(layerId, { name: 'Renamed', opacity: 0.5 })
		})

		expect(result.current.layers[0]?.name).toBe('Renamed')
		expect(result.current.layers[0]?.opacity).toBe(0.5)
	})

	it('clones an existing layer and ignores unknown ids', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })
		const layerId = result.current.layers[0]?.id
		if (!layerId) throw new Error('Expected initial layer id')

		act(() => {
			result.current.cloneLayer('missing-id')
		})

		expect(result.current.layers).toHaveLength(1)

		act(() => {
			result.current.cloneLayer(layerId)
		})

		expect(result.current.layers).toHaveLength(2)
		expect(result.current.layers[1]?.name).toContain('(cópia)')
		expect(result.current.currentLayerId).toBe(result.current.layers[1]?.id)
	})

	it('clears all layer pixel data and saves to history', () => {
		const { result } = renderHook(
			() => ({
				layer: useContext(LayerContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper },
		)
		const layerId = result.current.layer.layers[0]?.id
		if (!layerId) throw new Error('Expected initial layer id')

		act(() => {
			result.current.layer.updateLayer(layerId, { data: [['#ffffff']] })
		})

		const beforeHistory = result.current.history.history.length

		act(() => {
			result.current.layer.clearLayers()
		})

		expect(result.current.layer.layers[0]?.data).toEqual([])
		expect(result.current.history.history.length).toBeGreaterThan(beforeHistory)
	})

	it('merges visible layers and ignores hidden layer data', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })

		act(() => {
			result.current.setLayers([
				{
					id: 'hidden',
					name: 'Camada hidden',
					isVisible: false,
					isLocked: false,
					opacity: 1,
					data: [['#111111', '#111111']],
				},
				{
					id: 'visible-a',
					name: 'Camada A',
					isVisible: true,
					isLocked: false,
					opacity: 1,
					data: [['#222222', ''], ['#333333']],
				},
				{
					id: 'visible-b',
					name: 'Camada B',
					isVisible: true,
					isLocked: false,
					opacity: 1,
					data: [['#aaaaaa', '#bbbbbb']],
				},
			])
		})

		const merged = result.current.getMerged()

		expect(merged[0]?.[0]).toBe('#aaaaaa')
		expect(merged[0]?.[1]).toBe('#bbbbbb')
		expect(merged[1]?.[0]).toBe('#333333')
		expect(Object.values(merged[0] || {})).not.toContain('#111111')
	})

	it('sets current layer id when removing selected layer', () => {
		const { result } = renderHook(() => useContext(LayerContext), { wrapper })

		act(() => {
			result.current.addLayer()
		})

		const originalId = result.current.layers[0]?.id
		const secondId = result.current.layers[1]?.id
		if (!originalId || !secondId) throw new Error('Expected two layer ids')

		act(() => {
			result.current.setCurrentLayerId(originalId)
		})

		act(() => {
			result.current.removeLayer(originalId)
		})

		expect(result.current.layers).toHaveLength(1)
		expect(result.current.currentLayerId).toBe(secondId)
	})
})
