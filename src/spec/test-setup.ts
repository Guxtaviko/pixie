import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

const canvasContextMock = {
	clearRect: () => {},
	fillRect: () => {},
	beginPath: () => {},
	moveTo: () => {},
	lineTo: () => {},
	stroke: () => {},
	fillText: () => {},
	set fillStyle(_value: string) {},
	set strokeStyle(_value: string) {},
	set lineWidth(_value: number) {},
	set font(_value: string) {},
	set globalAlpha(_value: number) {},
}

afterEach(() => {
	cleanup()
})

beforeEach(() => {
	window.localStorage.clear()

	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}),
	})

	Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
		configurable: true,
		writable: true,
		value: () => canvasContextMock,
	})
})
