import { Circle as CircleIcon, Square as SquareIcon } from 'lucide-react'
import { MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from '../config/settings'
import { ToolContext } from '../contexts/tool-context'
import { useSafeContext } from '../hooks'
import { Button } from './ui/button'

export const ToolOptionsBar = () => {
	const { tool, brushSize, setBrushSize, brushShape, setBrushShape } =
		useSafeContext(ToolContext)

	if (tool !== 'brush' && tool !== 'eraser') return null

	return (
		<div className='w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center gap-3 shrink-0 z-10'>
			<span className='text-xs font-medium text-slate-500 text-right'>
				{brushSize}px
			</span>
			<input
				type='range'
				min={MIN_BRUSH_SIZE}
				max={MAX_BRUSH_SIZE}
				value={brushSize}
				onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
				onPointerUp={(e) => e.currentTarget.blur()}
				className='w-24 md:w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-slate-200'
			/>
			<div className='h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1' />
			<div className='flex gap-1'>
				<Button
					onClick={() => setBrushShape('circle')}
					onPointerUp={(e) => e.currentTarget.blur()}
					className={`p-1.5 rounded-full transition-colors ${
						brushShape === 'circle'
							? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
							: 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
					}`}
					title='Circle brush'
				>
					<CircleIcon
						size={14}
						className={brushShape === 'circle' ? 'fill-current' : ''}
					/>
				</Button>
				<Button
					onClick={() => setBrushShape('square')}
					onPointerUp={(e) => e.currentTarget.blur()}
					className={`p-1.5 rounded-full transition-colors ${
						brushShape === 'square'
							? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
							: 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
					}`}
					title='Square brush'
				>
					<SquareIcon
						size={14}
						className={brushShape === 'square' ? 'fill-current' : ''}
					/>
				</Button>
			</div>
		</div>
	)
}
