import type React from 'react'

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const Switch = ({
	checked,
	onCheckedChange,
	className = '',
	...props
}: SwitchProps) => {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={checked}
			onClick={() => onCheckedChange(!checked)}
			className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
				checked ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
			} ${className}`}
			{...props}
		>
			<span
				className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
					checked ? 'translate-x-4' : 'translate-x-0'
				}`}
			/>
		</button>
	)
}
