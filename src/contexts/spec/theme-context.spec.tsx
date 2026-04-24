import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ThemeContext, ThemeProvider } from '../theme-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<ThemeProvider>{children}</ThemeProvider>
)

describe('ThemeContext', () => {
	it('toggles dark class on document root', () => {
		const { result } = renderHook(() => useContext(ThemeContext), { wrapper })

		act(() => {
			result.current.setTheme('dark')
		})

		expect(document.documentElement.classList.contains('dark')).toBe(true)

		act(() => {
			result.current.setTheme('light')
		})

		expect(document.documentElement.classList.contains('dark')).toBe(false)
	})
})
