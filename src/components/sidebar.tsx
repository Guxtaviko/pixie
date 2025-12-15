import {
	Check as CheckIcon,
	Palette as ColorIcon,
	Plus as PlusIcon,
	Zap as ZapIcon,
} from 'lucide-react'
import { useState } from 'react'
import { ColorContext } from '../contexts/color-context'
import { useSafeContext } from '../hooks'
import { colorBrightness } from '../utils/color-brightness'
import { Button } from './ui/button'
import { ColorSelector } from './ui/color-selector'
import { Layers } from './ui/layers'

export const Sidebar = () => {
	const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false)
	const [customColor, setCustomColor] = useState<string | null>(null)

	const {
		primary: color,
		palette,
		setColor,
		addToPalette,
	} = useSafeContext(ColorContext)

	const toggleColorSelector = () => setIsColorSelectorOpen((prev) => !prev)

	const handleColorSelectorClose = () => {
		setIsColorSelectorOpen(false)

		if (!customColor) return

		addToPalette(customColor)
		setColor(customColor)
		setCustomColor(null)
	}

	return (
		<aside className='w-72 section border-l flex flex-col py-4 px-2 *:px-2 gap-4'>
			<h2 className='text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2'>
				<ColorIcon size={16} />
				<span>Cores</span>
			</h2>
			<div className='grid grid-cols-6 gap-1 relative'>
				{palette.map((hex) => {
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
					onClick={toggleColorSelector}
					className='color-selector-activator w-full aspect-square rounded-lg flex items-center justify-center z-10 border-2 border-dashed border-slate-200 dark:border-slate-800 transition-transform hover:scale-105 text-slate-500 hover:text-slate-950 dark:hover:text-slate-50 hover:border-slate-500'
					style={{ backgroundColor: 'transparent' }}
				>
					<PlusIcon size={16} />
				</Button>
				{isColorSelectorOpen && (
					<div className='absolute top-0 left-0 transform -translate-x-full z-30'>
						<ColorSelector
							showPreview
							onColorChange={setCustomColor}
							handleClose={handleColorSelectorClose}
						/>
					</div>
				)}
			</div>
			<Layers />
			<div className='mt-auto flex justify-between items-center text-cyan-400'>
				<a
					href='https://github.com/guxtaviko'
					target='_blank'
					rel='noopener noreferrer'
					className='text-sm flex gap-2 items-center justify-center transition-transform hover:scale-105 font-medium w-fit'
				>
					<ZapIcon size={14} />
					Guxtaviko
				</a>
				<a
					href='https://github.com/guxtaviko/pixie'
					target='_blank'
					rel='noopener noreferrer'
					className='w-5 h-5 flex items-center justify-center  transition-transform hover:scale-105'
				>
					<svg
						role='img'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>GitHub</title>
						<path
							fill='currentColor'
							d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
						/>
					</svg>
				</a>
			</div>
		</aside>
	)
}
