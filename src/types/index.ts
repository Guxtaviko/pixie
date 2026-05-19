export type Theme = 'light' | 'dark'

export type Tool = 'brush' | 'eraser' | 'fill' | 'picker' | 'line' | 'shape'
export type ShapeMode = 'outline' | 'filled'
export type ShapeType = 'rectangle' | 'circle'
export type BrushShape = 'square' | 'circle'
export type ToolBehavior = 'continuous' | 'click' | 'drag-to-draw'

export type Layer = {
	id: string
	name: string
	isVisible: boolean
	isLocked: boolean
	opacity: number
	data: string[][]
}

export type Coordinates = {
	x: number
	y: number
}
