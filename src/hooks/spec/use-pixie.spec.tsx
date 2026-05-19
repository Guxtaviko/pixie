import { act, renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ColorContext } from '@/contexts/color-context'
import { GridContext } from '@/contexts/grid-context'
import { HistoryContext } from '@/contexts/history-context'
import { LayerContext } from '@/contexts/layer-context'
import { ToolContext } from '@/contexts/tool-context'
import { usePixie } from '@/hooks/use-pixie'
import { PixieTestProviders } from '@/spec/test-providers'

describe('usePixie', () => {
	it('draws a pixel on active layer with current primary color', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				layer: useContext(LayerContext),
				color: useContext(ColorContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
			result.current.pixie.commitDrawing()
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe(result.current.color.primary)
	})

	it('erases a pixel when tool is eraser', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
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
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe('transparent')
	})

	it('fills contiguous area when tool is fill', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
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
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
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
				pixie: usePixie(),
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
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
		})

		expect(result.current.color.primary).toBe('#abcdef')
	})

	it('applies interpolated drawing coordinates with brush', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
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
			result.current.pixie.applyInterpolatedInteraction([
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
				pixie: usePixie(),
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
			result.current.pixie.applyPointInteraction({ x: 9, y: 9 })
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[9]).toBeUndefined()
	})

	it('commits one history entry after a brush stroke', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				color: useContext(ColorContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.color.setColor('#123456')
		})

		act(() => {
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
		})

		const historyLengthBeforeCommit = result.current.history.history.length

		act(() => {
			result.current.pixie.commitDrawing()
		})

		expect(result.current.history.history).toHaveLength(
			historyLengthBeforeCommit + 1,
		)
		expect(result.current.history.history.at(-1)?.[0]?.data[0]?.[0]).toBe(
			'#123456',
		)
	})

	it('commits one history entry after an eraser stroke', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				history: useContext(HistoryContext),
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
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
		})

		const historyLengthBeforeCommit = result.current.history.history.length

		act(() => {
			result.current.pixie.commitDrawing()
		})

		expect(result.current.history.history).toHaveLength(
			historyLengthBeforeCommit + 1,
		)
		expect(result.current.history.history.at(-1)?.[0]?.data[0]?.[0]).toBe(
			'transparent',
		)
	})

	it('does not commit history when picker finishes', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.layer.setLayers((layers) =>
				layers.map((layer) => ({
					...layer,
					data: [['#abcdef']],
				})),
			)
			result.current.tool.setTool('picker')
		})

		const historyLengthBeforePicker = result.current.history.history.length

		act(() => {
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
			result.current.pixie.commitDrawing()
		})

		expect(result.current.history.history).toHaveLength(
			historyLengthBeforePicker,
		)
	})

	it('commits shape drawing through commitDrawing options', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				layer: useContext(LayerContext),
				tool: useContext(ToolContext),
				color: useContext(ColorContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.color.setColor('#ff00ff')
			result.current.tool.setTool('line')
		})

		const historyLengthBeforeCommit = result.current.history.history.length

		act(() => {
			result.current.pixie.commitDrawing({
				start: { x: 0, y: 0 },
				end: { x: 2, y: 0 },
			})
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe('#ff00ff')
		expect(currentLayer?.data[0]?.[1]).toBe('#ff00ff')
		expect(currentLayer?.data[0]?.[2]).toBe('#ff00ff')
		expect(result.current.history.history).toHaveLength(
			historyLengthBeforeCommit + 1,
		)
	})

	it('does not mutate or commit a locked layer', () => {
		const { result } = renderHook(
			() => ({
				pixie: usePixie(),
				layer: useContext(LayerContext),
				history: useContext(HistoryContext),
			}),
			{ wrapper: PixieTestProviders },
		)

		act(() => {
			result.current.layer.setLayers((layers) =>
				layers.map((layer) => ({
					...layer,
					isLocked: true,
					data: [['#000000']],
				})),
			)
		})

		const historyLengthBeforeCommit = result.current.history.history.length

		act(() => {
			result.current.pixie.applyPointInteraction({ x: 0, y: 0 })
			result.current.pixie.commitDrawing()
		})

		const currentLayer = result.current.layer.layers.find(
			(l) => l.id === result.current.layer.currentLayerId,
		)

		expect(currentLayer?.data[0]?.[0]).toBe('#000000')
		expect(result.current.history.history).toHaveLength(
			historyLengthBeforeCommit,
		)
	})
})
