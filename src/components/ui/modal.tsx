import { X as CloseIcon } from 'lucide-react'
import { UseHotkey } from '../../hooks'
import { Button } from './button'

interface ModalProps {
	onClose: () => void
	children?: React.ReactNode
}

export const Modal = ({ onClose, children }: ModalProps) => {
	UseHotkey('escape', () => {
		onClose()
	})

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4'>
			<div className='section border-2 w-full max-w-md rounded-2xl shadow-2xl p-6 relative'>
				<Button
					onClick={onClose}
					className='p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors absolute top-4 right-4 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transform active:scale-95'
					title='Close'
				>
					<CloseIcon size={16} />
				</Button>
				{children}
			</div>
		</div>
	)
}
