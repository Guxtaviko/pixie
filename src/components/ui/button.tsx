import type { ButtonHTMLAttributes } from 'react'

export const Button = ({
	className = '',
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			type='button'
			className={`cursor-pointer disabled:cursor-default ${className}`}
			{...props}
		/>
	)
}
