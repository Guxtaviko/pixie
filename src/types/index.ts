export type Theme = 'light' | 'dark'

export type Tool = 'brush' | 'eraser' | 'fill' | 'picker'

export type Layer = {
	id: string
	name: string
	isVisible: boolean
	isLocked: boolean
	opacity: number
	data: number[][]
}
