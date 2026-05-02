import { useState } from 'react'
import { Canvas } from './components/canvas'
import { Header } from './components/header'
import { Sidebar } from './components/sidebar'
import { SidebarWrapper } from './components/sidebar-wrapper'
import { ToolBar } from './components/tool-bar'
import { ToolOptionsBar } from './components/tool-options-bar'
import { useMobile } from './hooks/use-mobile'

export const App = () => {
	const isMobile = useMobile()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
	const closeSidebar = () => setIsSidebarOpen(false)

	return (
		<div className='min-h-dvh bg-radial bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200  overflow-hidden selection:bg-cyan-500/50 selection:text-white antialiased duration-300'>
			<Header onToggleSidebar={toggleSidebar} />
			<main className='flex h-[calc(100dvh-4rem)] md:h-[calc(100vh-4rem)] relative flex-col md:flex-row'>
				<ToolBar />
				<div className='flex-1 relative flex flex-col overflow-hidden'>
					<ToolOptionsBar />
					<Canvas />
				</div>
				{isMobile ? (
					<SidebarWrapper isOpen={isSidebarOpen} onClose={closeSidebar}>
						<Sidebar
							onClose={closeSidebar}
							className='w-full h-full border-0'
						/>
					</SidebarWrapper>
				) : (
					<Sidebar className='flex' />
				)}
			</main>
		</div>
	)
}
