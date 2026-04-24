import { act, renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ColorContext } from '../../contexts/color-context'
import { LayerContext } from '../../contexts/layer-context'
import { ToolContext } from '../../contexts/tool-context'
import { PixieTestProviders } from '../../spec/test-providers'
import { UsePixie } from '../use-pixie'

describe('UsePixie', () => {
	it('draws a pixel on active layer with current primary color', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				color: useContext(ColorContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.pixie.handleInteraction({ x: 0, y: 0 })
			result.current.pixie.endDrawing()
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe(result.current.color.primary)
	})

	it('erases a pixel when tool is eraser', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.layer.setLayers((layers) =>
				layers.map((layer) => ({
					...layer,
					data: [['#000000']],
				})),
			)
			result.current.tool.setTool('eraser')
		})

		act(() => {
			result.current.pixie.handleInteraction({ x: 0, y: 0 })
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe('transparent')
	})
})
