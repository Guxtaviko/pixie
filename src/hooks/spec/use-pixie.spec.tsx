import { act, renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ColorContext } from '../../contexts/color-context'
import { GridContext } from '../../contexts/grid-context'
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

	it('fills contiguous area when tool is fill', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				color: useContext(ColorContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.layer.setLayers((layers) =>
				layers.map((layer) => ({
					...layer,
					data: [
						['#111111', '#111111', '#222222'],
						['#111111', '#222222', '#222222'],
						['#111111', '#111111', '#111111'],
					],
				})),
			)
			result.current.color.setColor('#ff0000')
			result.current.tool.setTool('fill')
		})

		act(() => {
			result.current.pixie.handleInteraction({ x: 0, y: 0 })
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe('#ff0000')
		expect(currentLayer?.data[0]?.[1]).toBe('#ff0000')
		expect(currentLayer?.data[2]?.[2]).toBe('#ff0000')
		expect(currentLayer?.data[0]?.[2]).toBe('#222222')
	})

	it('picks visible non-transparent color when tool is picker', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				color: useContext(ColorContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.layer.setLayers([
				{
					id: 'layer-hidden',
					name: 'Camada hidden',
					isVisible: false,
					isLocked: false,
					opacity: 1,
					data: [['#00ff00']],
				},
				{
					id: 'layer-visible',
					name: 'Camada visible',
					isVisible: true,
					isLocked: false,
					opacity: 1,
					data: [['#abcdef']],
				},
			])
			result.current.layer.setCurrentLayerId('layer-visible')
			result.current.tool.setTool('picker')
		})

		act(() => {
			result.current.pixie.handleInteraction({ x: 0, y: 0 })
		})

		expect(result.current.color.primary).toBe('#abcdef')
	})

	it('applies interpolated drawing coordinates with brush', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				color: useContext(ColorContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.color.setColor('#2222ff')
			result.current.tool.setTool('brush')
		})

		act(() => {
			result.current.pixie.handleInterpolatedInteraction([
				{ x: 1, y: 1 },
				{ x: 2, y: 1 },
				{ x: 3, y: 1 },
			])
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[1]?.[1]).toBe('#2222ff')
		expect(currentLayer?.data[1]?.[2]).toBe('#2222ff')
		expect(currentLayer?.data[1]?.[3]).toBe('#2222ff')
	})

	it('ignores draw interactions outside grid bounds', () => {
		const { result } = renderHook(
			() => ({
				pixie: UsePixie(),
				layer: useContext(LayerContext),
				grid: useContext(GridContext),
				tool: useContext(ToolContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.grid.setSize(2, 2)
			result.current.tool.setTool('brush')
		})

		act(() => {
			result.current.pixie.handleInteraction({ x: 9, y: 9 })
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[9]).toBeUndefined()
	})
})
