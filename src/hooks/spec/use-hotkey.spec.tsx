import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UseHotkey } from '../use-hotkey'

interface HotkeyHarnessProps {
	keybind: string
	onTrigger: (e: KeyboardEvent) => void
	allowRepeat?: boolean
}

const HotkeyHarness = ({
	keybind,
	onTrigger,
	allowRepeat,
}: HotkeyHarnessProps) => {
	UseHotkey(keybind, onTrigger, allowRepeat)

	return (
		<>
			<input data-testid='hotkey-input' />
			<textarea data-testid='hotkey-textarea' />
			<div data-testid='hotkey-editable' contentEditable />
		</>
	)
}

const triggerKey = (
	target: Element,
	options: {
		key: string
		ctrlKey?: boolean
		metaKey?: boolean
		repeat?: boolean
	},
) => {
	fireEvent.keyDown(target, options)
}

describe('UseHotkey', () => {
	it('triggers callback for matching hotkey', () => {
		const onTrigger = vi.fn()
		render(<HotkeyHarness keybind='b' onTrigger={onTrigger} />)

		triggerKey(document.body, { key: 'b' })

		expect(onTrigger).toHaveBeenCalledTimes(1)
	})

	it('supports ctrl modifier with ctrl or meta key', () => {
		const onTrigger = vi.fn()
		render(<HotkeyHarness keybind='ctrl+z' onTrigger={onTrigger} />)

		triggerKey(document.body, { key: 'z', ctrlKey: true })
		triggerKey(document.body, { key: 'z', metaKey: true })

		expect(onTrigger).toHaveBeenCalledTimes(2)
	})

	it('ignores repeated keydown by default', () => {
		const onTrigger = vi.fn()
		render(<HotkeyHarness keybind='g' onTrigger={onTrigger} />)

		triggerKey(document.body, { key: 'g', repeat: true })

		expect(onTrigger).not.toHaveBeenCalled()
	})

	it('allows repeated keydown when allowRepeat is true', () => {
		const onTrigger = vi.fn()
		render(<HotkeyHarness keybind='g' onTrigger={onTrigger} allowRepeat />)

		triggerKey(document.body, { key: 'g', repeat: true })

		expect(onTrigger).toHaveBeenCalledTimes(1)
	})

	it('ignores key events from inputs, textareas and editable content', () => {
		const onTrigger = vi.fn()
		const { getByTestId } = render(
			<HotkeyHarness keybind='x' onTrigger={onTrigger} />,
		)

		triggerKey(getByTestId('hotkey-input'), { key: 'x' })
		triggerKey(getByTestId('hotkey-textarea'), { key: 'x' })

		const editable = getByTestId('hotkey-editable') as HTMLElement
		Object.defineProperty(editable, 'isContentEditable', {
			configurable: true,
			value: true,
		})
		triggerKey(editable, { key: 'x' })

		expect(onTrigger).not.toHaveBeenCalled()
	})

	it('cleans up listener on unmount', () => {
		const onTrigger = vi.fn()
		const { unmount } = render(
			<HotkeyHarness keybind='i' onTrigger={onTrigger} />,
		)

		unmount()
		triggerKey(document.body, { key: 'i' })

		expect(onTrigger).not.toHaveBeenCalled()
	})
})
