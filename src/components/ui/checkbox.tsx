import { Check } from 'lucide-react'
import type React from 'react'

interface CheckboxProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const Checkbox = ({
	checked,
	onCheckedChange,
	className = '',
	...props
}: CheckboxProps) => {
	return (
		// biome-ignore lint/a11y/useSemanticElements: custom styled checkbox component
		<button
			type='button'
			role='checkbox'
			aria-checked={checked}
			onClick={() => onCheckedChange(!checked)}
			className={`peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
				checked
					? 'bg-cyan-500 border-cyan-500 text-white'
					: 'border-slate-300 dark:border-slate-600 bg-transparent'
			} ${className}`}
			{...props}
		>
			<span
				className={`flex items-center justify-center text-current transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
			>
				<Check size={14} strokeWidth={3} />
			</span>
		</button>
	)
}
