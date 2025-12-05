import { Canvas } from './components/canvas'
import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { ToolBar } from './components/tool-bar'

export const App = () => {
	return (
		<div className='min-h-dvh bg-radial bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200  overflow-hidden selection:bg-cyan-500/50 selection:text-white antialiased duration-300'>
			<Header />
			<main className='flex h-[calc(100vh-4rem)] relative'>
				<ToolBar />
				<Canvas />
				<Sidebar />
			</main>
		</div>
	)
}
