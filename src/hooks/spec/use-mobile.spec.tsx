import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMobile } from '../use-mobile'

describe('useMobile', () => {
	const originalInnerWidth = window.innerWidth

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			value: originalInnerWidth,
		})
	})

	it('returns false when window width is greater than breakpoint', () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
		const { result } = renderHook(() => useMobile(768))
		expect(result.current).toBe(false)
	})

	it('returns true when window width is less than breakpoint', () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
		const { result } = renderHook(() => useMobile(768))
		expect(result.current).toBe(true)
	})

	it('uses default breakpoint of 768', () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })
		const { result } = renderHook(() => useMobile())
		expect(result.current).toBe(true)
	})

	it('updates isMobile on window resize', () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 })
		const { result, rerender } = renderHook(() => useMobile(768))
		expect(result.current).toBe(false)

		Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
		window.dispatchEvent(new Event('resize'))
		rerender()
		expect(result.current).toBe(true)
	})

	it('respects custom breakpoint', () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
		const { result } = renderHook(() => useMobile(500))
		expect(result.current).toBe(false)
	})

	it('cleans up resize listener on unmount', () => {
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
		const { unmount } = renderHook(() => useMobile())
		unmount()
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			'resize',
			expect.any(Function),
		)
	})
})
