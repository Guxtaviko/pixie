import type { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface ToolButtonProps {
	label: string
	hotKey?: string
	isActive?: boolean
	icon: LucideIcon
	onClick?: () => void
}

export const ToolButton = ({
	label,
	hotKey,
	isActive = false,
	icon: Icon,
	onClick,
}: ToolButtonProps) => {
	return (
		<div className='group relative flex items-center'>
			<Button
				title={label}
				onClick={onClick}
				className={`p-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
					isActive
						? 'bg-cyan-500 text-white'
						: 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-cyan-500'
				}`}
			>
				<Icon size={24} />
			</Button>
			<span className='absolute left-14 dark:bg-slate-800 bg-slate-200 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg border border-slate-300 dark:border-slate-700 transform scale-y-0 group-hover:scale-y-100 transition-all flex items-center gap-2'>
				{label}{' '}
				<small className='text-cyan-500 w-4 h-4 inline-grid place-items-center rounded bg-slate-300 dark:bg-slate-700 uppercase'>
					{hotKey}
				</small>
			</span>
		</div>
	)
}
