import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ColorContext, ColorProvider } from '@/contexts/color-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<ColorProvider>{children}</ColorProvider>
)

describe('ColorContext', () => {
	it('sets active color and can add custom palette color', () => {
		const { result } = renderHook(() => useContext(ColorContext), { wrapper })

		act(() => {
			result.current.setColor('#123456')
			result.current.addToPalette('#123456')
		})

		expect(result.current.primary).toBe('#123456')
		expect(result.current.palette).toContain('#123456')
	})

	it('swaps active colors', () => {
		const { result } = renderHook(() => useContext(ColorContext), { wrapper })
		const initialPrimary = result.current.primary
		const initialSecondary = result.current.secondary

		act(() => {
			result.current.toggleActiveColor()
		})

		expect(result.current.primary).toBe(initialSecondary)
		expect(result.current.secondary).toBe(initialPrimary)
	})
})
