import { createContext } from 'react'
import {
	DEFAULT_BRUSH_SHAPE,
	DEFAULT_BRUSH_SIZE,
	DEFAULT_TOOL,
} from '@/config/settings'
import { useLocalStorage } from '@/hooks'
import type { BrushShape, Tool } from '@/types'

type ToolContextType = {
	tool: Tool
	setTool: (tool: Tool) => void
	brushSize: number
	setBrushSize: (size: number) => void
	brushShape: BrushShape
	setBrushShape: (shape: BrushShape) => void
}

const ToolContext = createContext<ToolContextType>({
	tool: DEFAULT_TOOL,
	setTool: () => null,
	brushSize: DEFAULT_BRUSH_SIZE,
	setBrushSize: () => null,
	brushShape: DEFAULT_BRUSH_SHAPE,
	setBrushShape: () => null,
})

const ToolProvider = ({ children }: { children: React.ReactNode }) => {
	const [tool, setTool] = useLocalStorage<Tool>('selected-tool', DEFAULT_TOOL)
	const [brushSize, setBrushSize] = useLocalStorage<number>(
		'brush-size',
		DEFAULT_BRUSH_SIZE,
	)
	const [brushShape, setBrushShape] = useLocalStorage<BrushShape>(
		'brush-shape',
		DEFAULT_BRUSH_SHAPE,
	)

	return (
		<ToolContext.Provider
			value={{
				tool,
				setTool,
				brushSize,
				setBrushSize,
				brushShape,
				setBrushShape,
			}}
		>
			{children}
		</ToolContext.Provider>
	)
}

export { ToolProvider, ToolContext }
