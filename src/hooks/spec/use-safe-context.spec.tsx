import { renderHook } from '@testing-library/react'
import { createContext, type PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'
import { useSafeContext } from '../use-safe-context'

const NumberContext = createContext<number | null>(null)
NumberContext.displayName = 'NumberContext'

describe('useSafeContext', () => {
	it('returns context value when provider exists', () => {
		const wrapper = ({ children }: PropsWithChildren) => (
			<NumberContext.Provider value={42}>{children}</NumberContext.Provider>
		)

		const { result } = renderHook(() => useSafeContext(NumberContext), {
			wrapper,
		})

		expect(result.current).toBe(42)
	})

	it('throws descriptive error without provider', () => {
		expect(() => renderHook(() => useSafeContext(NumberContext))).toThrowError(
			'NumberContext must be used within its corresponding Provider',
		)
	})
})
