import {
	Download as DownloadIcon,
	Grid3x3 as GridIcon,
	HelpCircle as HelpIcon,
	Menu as MenuIcon,
	Moon as MoonIcon,
	Redo2 as RedoIcon,
	Sun as SunIcon,
	Undo2 as UndoIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Logo from '../assets/logo.png'
import { ThemeContext } from '../contexts'
import { GridContext } from '../contexts/grid-context'
import { HistoryContext } from '../contexts/history-context'
import { LayerContext } from '../contexts/layer-context'
import { UseHotkey, useSafeContext } from '../hooks'
import type { Layer } from '../types'
import { Button } from './ui/button'
import { ExportModal } from './ui/export-modal'
import { GridModal } from './ui/grid-modal'
import { HelpModal } from './ui/help-modal'

interface HeaderProps {
	onToggleSidebar: () => void
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
	const [isExportModalOpen, setIsExportModalOpen] = useState(false)
	const [isGridModalOpen, setIsGridModalOpen] = useState(false)
	const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

	const { width, height } = useSafeContext(GridContext)
	const { canUndo, undo, canRedo, redo } = useSafeContext(HistoryContext)
	const { setLayers, setCurrentLayerId, currentLayerId } =
		useSafeContext(LayerContext)
	const { theme, setTheme } = useSafeContext(ThemeContext)
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	const setLayerId = (layers: Layer[]) => {
		if (!layers.find((l) => l.id === currentLayerId)) {
			setCurrentLayerId(layers[0]?.id || null)
		}
	}

	const handleUndo = () => {
		const restoredLayers = undo()
		if (!restoredLayers) return

		setLayers(restoredLayers)
		setLayerId(restoredLayers)
	}

	const handleRedo = () => {
		const restoredLayers = redo()
		if (!restoredLayers) return

		setLayers(restoredLayers)
		setLayerId(restoredLayers)
	}

	const handleCloseHelpModal = () => {
		localStorage.setItem('help-modal-seen', 'true')
		setIsHelpModalOpen(false)
	}

	useEffect(() => {
		const helpModalSeen = localStorage.getItem('help-modal-seen')
		if (!helpModalSeen) setIsHelpModalOpen(true)
	}, [])

	UseHotkey('ctrl+z', handleUndo)
	UseHotkey('ctrl+y', handleRedo)

	UseHotkey('ctrl+s', (e) => {
		e.preventDefault()
		setIsExportModalOpen(true)
	})

	return (
		<>
			<header className='section h-16 border-b flex items-center px-3 md:px-6 justify-between gap-2'>
				<div className='flex items-center gap-3'>
					<Button
						title='Abrir painel'
						onClick={onToggleSidebar}
						className='md:hidden p-2 text-slate-500 hover:text-cyan-400 transition-colors'
					>
						<MenuIcon size={20} />
					</Button>
					<div className='hidden md:flex w-8 h-8 bg-radial from-indigo-100 to-cyan-200 dark:from-indigo-900 dark:to-cyan-800 rounded-lg items-center justify-center'>
						<img src={Logo} alt='Logo' className='w-5 h-5' />
					</div>
					<h1 className='text-lg md:text-xl font-medium md:font-bold capitalize'>
						Pixie
					</h1>
				</div>
				<div className='flex items-center gap-1 md:gap-4'>
					<Button
						title='Undo'
						disabled={!canUndo}
						onClick={handleUndo}
						className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors'
					>
						<UndoIcon size={20} />
					</Button>

					<Button
						title='Redo'
						disabled={!canRedo}
						onClick={handleRedo}
						className='p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors'
					>
						<RedoIcon size={20} />
					</Button>
				</div>
				<div className='flex items-center gap-1 md:gap-4'>
					<Button
						title='Toggle Theme'
						onClick={toggleTheme}
						className='hidden md:inline-flex p-2 text-slate-500 hover:text-cyan-400 transition-colors'
					>
						{theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
					</Button>

					<Button
						title='Help'
						onClick={() => setIsHelpModalOpen(true)}
						className='p-2 text-slate-500 hover:text-cyan-400 transition-colors'
					>
						<HelpIcon className='size-5' />
					</Button>

					<Button
						title='Grid'
						onClick={() => setIsGridModalOpen(true)}
						className='flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg sm:border sm:bg-slate-50 sm:dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors text-sm'
					>
						<GridIcon className='size-5 sm:size-4' />
						<span className='hidden sm:inline'>
							{width}x{height}
						</span>
					</Button>

					<Button
						title='Exportar'
						onClick={() => setIsExportModalOpen(true)}
						className='flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 text-sm hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
					>
						<DownloadIcon size={16} />
						<span className='hidden sm:inline'>Exportar</span>
					</Button>
				</div>
			</header>
			{isExportModalOpen && (
				<ExportModal onClose={() => setIsExportModalOpen(false)} />
			)}
			{isGridModalOpen && (
				<GridModal onClose={() => setIsGridModalOpen(false)} />
			)}
			{isHelpModalOpen && <HelpModal onClose={handleCloseHelpModal} />}
		</>
	)
}
