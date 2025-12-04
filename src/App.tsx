import {
	Download as DownloadIcon,
	Grid3x3 as GridIcon,
	HelpCircle as HelpIcon,
	Moon as MoonIcon,
	Redo2 as RedoIcon,
	Sun as SunIcon,
	Undo2 as UndoIcon,
} from 'lucide-react'
import Logo from './assets/logo.png'
import { useTheme } from './hooks'

export const App = () => {
	const { theme, setTheme } = useTheme()
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<div className='min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200  overflow-hidden selection:bg-cyan-500/50 selection:text-white antialiased duration-300'>
			<header className='bg-slate-100 dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-radial from-indigo-100 to-cyan-200 dark:from-indigo-900 dark:to-cyan-800 rounded-lg flex items-center justify-center'>
						<img src={Logo} alt='Logo' className='w-5 h-5' />
					</div>
					<h1 className='text-xl font-bold capitalize'>Pixie</h1>
				</div>
				<div className='flex items-center gap-4'>
					<button
						type='button'
						disabled
						className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default'
					>
						<UndoIcon size={20} />
					</button>
					<button
						type='button'
						disabled
						className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default'
					>
						<RedoIcon size={20} />
					</button>
				</div>
				<div className='flex items-center gap-4'>
					<button
						type='button'
						title='Toggle Theme'
						onClick={toggleTheme}
						className='p-2 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer'
					>
						{theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
					</button>

					<button
						type='button'
						className='p-2 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer'
					>
						<HelpIcon size={20} />
					</button>

					<button
						type='button'
						className='flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors cursor-pointer text-sm'
					>
						<GridIcon size={16} />
						<span>16x16</span>
					</button>

					<button
						type='button'
						className='flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 text-sm hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500/50'
					>
						<DownloadIcon size={16} />
						<span>Exportar</span>
					</button>
				</div>
			</header>
		</div>
	)
}
