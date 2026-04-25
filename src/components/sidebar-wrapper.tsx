import type { ReactNode } from 'react'

interface SidebarWrapperProps {
	children: ReactNode
	isOpen: boolean
	onClose: () => void
}

export const SidebarWrapper = ({
	children,
	isOpen,
	onClose,
}: SidebarWrapperProps) => {
	return (
		<div
			className={`fixed inset-0 z-50 md:hidden ${isOpen ? 'block' : 'hidden'}`}
		>
			{/* Backdrop */}
			<button
				type='button'
				onClick={onClose}
				className='absolute inset-0 bg-black/45 backdrop-blur-[1px]'
			/>

			<div className='absolute left-0 top-0 bottom-0 w-[min(24rem,92vw)] section border-r border-slate-200 dark:border-slate-800'>
				{children}
			</div>
		</div>
	)
}
