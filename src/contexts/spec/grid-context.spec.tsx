import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import {
	DEFAULT_GRID_SIZE,
	DEFAULT_PIXEL_SIZE,
	DEFAULT_SHOW_GRID,
} from '../../config/settings'
import { GridContext, GridProvider } from '../grid-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<GridProvider>{children}</GridProvider>
)

describe('GridContext', () => {
	it('provides default values', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		expect(result.current.width).toBe(DEFAULT_GRID_SIZE)
		expect(result.current.height).toBe(DEFAULT_GRID_SIZE)
		expect(result.current.pixelSize).toBe(DEFAULT_PIXEL_SIZE)
		expect(result.current.showGrid).toBe(DEFAULT_SHOW_GRID)
	})

	it('updates grid size', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		act(() => {
			result.current.setSize(24, 40)
		})

		expect(result.current.width).toBe(24)
		expect(result.current.height).toBe(40)
	})

	it('toggles showGrid', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		const initial = result.current.showGrid

		act(() => {
			result.current.toggleGrid()
		})

		expect(result.current.showGrid).toBe(!initial)
	})
})
