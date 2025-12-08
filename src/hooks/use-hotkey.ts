import { useCallback, useEffect } from 'react'

export function UseHotkey(
	key: string,
	callback: () => void,
	allowRepeat = false,
) {
	const checkKey = useCallback(
		(e: KeyboardEvent) => {
			const modifiers = key.split('+').map((k) => k.trim().toLowerCase())
			const keyPart = modifiers.pop() // The last part is the main key
			const keyMatch =
				keyPart === e.key.toLowerCase() ||
				(keyPart === 'space' && e.key === ' ')

			const ctrlMatch = modifiers.includes('ctrl')
				? e.ctrlKey || e.metaKey
				: true
			const shiftMatch = modifiers.includes('shift') ? e.shiftKey : true
			const altMatch = modifiers.includes('alt') ? e.altKey : true
			const metaMatch = modifiers.includes('meta') ? e.metaKey : true

			return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
		},
		[key],
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!checkKey(e)) return
			if (!allowRepeat && e.repeat) return

			// Ignore if focus is on an input, textarea, or contenteditable element
			const target = e.target as HTMLElement
			const tagName = target.tagName.toLowerCase()
			const isContentEditable = target.isContentEditable
			if (tagName === 'input' || tagName === 'textarea' || isContentEditable) {
				return
			}

			callback()
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [callback, allowRepeat, checkKey])
}
