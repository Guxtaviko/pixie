import type { PropsWithChildren } from 'react'
import { ColorProvider } from '@/contexts/color-context'
import { GridProvider } from '@/contexts/grid-context'
import { HistoryProvider } from '@/contexts/history-context'
import { LayerProvider } from '@/contexts/layer-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { ToolProvider } from '@/contexts/tool-context'

export const PixieTestProviders = ({ children }: PropsWithChildren) => {
	return (
		<ThemeProvider>
			<ToolProvider>
				<ColorProvider>
					<HistoryProvider>
						<LayerProvider>
							<GridProvider>{children}</GridProvider>
						</LayerProvider>
					</HistoryProvider>
				</ColorProvider>
			</ToolProvider>
		</ThemeProvider>
	)
}
