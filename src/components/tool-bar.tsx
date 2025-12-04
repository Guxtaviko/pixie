import {
	Brush as BrushIcon,
	Eraser as EraserIcon,
	Grid3x3 as GridIcon,
	PaintBucket as PaintIcon,
	Pipette as PickerIcon,
	Trash2 as TrashIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { ToolButton } from './ui/tool-button'

const buttons = [
	{ label: 'Pincel', icon: BrushIcon, hotKey: 'B' },
	{ label: 'Borracha', icon: EraserIcon, hotKey: 'E' },
	{ label: 'Balde', icon: PaintIcon, hotKey: 'G' },
	{ label: 'Conta-gotas', icon: PickerIcon, hotKey: 'I' },
]

export const ToolBar = () => {
	const [showGrid, setShowGrid] = useState(true)

	const toggleGrid = () => setShowGrid(!showGrid)

	return (
		<aside className='w-20 border-r section flex flex-col items-center py-4 gap-4 z-10'>
			<div className='flex flex-col items-center gap-4'>
				{buttons.map(({ label, icon, hotKey }) => (
					<ToolButton key={label} label={label} icon={icon} hotKey={hotKey} />
				))}
			</div>

			<hr className='w-12 border-slate-500/50 my-2' />

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

			<Button className='mt-auto p-3 text-red-400 hover:bg-red-500/15 hover:text-red-500 rounded-xl transition-all'>
				<TrashIcon size={20} />
			</Button>
		</aside>
	)
}
