import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ToolOptionsBar } from '@/components/tool-options-bar'
import { DEFAULT_BRUSH_SHAPE, DEFAULT_BRUSH_SIZE } from '@/config/settings'
import { ToolContext } from '@/contexts/tool-context'
import type { BrushShape, Tool } from '@/types'

describe('ToolOptionsBar', () => {
	const defaultProps = {
		tool: 'brush' as Tool,
		setTool: vi.fn(),
		brushSize: DEFAULT_BRUSH_SIZE,
		setBrushSize: vi.fn(),
		brushShape: DEFAULT_BRUSH_SHAPE as BrushShape,
		setBrushShape: vi.fn(),
	}

	it('should render when tool is brush', () => {
		render(
			<ToolContext.Provider value={defaultProps}>
				<ToolOptionsBar />
			</ToolContext.Provider>,
		)
		expect(screen.getByText('1px')).toBeInTheDocument()
	})

	it('should render when tool is eraser', () => {
		render(
			<ToolContext.Provider value={{ ...defaultProps, tool: 'eraser' }}>
				<ToolOptionsBar />
			</ToolContext.Provider>,
		)
		expect(screen.getByText('1px')).toBeInTheDocument()
	})

	it('should not render when tool is picker', () => {
		const { container } = render(
			<ToolContext.Provider value={{ ...defaultProps, tool: 'picker' }}>
				<ToolOptionsBar />
			</ToolContext.Provider>,
		)
		expect(container).toBeEmptyDOMElement()
	})

	it('should call setBrushSize on slider change', () => {
		render(
			<ToolContext.Provider value={defaultProps}>
				<ToolOptionsBar />
			</ToolContext.Provider>,
		)
		const slider = screen.getByRole('slider')
		fireEvent.change(slider, { target: { value: '5' } })
		expect(defaultProps.setBrushSize).toHaveBeenCalledWith(5)
	})

	it('should call setBrushShape on button click', () => {
		render(
			<ToolContext.Provider value={defaultProps}>
				<ToolOptionsBar />
			</ToolContext.Provider>,
		)
		const squareBtn = screen.getByTitle('Square brush')
		fireEvent.click(squareBtn)
		expect(defaultProps.setBrushShape).toHaveBeenCalledWith('square')
	})
})
