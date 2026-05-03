import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
	DEFAULT_GRID_SIZE,
	DEFAULT_PIXEL_SIZE,
	DEFAULT_PIXEL_SIZE_MODE,
	DEFAULT_SHOW_GRID,
} from '@/config/settings'
import { GridContext, GridProvider } from '@/contexts/grid-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<GridProvider>{children}</GridProvider>
)

describe('GridContext', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('provides default values', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		expect(result.current.width).toBe(DEFAULT_GRID_SIZE)
		expect(result.current.height).toBe(DEFAULT_GRID_SIZE)
		expect(result.current.pixelSize).toBe(DEFAULT_PIXEL_SIZE)
		expect(result.current.manualPixelSize).toBe(DEFAULT_PIXEL_SIZE)
		expect(result.current.pixelSizeMode).toBe(DEFAULT_PIXEL_SIZE_MODE)
		expect(result.current.showGrid).toBe(DEFAULT_SHOW_GRID)
	})

	it('uses manual pixel size when override is set', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		act(() => {
			result.current.setPixelSize(40)
		})

		expect(result.current.pixelSizeMode).toBe('manual')
		expect(result.current.manualPixelSize).toBe(40)
		expect(result.current.pixelSize).toBe(40)
	})

	it('updates auto pixel size while staying in auto mode', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		act(() => {
			result.current.setAutoPixelSize(64)
		})

		expect(result.current.pixelSizeMode).toBe('auto')
		expect(result.current.pixelSize).toBe(64)
	})

	it('restores pixel size defaults', () => {
		const { result } = renderHook(() => useContext(GridContext), {
			wrapper,
		})

		act(() => {
			result.current.setPixelSizeMode('manual')
			result.current.setPixelSize(40)
			result.current.setAutoPixelSize(48)
			result.current.resetPixelSize()
		})

		expect(result.current.pixelSizeMode).toBe('manual')
		expect(result.current.manualPixelSize).toBe(DEFAULT_PIXEL_SIZE)
		expect(result.current.pixelSize).toBe(DEFAULT_PIXEL_SIZE)
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
