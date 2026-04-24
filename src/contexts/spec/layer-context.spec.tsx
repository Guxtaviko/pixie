import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { HistoryProvider } from '../history-context'
import { LayerContext, LayerProvider } from '../layer-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<HistoryProvider>
		<LayerProvider>{children}</LayerProvider>
	</HistoryProvider>
)

describe('LayerContext', () => {
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
})
