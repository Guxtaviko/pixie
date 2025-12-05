import {
	Download as DownloadIcon,
	Grid3x3 as GridIcon,
	HelpCircle as HelpIcon,
	Moon as MoonIcon,
	Redo2 as RedoIcon,
	Sun as SunIcon,
	Undo2 as UndoIcon,
} from 'lucide-react'
import Logo from '../assets/logo.png'
import { ThemeContext } from '../contexts'
import { useSafeContext } from '../hooks'
import { Button } from './ui/button'

export const Header = () => {
	const { theme, setTheme } = useSafeContext(ThemeContext)
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<header className='section h-16 border-b flex items-center px-6 justify-between'>
			<div className='flex items-center gap-3'>
				<div className='w-8 h-8 bg-radial from-indigo-100 to-cyan-200 dark:from-indigo-900 dark:to-cyan-800 rounded-lg flex items-center justify-center'>
					<img src={Logo} alt='Logo' className='w-5 h-5' />
				</div>
				<h1 className='text-xl font-bold capitalize'>Pixie</h1>
			</div>
			<div className='flex items-center gap-4'>
				<Button
					disabled
					className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors'
				>
					<UndoIcon size={20} />
				</Button>

				<Button
					disabled
					className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors'
				>
					<RedoIcon size={20} />
				</Button>
			</div>
			<div className='flex items-center gap-4'>
				<Button
					title='Toggle Theme'
					onClick={toggleTheme}
					className='p-2 text-slate-500 hover:text-cyan-400 transition-colors'
				>
					{theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
				</Button>

				<Button
					title='Help'
					className='p-2 text-slate-500 hover:text-cyan-400 transition-colors'
				>
					<HelpIcon size={20} />
				</Button>

				<Button className='flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors text-sm'>
					<GridIcon size={16} />
					<span>16x16</span>
				</Button>

				<Button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 text-sm hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'>
					<DownloadIcon size={16} />
					<span>Exportar</span>
				</Button>
			</div>
		</header>
	)
}
