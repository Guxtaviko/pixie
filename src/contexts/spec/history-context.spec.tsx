import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { HistoryContext, HistoryProvider } from '@/contexts/history-context'
import type { Layer } from '@/types'

const wrapper = ({ children }: PropsWithChildren) => (
	<HistoryProvider>{children}</HistoryProvider>
)

const stateA: Layer[] = [
	{
		id: '1',
		name: 'Camada 1',
		isVisible: true,
		isLocked: false,
		opacity: 1,
		data: [['#000000']],
	},
]

const stateB: Layer[] = [
	{
		...stateA[0],
		data: [['#ffffff']],
	},
]

describe('HistoryContext', () => {
	it('saves states and navigates with undo/redo', () => {
		const { result } = renderHook(() => useContext(HistoryContext), { wrapper })

		act(() => {
			result.current.saveToHistory(stateA)
		})

		act(() => {
			result.current.saveToHistory(stateB)
		})

		expect(result.current.canUndo).toBe(true)
		expect(result.current.canRedo).toBe(false)

		let restored: Layer[] | null = null
		act(() => {
			restored = result.current.undo()
		})

		expect(restored).toEqual(stateA)
		expect(result.current.canRedo).toBe(true)

		act(() => {
			restored = result.current.redo()
		})

		expect(restored).toEqual(stateB)
	})
})
