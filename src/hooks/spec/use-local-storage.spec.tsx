import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorage } from '@/hooks/use-local-storage'

describe('useLocalStorage', () => {
	it('returns initial value when key does not exist', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 5))
		expect(result.current[0]).toBe(5)
	})

	it('writes and reads value from localStorage', () => {
		const { result } = renderHook(() => useLocalStorage('counter', 0))

		act(() => {
			result.current[1](3)
		})

		expect(result.current[0]).toBe(3)
		expect(window.localStorage.getItem('counter')).toBe('3')
	})

	it('supports functional state updates', () => {
		const { result } = renderHook(() => useLocalStorage('counter-fn', 1))

		act(() => {
			result.current[1]((prev) => prev + 4)
		})

		expect(result.current[0]).toBe(5)
	})
})
