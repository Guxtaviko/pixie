import {
	Brush as BrushIcon,
	Eraser as EraserIcon,
	Grid3x3 as GridIcon,
	PaintBucket as PaintIcon,
	Pipette as PickerIcon,
	Trash2 as TrashIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColorSelector } from '@/components/ui/color-selector'
import { ToolButton } from '@/components/ui/tool-button'
import { ColorContext } from '@/contexts/color-context'
import { GridContext } from '@/contexts/grid-context'
import { LayerContext } from '@/contexts/layer-context'
import { ToolContext } from '@/contexts/tool-context'
import { UseHotkey, useSafeContext } from '@/hooks'
import { useMobile } from '@/hooks/use-mobile'
import type { Tool } from '@/types'

const version = APP_VERSION

const buttons = [
	{ label: 'Pincel', icon: BrushIcon, hotKey: 'b', tool: 'brush' },
	{ label: 'Borracha', icon: EraserIcon, hotKey: 'e', tool: 'eraser' },
	{ label: 'Balde', icon: PaintIcon, hotKey: 'g', tool: 'fill' },
	{ label: 'Conta-gotas', icon: PickerIcon, hotKey: 'i', tool: 'picker' },
]

export const ToolBar = () => {
	const isMobile = useMobile()
	const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false)

	const { showGrid, toggleGrid } = useSafeContext(GridContext)
	const { primary, secondary, toggleActiveColor, setColor } =
		useSafeContext(ColorContext)
	const { tool, setTool } = useSafeContext(ToolContext)
	const { clearLayers } = useSafeContext(LayerContext)

	UseHotkey('g', () => setTool('fill'))
	UseHotkey('b', () => setTool('brush'))
	UseHotkey('e', () => setTool('eraser'))
	UseHotkey('i', () => setTool('picker'))

	const toggleColorSelector = () => setIsColorSelectorOpen(!isColorSelectorOpen)
	const closeColorSelector = () => setIsColorSelectorOpen(false)

	return (
		<aside className='w-full md:w-20 border-b md:border-b-0 md:border-r section flex md:flex-col items-center py-3 md:py-4 px-3 md:px-0 gap-3 md:gap-4 z-10 overflow-x-auto md:overflow-x-visible'>
			<div className='flex md:flex-col items-center gap-3 md:gap-4'>
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

			<hr className='h-10 md:h-auto md:w-12 border-l md:border-l-0 md:border-t border-slate-200 dark:border-slate-800 mx-1 md:my-2' />

			<Button
				onClick={toggleGrid}
				className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all  transform  hover:scale-105 active:scale-95 ${
					showGrid
						? 'text-cyan-500 bg-slate-200 dark:bg-slate-800'
						: 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-200/50 dark:bg-slate-800/50 '
				}`}
			>
				<GridIcon size={18} />
			</Button>

			<div className='relative color-selector-wrapper w-10 md:w-11 h-10 md:h-11 shrink-0'>
				<Button
					onClick={toggleColorSelector}
					className='color-selector-activator w-8 h-8 md:w-9 md:h-9 rounded-lg border-2 absolute top-0 left-0 z-20 border-slate-900 dark:border-slate-100'
					style={{ backgroundColor: primary }}
				/>
				<Button
					onClick={toggleActiveColor}
					className='w-8 h-8 md:w-9 md:h-9 rounded-lg border-2 border-slate-200 dark:border-slate-800 absolute bottom-0 right-0 z-10'
					style={{ backgroundColor: secondary }}
				/>
				{isColorSelectorOpen &&
					(isMobile ? (
						<div className='fixed inset-0 z-50 md:hidden pointer-events-none'>
							<div className='absolute inset-0 bg-black/35 pointer-events-auto' />
							<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto'>
								<ColorSelector
									onColorChange={setColor}
									handleClose={closeColorSelector}
								/>
							</div>
						</div>
					) : (
						<div className='absolute top-0 left-12 z-30'>
							<ColorSelector
								onColorChange={setColor}
								handleClose={closeColorSelector}
							/>
						</div>
					))}
			</div>

			<div className='ml-auto md:ml-0 md:mt-auto flex flex-col items-center gap-2 shrink-0'>
				<Button
					onClick={clearLayers}
					className='p-2.5 md:p-3 text-red-400 hover:bg-red-500/15 hover:text-red-500 rounded-lg md:rounded-xl transition-all'
				>
					<TrashIcon size={18} />
				</Button>
				<span className='hidden md:inline text-xs text-slate-500'>
					v{version}
				</span>
			</div>
		</aside>
	)
}
