import type { Layer, Tool } from '../types'

// Color settings
export const DEFAULT_PALETTE = [
	'#f8fafc',
	'#ef4444',
	'#f97316',
	'#eab308',
	'#22c55e',
	'#06b6d4',
	'#3b82f6',
	'#8b5cf6',
	'#d946ef',
	'#f43f5e',
	'#78350f',
	'#000000',
]
export const DEFAULT_PRIMARY_COLOR = DEFAULT_PALETTE[0]
export const DEFAULT_SECONDARY_COLOR = DEFAULT_PALETTE[11]

// Tool settings
export const DEFAULT_TOOL: Tool = 'brush'

// Grid settings
export const DEFAULT_GRID_SIZE = 16
export const DEFAULT_SHOW_GRID = true
export const MIN_GRID_SIZE = 4
export const MAX_GRID_SIZE = 128

// Canvas settings
export const DEFAULT_PIXEL_SIZE = 24
export const DARK_CHECKER = ['#1e293b', '#334155']
export const LIGHT_CHECKER = ['#cbd5e1', '#e2e8f0']

// Zoom settings
export const DEFAULT_ZOOM = 1
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 3
export const ZOOM_STEP = 0.25

// Layer settings
export const DEFAULT_LAYER_OPTIONS: Omit<Layer, 'id' | 'name'> = {
	isVisible: true,
	isLocked: false,
	opacity: 1,
	data: [],
}
