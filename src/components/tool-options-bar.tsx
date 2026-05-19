import { Circle as CircleIcon, Square as SquareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from '@/config/settings'
import { ToolContext } from '@/contexts/tool-context'
import { useSafeContext } from '@/hooks'

const BrushOptions = () => {
	const { brushSize, setBrushSize, brushShape, setBrushShape } =
		useSafeContext(ToolContext)

	return (
		<>
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
		</>
	)
}

const ShapeOptions = () => {
	const {
		shapeType,
		setShapeType,
		shapeMode,
		setShapeMode,
		useSecondaryFill,
		setUseSecondaryFill,
	} = useSafeContext(ToolContext)

	return (
		<>
			<div className='flex gap-1 items-center'>
				<span className='text-xs font-medium text-slate-500 mr-1'>Forma:</span>
				<Button
					onClick={() => setShapeType('rectangle')}
					onPointerUp={(e) => e.currentTarget.blur()}
					className={`p-1.5 rounded-md transition-colors ${
						shapeType === 'rectangle'
							? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
							: 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
					}`}
					title='Retângulo'
				>
					<SquareIcon size={14} />
				</Button>
				<Button
					onClick={() => setShapeType('circle')}
					onPointerUp={(e) => e.currentTarget.blur()}
					className={`p-1.5 rounded-md transition-colors ${
						shapeType === 'circle'
							? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
							: 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
					}`}
					title='Círculo'
				>
					<CircleIcon size={14} />
				</Button>
			</div>

			<div className='h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1' />

			<div className='flex gap-4 items-center'>
				{/* biome-ignore lint/a11y/noLabelWithoutControl: custom switch control */}
				<label className='flex items-center gap-2 cursor-pointer'>
					<Switch
						checked={shapeMode === 'filled'}
						onCheckedChange={(checked) =>
							setShapeMode(checked ? 'filled' : 'outline')
						}
						onPointerUp={(e) => e.currentTarget.blur()}
					/>
					<span className='text-xs font-medium text-slate-500'>
						Preenchimento
					</span>
				</label>

				{shapeMode === 'filled' && (
					// biome-ignore lint/a11y/noLabelWithoutControl: custom checkbox control
					<label className='flex items-center gap-1.5 cursor-pointer'>
						<Checkbox
							checked={useSecondaryFill}
							onCheckedChange={setUseSecondaryFill}
						/>
						<span className='text-xs text-slate-500'>Usar cor secundária</span>
					</label>
				)}
			</div>
		</>
	)
}

export const ToolOptionsBar = () => {
	const { tool } = useSafeContext(ToolContext)

	const showBrushOptions = tool === 'brush' || tool === 'eraser'
	const showShapeOptions = tool === 'shape'

	if (!showBrushOptions && !showShapeOptions) return null

	return (
		<div className='w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center gap-3 shrink-0'>
			{showBrushOptions && <BrushOptions />}
			{showShapeOptions && <ShapeOptions />}
		</div>
	)
}
