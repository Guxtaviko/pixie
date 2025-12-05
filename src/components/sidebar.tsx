import {
	Check as CheckIcon,
	Palette as ColorIcon,
	Plus as PlusIcon,
	Zap as ZapIcon,
} from 'lucide-react'
import { DEFAULT_PALETTE } from '../config/settings'
import { ColorContext } from '../contexts/color-context'
import { useSafeContext } from '../hooks'
import { colorBrightness } from '../utils/color-brightness'
import { Button } from './ui/button'
import { Layers } from './ui/layers'

export const Sidebar = () => {
	const { primary: color, setColor } = useSafeContext(ColorContext)

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
			<Layers />
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
