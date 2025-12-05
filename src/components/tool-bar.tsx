import {
	Brush as BrushIcon,
	Eraser as EraserIcon,
	Grid3x3 as GridIcon,
	PaintBucket as PaintIcon,
	Pipette as PickerIcon,
	Trash2 as TrashIcon,
} from 'lucide-react'
import { ColorContext } from '../contexts/color-context'
import { GridContext } from '../contexts/grid-context'
import { ToolContext } from '../contexts/tool-context'
import { UseHotkey, useSafeContext } from '../hooks'
import { UsePixie } from '../hooks/use-pixie'
import type { Tool } from '../types'
import { colorBrightness } from '../utils/color-brightness'
import { Button } from './ui/button'
import { ToolButton } from './ui/tool-button'

const buttons = [
	{ label: 'Pincel', icon: BrushIcon, hotKey: 'b', tool: 'brush' },
	{ label: 'Borracha', icon: EraserIcon, hotKey: 'e', tool: 'eraser' },
	{ label: 'Balde', icon: PaintIcon, hotKey: 'g', tool: 'fill' },
	{ label: 'Conta-gotas', icon: PickerIcon, hotKey: 'i', tool: 'picker' },
]

export const ToolBar = () => {
	const { showGrid, toggleGrid } = useSafeContext(GridContext)
	const { primary, secondary, toggleActiveColor } = useSafeContext(ColorContext)
	const { tool, setTool } = useSafeContext(ToolContext)
	const { clearCanvas } = UsePixie()

	UseHotkey('g', () => setTool('fill'))
	UseHotkey('b', () => setTool('brush'))
	UseHotkey('e', () => setTool('eraser'))
	UseHotkey('i', () => setTool('picker'))

	return (
		<aside className='w-20 border-r section flex flex-col items-center py-4 gap-4 z-10'>
			<div className='flex flex-col items-center gap-4'>
				{buttons.map(({ label, icon, hotKey, tool: buttonTool }) => (
					<ToolButton
						key={label}
						label={label}
						icon={icon}
						hotKey={hotKey}
						isActive={tool === buttonTool}
						onClick={() => setTool(buttonTool as Tool)}
					/>
				))}
			</div>

			<hr className='w-12 border-slate-200 dark:border-slate-800 my-2' />

			<Button
				onClick={toggleGrid}
				className={`p-3 rounded-xl transition-all  transform  hover:scale-105 active:scale-95 ${
					showGrid
						? 'text-cyan-500 bg-slate-200 dark:bg-slate-800'
						: 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-200/50 dark:bg-slate-800/50 '
				}`}
			>
				<GridIcon size={20} />
			</Button>

			<div className='relative w-11 h-11'>
				<Button
					className={`w-9 h-9 rounded-lg border-2 absolute top-0 left-0 z-20 ${colorBrightness(primary) === 'dark' ? 'border-slate-100' : 'border-slate-900'}`}
					style={{ backgroundColor: primary }}
				/>
				<Button
					onClick={toggleActiveColor}
					className='w-9 h-9 rounded-lg border-2 border-slate-200 dark:border-slate-800 absolute bottom-0 right-0 z-10'
					style={{ backgroundColor: secondary }}
				/>
			</div>

			<Button
				onClick={clearCanvas}
				className='mt-auto p-3 text-red-400 hover:bg-red-500/15 hover:text-red-500 rounded-xl transition-all'
			>
				<TrashIcon size={20} />
			</Button>
		</aside>
	)
}
