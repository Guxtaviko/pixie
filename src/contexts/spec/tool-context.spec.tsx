import { act, renderHook } from '@testing-library/react'
import { type PropsWithChildren, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { ToolContext, ToolProvider } from '../tool-context'

const wrapper = ({ children }: PropsWithChildren) => (
	<ToolProvider>{children}</ToolProvider>
)

describe('ToolContext', () => {
	it('updates selected tool', () => {
		const { result } = renderHook(() => useContext(ToolContext), { wrapper })

		act(() => {
			result.current.setTool('eraser')
		})

		expect(result.current.tool).toBe('eraser')
	})
})
