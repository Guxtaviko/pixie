import { useContext } from 'react'

export function useSafeContext<T>(context: React.Context<T>): T {
	const ctx = useContext(context)
	if (!ctx) {
		throw new Error(
			`${context.displayName} must be used within its corresponding Provider`,
		)
	}

	return ctx
}
