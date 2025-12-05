import {
	Check as CheckIcon,
	Copy as CloneIcon,
	Palette as ColorIcon,
	Trash2 as DeleteIcon,
	EyeOff as HiddenIcon,
	Layers as LayersIcon,
	Lock as LockIcon,
	Plus as PlusIcon,
	LockOpen as UnlockIcon,
	Eye as VisibleIcon,
	Zap as ZapIcon,
} from 'lucide-react'
import { useState } from 'react'
import { DEFAULT_PALETTE } from '../config/settings'
import { ColorContext } from '../contexts/color-context'
import { useSafeContext } from '../hooks'
import { colorBrightness } from '../utils/color-brightness'
import { Button } from './ui/button'

const mockLayers = [
	{ id: 1, name: 'Layer 1', locked: false, visible: true },
	{ id: 2, name: 'Layer 2', locked: true, visible: true },
	{ id: 3, name: 'Layer 3', locked: false, visible: false },
]

export const Sidebar = () => {
	const { primary: color, setColor } = useSafeContext(ColorContext)
	const [layer, setLayer] = useState<number>(mockLayers[0].id)

	return (
		<aside className='w-72 section border-l flex flex-col p-4 gap-4'>
			<h2 className='text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
				<ColorIcon size={16} />
				<span>Cores</span>
			</h2>
			<div className='grid grid-cols-6 gap-1'>
				{DEFAULT_PALETTE.map((hex) => {
					const brightness = colorBrightness(hex)
					return (
						<Button
							key={hex}
							onClick={() => setColor(hex)}
							className={`w-full aspect-square rounded-lg relative transition-transform hover:scale-105 z-10 border-2 ${color === hex ? (brightness === 'dark' ? 'border-slate-100' : 'border-slate-900') : 'border-slate-200 dark:border-slate-800'}`}
							style={{ backgroundColor: hex }}
						>
							{color === hex && (
								<span
									className={`absolute bottom-1 right-1 ${
										brightness === 'dark' ? 'text-slate-100' : 'text-slate-900'
									}`}
								>
									<CheckIcon size={12} />
								</span>
							)}
						</Button>
					)
				})}
				<Button
					className='w-full aspect-square rounded-lg flex items-center justify-center z-10 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-transform hover:scale-105 text-slate-500 hover:text-slate-950 dark:hover:text-slate-50 hover:border-slate-500'
					style={{ backgroundColor: 'transparent' }}
				>
					<PlusIcon size={16} />
				</Button>
			</div>
			<div className='border-t border-slate-200 dark:border-slate-800'>
				<div className='flex items-center justify-between my-4'>
					<h2 className='text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
						<LayersIcon size={16} />
						<span>Camadas</span>
					</h2>
					<Button className='p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-cyan-500/25 hover:text-cyan-400 rounded-lg transition-colors'>
						<PlusIcon size={16} />
					</Button>
				</div>
				<div className='flex flex-col gap-1'>
					{mockLayers.map((l) => (
						<Button
							key={l.id}
							onClick={() => setLayer(l.id)}
							className={`flex items-center p-2 rounded-lg border transition-all group ${
								layer === l.id
									? 'border-cyan-500 bg-cyan-500/10'
									: 'border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'
							}`}
						>
							<Button className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'>
								{l.visible ? (
									<VisibleIcon size={14} />
								) : (
									<HiddenIcon size={14} className='text-slate-500' />
								)}
							</Button>
							<Button className='p-1.5 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 rounded transition-colors'>
								{l.locked ? (
									<LockIcon size={14} className='text-cyan-500' />
								) : (
									<UnlockIcon size={14} />
								)}
							</Button>
							<span className='flex-1 ml-2 text-left text-sm'>{l.name}</span>
							<Button className='p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 rounded transition-colors'>
								<CloneIcon size={14} />
							</Button>
							{mockLayers.length > 1 && (
								<Button className='p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 rounded transition-colors'>
									<DeleteIcon size={14} />
								</Button>
							)}
						</Button>
					))}
				</div>
			</div>
			<a
				href='https://github.com/guxtaviko'
				target='_blank'
				rel='noopener noreferrer'
				className='mt-auto mx-auto text-sm flex gap-2 items-center justify-center text-cyan-400 transition-transform hover:scale-105 font-medium w-fit px-2'
			>
				<ZapIcon size={14} className='text-cyan-400' />
				Guxtaviko
			</a>
		</aside>
	)
}
