import type { Tool, ToolBehavior } from '@/types'

export const TOOL_CONFIG: Record<
	Tool,
	{ behavior: ToolBehavior; usesBrushSize?: boolean }
> = {
	brush: { behavior: 'continuous', usesBrushSize: true },
	eraser: { behavior: 'continuous', usesBrushSize: true },
	fill: { behavior: 'click' },
	picker: { behavior: 'click' },
	line: { behavior: 'drag-to-draw' },
	shape: { behavior: 'drag-to-draw' },
}

export const isShapeTool = (tool: Tool) =>
	TOOL_CONFIG[tool].behavior === 'drag-to-draw'

export const getToolBehavior = (tool: Tool): ToolBehavior =>
	TOOL_CONFIG[tool].behavior
