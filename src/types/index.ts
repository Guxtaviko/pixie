export type Theme = 'light' | 'dark'

export type Tool =
	| 'brush'
	| 'eraser'
	| 'fill'
	| 'picker'
	| 'line'
	| 'shape'
	| 'select'
export type ShapeMode = 'outline' | 'filled'
export type ShapeType = 'rectangle' | 'circle'
export type BrushShape = 'square' | 'circle'
export type ToolBehavior = 'continuous' | 'click' | 'drag-to-draw' | 'custom'

export type SelectionState = {
	x: number
	y: number
	width: number
	height: number
	pixels: Array<{ relativeX: number; relativeY: number; color: string }>
	transform: {
		dx: number
		dy: number
		scaleX: number
		scaleY: number
		rotation: number
	}
}

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
