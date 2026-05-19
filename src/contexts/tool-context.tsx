import { createContext } from 'react'
import {
	DEFAULT_BRUSH_SHAPE,
	DEFAULT_BRUSH_SIZE,
	DEFAULT_TOOL,
} from '@/config/settings'
import { useLocalStorage } from '@/hooks'
import type { BrushShape, ShapeMode, ShapeType, Tool } from '@/types'

type ToolContextType = {
	tool: Tool
	setTool: (tool: Tool) => void
	brushSize: number
	setBrushSize: (size: number) => void
	brushShape: BrushShape
	setBrushShape: (shape: BrushShape) => void
	shapeMode: ShapeMode
	setShapeMode: (mode: ShapeMode) => void
	shapeType: ShapeType
	setShapeType: (shape: ShapeType) => void
	useSecondaryFill: boolean
	setUseSecondaryFill: (use: boolean) => void
}

const ToolContext = createContext<ToolContextType>({
	tool: DEFAULT_TOOL,
	setTool: () => null,
	brushSize: DEFAULT_BRUSH_SIZE,
	setBrushSize: () => null,
	brushShape: DEFAULT_BRUSH_SHAPE,
	setBrushShape: () => null,
	shapeMode: 'outline',
	setShapeMode: () => null,
	shapeType: 'rectangle',
	setShapeType: () => null,
	useSecondaryFill: false,
	setUseSecondaryFill: () => null,
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
	const [shapeMode, setShapeMode] = useLocalStorage<ShapeMode>(
		'shape-mode',
		'outline',
	)
	const [shapeType, setShapeType] = useLocalStorage<ShapeType>(
		'shape-type',
		'rectangle',
	)
	const [useSecondaryFill, setUseSecondaryFill] = useLocalStorage<boolean>(
		'use-secondary-fill',
		false,
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
				shapeMode,
				setShapeMode,
				shapeType,
				setShapeType,
				useSecondaryFill,
				setUseSecondaryFill,
			}}
		>
			{children}
		</ToolContext.Provider>
	)
}

export { ToolProvider, ToolContext }
