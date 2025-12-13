import {
	Brush as BrushIcon,
	Download as ExportIcon,
	Grid2x2 as GridIcon,
	Layers as LayersIcon,
} from 'lucide-react'
import { Button } from './button'
import { Modal } from './modal'

interface HelpModalProps {
	onClose: () => void
}

export const HelpModal = ({ onClose }: HelpModalProps) => {
	return (
		<Modal onClose={onClose}>
			<h2 className='text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-400'>
				Bem-vindo ao Pixie
			</h2>
			<p className='text-sm text-slate-700 dark:text-slate-300'>
				Pixie é uma ferramenta de design de pixel art. Divirta-se explorando sua
				criatividade!
			</p>
			<hr className='border-slate-200 dark:border-slate-800 my-4' />
			<div>
				<h3 className='font-medium text-slate-800 dark:text-slate-200 uppercase'>
					Como usar
				</h3>
				<ul className='flex flex-col gap-3 text-sm my-2 text-slate-700 dark:text-slate-300'>
					<li className='flex items-center gap-3'>
						<span className='p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700/75'>
							<BrushIcon size={16} className='text-cyan-400' />
						</span>
						<span>
							Desenhe pixels usando o <strong>Pincel</strong>
						</span>
					</li>
					<li className='flex items-center gap-3'>
						<span className='p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700/75'>
							<LayersIcon size={16} className='text-amber-400' />
						</span>
						<span>
							Gerencie elementos em <strong>Camadas</strong>
						</span>
					</li>
					<li className='flex items-center gap-3'>
						<span className='p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700/75'>
							<GridIcon size={16} className='text-purple-400' />
						</span>
						<span>
							Use tamanhos personalizados de <strong>Grade</strong>
						</span>
					</li>
					<li className='flex items-center gap-3'>
						<span className='p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700/75'>
							<ExportIcon size={16} className='text-green-400' />
						</span>
						<span>
							Exporte como PNG usando o <strong>Exportar</strong>
						</span>
					</li>
				</ul>
			</div>
			<div className='mt-6'>
				<h3 className='font-medium text-slate-800 dark:text-slate-200 uppercase'>
					Atalhos
				</h3>
				<div className='grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300'>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Pincel</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							B
						</span>
					</div>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Borracha</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							E
						</span>
					</div>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Balde</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							G
						</span>
					</div>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Conta-gotas</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							I
						</span>
					</div>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Desfazer</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							Ctrl + Z
						</span>
					</div>
					<div className='flex justify-between py-2 px-3 bg-slate-200 dark:bg-slate-800 rounded-lg'>
						<span>Refazer</span>
						<span className='text-slate-950 dark:text-slate-50 font-medium'>
							Ctrl + Y
						</span>
					</div>
				</div>
			</div>
			<Button
				onClick={onClose}
				className='mt-6 px-4 py-2 rounded-lg bg-slate-800 text-slate-50 dark:bg-slate-200 dark:text-slate-950 text-sm hover:bg-cyan-400 hover:text-slate-50 transition-all transform active:scale-95 font-bold border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 w-full'
			>
				Começar a criar!
			</Button>
		</Modal>
	)
}
