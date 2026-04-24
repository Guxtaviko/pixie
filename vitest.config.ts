import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			setupFiles: './src/spec/test-setup.ts',
			include: ['src/**/spec/*.spec.{ts,tsx}'],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'html'],
				include: ['src/**/*.{ts,tsx}'],
				exclude: ['src/main.tsx', 'src/vite-env.d.ts'],
			},
		},
	}),
)
